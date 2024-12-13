import React from "react";
import { Badge } from "@/components/ui/badge";
import { CircleArrowLeft } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";
import { Skeleton } from "../ui";

const BlogCardSidebarSkeleton = ({ width = "" }: { width?: string }) => (
  <div className={`overflow-hidden flex flex-col ${width}`}>
    <Skeleton className="w-full h-32 rounded-[20px]" />
    <div className="py-6 mb-auto">
      <div className="mb-4 flex items-center gap-2">
        <Skeleton className="h-8 w-8 rounded-full" />
        <Skeleton className="h-4 w-24" />
      </div>
      <Skeleton className="h-6 w-full mb-2" />
      <Skeleton className="h-6 w-20 rounded-full" />
    </div>
  </div>
);

const BlogCardSkeleton = () => (
  <div className="overflow-hidden flex flex-col">
    <Skeleton className="w-full h-[256px] rounded-[20px]" />
    <div className="px-4 py-6 mb-auto">
      <div className="mb-4 flex items-center gap-2">
        <Skeleton className="h-8 w-8 rounded-full" />
        <Skeleton className="h-4 w-24" />
      </div>
      <Skeleton className="h-6 w-3/4 mb-2" />
      <Skeleton className="h-6 w-20 rounded-full" />
    </div>
  </div>
);

export default function BlogDetailSkeleton() {
  return (
    <div className="px-[35px] lg:px-[100px] py-10">
      <div className="flex flex-col gap-4">
        <CircleArrowLeft strokeWidth={"1.3px"} size={40} className="text-primary-color" />
        <Skeleton className="h-6 w-32" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-[50px] w-[50px] rounded-full" />
          <Skeleton className="h-5 w-24" />
        </div>

        <Skeleton className="h-12 w-3/4" />
        <Skeleton className="w-full h-[300px]" />

        <div className="space-y-4">
          {[...Array(5)].map((_, index) => (
            <Skeleton key={index} className="h-6 w-full" />
          ))}
        </div>

        <div className="flex flex-col gap-[14px]">
          <Skeleton className="h-9 w-24" />
          <div className="flex gap-[14px]">
            {[...Array(3)].map((_, index) => (
              <Badge key={index} variant="outline" className="font-secondary font-medium px-3 py-1">
                <Skeleton className="h-4 w-16" />
              </Badge>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-[14px] mt-8">
        <Skeleton className="h-8 w-48" />
        <div className="hidden lg:grid grid-cols-4 gap-5">
          {[...Array(4)].map((_, index) => (
            <BlogCardSidebarSkeleton key={index} width="min-w-[158px]" />
          ))}
        </div>
        <div className="m-11 lg:hidden mt-0">
          <Carousel className="w-full">
            <CarouselContent>
              {[...Array(4)].map((_, index) => (
                <CarouselItem key={index}>
                  <div className="p-[18px] pb-0 border rounded-lg">
                    <BlogCardSkeleton />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="bg-primary-color text-white" />
            <CarouselNext className="bg-primary-color text-white" />
          </Carousel>
        </div>
      </div>
    </div>
  );
}
