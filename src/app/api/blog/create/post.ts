import { apiValidations } from "@/middleware/apiValidations";
import { NextRequest, NextResponse } from "next/server";
import { postBlogReqType, postBlogResType, postBlogReqSchema } from "./validators";
import { prisma } from "@/clients/prisma-client";

const handler = async (req: NextRequest, params: postBlogReqType) => {
  const appId = req.headers.get("x-app-name") as string; // already validated in the middleware
  // Check if tagTitle exists and has length > 0
  if (params?.tagTitle?.length > 0) {
    console.log(params?.tagTitle);
    // Create tags in the database and collect their IDs
    const createdTags = await Promise.all(
      params?.tagTitle?.map(async (title) => {
        console.log(title);

        // Check if the tag already exists
        let tag = await prisma.tag.findUnique({
          where: { title },
        });

        // Create the tag only if it doesn't exist
        if (!tag) {
          tag = await prisma.tag.create({
            data: {
              appId,
              title,
              isActive: true,
              author: {
                connect: {
                  id: params.authId,
                },
              },
            },
          });
        }

        return { id: tag.id };
      }),
    );

    // Append the created tags to params.tags
    params.tags = [...(params.tags || []), ...createdTags];
  }
  const res = await prisma.blogs.create({
    include: { tags: true },
    data: {
      appId,
      metaTitle: params.metaTitle,
      coverImage: params?.coverImage || "",
      coverImageAlt: params?.coverImageAlt || "",
      description: params.description,
      content: params.content,
      title: params.title,
      status: params.status,
      author: {
        connect: {
          id: params.authId,
        },
      },
      tags: {
        connect:
          params.tags?.map((tag) => ({
            id: tag.id,
          })) || [],
      },
    },
  });

  return NextResponse.json<postBlogResType>({
    success: true,
    data: { message: "Blog created successful", result: res },
  });
};

export const POST = async (req: NextRequest) => {
  const response = await apiValidations({
    req,
    handler,
    schema: postBlogReqSchema,
  });
  return response;
};
