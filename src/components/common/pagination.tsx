"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";

interface PaginationProps {
  totalCount: number; // Total number of items
  pageSize?: number; // Number of items per page, default is 10
  activePage?: number; // The currently active page
  onPageChange: (e: number) => void;
}

export default function Pagination({ totalCount, pageSize = 10, activePage = 1, onPageChange }: PaginationProps) {
  const [currentPage, setCurrentPage] = useState(activePage);

  // Calculate total pages based on totalCount and pageSize
  const totalPages = useMemo(() => Math.ceil(totalCount / pageSize), [totalCount, pageSize]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    onPageChange(page);
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      onPageChange(currentPage + 1);
    }
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      onPageChange(currentPage - 1);
    }
  };

  // Helper function to generate the pagination buttons with ellipses
  const getPageNumbers = (): (number | string)[] => {
    // Modified type to accept both number and string
    const pageNumbers: (number | string)[] = [];
    const siblingCount = 1; // Show 1 page before/after the current page

    // Always show the first page
    pageNumbers.push(1);

    // Show ellipses if currentPage is far from the start
    if (currentPage > siblingCount + 2) {
      pageNumbers.push("...");
    }

    // Calculate start and end of the middle range
    const start = Math.max(2, currentPage - siblingCount);
    const end = Math.min(totalPages - 1, currentPage + siblingCount);

    // Add middle pages
    for (let i = start; i <= end; i++) {
      pageNumbers.push(i);
    }

    // Show ellipses if currentPage is far from the end
    if (currentPage < totalPages - siblingCount - 1) {
      pageNumbers.push("...");
    }

    // Always show the last page
    if (totalPages > 1) {
      pageNumbers.push(totalPages);
    }

    return pageNumbers;
  };

  return (
    <div className="flex items-center space-x-2">
      <Button
        variant="outline"
        className="bg-white text-black border border-gray-300"
        onClick={handlePrevious}
        disabled={currentPage === 1}
      >
        ← Previous
      </Button>

      {/* Render page number buttons with ellipses */}
      {getPageNumbers().map((page, index) =>
        typeof page === "number" ? (
          <Button
            key={index}
            variant={currentPage === page ? "default" : "outline"}
            className={`w-10 rounded-xl h-10 p-0 ${currentPage === page ? "bg-purple-600 text-white" : ""}`}
            onClick={() => handlePageChange(page)}
          >
            {page}
          </Button>
        ) : (
          <span key={index} className="w-10 h-10 flex items-center justify-center">
            ...
          </span>
        ),
      )}
      <Button
        variant="outline"
        className="bg-white text-black border border-gray-300"
        onClick={handleNext}
        disabled={currentPage === totalPages}
      >
        Next →
      </Button>
    </div>
  );
}
