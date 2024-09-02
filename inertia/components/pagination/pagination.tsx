import React from 'react'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '#components/ui/components/ui/pagination'
import { usePagination } from '#components/context/pagination_context'

interface PaginationComponentProps {
  onPageChange: (page: number) => void
}

function PaginationComponent({ onPageChange }: PaginationComponentProps) {
  const { currentPage, totalPages } = usePagination()

  const handlePageChange = (page: number) => {
    onPageChange(page)
  }

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1)
    }
  }

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1)
    }
  }

  const renderPageNumbers = () => {
    const pageNumbers = []
    const maxVisiblePages = 5

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2))
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1)
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <PaginationItem key={i}>
          <PaginationLink href="#" onClick={() => handlePageChange(i)} isActive={i === currentPage}>
            {i}
          </PaginationLink>
        </PaginationItem>
      )
    }

    return pageNumbers
  }

  return (
    <Pagination className="flex justify-center">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={handlePreviousPage}
            className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
          />
        </PaginationItem>
        {renderPageNumbers()}
        <PaginationItem>
          <PaginationNext
            href="#"
            onClick={handleNextPage}
            className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}

export default PaginationComponent
