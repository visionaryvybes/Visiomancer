'use client'

import React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange
}: PaginationProps) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)

  // Show at most 5 page numbers, centered around current page
  const visiblePages = pages.filter(page => {
    if (totalPages <= 5) return true
    if (page === 1 || page === totalPages) return true
    if (Math.abs(page - currentPage) <= 1) return true
    return false
  })

  // Add ellipsis where needed
  const pagesWithEllipsis = visiblePages.reduce((acc: (number | string)[], page, i) => {
    if (i === 0) return [page]
    if (visiblePages[i - 1] !== page - 1) {
      return [...acc, '...', page]
    }
    return [...acc, page]
  }, [])

  return (
    <nav className="flex items-center justify-center space-x-2">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="rounded-lg border bg-background p-2 text-muted-foreground transition-colors hover:bg-accent disabled:opacity-50"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      {pagesWithEllipsis.map((page, i) => (
        <React.Fragment key={i}>
          {typeof page === 'number' ? (
            <button
              onClick={() => onPageChange(page)}
              className={`min-w-[2.5rem] rounded-lg border bg-background px-4 py-2 text-sm transition-colors hover:bg-accent ${
                currentPage === page
                  ? 'border-primary bg-primary text-primary-foreground hover:bg-primary/90'
                  : ''
              }`}
            >
              {page}
            </button>
          ) : (
            <span className="px-2 text-muted-foreground">{page}</span>
          )}
        </React.Fragment>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="rounded-lg border bg-background p-2 text-muted-foreground transition-colors hover:bg-accent disabled:opacity-50"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </nav>
  )
} 