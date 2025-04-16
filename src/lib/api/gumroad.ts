// Placeholder for Gumroad API interactions
// TODO: Implement functions to fetch products, handle auth, etc.

// --- Gumroad API Types (Basic Structure - adjust based on actual API response) ---
interface GumroadProductResponse {
  success: boolean
  products: RawGumroadProduct[]
  // May include pagination fields
}

// Define the expected fields from the Gumroad API product object
// Refer to Gumroad API documentation for the exact structure
export interface RawGumroadProduct {
  id: string
  name: string
  description?: string // Often HTML
  price: number // Typically in cents
  short_url?: string // The direct purchase link
  preview_url?: string // Primary image URL
  published: boolean
  // Add other relevant fields like variants (if applicable/available), custom fields etc.
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
    headers: {
      Authorization: `Bearer ${ACCESS_TOKEN}`,
      'Content-Type': 'application/json',
    },
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
  const data = await fetchGumroadAPI<GumroadProductResponse>('/products')
  // Filter for published products if the API doesn't do it by default
  return data.products.filter(p => p.published)
}

// Fetches a single product by its Gumroad ID
export async function getGumroadProductById(id: string): Promise<RawGumroadProduct | null> {
  // Remove outer try...catch; let fetchGumroadAPI errors propagate
  // Inner try...catch in fetchGumroadAPI handles API errors / non-success
  // Still need to handle the case where the product isn't found (which might not be an error)
  try {
    const data = await fetchGumroadAPI<GumroadSingleProductResponse>(`/products/${id}`)
    console.log(`[GumroadAPI] Raw data received for product ${id}:`, JSON.stringify(data)); // Log raw data
    // Ensure product exists in the response before returning
    if (data && data.product) {
        return data.product;
    } else {
        console.warn(`[GumroadAPI] Product field missing in response for ID ${id}. Response:`, data);
        return null; // Return null if product field is missing
    }
  } catch (error: unknown) { // Use unknown instead of any
    // Check if it's an error and has a message
    let errorMessage = 'Unknown error during fetch'
    if (error instanceof Error) {
      errorMessage = error.message
    }
    
    // Specifically check if the error indicates a 404 Not Found scenario
    if (errorMessage.includes('Status: 404')) { // Example check
      console.log(`Gumroad product ${id} not found (404).`);
      return null; // Treat 404 as null, not a throw
    } 
    // Re-throw other errors (like auth, network, actual 500s)
    console.error(`Error fetching Gumroad product ${id} (re-throwing):`, error)
    throw error; // Re-throw the original error object
  }
} 