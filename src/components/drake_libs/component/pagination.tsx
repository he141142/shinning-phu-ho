import { useRouter } from "next/router"
import { PaginationContent, PaginationPrevious, Pagination, PaginationItem, PaginationLink, PaginationNext, PaginationEllipsis } from "../ui/pagination"
import { useState } from "react"

export function PaginationNav({ initialPage, totalPages }: { initialPage: number, totalPages: number }) {

    const [students, setStudents] = useState(0)
    const [currentPage, setCurrentPage] = useState(1)
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    const handlePageChange = async (page: number) => {
        setIsLoading(true)
        router.push(`/students?page=${page}`)
        // In a real application, you would fetch new data here
        // For this example, we'll just simulate a delay
        await new Promise((resolve) => setTimeout(resolve, 1000))
        setCurrentPage(page)
        setIsLoading(false)
    }

    return (
        <>
            <Pagination className="mt-8">
                <PaginationContent>
                    <PaginationItem>
                        <PaginationPrevious
                            href="#"
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1 || isLoading}
                        />
                    </PaginationItem>
                    {[...Array(totalPages)].map((_, index) => {
                        const page = index + 1
                        if (page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)) {
                            return (
                                <PaginationItem key={page}>
                                    <PaginationLink
                                        href="#"
                                        onClick={() => handlePageChange(page)}
                                        isActive={page === currentPage}
                                        disabled={isLoading}
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
                    <PaginationItem>
                        <PaginationNext
                            href="#"
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages || isLoading}
                        />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        </>
    )
}