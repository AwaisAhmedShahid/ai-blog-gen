"use client";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import { DataTable } from "@/components/common";
import { Button, Dialog, DialogContent, DialogTitle } from "@/components/ui";
import { getCoreRowModel, useReactTable } from "@tanstack/react-table";
import React, { useEffect, useState } from "react";
import { columns } from "./column";
import PageTitle from "@/components/common/page-title";
import { getTags } from "@/utils/api";
import { useQuery } from "@tanstack/react-query";
import { getTagResType } from "@/app/api/tag/validators";
import { CreateTagPage } from "../CreateTag";
import { useSearchParams } from "next/navigation";

const TagListPage = () => {
  const searchParams = useSearchParams();

  const limit = searchParams.get("per_page") || 10;
  const page = searchParams.get("current_page") || 1;
  const tagId = searchParams.get("id");
  const [openCreateModal, setOpenCreateModal] = useState<boolean>(false);
  const { data: tagsList, isPending: isLoading } = useQuery<NonNullable<getTagResType["data"]["result"]>>({
    queryKey: ["tag-list", limit, page],
    queryFn: async () => {
      const res = await getTags({ limit: Number(limit), page: Number(page) });
      if (res.ok) {
        const formattedData = await res.json();
        if (formattedData.success) {
          return formattedData.data.result as NonNullable<getTagResType["data"]["result"]>;
        }
      }
      throw new Error("Failed to fetch tags");
    },
  });

  const table = useReactTable({
    data: tagsList?.Tags || [],
    columns: columns,
    getCoreRowModel: getCoreRowModel(),
  });

  useEffect(() => {
    if (tagId) {
      setOpenCreateModal(true);
    }
  }, [tagId]);

  return (
    <ContentLayout title="The Funnel Blog" style="flex flex-col gap-6">
      <Dialog open={openCreateModal}>
        <DialogTitle></DialogTitle>
        <DialogContent className="overflow-hidden p-0 shadow-lg">
          <CreateTagPage onCancel={() => setOpenCreateModal(!openCreateModal)} />
        </DialogContent>
      </Dialog>
      <div className="flex justify-between items-center">
        <PageTitle title="Tags" />
        <Button onClick={() => setOpenCreateModal(!openCreateModal)}>Create Tag</Button>
      </div>

      <hr />
      <DataTable loading={isLoading} table={table} total={tagsList?.count || 0} />
    </ContentLayout>
  );
};

export default TagListPage;
