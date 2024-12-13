"use client";
import { getBlogResType } from "@/app/api/blog/validators";
import { getTagResType } from "@/app/api/tag/validators";
import { IconInput } from "@/components/common";
import BlogCard from "@/components/common/blog-card";
import BlogCardSidebar from "@/components/common/blog-card-sidebar";
import BlogMainBox from "@/components/common/blog-main-box";
import PopOverFilterButton from "@/components/common/filter-button";
import PageContainer from "@/components/common/page-container";
import { SelectMonth } from "@/components/common/select-months";
import { SelectYear } from "@/components/common/select-year";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, MultiSelect } from "@/components/ui";
import { allBlogs, getTags } from "@/utils/api";
import { useQuery } from "@tanstack/react-query";
import { debounce } from "lodash";
import { SearchIcon } from "lucide-react";
import { useState } from "react";
import { format } from "date-fns";
import Pagination from "@/components/common/pagination";
import BlogCardSkeleton from "@/components/common/blog-card-skelton";
import React from "react";
import BlogCardSidebarSkeleton from "@/components/common/blog-card-sidebar-skelton";

const Blog = () => {
  const dateObject = new Date().setDate(1);
  const [fromDate, setFromDate] = useState<Date>(new Date(dateObject));
  const [blogTags, setBlogTags] = useState<string[]>([]);
  const [activePage, setActivePage] = useState(1);
  const { data: tagsList } = useQuery<NonNullable<getTagResType["data"]["result"]>>({
    queryKey: ["tag-list"],
    queryFn: async () => {
      const res = await getTags({ isActive: true });
      if (res.ok) {
        const formattedData = await res.json();
        if (formattedData.success) {
          return formattedData.data.result as NonNullable<getTagResType["data"]["result"]>;
        }
      }
      throw new Error("Failed to fetch tags");
    },
  });

  const [searchValue, setSearchValue] = useState<string>("");

  const { data: blogList, isPending: isLoading } = useQuery<NonNullable<getBlogResType["data"]["result"]>>({
    queryKey: ["blog-list", searchValue, blogTags, fromDate, activePage],
    queryFn: async () => {
      const res = await allBlogs({
        searchValue,
        fromDate: fromDate.toISOString(),
        page: activePage,
        blogTags,
        limit: 10,
      });
      if (res.ok) {
        const formattedData = await res.json();
        if (formattedData.success) {
          return formattedData.data.result as NonNullable<getBlogResType["data"]["result"]>;
        }
      }
      throw new Error("Failed to fetch blogs");
    },
  });
  const { data: mostPopular, isPending: isFetching } = useQuery<NonNullable<getBlogResType["data"]["result"]>>({
    queryKey: ["popular-blog-list"],
    queryFn: async () => {
      const res = await allBlogs({ sortByViews: true, limit: 5 });
      if (res.ok) {
        const formattedData = await res.json();
        if (formattedData.success) {
          return formattedData.data.result as NonNullable<getBlogResType["data"]["result"]>;
        }
      }
      throw new Error("Failed to fetch blogs");
    },
  });

  const debouncedSearch = debounce((query) => setSearchValue(query), 500); // 500ms delay

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    debouncedSearch(e.target.value);
  };

  return (
    <PageContainer>
      <BlogMainBox />
      <div className="flex flex-col lg:flex-row gap-[30px]">
        <div className="w-1/4 hidden lg:flex flex-col gap-10">
          <div className="flex flex-col gap-[10px]">
            <div className="w-full rounded-lg px-[14px] py-[10px] bg-primary-color">
              <h3 className="text-white text-sm font-secondary font-semibold">Explore</h3>
            </div>
            <IconInput
              placeholder="Search topics"
              onChange={handleChange}
              className="shadow-none"
              icon={<SearchIcon size={16} />}
            />
            <div className="flex flex-col w-full gap-4">
              <h1 className="font-secondary text-base font-medium">Filter by</h1>
              <div className="flex flex-col w-full gap-2">
                <h3 className="font-secondary text-sm font-normal">Posts from</h3>
                <div className="flex flex-row gap-2">
                  <div className="w-2/3">
                    <SelectMonth
                      onChange={(e) => {
                        const formatDate = new Date(fromDate.setMonth(parseInt(e)));
                        setFromDate(formatDate);
                      }}
                    />
                  </div>
                  <div className="w-1/3">
                    <SelectYear
                      onChange={(e) => {
                        const formatDate = new Date(fromDate.setFullYear(parseInt(e)));
                        setFromDate(formatDate);
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div>
              <label className="text-sm leading-[14px] font-secondary font-semibold mb-2">Categories</label>
              <MultiSelect
                options={
                  tagsList?.Tags?.map(({ title, id }) => {
                    return {
                      label: title,
                      value: id,
                    };
                  }) || []
                }
                onValueChange={setBlogTags}
                defaultValue={blogTags}
                placeholder="Select tag"
                variant="inverted"
                animation={2}
                maxCount={3}
              />
            </div>
          </div>
          <div className="w-full rounded-lg px-[14px] py-[10px] bg-primary-color">
            <h3 className="text-white text-sm font-secondary font-semibold">Most Popular</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-1 gap-2">
            {isFetching ? (
              <>
                {Array.from({ length: 5 }).map((_, index) => (
                  <BlogCardSidebarSkeleton key={index} />
                ))}
              </>
            ) : (
              <>
                {mostPopular?.blogs.map((item, index) => {
                  return (
                    <BlogCardSidebar
                      createdAt={item.createdAt}
                      key={index}
                      blogId={item.id}
                      avatar={item.author.profilePic}
                      createdBy={`${item.author.firstName} ${item.author.lastName}`}
                      date={format(item.createdAt, "dd MMM, yyyy")}
                      description={item.content}
                      title={item.title}
                      tag={item.tags[0]?.title}
                      img={item.coverImage || ""}
                    />
                  );
                })}
              </>
            )}
          </div>
        </div>
        <div className="lg:hidden ">
          <h3 className="font-secondary font-medium text-base mb-4">Most Popular</h3>

          <div className="m-11 mt-0">
            <Carousel className="w-full ">
              <CarouselContent>
                {isFetching ? (
                  <CarouselItem>
                    <div className="p-[18px] pb-0 border rounded-lg ">
                      <BlogCardSkeleton showDescription={false} />
                    </div>
                  </CarouselItem>
                ) : (
                  <>
                    {mostPopular?.blogs.map((item, index) => (
                      <CarouselItem key={index}>
                        <div className="p-[18px] pb-0 border rounded-lg ">
                          <BlogCard
                            showDescription={false}
                            key={index}
                            blogId={item.id}
                            avatar={item.author.profilePic}
                            createdBy={`${item.author.firstName} ${item.author.lastName}`}
                            date={format(item.createdAt, "dd MMM, yyyy")}
                            description={item.description}
                            title={item.title}
                            tag={item.tags[0]?.title}
                            img={item.coverImage || ""}
                            createdAt={item.createdAt}
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
        <div className="lg:hidden flex items-center gap-[10px] -mt-10 w-full">
          <IconInput
            placeholder="Search topics"
            onChange={handleChange}
            className="shadow-none"
            icon={<SearchIcon size={16} />}
          />
          <PopOverFilterButton>
            <div className="flex flex-col w-full gap-4">
              <h1 className="font-secondary text-base font-medium">Filter by</h1>
              <div className="flex flex-col w-full gap-2">
                <h3 className="font-secondary text-sm font-normal">Posts from</h3>
                <div className="flex flex-row gap-2">
                  <div className="w-2/3">
                    <SelectMonth
                      onChange={(e) => {
                        const formatDate = new Date(fromDate.setMonth(parseInt(e)));
                        setFromDate(formatDate);
                      }}
                    />
                  </div>
                  <div className="w-1/3">
                    <SelectYear
                      onChange={(e) => {
                        const formatDate = new Date(fromDate.setFullYear(parseInt(e)));
                        setFromDate(formatDate);
                      }}
                    />
                  </div>
                </div>
              </div>
              {/* to do later */}
              <MultiSelect
                options={
                  tagsList?.Tags?.map(({ title, id }) => {
                    return {
                      label: title,
                      value: id,
                    };
                  }) || []
                }
                onValueChange={setBlogTags}
                defaultValue={blogTags}
                placeholder="Select tag"
                variant="inverted"
                animation={2}
                maxCount={3}
              />
            </div>
          </PopOverFilterButton>
        </div>

        <div className="w-full lg:w-[75%]">
          <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 gap-5">
            {isLoading ? (
              <>
                {Array.from({ length: 10 }).map((_, index) => (
                  <BlogCardSkeleton key={index} />
                ))}
              </>
            ) : (
              <>
                {blogList?.blogs.map((item, index) => {
                  return (
                    <BlogCard
                      key={index}
                      blogId={item.id}
                      createdBy={`${item.author.firstName} ${item.author.lastName}`}
                      avatar={item.author.profilePic}
                      date={format(item.createdAt, "dd MMM, yyyy")}
                      description={item.content}
                      title={item.title}
                      tag={item.tags[0]?.title}
                      img={item.coverImage || ""}
                      createdAt={item.createdAt}
                    />
                  );
                })}
              </>
            )}
          </div>

          {(blogList?.count || 0) > 0 && (
            <div className="flex justify-end">
              <Pagination
                totalCount={blogList?.count || 0}
                activePage={activePage}
                pageSize={10}
                onPageChange={(e) => setActivePage(e)}
              />
            </div>
          )}
        </div>
      </div>
    </PageContainer>
  );
};

export default Blog;
