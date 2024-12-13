import { Column } from "@tanstack/react-table";
import React from "react";
import { ArrowUpIcon, ArrowDownIcon, ArrowDownUpIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/utils/tailwind-utils";

interface DataTableColumnHeaderProps<TData, TValue> extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>;
  title: string;
}

export function ColumnHeader<TData, TValue>({ column, title, className }: DataTableColumnHeaderProps<TData, TValue>) {
  if (!column.getCanSort()) {
    return <div className={cn("ml-2 text-xs", className)}>{title}</div>;
  }

  const getSortIcon = () => {
    if (column.getIsSorted() === "desc") {
      return <ArrowDownIcon className="ml-2 h-4 w-4" />;
    }

    if (column.getIsSorted() === "asc") {
      return <ArrowUpIcon className="ml-2 h-4 w-4" />;
    }

    return <ArrowDownUpIcon className="ml-2 h-4 w-4" />;
  };
  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="data-[state=open]:bg-muted border-none  h-8 w-full justify-between px-2"
      >
        <span className="text-left ">{title}</span>
        {getSortIcon()}
      </Button>
    </div>
  );
}
