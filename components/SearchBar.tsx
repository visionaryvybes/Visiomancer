'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Search, X, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useDebounce } from 'react-use'
import { useOnClickOutside } from '../hooks/useOnClickOutside'

interface SearchResult {
  id: string
  title: string
  image: string
  price: number
  category: string
}

export default function SearchBar() {
  const [query, setQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  // Handle click outside to close results
  useOnClickOutside(searchRef, () => setIsFocused(false))

  // Debounce search query
  useDebounce(
    () => {
      setDebouncedQuery(query)
    },
    300,
    [query]
  )

  // Fetch search results
  useEffect(() => {
    const fetchResults = async () => {
      if (!debouncedQuery.trim()) {
        setResults([])
        return
      }

      setIsLoading(true)
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(debouncedQuery)}`)
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
  }, [debouncedQuery])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}`)
      setIsFocused(false)
    }
  }

  const searchBarVariants = {
    focus: {
      scale: 1.01,
      borderColor: 'rgba(255, 255, 255, 0.4)',
      transition: { type: 'spring', stiffness: 300, damping: 20 }
    },
    blur: {
      scale: 1,
      borderColor: 'rgba(255, 255, 255, 0.2)',
      transition: { type: 'spring', stiffness: 300, damping: 20 }
    }
  }

  const resultsContainerVariants = {
    hidden: { 
      opacity: 0,
      y: -10,
      transition: { 
        when: "afterChildren"
      }
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.05
      }
    }
  }

  const resultItemVariants = {
    hidden: { 
      opacity: 0,
      x: -20
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 25
      }
    },
    hover: {
      scale: 1.02,
      backgroundColor: "rgba(255, 255, 255, 0.08)",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 25
      }
    }
  }

  const loadingVariants = {
    animate: {
      scale: [1, 1.1, 1],
      opacity: [0.5, 1, 0.5],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  }

  return (
    <div ref={searchRef} className="relative w-full max-w-xl">
      <motion.form
        onSubmit={handleSubmit}
        animate={isFocused ? "focus" : "blur"}
        variants={searchBarVariants}
        className="relative"
      >
        <motion.input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          placeholder="Search products..."
          whileFocus={{ scale: 1.01 }}
          className="w-full h-10 pl-10 pr-4 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-1 focus:ring-white/40 transition-all duration-200"
        />
        <motion.div 
          className="absolute inset-y-0 left-0 flex items-center pl-3"
          animate={isLoading ? "animate" : ""}
          variants={loadingVariants}
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 text-white/60 animate-spin" />
          ) : (
            <Search className="w-4 h-4 text-white/60" />
          )}
        </motion.div>
        <AnimatePresence>
          {query && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              whileHover={{ scale: 1.1 }}
              type="button"
              onClick={() => setQuery('')}
              className="absolute inset-y-0 right-0 flex items-center pr-3"
            >
              <X className="w-4 h-4 text-white/60 hover:text-white transition-colors" />
            </motion.button>
          )}
        </AnimatePresence>
      </motion.form>

      <AnimatePresence>
        {isFocused && (results.length > 0 || isLoading) && (
          <motion.div
            variants={resultsContainerVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="absolute top-full left-0 right-0 mt-2 rounded-lg bg-background/95 backdrop-blur-sm border border-white/20 shadow-xl overflow-hidden z-50"
          >
            {isLoading ? (
              <motion.div 
                className="p-4 text-center text-white/60"
                variants={loadingVariants}
                animate="animate"
              >
                <Loader2 className="w-5 h-5 mx-auto animate-spin" />
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="mt-2"
                >
                  Searching...
                </motion.p>
              </motion.div>
            ) : (
              <div className="max-h-[60vh] overflow-auto">
                {results.map((result) => (
                  <motion.button
                    key={result.id}
                    variants={resultItemVariants}
                    whileHover="hover"
                    onClick={() => {
                      router.push(`/products/${result.id}`)
                      setIsFocused(false)
                    }}
                    className="w-full p-4 flex items-center gap-4 transition-all duration-200"
                  >
                    <motion.div 
                      className="relative w-12 h-12 rounded-md overflow-hidden bg-white/5"
                      whileHover={{ scale: 1.05 }}
                    >
                      <motion.img
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                        src={result.image}
                        alt={result.title}
                        className="object-cover"
                      />
                    </motion.div>
                    <div className="flex-1 text-left">
                      <motion.h4 
                        className="text-white font-medium"
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                      >
                        {result.title}
                      </motion.h4>
                      <motion.p 
                        className="text-sm text-white/60"
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        {result.category}
                      </motion.p>
                    </div>
                    <motion.div 
                      className="text-right"
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <p className="text-white font-medium">
                        ${result.price.toFixed(2)}
                      </p>
                    </motion.div>
                  </motion.button>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
} 