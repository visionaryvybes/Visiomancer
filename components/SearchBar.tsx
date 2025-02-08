'use client'

import React, { useState, useRef, useEffect } from "react"
import { Search, X } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface SearchResult {
  id: string
  title: string
  description: string
  images: { src: string }[]
  variants: { price: number }[]
}

export default function SearchBar() {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  // Close search when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Debounced search function
  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      if (query.length < 2) {
        setResults([])
        return
      }

      setLoading(true)
      try {
        const response = await fetch(`/api/printify/search?q=${encodeURIComponent(query)}`)
        const data = await response.json()
        
        if (data.error) {
          throw new Error(data.error)
        }

        setResults(data.data.slice(0, 5)) // Show only first 5 results
      } catch (error) {
        console.error('Search error:', error)
        setResults([])
      } finally {
        setLoading(false)
      }
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [query])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query) {
      router.push(`/search?q=${encodeURIComponent(query)}`)
      setIsOpen(false)
    }
  }

  return (
    <div ref={searchRef} className="relative">
      <form onSubmit={handleSubmit} className="relative">
        <input
          type="text"
          placeholder="Search products..."
          className="w-full rounded-lg border bg-background px-4 py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-primary"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setIsOpen(true)
          }}
          onFocus={() => setIsOpen(true)}
        />
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery("")
              setResults([])
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </form>

      {/* Search Results Dropdown */}
      {isOpen && (loading || results.length > 0) && (
        <div className="absolute top-full z-50 mt-2 w-full rounded-lg border bg-background p-2 shadow-lg">
          <div className="space-y-2">
            {loading ? (
              <div className="flex items-center justify-center py-4">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              </div>
            ) : (
              <>
                {results.map((result) => (
                  <Link
                    key={result.id}
                    href={`/products/${result.id}`}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-4 rounded-md p-2 hover:bg-accent"
                  >
                    <div className="relative h-12 w-12 overflow-hidden rounded-md">
                      <Image
                        src={result.images[0]?.src || '/placeholder.jpg'}
                        alt={result.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-medium">{result.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        ${result.variants[0]?.price.toFixed(2)}
                      </p>
                    </div>
                  </Link>
                ))}
                <div className="border-t pt-2">
                  <button
                    onClick={handleSubmit}
                    className="w-full rounded-md bg-accent p-2 text-center text-sm hover:bg-accent/80"
                  >
                    View all results
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
} 