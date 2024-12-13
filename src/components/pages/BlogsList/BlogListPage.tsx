"use client";

import { ContentLayout } from "@/components/admin-panel/content-layout";
import { DataTable, IconInput } from "@/components/common";
import { Button } from "@/components/ui";
import { getCoreRowModel, useReactTable } from "@tanstack/react-table";
import React, { useState } from "react";
import { columns } from "./column";
import PageTitle from "@/components/common/page-title";
import { CalendarCheckIcon, PencilIcon, SearchIcon } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { PAGE_ROUTES } from "@/constants/API_ROUTES";
import { debounce } from "lodash";
import { useQuery } from "@tanstack/react-query";
import { allBlogs } from "@/utils/api";
import { getBlogResType } from "@/app/api/blog/validators";

const BlogListPage = () => {
  const router = useRouter();
  const [searchValue, setSearchValue] = useState<string>("");
  const searchParams = useSearchParams();

  const limit = searchParams.get("per_page") || 10;
  const page = searchParams.get("current_page") || 1;
  const { data: blogList, isPending: isLoading } = useQuery<getBlogResType["data"]["result"]>({
    queryKey: ["blog-list", searchValue, page, limit],
    queryFn: async () => {
      const res = await allBlogs({ searchValue, page: Number(page), limit: Number(limit) });
      if (res.ok) {
        const formattedData = await res.json();
        if (formattedData.success) {
          return formattedData.data.result as getBlogResType["data"]["result"];
        }
      }
      throw new Error("Failed to fetch blogs");
    },
  });

  const debouncedSearch = debounce((query) => setSearchValue(query), 500); // 500ms delay

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    debouncedSearch(e.target.value);
  };

  const table = useReactTable({
    data: blogList?.blogs || [],
    columns: columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <ContentLayout title="The Funnel Blog" style="flex flex-col gap-6">
      <div className="h-56 rounded-lg bg-gradient-to-b from-primary-color to-primary-color  w-full flex items-center justify-center">
        <div className=" flex flex-col items-center align-middle justify-center gap-[22px]">
          <h1 className="text-white font-extrabold text-[32px] leading-10">What should we create today?</h1>
          <div className="flex w-full justify-center gap-[22px]">
            <Button
              onClick={() => router.push(PAGE_ROUTES.ADMIN_BLOG_CREATE)}
              variant={"secondary"}
              className="text-primary-color gap-2 font-bold text-base px-[24px] py-[13px]  h-[50px]"
            >
              <PencilIcon size={16} className="text-primary-color" />
              AI Create
            </Button>
            <Button
              variant={"secondary"}
              onClick={() => router.push(PAGE_ROUTES.SCHEDULE_BLOG)}
              className="text-primary-color gap-2 font-bold text-base px-[24px] py-[18px] h-[50px]"
            >
              <CalendarCheckIcon size={16} />
              AI Campaign
            </Button>
          </div>
        </div>
      </div>
      <PageTitle title="Posts" />
      <div className="flex items-center gap-[10px] w-1/3">
        <IconInput
          placeholder="Search topics"
          onChange={handleChange}
          className="shadow-none"
          icon={<SearchIcon size={16} />}
        />
        {/* <FilterButton /> */}
      </div>
      <hr />
      <DataTable loading={isLoading} table={table} total={blogList?.count || 0} />
    </ContentLayout>
  );
};

export default BlogListPage;
