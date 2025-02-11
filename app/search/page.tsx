'use client'

import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { useSearch } from '../../hooks/useSearch'
import ProductGrid from '../../components/ProductGrid'
import { motion, AnimatePresence } from 'framer-motion'
import { Filter, SortAsc, SortDesc, Loader2 } from 'lucide-react'
import { Product } from '../../types/product'

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30,
      when: "beforeChildren",
      staggerChildren: 0.1
    }
  },
  exit: { 
    opacity: 0,
    y: 20,
    transition: {
      when: "afterChildren"
    }
  }
}

const itemVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30
    }
  },
  exit: { opacity: 0, y: 20 }
}

const filterPanelVariants = {
  closed: { 
    height: 0,
    opacity: 0,
    transition: {
      height: { duration: 0.3, ease: "easeInOut" },
      opacity: { duration: 0.2 }
    }
  },
  open: { 
    height: "auto",
    opacity: 1,
    transition: {
      height: { duration: 0.3, ease: "easeInOut" },
      opacity: { duration: 0.3 },
      when: "beforeChildren",
      staggerChildren: 0.05
    }
  }
}

const filterItemVariants = {
  closed: { opacity: 0, x: -20 },
  open: { 
    opacity: 1, 
    x: 0,
    transition: { type: "spring", stiffness: 300, damping: 30 }
  }
}

export default function SearchPage() {
  const searchParams = useSearchParams()
  const query = searchParams.get('q') || ''

  const {
    search,
    setSearch,
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
  } = useSearch({
    defaultSort: 'newest',
    initialQuery: query,
  })

  React.useEffect(() => {
    const fetchResults = async () => {
      if (!search.trim()) {
        setResults([])
        return
      }

      setIsLoading(true)
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(search)}`)
        const data = await response.json()
        
        // Transform search results to match Product type
        const transformedResults = data.map((result: any) => ({
          id: result.id,
          title: result.title,
          description: result.description || '',
          images: result.images.map((img: any) => ({ src: img.src })),
          variants: result.variants.map((variant: any) => ({
            id: variant.id,
            title: variant.title || '',
            price: variant.price,
            is_enabled: true,
            options: variant.options || {}
          })),
          options: result.options || [],
          category: result.category || 'All'
        }))

        setResults(transformedResults)
      } catch (error) {
        console.error('Search error:', error)
        setResults([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchResults()
  }, [search, setResults, setIsLoading])

  return (
    <motion.div
      className="min-h-screen container mx-auto px-4 py-8"
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
    >
      <div className="space-y-8">
        {/* Search Header */}
        <motion.div 
          variants={itemVariants}
          className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
        >
          <motion.h1 
            className="text-2xl font-bold"
            variants={itemVariants}
          >
            {query ? (
              <>
                Search results for{' '}
                <motion.span
                  className="text-primary"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  "{query}"
                </motion.span>
              </>
            ) : (
              'All Products'
            )}
          </motion.h1>

          <motion.div 
            variants={itemVariants}
            className="flex items-center gap-4"
          >
            {/* Sort Options */}
            <motion.div 
              className="relative"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="h-10 rounded-lg bg-white/10 border border-white/20 text-white px-4 pr-8 appearance-none focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-200"
              >
                <option value="newest">Newest</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="name-asc">Name: A to Z</option>
                <option value="name-desc">Name: Z to A</option>
              </select>
              <motion.div 
                className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
                animate={{ rotate: sort.includes('asc') ? 0 : 180 }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                {sort.includes('asc') ? (
                  <SortAsc className="w-4 h-4 text-white/60" />
                ) : (
                  <SortDesc className="w-4 h-4 text-white/60" />
                )}
              </motion.div>
            </motion.div>

            {/* Filter Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setFilter('showFilters', !filters.showFilters)}
              className="flex items-center gap-2 h-10 px-4 rounded-lg bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-all duration-200"
            >
              <Filter className="w-4 h-4" />
              Filters
            </motion.button>

            {/* Clear Filters */}
            <AnimatePresence>
              {isFiltered && (
                <motion.button
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={clearFilters}
                  className="text-sm text-white/60 hover:text-white transition-colors"
                >
                  Clear all
                </motion.button>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>

        {/* Filter Panel */}
        <AnimatePresence>
          {filters.showFilters && (
            <motion.div
              variants={filterPanelVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className="overflow-hidden"
            >
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-6 rounded-lg bg-white/5 border border-white/10">
                {/* Price Range */}
                <motion.div 
                  variants={filterItemVariants}
                  className="space-y-2"
                >
                  <label className="text-sm font-medium">Price Range</label>
                  <div className="flex gap-2">
                    <motion.input
                      whileFocus={{ scale: 1.02 }}
                      type="number"
                      placeholder="Min"
                      className="w-full h-10 px-3 rounded-lg bg-white/10 border border-white/20 text-white transition-all duration-200"
                      value={filters.minPrice || ''}
                      onChange={(e) => setFilter('minPrice', e.target.value)}
                    />
                    <motion.input
                      whileFocus={{ scale: 1.02 }}
                      type="number"
                      placeholder="Max"
                      className="w-full h-10 px-3 rounded-lg bg-white/10 border border-white/20 text-white transition-all duration-200"
                      value={filters.maxPrice || ''}
                      onChange={(e) => setFilter('maxPrice', e.target.value)}
                    />
                  </div>
                </motion.div>

                {/* Categories */}
                <motion.div 
                  variants={filterItemVariants}
                  className="space-y-2"
                >
                  <label className="text-sm font-medium">Categories</label>
                  <motion.select
                    whileFocus={{ scale: 1.02 }}
                    className="w-full h-10 px-3 rounded-lg bg-white/10 border border-white/20 text-white transition-all duration-200"
                    value={filters.category || ''}
                    onChange={(e) => setFilter('category', e.target.value)}
                  >
                    <option value="">All Categories</option>
                    <option value="shirts">Shirts</option>
                    <option value="hoodies">Hoodies</option>
                    <option value="accessories">Accessories</option>
                  </motion.select>
                </motion.div>

                {/* Availability */}
                <motion.div 
                  variants={filterItemVariants}
                  className="space-y-2"
                >
                  <label className="text-sm font-medium">Availability</label>
                  <motion.select
                    whileFocus={{ scale: 1.02 }}
                    className="w-full h-10 px-3 rounded-lg bg-white/10 border border-white/20 text-white transition-all duration-200"
                    value={filters.availability || ''}
                    onChange={(e) => setFilter('availability', e.target.value)}
                  >
                    <option value="">All</option>
                    <option value="in-stock">In Stock</option>
                    <option value="out-of-stock">Out of Stock</option>
                  </motion.select>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results */}
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-center py-12"
            >
              <motion.div
                animate={{ 
                  rotate: 360,
                  scale: [1, 1.1, 1],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{
                  rotate: { duration: 1.5, repeat: Infinity, ease: "linear" },
                  scale: { duration: 1.5, repeat: Infinity },
                  opacity: { duration: 1.5, repeat: Infinity }
                }}
              >
                <Loader2 className="w-8 h-8 text-primary" />
              </motion.div>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="ml-3 text-white/60"
              >
                Loading results...
              </motion.p>
            </motion.div>
          ) : results.length > 0 ? (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <ProductGrid products={results} />
            </motion.div>
          ) : (
            <motion.div
              key="no-results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="text-center py-12"
            >
              <motion.p 
                className="text-lg text-white/60"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                No products found
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
} 