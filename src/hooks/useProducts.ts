import useSWR, { SWRConfiguration } from 'swr'
import { Product } from '@/types'

// Define a custom error type
class FetchError extends Error {
  info?: unknown
  status?: number
}

// Define a fetcher function
const fetcher = async (url: string) => {
  const res = await fetch(url)
  if (!res.ok) {
    const error = new FetchError('An error occurred while fetching the data.')
    // Attach extra info to the error object.
    try {
      error.info = await res.json()
    } catch {
      // Ignore if response is not JSON
    }
    error.status = res.status
    throw error
  }
  return res.json()
}

// Define the expected shape of the API response
interface UseProductsData {
  products: Product[]
  // Add other potential fields like totalCount, etc., if your API returns them
}

interface UseProductsResult {
  products: Product[] | undefined
  isLoading: boolean
  error: FetchError | undefined // Use specific error type
}

export default function useProducts(config?: SWRConfiguration): UseProductsResult {
  const { data, error, isLoading } = useSWR<UseProductsData, FetchError>(
    '/api/products',
    fetcher,
    config // Pass optional SWR configuration
  )

  return {
    products: data?.products,
    isLoading,
    error,
  }
} 