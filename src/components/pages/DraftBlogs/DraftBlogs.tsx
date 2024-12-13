"use client";

import { ContentLayout } from "@/components/admin-panel/content-layout";
import { DataTable, IconInput } from "@/components/common";
import { getCoreRowModel, useReactTable } from "@tanstack/react-table";
import React, { useState } from "react";
import { BlogStatus } from "@prisma/client";
import PageTitle from "@/components/common/page-title";
import { SearchIcon } from "lucide-react";
import { debounce } from "lodash";
import { columns } from "./column";
import { getBlogResType } from "@/app/api/blog/validators";
import { useQuery } from "@tanstack/react-query";
import { allBlogs } from "@/utils/api";
import { useSearchParams } from "next/navigation";

const BlogListPage = () => {
  const [searchValue, setSearchValue] = useState<string>("");
  const searchParams = useSearchParams();

  const limit = searchParams.get("per_page") || 10;
  const page = searchParams.get("current_page") || 1;
  const { data: blogList, isPending: isLoading } = useQuery<getBlogResType["data"]["result"]>({
    queryKey: ["blog-list", searchValue, limit, page],
    queryFn: async () => {
      const res = await allBlogs({
        searchValue,
        status: BlogStatus.DRAFT,
        limit: Number(limit),
        page: Number(page),
      });
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
      <PageTitle title="Draft Posts" />
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
