import React from "react";
import { cn } from "@/utils/tailwind-utils";
import { Skeleton } from "../ui";

interface BlogCardSidebarSkeletonProps {
  width?: string;
}

const BlogCardSidebarSkeleton = ({ width = "" }: BlogCardSidebarSkeletonProps) => {
  return (
    <div className={cn("overflow-hidden flex flex-col", width)}>
      <div className="relative">
        <Skeleton className="w-full h-32 rounded-[20px]" />
      </div>
      <div className="py-6 mb-auto">
        <div className="mb-4 flex flex-row items-center">
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
        <div className="mb-4">
          <Skeleton className="h-6 w-full mb-2" />
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>
        <Skeleton className="h-px w-full mt-4" />
      </div>
    </div>
  );
};

export default BlogCardSidebarSkeleton;
