"use client";

import { ContentLayout } from "@/components/admin-panel/content-layout";
import { DataTable } from "@/components/common";
import { getCoreRowModel, useReactTable } from "@tanstack/react-table";
import React from "react";
import { columns } from "./column";
import { useAuthContext } from "@/context/AuthContext";

import PageTitle from "@/components/common/page-title";
import { useQuery } from "@tanstack/react-query";
import { scheduleBlogList } from "@/utils/api";
import { getSchedularListResType } from "@/app/api/schedular/validators";

const BlogListPage = () => {
  const { userInfo } = useAuthContext();

  const { data: blogList, isPending: isLoading } = useQuery<NonNullable<getSchedularListResType["data"]["result"]>>({
    queryKey: ["schedule-blog-list", userInfo?.id],
    queryFn: async () => {
      const res = await scheduleBlogList(userInfo?.id || "");
      if (res.ok) {
        const formattedData = await res.json();
        if (formattedData.success) {
          return formattedData.data.result as NonNullable<getSchedularListResType["data"]["result"]>;
        }
      }
      throw new Error("Failed to fetch blogs");
    },
  });

  const table = useReactTable({
    data: blogList?.schedularList || [],
    columns: columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <ContentLayout title="The Funnel Blog" style="flex flex-col gap-6">
      <PageTitle title="Scheduled Posts" />
      {/* <div className="flex items-center gap-[10px] w-1/3">
        <IconInput
          placeholder="Search topics"
          // onChange={handleChange}
          className="shadow-none"
          icon={<SearchIcon size={16} />}
        />
        <FilterButton />
      </div> */}
      <hr />
      <DataTable loading={isLoading} table={table} total={blogList?.count || 0} />
    </ContentLayout>
  );
};

export default BlogListPage;
