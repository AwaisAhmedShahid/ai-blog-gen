import React from "react";
import { Avatar, AvatarFallback, AvatarImage, Badge } from "../ui";
import { cn } from "@/utils/tailwind-utils";
import Link from "next/link";
import { PAGE_ROUTES } from "@/constants/API_ROUTES";
import Image from "next/image";
import { generateSlugUrl } from "@/utils/query-parser";

interface BlogCard {
  title: string;
  description: string;
  img: string;
  tag: string;
  createdBy: string;
  date: string;
  width?: string;
  blogId: string;
  avatar?: string;
  createdAt: Date;
}

const BlogCardSidebar = ({ title, img, tag, createdBy, width = "", avatar, createdAt }: BlogCard) => {
  return (
    <Link href={PAGE_ROUTES.BLOG.replace(":blogId", generateSlugUrl(title, createdAt.toString()))} className="pb-4">
      <div className={cn("overflow-hidden   flex flex-col", width)}>
        <div className="relative h-[120px]  rounded-[10px]">
          {img !== "" ? (
            <Image src={img} alt={title} layout="fill" objectFit="cover" className="  h-[120px]  rounded-[10px] " />
          ) : (
            <div className="  absolute right-0 rounded-[10px] mr-4 mt-2 ">
              <Image
                src={"/quote.svg"}
                width={100}
                height={100}
                alt="no-image"
                className="text-black dark:text-white w-[72px] h-[72px]"
              />
            </div>
          )}

          <div
            className={cn(
              "absolute  rounded-[10px] inset-0 ",
              img === ""
                ? "  bg-gradient-to-t from-[#F9F9FB]  to-[#E8E8E8]/95   dark:from-[#F9F9FB] dark:to-[#E8E8E8]/20"
                : "bg-gradient-to-b from-transparent to-black/70",
            )}
          />
          <div className="absolute bottom-1 left-3">
            <h1
              className={cn("text-sm font-medium font-secondary mr-2 mb-2", img === "" ? "text-black" : "text-white")}
            >
              {title}
            </h1>
          </div>
        </div>
        <div className=" py-2 mb-auto ">
          <div className="flex flex-row items-center">
            <div className="flex items-center gap-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src={avatar} alt="Avatar" />
                <AvatarFallback>{createdBy}</AvatarFallback>
              </Avatar>
              <h3 className="font-medium text-sm font-secondary">By {createdBy}</h3>
            </div>
          </div>
        </div>
        <div>
          {tag && (
            <Badge className="px-[10px] py-1 font-secondary" variant={"secondary"}>
              {tag}
            </Badge>
          )}
        </div>
        <hr className="mt-6 mb-0" />
      </div>
    </Link>
  );
};

export default BlogCardSidebar;
