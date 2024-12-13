"use client";

import { CardDescription, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useSearchParams } from "next/navigation";

import { TagsAndBlogs } from "@/types";
import Time from "./time";
import { PAGE_ROUTES } from "@/constants/API_ROUTES";
import React from "react";

const BlogContent = ({ posts }: { posts: TagsAndBlogs[] }) => {
  const searchParams = useSearchParams();
  const currentTag = searchParams.get("tag");

  if (currentTag) {
    posts = posts.filter((post) => post.tags.some((tag) => tag.title === currentTag));
  }

  return (
    <>
      {posts.map((post, index: number) => (
        <div className={"space-y-6 border-indigo-400 border-4 p-6 rounded-xl"} key={index}>
          <Link href={PAGE_ROUTES.BLOG.replace(":blogId", post.id)}>
            <div className={"space-y-6 "}>
              <div className={""}>
                <Time date={post.createdAt} />
              </div>
              <CardTitle className={"not-prose space-x-4 flex justify-start items-center "}>
                <Link
                  className={"hover:underline hover:underline-offset-8"}
                  href={`${PAGE_ROUTES.BLOG.replace(":blogId", post.id)}`}
                >
                  {post.title}
                </Link>
                {/* {post.pinned && (
                                <Badge className={'li'}>
                                    Pinned
                                </Badge>
                            )} */}
              </CardTitle>
              <div className={"flex flex-col md:flex-row md:space-x-4"}>
                <div className={"space-x-2"}>
                  {post?.tags?.map((tag, index: number) => (
                    <Link href={`${PAGE_ROUTES.BLOGS}?searchTag=${tag.title}`} key={index}>
                      <Badge key={index} variant={currentTag == tag.title ? "secondary" : "outline"}>
                        #{tag.title}
                      </Badge>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
            <CardDescription className={"truncate text-current my-6 pr-24"}>{post.content}</CardDescription>
            <div className={"flex justify-end"}>
              <Button variant={"link"}>
                Read More <ArrowRight size={16} className={"ml-2"} />
              </Button>
            </div>

            <div className={"flex justify-end"}></div>
          </Link>
        </div>
      ))}
    </>
  );
};

export default BlogContent;
