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
import { Schedular, Tag } from "@prisma/client";
import { Badge, Checkbox } from "@/components/ui";
import dayjs from "dayjs";
import { formatString } from "@/utils";
import { PAGE_ROUTES } from "@/constants/API_ROUTES";

export const columns: ColumnDef<Schedular>[] = [
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
    accessorKey: "frequency",
    header: ({ column }) => {
      return <ColumnHeader column={column} title="Frequency" />;
    },
    cell: ({ row }) => {
      const freq: string = row.getValue("frequency");
      return formatString(freq);
    },

    footer: "title",
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
      const tags: {
        tag: Tag;
      }[] = row.getValue("tags");
      return (
        <div className={"flex flex-wrap gap-2"}>
          {tags.map(({ tag }: { tag: Tag }) => {
            return <Badge key={tag.id}>{tag.title}</Badge>;
          })}
        </div>
      );
    },
    enableSorting: false,
  },
  // {
  //   accessorKey: "Focused_topics",
  //   header: ({ column }) => {
  //     return <ColumnHeader column={column} title="Focused Topics" />;
  //   },
  //   cell: ({ row }) => {
  //     const tags: {
  //       focusTopic: string;
  //     }[] = row.getValue("tags");
  //     return (
  //       <div className={"flex flex-wrap gap-2 "}>
  //         {tags.map(({ focusTopic }: { focusTopic: string }) => {
  //           return <Badge key={focusTopic} className="truncate">{focusTopic}</Badge>;
  //         })}
  //       </div>
  //     );
  //   },
  //   enableSorting: false,
  // },
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
            <MoreHorizontal className="h-5 w-12 hover:text-teal-500 hover:shadow-lg" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <Link href={`${PAGE_ROUTES.SCHEDULE_BLOG}/?id=${data.id}`}>
              <DropdownMenuItem>Edit</DropdownMenuItem>
            </Link>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
