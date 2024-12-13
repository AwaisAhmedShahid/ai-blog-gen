import { SchedularStatus } from "@prisma/client";
import { prisma } from "../clients/prisma-client";
import { postGenerateBlogReqType, postGenerateBlogResType } from "@/app/api/blog/generate/validators";
import { API_ROUTES } from "@/constants/API_ROUTES";
import { jwtUtils } from "@/utils/jwt";
import { extractHeadersFromMarkdown, shouldCreateBlog } from "@/utils/cron-utils";
import { ENV } from "@/constants/ENV";
import { ScheduledBlogGen } from "@/constants";

const SchedularCronJob = async () => {
  const currentDateTime = new Date();

  const validSchedulers = (
    await prisma.schedular.findMany({
      where: {
        status: {
          in: [SchedularStatus.PENDING, SchedularStatus.FAILED],
        },
        startDate: {
          lte: currentDateTime,
        },
        endDate: {
          gte: currentDateTime,
        },
      },
      include: {
        tags: {
          include: {
            blogs: {
              select: {
                title: true,
                createdAt: true,
              },
              orderBy: {
                createdAt: "desc",
              },
              take: 1,
            },
            tag: true,
          },
        },
      },
    })
  ).filter((schedular) => schedular.tags.length);

  if (!validSchedulers.length) {
    console.log("No blogs to publish");
    return;
  }

  console.log("Valid schedulers found", validSchedulers.length);

  for (const validScheduler of validSchedulers) {
    (async () => {
      try {
        let validTagIdx = validScheduler.lastTagIdx;
        if (validTagIdx < 0) {
          validTagIdx = 0;
        }
        // if last index tag already used, then start from 0
        else if (validTagIdx === validScheduler.tags.length - 1) {
          validTagIdx = 0;
        }
        // if not last index, then increment by 1
        else if (validTagIdx < validScheduler.tags.length - 1) {
          validTagIdx++;
        }

        const validTag = validScheduler.tags[validTagIdx];
        const lastBlogGen = validTag?.blogs?.at(0);

        if (lastBlogGen && !shouldCreateBlog(lastBlogGen.createdAt, validScheduler.frequency)) {
          console.log("Blog not created, as it's not time yet");
          return undefined;
        }
        const prompt = ScheduledBlogGen({
          blogLength: validScheduler.length,
          focusTopics: validTag.focusTopic,
          prevBlogTitle: validTag?.blogs?.map((blog) => blog.title).join("\n\t- "),
          tags: validScheduler.tags.map((item) => item.tag.title),
        });

        const genBlogPayload: postGenerateBlogReqType = {
          prompt,
          title: validTag.tag.title,
          length: validScheduler.length,
        };

        // create jwt token for the user
        const userToken = jwtUtils.sign({ id: validScheduler.authId, role: "USER" });

        const blogFetch = await fetch(ENV.NEXT_PUBLIC_FE_URL + API_ROUTES.GEN_BLOG, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userToken}`,
            "x-app-name": validScheduler.appId,
          },
          body: JSON.stringify(genBlogPayload),
        });

        const blogData: postGenerateBlogResType = await blogFetch.json();
        if (!blogFetch.ok) {
          console.log("Failed to generate blog", blogData);
          return undefined;
        }

        if (!blogData.success) {
          console.log("Failed to generate blog", blogData);
          return undefined;
        }

        if (!blogData.data.result) {
          console.log("Failed to generate blog", blogData);
          return undefined;
        }

        const title = extractHeadersFromMarkdown(blogData.data.result)[0]?.text || validTag.tag.title;

        if (!title) {
          console.log("No title found in the generated blog", blogData);
          return undefined;
        }

        const schedularEndDate = new Date(validScheduler.endDate);

        await prisma.$transaction([
          prisma.blogs.create({
            data: {
              appId: validScheduler.appId,
              authId: validScheduler.authId,
              metaTitle: title,
              coverImage: "",
              coverImageAlt: "",
              description: "",
              content: blogData.data.result,
              title: title,
              schedularTagId: validTag.id,
              tags: {
                connect: {
                  id: validTag.tagId,
                },
              },
            },
          }),
          prisma.schedular.update({
            where: {
              id: validScheduler.id,
            },
            data: {
              lastTagIdx: validTagIdx,
              status: currentDateTime >= schedularEndDate ? SchedularStatus.COMPLETED : SchedularStatus.PENDING,
            },
          }),
        ]);
      } catch (error) {
        console.log("Error in generating blog", error);

        await prisma.schedular.update({
          where: {
            id: validScheduler.id,
          },
          data: {
            status: SchedularStatus.FAILED,
          },
        });

        return undefined;
      }
    })();
  }

  console.log("Cron job finished");
};

SchedularCronJob();
