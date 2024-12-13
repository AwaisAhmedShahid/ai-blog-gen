"use client";
import MarkdownPreview from "@uiw/react-markdown-preview";

import { CircleArrowLeft } from "lucide-react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Badge,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui";
import { Tag } from "@prisma/client";
import React, { useEffect } from "react";
import DateComp from "@/components/common/date-com";
import Image from "next/image";
import BlogCardSidebar from "@/components/common/blog-card-sidebar";
import BlogCard from "@/components/common/blog-card";
import { useMutation, useQuery } from "@tanstack/react-query";
import { allBlogs, singleBlogDetailBySlug, updateBlogViews } from "@/utils/api";
import BlogDetailSkeleton from "@/components/common/blog-detail-skelton";
import { getBlogResType } from "@/app/api/blog/validators";
import { format } from "date-fns";
import BlogCardSkeleton from "@/components/common/blog-card-skelton";
import { getBlogBySlugResType } from "@/app/api/blog/get-blog-by-slug/validators";
import { extractSlugParams } from "@/utils/query-parser";
import { useRouter } from "next/navigation";
import { hslToHex } from "@/constants";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function BlogPage({ params }: any) {
  const { title, createdAt } = extractSlugParams(params.slug);
  const router = useRouter();

  const { data: blogDetail, isLoading: isBlogDetailLoading } = useQuery<
    NonNullable<getBlogBySlugResType["data"]["result"]>
  >({
    queryKey: ["blog-detail", params.slug],
    queryFn: async () => {
      const res = await singleBlogDetailBySlug(title, createdAt);
      if (res.ok) {
        const formattedData = await res.json();
        if (formattedData.success) {
          return formattedData.data.result as NonNullable<getBlogBySlugResType["data"]["result"]>;
        }
      }
      throw new Error("Failed to fetch blog detail");
    },
    refetchOnWindowFocus: false,
  });

  const { data: blogList, isFetching: isBlogListFetching } = useQuery<NonNullable<getBlogResType["data"]["result"]>>({
    queryKey: ["blog-list"],
    queryFn: async () => {
      const res = await allBlogs({ blogTags: blogDetail?.tags?.map(({ id }) => id), sortByViews: true });
      if (res.ok) {
        const formattedData = await res.json();
        if (formattedData.success) {
          return formattedData.data.result as NonNullable<getBlogResType["data"]["result"]>;
        }
      }
      throw new Error("Failed to fetch blogs");
    },
    refetchOnWindowFocus: false,
    enabled: !!blogDetail, // Only fetch blogs once blogDetail is available
  });

  const { mutate } = useMutation({
    mutationFn: updateBlogViews,
    onError: (err) => {
      console.log(err);
    },
  });

  useEffect(() => {
    if (blogDetail?.id) {
      mutate({
        blogId: blogDetail?.id,
        values: {
          id: blogDetail?.id || "",
        },
      });
    }
  }, [blogDetail?.id, mutate]);

  // Conditional rendering to avoid flicker
  if (isBlogDetailLoading) return <BlogDetailSkeleton />;
  const rootStyles = getComputedStyle(document.documentElement);

  const hslPrimaryColor = rootStyles.getPropertyValue("--primary-color").trim();
  const hexPrimaryColor = hslToHex(hslPrimaryColor);
  const hslBackgroundColor = rootStyles.getPropertyValue("--background").trim();
  const hexBackgroundColor = hslToHex(hslBackgroundColor);
  return (
    <div className="px-[35px] lg:px-[100px]  py-10  ">
      <div className="flex flex-col gap-4">
        <CircleArrowLeft
          strokeWidth={"1.3px"}
          size={26.67}
          className="text-[#051E4C] mb-6 cursor-pointer"
          onClick={() => router.back()}
        />
        <DateComp date={format(blogDetail?.createdAt || new Date(), "dd MMM, yyyy")} />
        <div className="flex items-center gap-2 mt-6">
          <Avatar className="h-[50px] w-[50px]">
            <AvatarImage src={blogDetail?.author.profilePic} alt="Avatar" />
            <AvatarFallback>
              {blogDetail?.author.firstName.slice(0, 1)} {blogDetail?.author.lastName.slice(0, 1)}
            </AvatarFallback>
          </Avatar>
          <h3 className="font-semibold font-secondary text-sm">
            {blogDetail?.author.firstName} {blogDetail?.author.lastName}
          </h3>
        </div>
        <h1 className="text-4xl font-semibold font-primary">{blogDetail?.title}</h1>
        {blogDetail?.coverImage && (
          <Image
            src={blogDetail.coverImage}
            alt={blogDetail?.title || ""}
            width={100}
            className="max-h-[450px] w-full object-cover rounded-[10px]"
            height={100}
          />
        )}
        <div className="flex flex-1 flex-col lg:flex-row gap-5 w-full">
          <div className="w-full lg:w-4/5">
            <MarkdownPreview
              source={blogDetail?.content || ""}
              style={{
                width: "100%",
                fontFamily: "var(--font-secondary)",
                color: hexPrimaryColor,
                backgroundColor: hexBackgroundColor,
              }}
              rehypeRewrite={(node) => {
                if (node.type === "element" && node.tagName !== "svg") {
                  node.properties = {
                    style: `color: ${hexPrimaryColor}, background-color:${hexBackgroundColor}`,
                  };
                }
              }}
            />
          </div>
          <div className="flex flex-col w-full lg:w-1/5 gap-5">
            <div className="flex flex-col gap-[14px]">
              <h2 className="text-[30px] font-semibold  leading-[38px] font-secondary ">Tags</h2>
              <div className="flex gap-[14px] ">
                {blogDetail?.tags.map((tag: Tag) => (
                  <Badge variant={"outline"} className="font-secondary font-medium px-3 py-1" key={tag.id}>
                    {tag.title}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-[14px] ">
              <h1 className="font-secondary font-medium text-2xl">More like this...</h1>
              <div className=" hidden lg:grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-1 gap-5">
                {blogList?.blogs?.map((item, index) => {
                  return (
                    <BlogCardSidebar
                      createdAt={item.createdAt}
                      width={"min-w-[158px]"}
                      key={index}
                      avatar={item.author.profilePic}
                      blogId={item.id}
                      createdBy={`${item.author.firstName} ${item.author.lastName}`}
                      date={format(item.createdAt, "dd MMM, yyyy")}
                      description={item.content}
                      title={item.title}
                      tag={item.tags[0]?.title}
                      img={item.coverImage || ""}
                    />
                  );
                })}
              </div>

              <div className="m-11 lg:hidden mt-0">
                <Carousel className="w-full ">
                  <CarouselContent>
                    {isBlogListFetching ? (
                      <CarouselItem>
                        <div className="p-[18px] pb-0 border rounded-lg ">
                          <BlogCardSkeleton showDescription={false} />
                        </div>
                      </CarouselItem>
                    ) : (
                      <>
                        {blogList?.blogs.map((item, index) => (
                          <CarouselItem key={index}>
                            <div className="p-[18px] pb-0 border rounded-lg ">
                              <BlogCard
                                showDescription={false}
                                key={index}
                                blogId={item.id}
                                createdBy={`${item.author.firstName} ${item.author.lastName}`}
                                date={format(item.createdAt, "dd MMM, yyyy")}
                                description={item.description}
                                title={item.title}
                                tag={item.tags[0]?.title}
                                createdAt={item.createdAt}
                                img={item.coverImage || ""}
                              />
                            </div>
                          </CarouselItem>
                        ))}
                      </>
                    )}
                  </CarouselContent>
                  <CarouselPrevious className="bg-primary-color text-white" />
                  <CarouselNext className="bg-primary-color text-white" />
                </Carousel>
              </div>
            </div>
          </div>
        </div>

        {/* <BlogNavigation
          previousPost={{
            title: "Digital Nomad: Living and Working Anywhere",
            description: "Explore the lifestyle of digital nomads",
            image:
              "https://images.pexels.com/photos/61180/pexels-photo-61180.jpeg?auto=compress&amp;cs=tinysrgb&amp;dpr=1&amp;w=500",
            href: "/blog/digital-nomad",
          }}
          nextPost={{
            title: "Creative Writers: Crafting Stories, One Word",
            description: "Tips and tricks for aspiring writers",
            image:
              "https://images.pexels.com/photos/61180/pexels-photo-61180.jpeg?auto=compress&amp;cs=tinysrgb&amp;dpr=1&amp;w=500",
            href: "/blog/creative-writers",
          }}
        /> */}
      </div>
    </div>
  );
}
