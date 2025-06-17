// Updated Gumroad API interactions based on official API documentation

// --- Gumroad API Types (Based on actual API response structure) ---
interface GumroadProductResponse {
  success: boolean
  products: RawGumroadProduct[]
}

// Define the expected fields from the Gumroad API product object
// Based on official API documentation
export interface RawGumroadProduct {
  id: string
  name: string
  description?: string // Often HTML
  price: number // In cents according to API docs
  short_url?: string // The direct purchase link
  preview_url?: string // Primary image URL
  thumbnail_url?: string // Product thumbnail
  published: boolean
  tags?: string[]
  formatted_price?: string
  currency?: string
  sales_count?: string
  sales_usd_cents?: string
  url?: string // Product file URL
  custom_summary?: string
  custom_permalink?: string
  variants?: Array<{
    title: string
    options: Array<{
      name: string
      price_difference?: number
      purchasing_power_parity_prices?: Record<string, number>
      is_pay_what_you_want?: boolean
      recurrence_prices?: Record<string, {
        price_cents: number
        suggested_price_cents?: number
        purchasing_power_parity_prices?: Record<string, number>
      }>
    }>
  }>
}

interface GumroadSingleProductResponse {
  success: boolean
  product: RawGumroadProduct
}

// --- Gumroad API Client ---

const GUMROAD_API_BASE = 'https://api.gumroad.com/v2'
const ACCESS_TOKEN = process.env.GUMROAD_ACCESS_TOKEN

async function fetchGumroadAPI<T>(endpoint: string): Promise<T> {
  if (!ACCESS_TOKEN) {
    throw new Error('Gumroad Access Token is not configured in environment variables.')
  }

  const url = `${GUMROAD_API_BASE}${endpoint}`
  console.log(`Fetching Gumroad API: ${url}`)

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${ACCESS_TOKEN}`,
      'Content-Type': 'application/json',
    },
    // Add cache settings for better performance
    next: { revalidate: 300 } // Cache for 5 minutes
  })

  if (!response.ok) {
    let errorDetails = 'Unknown error'
    try {
      const errorBody = await response.json()
      errorDetails = errorBody.message || JSON.stringify(errorBody)
    } catch (e) {
      console.error('Error parsing Gumroad error response body:', e);
      errorDetails = `Status: ${response.status} ${response.statusText}`
    }
    throw new Error(`Gumroad API Error (${url}): ${errorDetails}`)
  }

  const data = await response.json()
  if (!data.success) {
     throw new Error(`Gumroad API returned success:false (${url}) - ${data.message || 'No message provided'}`)
  }

  return data as T
}

// Fetches all published products from Gumroad
export async function getGumroadProducts(): Promise<RawGumroadProduct[]> {
  try {
    const data = await fetchGumroadAPI<GumroadProductResponse>('/products')
    // Filter for published products if the API doesn't do it by default
    return data.products.filter(p => p.published)
  } catch (error) {
    console.error('Error fetching Gumroad products:', error)
    throw error
  }
}

// Fetches a single product by its Gumroad ID
export async function getGumroadProductById(id: string): Promise<RawGumroadProduct | null> {
  try {
    const data = await fetchGumroadAPI<GumroadSingleProductResponse>(`/products/${id}`)
    console.log(`[GumroadAPI] Raw data received for product ${id}:`, JSON.stringify(data, null, 2));
    
    if (data && data.product) {
        return data.product;
    } else {
        console.warn(`[GumroadAPI] Product field missing in response for ID ${id}. Response:`, data);
        return null;
    }
  } catch (error: unknown) {
    let errorMessage = 'Unknown error during fetch'
    if (error instanceof Error) {
      errorMessage = error.message
    }
    
    // Specifically check if the error indicates a 404 Not Found scenario
    if (errorMessage.includes('Status: 404')) {
      console.log(`Gumroad product ${id} not found (404).`);
      return null; // Treat 404 as null, not a throw
    } 
    // Re-throw other errors (like auth, network, actual 500s)
    console.error(`Error fetching Gumroad product ${id} (re-throwing):`, error)
    throw error;
  }
}

// Helper function to get the direct purchase URL for a product
export function getGumroadPurchaseUrl(product: RawGumroadProduct): string {
  const baseUrl = product.short_url || `https://gumroad.com/l/${product.custom_permalink || product.id}`
  // Add ?wanted=true to go directly to checkout instead of product page
  return `${baseUrl}?wanted=true`
}

// Helper function to format price from cents to dollars
export function formatGumroadPrice(priceInCents: number): number {
  return priceInCents / 100
} 