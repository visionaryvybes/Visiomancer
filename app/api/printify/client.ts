export interface PrintifyProduct {
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
  options?: Array<{
    name: string
    values: string[]
  }>
  tags?: string[]
}

export interface PrintifyResponse {
  data: PrintifyProduct[]
}

export class PrintifyClient {
  private readonly apiToken: string
  public readonly shopId: string = '18831932'
  private readonly baseUrl = 'https://api.printify.com/v1'

  constructor(apiToken?: string) {
    console.log('Initializing PrintifyClient...')
    const token = apiToken || process.env.PRINTIFY_API_TOKEN
    
    if (!token) {
      console.error('No API token provided and PRINTIFY_API_TOKEN environment variable is not set')
      throw new Error('Printify API token is required')
    }
    
    // Log token presence and length (safely)
    console.log('Environment variables available:', Object.keys(process.env))
    console.log('API Token present:', !!token)
    console.log('API Token length:', token.length)
    console.log('API Token first 4 chars:', token.substring(0, 4))
    
    this.apiToken = token.trim()
  }

  async getProducts() {
    console.log('Attempting to fetch products from Printify...')
    console.log('Using shop ID:', this.shopId)
    const url = `${this.baseUrl}/shops/${this.shopId}/products.json`
    console.log('Fetching from URL:', url)
    
    try {
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${this.apiToken}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        const errorText = await response.text()
        const errorDetails = {
          status: response.status,
          statusText: response.statusText,
          error: errorText,
          url: url,
          headers: Object.fromEntries(response.headers.entries()),
          hasToken: !!this.apiToken,
          tokenLength: this.apiToken.length
        }
        console.error('Printify API error:', errorDetails)
        throw new Error(`Printify API error: ${response.status} ${response.statusText} - ${errorText}`)
      }

      const data = await response.json()
      console.log('Raw Printify API response structure:', Object.keys(data))
      console.log('Raw Printify API response data count:', data.data?.length)
      
      return data
    } catch (error) {
      console.error('Error fetching products from Printify:', error)
      throw error
    }
  }

  async getProduct(id: string) {
    try {
      console.log('Fetching single product from Printify...')
      const response = await fetch(
        `${this.baseUrl}/shops/${this.shopId}/products/${id}.json`,
        {
          headers: {
            'Authorization': `Bearer ${this.apiToken}`,
            'Content-Type': 'application/json'
          },
          cache: 'no-store'
        }
      )

      if (!response.ok) {
        const errorText = await response.text()
        console.error('Printify API error:', {
          status: response.status,
          statusText: response.statusText,
          error: errorText
        })
        if (response.status === 404) {
          return null
        }
        throw new Error(`Failed to fetch product: ${response.statusText}`)
      }

      const rawData = await response.json()
      console.log('Raw product data:', rawData)

      // Process images to ensure they use HTTPS and the correct domain
      const processedImages = rawData.images.map((image: any) => {
        let src = image.src || image;
        if (typeof src === 'string') {
          // Ensure HTTPS
          src = src.replace(/^http:/, 'https:');
          // Update domain if needed
          src = src.replace('cdn.printify.com', 'images-api.printify.com');
          // Remove any preview parameters
          src = src.replace(/[?&]preview=\d+/, '');
          // Add timestamp to prevent caching issues
          src = `${src}${src.includes('?') ? '&' : '?'}t=${Date.now()}`;
          return { src };
        }
        return image;
      });

      // Sort images to prioritize front/main images
      processedImages.sort((a: any, b: any) => {
        const aIsFront = a.src.includes('front') || a.src.includes('main');
        const bIsFront = b.src.includes('front') || b.src.includes('main');
        
        if (aIsFront && !bIsFront) return -1;
        if (!aIsFront && bIsFront) return 1;
        return 0;
      });

      // Transform the single product data
      const transformedProduct = {
        id: String(rawData.id),
        title: rawData.title || 'Untitled Product',
        description: rawData.description || '',
        images: processedImages,
        variants: Array.isArray(rawData.variants) ? rawData.variants
          .filter((variant: any) => variant && variant.is_enabled) // Only include enabled variants
          .map((variant: any) => ({
            id: String(variant.id || 'unknown'),
            title: variant.title || '',
            price: variant && variant.price ? variant.price / 100 : 19.99, // Convert cents to dollars
            is_enabled: true, // We've already filtered for enabled variants
            options: variant.options || {}
          })) : [
            {
              id: 'default-variant',
              title: 'Default',
              price: 19.99,
              is_enabled: true,
              options: {}
            }
          ],
        options: rawData.options || []
      }

      console.log('Transformed product:', transformedProduct)
      return transformedProduct
    } catch (error) {
      console.error('Error in PrintifyClient.getProduct:', error)
      throw error
    }
  }
} 