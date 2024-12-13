import React from "react";
import { Avatar, AvatarFallback, AvatarImage, Badge } from "../ui";
import { Dot } from "lucide-react";
import Link from "next/link";
import { PAGE_ROUTES } from "@/constants/API_ROUTES";
import Image from "next/image";
import { cn } from "@/utils/tailwind-utils";
import { generateSlugUrl, sanitizeHTMLString } from "@/utils/query-parser";

interface BlogCard {
  title: string;
  description: string;
  img: string;
  tag: string;
  createdBy: string;
  date: string;
  showDescription?: boolean;
  blogId: string;
  avatar?: string;
  createdAt: Date;
}
const BlogCard = ({
  title,
  description,
  img,
  tag,
  createdBy,
  date,
  showDescription = true,
  avatar,
  createdAt,
}: BlogCard) => {
  return (
    <Link href={PAGE_ROUTES.BLOG.replace(":blogId", generateSlugUrl(title, createdAt.toString()))}>
      <div className="overflow-hidden  lg:min-w-[390px]   flex flex-col">
        <div className="relative h-[256px] 2xl:h-[330px]  rounded-[10px]">
          {img !== "" ? (
            <Image
              src={img}
              alt={title}
              layout="fill"
              objectFit="cover"
              className="  h-[256px] 2xl:h-[330px]  rounded-[10px] "
            />
          ) : (
            <div className="  absolute right-0 rounded-[10px] mr-4 mt-2 ">
              <Image
                src={"/quote.svg"}
                width={100}
                height={100}
                alt="no-image"
                className="text-black  dark:text-white   z-50 w-[72px] h-[72px]"
              />
            </div>
          )}

          <div
            className={cn(
              "absolute  rounded-[10px] inset-0 ",
              img === ""
                ? "  bg-gradient-to-t from-[#F9F9FB]  to-[#E8E8E8]/95 dark:from-[#F9F9FB] dark:to-[#E8E8E8]/20"
                : "bg-gradient-to-b from-transparent to-black/70",
            )}
          />
          {showDescription && tag && (
            <Badge
              className="font-secondary font-medium text-sm absolute top-0 left-0 mt-6 ml-4 dark:bg-slate-500  bg-white"
              variant={"secondary"}
            >
              {tag}
            </Badge>
          )}
          <div className="absolute bottom-4 left-4 right-4">
            <h2
              className={cn("text-2xl font-extrabold font-secondary  mb-2", img === "" ? "text-black" : "text-white")}
            >
              {title}
            </h2>
          </div>
        </div>
        <div className="px-4 py-6 mb-auto ">
          <div className="mb-4 flex flex-row items-center">
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={avatar} alt="Avatar" />
                <AvatarFallback>{createdBy}</AvatarFallback>
              </Avatar>
              <h3 className="font-medium text-sm font-secondary">By {createdBy}</h3>
            </div>
            {showDescription && <Dot className="mx-4 font-medium font-secondary" />}

            {showDescription && <p className="text-sm leading-5 font-secondary font-medium">{date}</p>}
          </div>
          <div className="mb-4">
            {showDescription && (
              <p className="dark:text-white text-black font-secondary font-normal text-base line-clamp-3">
                {sanitizeHTMLString(description)}{" "}
              </p>
            )}
            {!showDescription && tag && (
              <Badge className="font-secondary font-medium text-sm    " variant={"secondary"}>
                {tag}
              </Badge>
            )}
          </div>
          {showDescription && <hr className="mt-4" />}
        </div>
      </div>
    </Link>
  );
};

export default BlogCard;
