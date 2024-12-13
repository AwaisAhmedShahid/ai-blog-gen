"use client";

import { ColumnDef } from "@tanstack/react-table";

import { MoreHorizontal } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { ColumnHeader } from "@/components/common";
// import { Checkbox } from "@/components/ui/checkbox";
import { Blogs, Tag } from "@prisma/client";
import { Badge, Checkbox } from "@/components/ui";
import dayjs from "dayjs";
import { PAGE_ROUTES } from "@/constants/API_ROUTES";
import PublishAction from "./PublishAction";
import { generateSlugUrl } from "@/utils/query-parser";

export const columns: ColumnDef<Blogs>[] = [
  {
    id: "select",
    size: 5,
    header: () => <></>,
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  // {
  //   accessorKey: "cover",
  //   header: ({ column }) => {
  //     return <ColumnHeader column={column} title="Cover" />;
  //   },
  //   footer: "cover",
  //   enableSorting: false,
  //   size: 20,
  // },
  {
    accessorKey: "title",
    header: ({ column }) => {
      return <ColumnHeader column={column} title="Title" />;
    },

    footer: "Content",
    enableSorting: false,
  },

  {
    accessorKey: "status",
    header: ({ column }) => {
      return <ColumnHeader column={column} title="Status" />;
    },
    cell: ({ row }) => {
      const status: string = row.getValue("status");
      return <Badge variant={status === "PUBLISHED" ? "default" : "destructive"}>{status.toLowerCase()}</Badge>;
    },
    enableSorting: false,
  },
  {
    accessorKey: "tags",
    header: ({ column }) => {
      return <ColumnHeader column={column} title="Tags" />;
    },
    cell: ({ row }) => {
      const tags: Tag[] = row.getValue("tags");
      const schedularTagId: string | null = row.original.schedularTagId;
      return (
        <div className={"flex  gap-2 flex-wrap"}>
          {schedularTagId && <Badge variant="secondary">Scheduled</Badge>}
          {tags.map((tag: Tag) => {
            return <Badge key={tag.id}>{tag.title}</Badge>;
          })}
        </div>
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return <ColumnHeader column={column} title="Created At" />;
    },
    cell: ({ row }) => {
      return <div className="font-medium">{dayjs(row.getValue("createdAt")).format("LL")}</div>;
    },
    enableSorting: false,
  },

  {
    id: "actions",
    cell: ({ row }) => {
      const data = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <MoreHorizontal className=" w-12 hover:text-teal-500 hover:shadow-lg rotate-90" />
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <Link href={PAGE_ROUTES.BLOG.replace(":blogId", generateSlugUrl(data.title, data.createdAt.toString()))}>
              <DropdownMenuItem>View</DropdownMenuItem>
            </Link>

            <PublishAction id={data.id.toString()} />
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
