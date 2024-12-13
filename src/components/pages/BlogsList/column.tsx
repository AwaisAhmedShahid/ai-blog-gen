"use client";

import { ColumnDef } from "@tanstack/react-table";

import { Image as NoImage, MoreHorizontal } from "lucide-react";

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
import ArchiveAction from "./ArchiveAction";
import DraftAction from "./DraftAction";
import { formatString } from "@/utils";
import { generateSlugUrl } from "@/utils/query-parser";
import Image from "next/image";

export const columns: ColumnDef<Blogs>[] = [
  {
    id: "select",
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
    size: 10, // Setting minimum width
    maxSize: 10, // Setting maximum width
  },
  {
    accessorKey: "coverImage",
    header: ({ column }) => {
      return <ColumnHeader column={column} title="Cover" />;
    },
    size: 20, // Setting minimum width
    maxSize: 20, // Setting maximum width
    cell: ({ row }) => {
      const imgSrc: string = row.getValue("coverImage");
      if (imgSrc === "")
        return (
          <div className="w-[100px] bg-[#F5F5F5] rounded-[6px] h-[50px] flex items-center justify-center">
            <NoImage size={20} className="text-slate-600" />
          </div>
        );

      return (
        <Image
          src={imgSrc}
          alt={row.getValue("coverImageAlt") || ""}
          width={100}
          height={100}
          // layout="fill"
          objectFit="cover"
          className="  h-[50px] w-[100px]  rounded-[6px] "
        />
      );
    },
    footer: "cover",
    enableSorting: false,
  },
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
      return <Badge variant={status === "PUBLISHED" ? "default" : "destructive"}>{formatString(status)}</Badge>;
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
    size: 10, // Setting minimum width
    maxSize: 10, // Setting maximum width
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
            <Link href={`${PAGE_ROUTES.ADMIN_BLOG_CREATE}/?id=${data.id}`}>
              <DropdownMenuItem>Edit</DropdownMenuItem>
            </Link>

            <ArchiveAction id={data.id.toString()} />
            <DraftAction id={data.id.toString()} />
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
