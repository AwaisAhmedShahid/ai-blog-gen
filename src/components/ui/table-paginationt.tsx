"use client";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ArrowDownNarrowWide } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface paginationProps {
  count: number;
}

export function PaginationsParams({ count = 10 }: paginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const search = Object.fromEntries(searchParams);
  const location = window.location;
  const pageSize = Number(search.per_page) || 10;
  const numPages = Math.ceil(count / pageSize);
  const current_page = Number(search.current_page) || 1;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const pagination: any = [];

  for (let i = 0; i < numPages; i++) {
    pagination.push({
      page: i + 1,
      per_page: pageSize,
    });
  }

  const getPaginationItems = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const items: any = [];

    if (numPages <= 11) {
      // If total pages are 11 or less, show all pages
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      pagination.forEach((itm) => {
        items.push(
          <PaginationItem key={itm.page}>
            <PaginationLink
              className={`${current_page === itm.page ? "bg-gray-700 text-gray-50 cursor-pointer" : "cursor-pointer"}`}
              onClick={() => router.push(`${location.pathname}?current_page=${itm.page}&per_page=${itm.per_page}`)}
            >
              {itm.page}
            </PaginationLink>
          </PaginationItem>,
        );
      });
    } else {
      // Display first 2 pages, ellipsis, current page, ellipsis, and last 2 pages
      // First 2 pages
      items.push(
        <PaginationItem key={1}>
          <PaginationLink
            className={`${current_page === 1 ? "bg-gray-700 text-gray-50 cursor-pointer" : "cursor-pointer"}`}
            onClick={() => router.push(`${location.pathname}?current_page=1&per_page=${pageSize}`)}
          >
            1
          </PaginationLink>
        </PaginationItem>,
      );
      items.push(
        <PaginationItem key={2}>
          <PaginationLink
            className={`${current_page === 2 ? "bg-gray-700 text-gray-50 cursor-pointer" : "cursor-pointer"}`}
            onClick={() => router.push(`${location.pathname}?current_page=2&per_page=${pageSize}`)}
          >
            2
          </PaginationLink>
        </PaginationItem>,
      );

      if (current_page > 4) {
        items.push(
          <PaginationItem key="ellipsis-1">
            <PaginationEllipsis />
          </PaginationItem>,
        );
      }

      // Pages around the current page
      for (let i = Math.max(3, current_page - 2); i <= Math.min(numPages - 2, current_page + 2); i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              className={`${current_page === i ? "bg-gray-700 text-gray-50 cursor-pointer" : "cursor-pointer"}`}
              onClick={() => router.push(`${location.pathname}?current_page=${i}&per_page=${pageSize}`)}
            >
              {i}
            </PaginationLink>
          </PaginationItem>,
        );
      }

      if (current_page < numPages - 3) {
        items.push(
          <PaginationItem key="ellipsis-2">
            <PaginationEllipsis />
          </PaginationItem>,
        );
      }

      // Last 2 pages
      items.push(
        <PaginationItem key={numPages - 1}>
          <PaginationLink
            className={`${
              current_page === numPages - 1 ? "bg-gray-700 text-gray-50 cursor-pointer" : "cursor-pointer"
            }`}
            onClick={() => router.push(`${location.pathname}?current_page=${numPages - 1}&per_page=${pageSize}`)}
          >
            {numPages - 1}
          </PaginationLink>
        </PaginationItem>,
      );
      items.push(
        <PaginationItem key={numPages}>
          <PaginationLink
            className={`${current_page === numPages ? "bg-gray-700 text-gray-50 cursor-pointer" : "cursor-pointer"}`}
            onClick={() => router.push(`${location.pathname}?current_page=${numPages}&per_page=${pageSize}`)}
          >
            {numPages}
          </PaginationLink>
        </PaginationItem>,
      );
    }

    return items;
  };

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            className="cursor-pointer"
            onClick={() => {
              if (Number(current_page) > 1) {
                router.push(`${location.pathname}?current_page=${Number(current_page) - 1}&per_page=${pageSize}`);
              }
            }}
          />
        </PaginationItem>

        {getPaginationItems()}

        <PaginationItem>
          <PaginationNext
            className="cursor-pointer"
            onClick={() => {
              if (Number(current_page) < numPages) {
                router.push(`${location.pathname}?current_page=${Number(current_page) + 1}&per_page=${pageSize}`);
              }
            }}
          />
        </PaginationItem>

        {/* Number of items */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <ArrowDownNarrowWide />
              <span className="mx-1">{pageSize}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>Items per page</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuRadioGroup
              value={pageSize.toString()}
              onValueChange={(e) => router.push(`${location.pathname}?current_page=1&per_page=${Number(e)}`)}
            >
              <DropdownMenuRadioItem value="10">10</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="25">25</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="100">100</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </PaginationContent>
    </Pagination>
  );
}
