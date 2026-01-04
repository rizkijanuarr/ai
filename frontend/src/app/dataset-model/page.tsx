"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/navbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ExternalLink } from "lucide-react";
import { datasetService } from "@/services/dataset.service";
import { ApiError } from "@/services/api-client";
import { toast } from "sonner";
import type { DatasetData } from "@/types/api";

export default function DatasetModelPage() {
  const [datasets, setDatasets] = useState<DatasetData[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalData, setTotalData] = useState(0);
  const [filter, setFilter] = useState<number>(1); // Default to Legal
  const itemsPerPage = 10;

  const fetchDatasets = async (page: number, isLegal?: number) => {
    setLoading(true);
    const startTime = Date.now();

    try {
      const response = await datasetService.getList({
        page,
        limit_data: itemsPerPage,
        is_legal: isLegal,
      });

      if (response.success && response.data) {
        setDatasets(response.data);
        setTotalData(response.total_data);
        setCurrentPage(response.current_page);
      } else {
        toast.error("Gagal memuat data", {
          description: response.message || "Terjadi kesalahan",
        });
      }
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error("Error!", {
          description: error.message,
        });
      }
    } finally {
      // Ensure minimum 3 second loading for skeleton display
      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(0, 500 - elapsedTime);

      setTimeout(() => {
        setLoading(false);
      }, remainingTime);
    }
  };

  useEffect(() => {
    fetchDatasets(1, filter);
  }, [filter]);

  const totalPages = Math.ceil(totalData / itemsPerPage);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      fetchDatasets(page, filter);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleFilterChange = (isLegal: number) => {
    setFilter(isLegal);
    setCurrentPage(1);
  };

  return (
    <main className="min-h-screen bg-slate-950">
      <Navbar />

      {/* Hero Banner */}
      <div className="relative h-64 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] bg-repeat"></div>
        </div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>

        {/* Content */}
        <div className="relative container mx-auto px-4 h-full flex flex-col justify-end pb-8">
          <h1 className="text-5xl font-bold text-white mb-3 drop-shadow-lg">
            Dataset Model
          </h1>
          <p className="text-lg text-slate-300 max-w-2xl">
            Explore {totalData.toLocaleString()} dataset records used for AI classification.
            Discover legal and illegal website patterns analyzed by IndoBERT.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">

        {/* Filters */}
        <div className="flex gap-2 mb-6">
          <Button
            variant={filter === 1 ? "default" : "outline"}
            onClick={() => handleFilterChange(1)}
            size="sm"
            className={filter === 1 ? "bg-green-600 hover:bg-green-700" : ""}
          >
            Legal
          </Button>
          <Button
            variant={filter === 0 ? "default" : "outline"}
            onClick={() => handleFilterChange(0)}
            size="sm"
            className={filter === 0 ? "bg-red-600 hover:bg-red-700" : ""}
          >
            Illegal
          </Button>
        </div>


        {/* Loading State - Skeleton */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
            {Array.from({ length: itemsPerPage }).map((_, index) => (
              <div
                key={index}
                className="bg-slate-900 rounded-lg overflow-hidden border border-slate-800 p-4"
              >
                {/* Header: Title + Badge */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <Skeleton className="h-10 flex-1" />
                  <Skeleton className="h-5 w-16 shrink-0" />
                </div>

                {/* Keyword */}
                <Skeleton className="h-5 w-32 mb-2" />

                {/* Description */}
                <div className="space-y-2 mb-3">
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-3/4" />
                </div>

                {/* Link */}
                <Skeleton className="h-4 w-full" />
              </div>
            ))}
          </div>
        ) : (
          <>
            {/* Dataset Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
              {datasets.map((dataset) => (
                <div
                  key={dataset.id}
                  className="bg-slate-900 rounded-lg overflow-hidden border border-slate-800 hover:border-orange-500/50 transition-all group"
                >
                  {/* Content */}
                  <div className="p-4">
                    {/* Header: Title + Badge */}
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <h3 className="text-sm font-semibold text-white line-clamp-2 group-hover:text-orange-400 transition-colors flex-1">
                        {dataset.title}
                      </h3>
                      <Badge
                        variant={dataset.is_legal === 1 ? "default" : "destructive"}
                        className={`text-xs shrink-0 ${
                          dataset.is_legal === 1
                            ? "bg-green-600"
                            : "bg-red-600"
                        }`}
                      >
                        {dataset.is_legal === 1 ? "LEGAL" : "ILLEGAL"}
                      </Badge>
                    </div>

                    {/* Keyword */}
                    <div className="mb-2">
                      <Badge variant="secondary" className="text-xs">
                        {dataset.keyword}
                      </Badge>
                    </div>

                    {/* Description */}
                    <p className="text-xs text-slate-400 line-clamp-3 mb-3">
                      {dataset.description}
                    </p>

                    {/* Link with Tooltip */}
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <a
                            href={dataset.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 text-xs text-orange-400 hover:text-orange-300 transition-colors w-full"
                          >
                            <ExternalLink className="h-3 w-3 shrink-0" />
                            <span className="truncate font-mono">{dataset.link}</span>
                          </a>
                        </TooltipTrigger>
                        <TooltipContent side="bottom" className="max-w-md">
                          <p className="text-xs break-all">{dataset.link}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() => handlePageChange(currentPage - 1)}
                        className={
                          currentPage === 1
                            ? "pointer-events-none opacity-50"
                            : "cursor-pointer"
                        }
                      />
                    </PaginationItem>

                    {/* Page Numbers */}
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }

                      return (
                        <PaginationItem key={pageNum}>
                          <PaginationLink
                            onClick={() => handlePageChange(pageNum)}
                            isActive={currentPage === pageNum}
                            className="cursor-pointer"
                          >
                            {pageNum}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    })}

                    <PaginationItem>
                      <PaginationNext
                        onClick={() => handlePageChange(currentPage + 1)}
                        className={
                          currentPage === totalPages
                            ? "pointer-events-none opacity-50"
                            : "cursor-pointer"
                        }
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}

            {/* Page Info */}
            <div className="text-center mt-4 text-sm text-slate-400">
              Page {currentPage} of {totalPages} • Showing {datasets.length} of{" "}
              {totalData.toLocaleString()} records
            </div>
          </>
        )}
      </div>
    </main>
  );
}
