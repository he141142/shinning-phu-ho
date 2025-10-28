import { useRouter } from "next/router"
import { PaginationContent, PaginationPrevious, Pagination, PaginationItem, PaginationLink, PaginationNext, PaginationEllipsis } from "../ui/pagination"
import { useEffect, useState } from "react"

export function PaginationNav({ currentPage, totalPages, handlePageChange }: { currentPage: number, totalPages: number, handlePageChange: (page: number) => Promise<void> }) {
    const [students, setStudents] = useState(0)
    const [isLoading, setIsLoading] = useState(false)
    const handlePageChange2 = async (page: number) => {
        if (page < 1 || page > totalPages) {
            return
        }

        setIsLoading(prev => true);
        await handlePageChange(page);
        setIsLoading(prev => false);
    };


    useEffect(() => {
        return () => {
            console.log("cleanup");
            
        }
    },[]);

    console.log("currentPage", currentPage);
    console.log("totalPages", totalPages);

    return (
        <>
            <Pagination className="mt-8 ">
                <PaginationContent >
                    <PaginationItem>
                        <PaginationPrevious
                            className="disabled:opacity-50 cursor-pointer animate-out hover:animate-in  transition duration-300  hover:shadow-neon-red-hover"
                            onClick={() => handlePageChange2(currentPage - 1)}
                            disabled={currentPage === 1 || isLoading}
                        />
                    </PaginationItem>
                    {[...Array(totalPages)].map((_, index) => {
                        const page = index + 1
                        if (page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)) {
                            return (
                                <PaginationItem key={page} >
                                    
                                    <PaginationLink
                                        onClick={() => handlePageChange2(page)}
                                        isActive={page === currentPage}
                                        disabled={isLoading}
                                        className="transition duration-300"
                                    >
                                        {page}
                                    </PaginationLink>
                                </PaginationItem>
                            )
                        } else if (
                            (page === currentPage - 2 && currentPage > 3) ||
                            (page === currentPage + 2 && currentPage < totalPages - 2)
                        ) {
                            return <PaginationEllipsis key={page} />
                        }
                        return null
                    })}
                    <PaginationItem

                    >
                        <PaginationNext
                            disabled={currentPage === totalPages || isLoading}
                            onClick={() => handlePageChange2(currentPage + 1)}
                            className="disabled:opacity-50 cursor-pointer"
                        />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        </>
    )
}