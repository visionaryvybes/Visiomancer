"use client"

import React, { createContext, useContext, ReactNode } from 'react'
import useSWR from 'swr'
import { Product } from '@/types'
import { GetAllProductsResult } from '@/lib/api/products' // Import the result type

// Define structure for fetch errors from the API
interface FetchErrors {
  gumroad?: string;
}

interface ProductsContextType {
  products: Product[] | undefined // All successfully fetched products
  isLoading: boolean
  fetchErrors: FetchErrors | null // Errors reported by the API for specific sources
  fetcherError: Error | null // General SWR/network error
  getProductById: (id: string) => Product | undefined // Helper to find product
}

const ProductsContext = createContext<ProductsContextType | undefined>(undefined)

// Updated fetcher function for SWR
const fetcher = async (url: string): Promise<GetAllProductsResult> => {
  const res = await fetch(url);

  if (!res.ok) {
    let errorPayload: any = { message: `HTTP error! Status: ${res.status}` }
    try {
        // Try to parse error details from the API response body
        errorPayload = await res.json(); 
    } catch (parseError) {
        console.error("Could not parse error response body:", parseError);
    }
    // Throw an error object that includes potential API-reported errors
    const error = new Error(errorPayload.message || `API request failed with status ${res.status}`);
    (error as any).apiErrors = errorPayload.errors; // Attach API errors if they exist
    throw error;
  }

  // Expecting GetAllProductsResult structure on success
  const data: GetAllProductsResult = await res.json();
  return data;
};

export const ProductsProvider = ({ children }: { children: ReactNode }) => {
  // Use the updated fetcher, data will be of type GetAllProductsResult | undefined
  const { data, error: swrError, isLoading } = useSWR<GetAllProductsResult>('/api/products', fetcher)

  // Helper function to find a product in the fetched list by its unified ID
  const getProductById = (id: string): Product | undefined => {
    return data?.products?.find(p => p.id === id)
  }

  // Extract fetch errors reported by the API from the data or SWR error
  let fetchErrors: FetchErrors | null = null;
  if (data?.errors && data.errors.gumroad) {
      fetchErrors = data.errors;
  } else if (swrError && (swrError as any).apiErrors) {
      // If SWR errored but contained API errors (e.g., 500 with details)
      fetchErrors = (swrError as any).apiErrors;
  }

  const value: ProductsContextType = {
    products: data?.products, // Products array from the API response
    isLoading,
    fetchErrors: fetchErrors, // API-reported errors for specific sources
    fetcherError: swrError || null, // General SWR/fetcher error
    getProductById,
  }

  return (
    <ProductsContext.Provider value={value}>
      {children}
    </ProductsContext.Provider>
  )
}

export const useProducts = () => {
  const context = useContext(ProductsContext)
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductsProvider')
  }
  return context
} 