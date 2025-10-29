import { useRouter } from "next/router"
import { PaginationContent, PaginationPrevious, Pagination, PaginationItem, PaginationLink, PaginationNext, PaginationEllipsis } from "../ui/pagination"
import { useEffect, useState, useCallback, useMemo } from "react"
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Loader2 } from "lucide-react"

export function PaginationNav({ currentPage, totalPages, handlePageChange }: { currentPage: number, totalPages: number, handlePageChange: (page: number) => Promise<void> }) {
    const [isLoading, setIsLoading] = useState(false)

    const handlePageChangeInternal = useCallback(async (page: number) => {
        if (page < 1 || page > totalPages || page === currentPage || isLoading) {
            return
        }

        setIsLoading(true);
        try {
            await handlePageChange(page);
        } finally {
            setIsLoading(false);
        }
    }, [currentPage, totalPages, isLoading, handlePageChange]);

    // Generate visible page numbers
    const visiblePages = useMemo(() => {
        const pages: (number | 'ellipsis')[] = [];
        const maxVisiblePages = 7;

        if (totalPages <= maxVisiblePages) {
            // Show all pages if total is small
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            // Always show first page
            pages.push(1);

            if (currentPage > 3) {
                pages.push('ellipsis');
            }

            // Show pages around current page
            const startPage = Math.max(2, currentPage - 1);
            const endPage = Math.min(totalPages - 1, currentPage + 1);

            for (let i = startPage; i <= endPage; i++) {
                pages.push(i);
            }

            if (currentPage < totalPages - 2) {
                pages.push('ellipsis');
            }

            // Always show last page
            pages.push(totalPages);
        }

        return pages;
    }, [currentPage, totalPages]);

    return (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white rounded-xl shadow-lg p-4 border border-gray-200">
            {/* Page Info */}
            <div className="text-sm text-gray-600">
                Page <span className="font-semibold text-gray-900">{currentPage}</span> of{' '}
                <span className="font-semibold text-gray-900">{totalPages}</span>
            </div>

            {/* Pagination Controls */}
            <Pagination>
                <PaginationContent className="gap-1">
                    {/* First Page Button */}
                    <PaginationItem>
                        <button
                            onClick={() => handlePageChangeInternal(1)}
                            disabled={currentPage === 1 || isLoading}
                            className="inline-flex items-center justify-center h-9 w-9 rounded-lg border border-gray-200 bg-white hover:bg-indigo-50 hover:border-indigo-300 hover:text-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-gray-200 transition-all duration-200"
                            aria-label="Go to first page"
                        >
                            <ChevronsLeft className="h-4 w-4" />
                        </button>
                    </PaginationItem>

                    {/* Previous Button */}
                    <PaginationItem>
                        <button
                            onClick={() => handlePageChangeInternal(currentPage - 1)}
                            disabled={currentPage === 1 || isLoading}
                            className="inline-flex items-center justify-center h-9 px-4 rounded-lg border border-gray-200 bg-white hover:bg-indigo-50 hover:border-indigo-300 hover:text-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-gray-200 transition-all duration-200 font-medium text-sm"
                            aria-label="Go to previous page"
                        >
                            <ChevronLeft className="h-4 w-4 mr-1" />
                            Previous
                        </button>
                    </PaginationItem>

                    {/* Page Numbers */}
                    {visiblePages.map((page, index) => (
                        page === 'ellipsis' ? (
                            <PaginationEllipsis key={`ellipsis-${index}`} />
                        ) : (
                            <PaginationItem key={page}>
                                <button
                                    onClick={() => handlePageChangeInternal(page)}
                                    disabled={isLoading}
                                    className={`inline-flex items-center justify-center h-9 w-9 rounded-lg border transition-all duration-200 font-medium text-sm ${
                                        page === currentPage
                                            ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-indigo-600 shadow-md'
                                            : 'border-gray-200 bg-white hover:bg-indigo-50 hover:border-indigo-300 hover:text-indigo-600'
                                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                                >
                                    {page}
                                </button>
                            </PaginationItem>
                        )
                    ))}

                    {/* Next Button */}
                    <PaginationItem>
                        <button
                            onClick={() => handlePageChangeInternal(currentPage + 1)}
                            disabled={currentPage === totalPages || isLoading}
                            className="inline-flex items-center justify-center h-9 px-4 rounded-lg border border-gray-200 bg-white hover:bg-indigo-50 hover:border-indigo-300 hover:text-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-gray-200 transition-all duration-200 font-medium text-sm"
                            aria-label="Go to next page"
                        >
                            Next
                            <ChevronRight className="h-4 w-4 ml-1" />
                        </button>
                    </PaginationItem>

                    {/* Last Page Button */}
                    <PaginationItem>
                        <button
                            onClick={() => handlePageChangeInternal(totalPages)}
                            disabled={currentPage === totalPages || isLoading}
                            className="inline-flex items-center justify-center h-9 w-9 rounded-lg border border-gray-200 bg-white hover:bg-indigo-50 hover:border-indigo-300 hover:text-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-gray-200 transition-all duration-200"
                            aria-label="Go to last page"
                        >
                            <ChevronsRight className="h-4 w-4" />
                        </button>
                    </PaginationItem>
                </PaginationContent>
            </Pagination>

            {/* Loading Indicator */}
            {isLoading && (
                <div className="flex items-center gap-2 text-sm text-indigo-600">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Loading...</span>
                </div>
            )}
        </div>
    )
}