interface PrintifyResponse<T> {
  data: T[]
  total: number
  shop_id: string
}

interface PrintifyProduct {
  id: string
  title: string
  description: string
  images: { src: string }[]
  variants: Array<{
    id: string
    title: string
    price: number
    is_enabled: boolean
    options: Record<string, string>
  }>
  options: Array<{
    name: string
    values: string[]
  }>
  tags: string[]
}

export class PrintifyClient {
  private readonly token: string
  private readonly baseUrl: string
  private readonly shopId: string
  private readonly isServer: boolean

  constructor(token?: string) {
    this.token = token || process.env.PRINTIFY_API_TOKEN || ''
    if (!this.token) {
      throw new Error('Printify API token is required')
    }
    this.baseUrl = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000'
    this.shopId = process.env.NEXT_PUBLIC_PRINTIFY_SHOP_ID || '204284'
    this.isServer = typeof window === 'undefined'
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const startTime = Date.now()
    console.log(`[Printify] Making request to: ${endpoint}`)

    try {
      let url: string
      let headers: HeadersInit = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      }

      // Always use direct API calls for server-side
      if (this.isServer) {
        url = `https://api.printify.com/v1${endpoint}`
        headers = {
          ...headers,
          'Authorization': `Bearer ${this.token}`,
          'User-Agent': 'Visiomancer/1.0'
        }
      } else {
        // If running on client side, proxy through Next.js API routes
        url = `${this.baseUrl}/api/printify${endpoint}`
      }

      console.log(`[Printify] Full URL:`, url)
      console.log(`[Printify] Headers:`, headers)
      
      const response = await fetch(url, {
        ...options,
        headers,
      })

      const duration = Date.now() - startTime
      console.log(`[Printify] Request completed in ${duration}ms`)

      if (!response.ok) {
        const errorData = await response.text()
        console.error(`[Printify] Error response (${response.status}):`, errorData)
        throw new Error(`Printify API error: ${response.status} ${response.statusText} - ${errorData}`)
      }

      const data = await response.json()
      return data as T
    } catch (error) {
      console.error('[Printify] Request failed:', error)
      throw error
    }
  }

  async getShops() {
    console.log('[Printify] Fetching shops')
    return this.request<Array<{
      id: string
      title: string
      sales_channel: string
    }>>('/shops')
  }

  async getProducts(limit = 25) {
    console.log(`[Printify] Fetching products for shop ${this.shopId}`)
    try {
      // First verify the shop exists
      const shops = await this.getShops()
      console.log('[Printify] Available shops:', shops)
      
      if (!shops.some(shop => shop.id === this.shopId)) {
        throw new Error(`Shop ${this.shopId} not found in available shops`)
      }

      const response = await this.request<{
        current_page: number
        data: Array<{
          id: string
          title: string
          description: string
          images: Array<{ src: string }>
          variants: Array<{
            id: string
            title: string
            price: number
            is_enabled: boolean
            options: Record<string, string>
          }>
          options: Array<{
            name: string
            values: string[]
          }>
        }>
        last_page: number
        total: number
      }>(`/shops/${this.shopId}/products`)

      return {
        data: response.data.map(product => ({
          ...product,
          options: product.options || [],
          variants: product.variants.map(variant => ({
            ...variant,
            price: variant.price / 100, // Convert cents to dollars
            options: variant.options || {},
            is_enabled: variant.is_enabled || true
          }))
        })),
        total: response.total,
        current_page: response.current_page,
        last_page: response.last_page
      }
    } catch (error) {
      console.error('[Printify] Failed to fetch products:', error)
      throw error
    }
  }

  async getProduct(productId: string) {
    console.log(`[Printify] Fetching product ${productId}`)
    try {
      const url = `${this.baseUrl}/api/printify/shops/${this.shopId}/products/${productId}`
      
      console.log(`[Printify] Making request to: ${url}`)
      
      const response = await fetch(url, { 
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        next: { revalidate: 60 } // Cache for 60 seconds
      })

      if (!response.ok) {
        const errorData = await response.text()
        console.error(`[Printify] Error response (${response.status}):`, errorData)
        
        if (response.status === 404) {
          throw new Error(`Product not found: ${productId}`)
        }
        
        throw new Error(`Failed to fetch product: ${response.statusText}`)
      }

      const data = await response.json()
      
      if (data.error) {
        throw new Error(data.error)
      }

      // Transform the data
      return {
        ...data,
        images: data.images.map((img: any) => ({
          src: img.src.replace(/^http:/, 'https:')
            .replace('cdn.printify.com', 'images-api.printify.com')
            .replace(/[?&]preview=\d+/, '')
        })),
        variants: data.variants.map((variant: any) => ({
          ...variant,
          price: variant.price,
          is_enabled: variant.is_enabled || true,
          options: variant.options || {}
        })),
        options: data.options || []
      }
    } catch (error) {
      console.error(`[Printify] Failed to fetch product ${productId}:`, error)
      throw error
    }
  }

  async getShipping(shopId: string, address: {
    country: string
    region?: string
    address1?: string
    address2?: string
    city?: string
    zip?: string
  }) {
    console.log(`[Printify] Fetching shipping rates for shop ${shopId}`)
    return this.request<{
      shipping_methods: Array<{
        id: string
        title: string
        price: number
        currency: string
        delivery_time: {
          min: number
          max: number
          unit: string
        }
      }>
    }>(`/shops/${shopId}/shipping`, {
      method: 'POST',
      body: JSON.stringify({ address }),
    })
  }
} 