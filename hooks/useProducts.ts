'use client'

import { useState, useEffect } from "react"
import { PrintifyProduct } from "@/app/api/printify/client"

export function useProducts() {
  const [products, setProducts] = useState<PrintifyProduct[] | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch('/api/printify/products')
        if (!response.ok) {
          throw new Error('Failed to fetch products')
        }
        const data = await response.json()
        console.log('API Response:', data) // Debug log
        
        // Handle different possible response formats
        const productsArray = Array.isArray(data) ? data : 
                            data.products ? data.products :
                            data.data ? data.data : null

        if (!productsArray) {
          throw new Error('Invalid products data format')
        }

        setProducts(productsArray)
      } catch (err) {
        console.error('Failed to fetch products:', err)
        setError(err instanceof Error ? err : new Error('Unknown error'))
        setProducts([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchProducts()
  }, [])

  return { products, isLoading, error }
} 