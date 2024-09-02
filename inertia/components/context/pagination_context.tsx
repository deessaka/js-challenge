import React, { createContext, useState, useContext, ReactNode } from 'react'

interface PaginationContextType {
  currentPage: number
  setCurrentPage: (page: number) => void
  totalPages: number
  setTotalPages: (total: number) => void
}

const PaginationContext = createContext<PaginationContextType | undefined>(undefined)

export const usePagination = () => {
  const context = useContext(PaginationContext)
  if (!context) {
    throw new Error('usePagination must be used within a PaginationProvider')
  }
  return context
}

interface PaginationProviderProps {
  children: ReactNode
}

export const PaginationProvider: React.FC<PaginationProviderProps> = ({ children }) => {
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  return (
    <PaginationContext.Provider value={{ currentPage, setCurrentPage, totalPages, setTotalPages }}>
      {children}
    </PaginationContext.Provider>
  )
}
