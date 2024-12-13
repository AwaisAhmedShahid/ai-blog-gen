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
import dayjs from "dayjs";
import { PAGE_ROUTES } from "@/constants/API_ROUTES";
export type TagsAndBlogs = Tag & {
  blogs: Blogs[];
};
export const columns: ColumnDef<TagsAndBlogs>[] = [
  {
    accessorKey: "title",
    header: ({ column }) => {
      return <ColumnHeader column={column} title="Title" />;
    },
    footer: "title",
    enableSorting: false,
  },

  {
    accessorKey: "no-of-blogs",
    header: ({ column }) => {
      return <ColumnHeader column={column} title="Total Blogs" />;
    },
    cell: ({ row }) => {
      const totalBlogs = row.original?.blogs;
      return <div>{totalBlogs.length}</div>;
    },
    enableSorting: false,
  },
  {
    accessorKey: "isActive",
    header: ({ column }) => {
      return <ColumnHeader column={column} title="Status" />;
    },
    cell: ({ row }) => {
      const status = row.getValue("isActive");
      return (
        <div className={status ? "text-green-500" : "text-red-500"}>
          {row.getValue("isActive") ? "Active" : "Inactive"}
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
            <MoreHorizontal className="h-5 w-12 hover:text-teal-500 hover:shadow-lg" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <Link href={`${PAGE_ROUTES.ADMIN_TAGS}/?id=${data.id.toString()}`}>
              <DropdownMenuItem>Edit</DropdownMenuItem>
            </Link>
            {/* <DeleteAction id={data.id.toString()} /> */}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
