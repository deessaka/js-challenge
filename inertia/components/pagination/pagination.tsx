import React from 'react'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from '#components/ui/components/ui/pagination'
import { usePagination } from '#components/context/pagination_context'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface PaginationComponentProps {
  onPageChange: (page: number) => void
  isPageAccessible: (page: number) => boolean
}

function PaginationComponent({ onPageChange, isPageAccessible }: PaginationComponentProps) {
  const { currentPage, totalPages } = usePagination()

  const handlePageChange = (page: number) => {
    if (page !== currentPage && isPageAccessible(page)) {
      onPageChange(page)
    }
  }

  const renderPaginationItems = () => {
    const items = []
    const maxVisiblePages = 7
    const showEllipsisStart = currentPage > 3
    const showEllipsisEnd = currentPage < totalPages - 2

    if (totalPages <= maxVisiblePages) {
      // Afficher toutes les pages si leur nombre est inférieur à maxVisiblePages
      for (let i = 1; i <= totalPages; i++) {
        const pageAccessible = isPageAccessible(i)
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              href="#"
              onClick={(e) => {
                e.preventDefault()
                handlePageChange(i)
              }}
              isActive={i === currentPage}
              className={`w-9 h-9 ${
                i === currentPage 
                  ? 'bg-primary text-primary-foreground hover:bg-primary/90' 
                  : !pageAccessible 
                    ? 'opacity-50 cursor-not-allowed'
                    : ''
              }`}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        )
      }
    } else {
      // Toujours afficher la première page
      items.push(
        <PaginationItem key={1}>
          <PaginationLink
            href="#"
            onClick={(e) => {
              e.preventDefault()
              handlePageChange(1)
            }}
            isActive={1 === currentPage}
            className={`w-9 h-9 ${1 === currentPage ? 'bg-primary text-primary-foreground hover:bg-primary/90' : ''}`}
          >
            1
          </PaginationLink>
        </PaginationItem>
      )

      // Ellipsis de début si nécessaire
      if (showEllipsisStart) {
        items.push(
          <PaginationItem key="ellipsis-start">
            <PaginationEllipsis />
          </PaginationItem>
        )
      }

      // Pages autour de la page courante
      const startPage = Math.max(2, currentPage - 1)
      const endPage = Math.min(totalPages - 1, currentPage + 1)

      for (let i = startPage; i <= endPage; i++) {
        const pageAccessible = isPageAccessible(i)
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              href="#"
              onClick={(e) => {
                e.preventDefault()
                handlePageChange(i)
              }}
              isActive={i === currentPage}
              className={`w-9 h-9 ${
                i === currentPage 
                  ? 'bg-primary text-primary-foreground hover:bg-primary/90' 
                  : !pageAccessible 
                    ? 'opacity-50 cursor-not-allowed'
                    : ''
              }`}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        )
      }

      // Ellipsis de fin si nécessaire
      if (showEllipsisEnd) {
        items.push(
          <PaginationItem key="ellipsis-end">
            <PaginationEllipsis />
          </PaginationItem>
        )
      }

      // Toujours afficher la dernière page
      const lastPageAccessible = isPageAccessible(totalPages)
      items.push(
        <PaginationItem key={totalPages}>
          <PaginationLink
            href="#"
            onClick={(e) => {
              e.preventDefault()
              handlePageChange(totalPages)
            }}
            isActive={totalPages === currentPage}
            className={`w-9 h-9 ${
              totalPages === currentPage 
                ? 'bg-primary text-primary-foreground hover:bg-primary/90' 
                : !lastPageAccessible 
                  ? 'opacity-50 cursor-not-allowed'
                  : ''
            }`}
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      )
    }

    return items
  }

  const nextPageAccessible = isPageAccessible(currentPage + 1)
  const previousPageAccessible = isPageAccessible(currentPage - 1)

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={(e) => {
              e.preventDefault()
              if (currentPage > 1 && previousPageAccessible) handlePageChange(currentPage - 1)
            }}
            className={`${!previousPageAccessible || currentPage === 1 ? 'pointer-events-none opacity-50' : ''}`}
          >
            <ChevronLeft className="h-4 w-4" />
          </PaginationPrevious>
        </PaginationItem>

        {renderPaginationItems()}

        <PaginationItem>
          <PaginationNext
            href="#"
            onClick={(e) => {
              e.preventDefault()
              if (currentPage < totalPages && nextPageAccessible) handlePageChange(currentPage + 1)
            }}
            className={`${!nextPageAccessible || currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}`}
          >
            <ChevronRight className="h-4 w-4" />
          </PaginationNext>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}

export default PaginationComponent
