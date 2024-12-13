import React from "react";
import { Skeleton } from "../ui";

interface BlogCardSkeletonProps {
  showDescription?: boolean;
}

export default function BlogCardSkeleton({ showDescription = true }: BlogCardSkeletonProps) {
  return (
    <div className="overflow-hidden lg:min-w-[390px] flex flex-col">
      <div className="relative">
        <Skeleton className="w-full h-[256px] 2xl:h-[330px] rounded-[20px]" />
        {showDescription && <Skeleton className="absolute top-6 left-6 h-6 w-20 rounded-full" />}
      </div>
      <div className="px-4 py-6 mb-auto">
        <div className="mb-4 flex flex-row items-center">
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-4 w-24" />
          </div>
          {showDescription && (
            <>
              <Skeleton className="mx-4 h-1 w-1 rounded-full" />
              <Skeleton className="h-4 w-20" />
            </>
          )}
        </div>
        <div className="mb-4">
          <Skeleton className="h-6 w-3/4 mb-2" />
          {showDescription ? <Skeleton className="h-4 w-full" /> : <Skeleton className="h-6 w-20 rounded-full" />}
        </div>
        {showDescription && <Skeleton className="h-px w-full mt-4" />}
      </div>
    </div>
  );
}
