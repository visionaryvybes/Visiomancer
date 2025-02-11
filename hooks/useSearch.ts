import { useState, useCallback, useMemo, useEffect } from 'react'
import { useDebounce } from 'react-use'
import { useRouter, useSearchParams } from 'next/navigation'
import { Product } from '../types/product'

interface UseSearchOptions {
  defaultSort?: string
  defaultFilters?: Record<string, any>
  debounceMs?: number
  initialQuery?: string
}

interface UseSearchReturn {
  search: string
  setSearch: (value: string) => void
  debouncedSearch: string
  sort: string
  setSort: (value: string) => void
  filters: Record<string, any>
  setFilter: (key: string, value: any) => void
  removeFilter: (key: string) => void
  clearFilters: () => void
  isFiltered: boolean
  isLoading: boolean
  setIsLoading: (value: boolean) => void
  results: Product[]
  setResults: (products: Product[]) => void
  searchParams: URLSearchParams
  createQueryString: (params: Record<string, string>) => string
}

export function useSearch({
  defaultSort = 'newest',
  defaultFilters = {},
  debounceMs = 300,
  initialQuery = '',
}: UseSearchOptions = {}): UseSearchReturn {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [search, setSearch] = useState(initialQuery)
  const [debouncedSearch, setDebouncedSearch] = useState(initialQuery)
  const [sort, setSort] = useState(searchParams.get('sort') || defaultSort)
  const [filters, setFilters] = useState({ ...defaultFilters })
  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults] = useState<Product[]>([])

  // Debounce search
  useDebounce(
    () => {
      setDebouncedSearch(search)
    },
    debounceMs,
    [search]
  )

  // Fetch results when search changes
  useEffect(() => {
    const fetchResults = async () => {
      if (!debouncedSearch.trim()) {
        setResults([])
        return
      }

      setIsLoading(true)
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(debouncedSearch)}`)
        const data = await response.json()
        setResults(data)
      } catch (error) {
        console.error('Search error:', error)
        setResults([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchResults()
  }, [debouncedSearch])

  const setFilter = useCallback((key: string, value: any) => {
    setFilters(current => ({ ...current, [key]: value }))
  }, [])

  const removeFilter = useCallback((key: string) => {
    setFilters(current => {
      const { [key]: _, ...rest } = current
      return rest
    })
  }, [])

  const clearFilters = useCallback(() => {
    setFilters(defaultFilters)
  }, [defaultFilters])

  const isFiltered = useMemo(() => {
    return Object.keys(filters).length > 0 || search !== ''
  }, [filters, search])

  const createQueryString = useCallback((params: Record<string, string>) => {
    const newSearchParams = new URLSearchParams(searchParams.toString())
    
    Object.entries(params).forEach(([key, value]) => {
      if (value === null) {
        newSearchParams.delete(key)
      } else {
        newSearchParams.set(key, value)
      }
    })

    return newSearchParams.toString()
  }, [searchParams])

  return {
    search,
    setSearch,
    debouncedSearch,
    sort,
    setSort,
    filters,
    setFilter,
    removeFilter,
    clearFilters,
    isFiltered,
    isLoading,
    setIsLoading,
    results,
    setResults,
    searchParams,
    createQueryString,
  }
} 