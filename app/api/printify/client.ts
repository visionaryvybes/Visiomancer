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
}

export interface PrintifyResponse {
  data: PrintifyProduct[]
}

export class PrintifyClient {
  private readonly apiToken: string
  public readonly shopId: string = '18831932'
  private readonly baseUrl = 'https://api.printify.com/v1'

  constructor(apiToken?: string) {
    const token = apiToken || process.env.PRINTIFY_API_TOKEN
    if (!token) {
      console.error('No API token provided and PRINTIFY_API_TOKEN environment variable is not set')
      throw new Error('Printify API token is required')
    }
    this.apiToken = token.trim()
  }

  async getProducts() {
    try {
      console.log('Attempting to fetch products from Printify...')
      console.log('Using shop ID:', this.shopId)
      
      const url = `${this.baseUrl}/shops/${this.shopId}/products.json`
      console.log('Fetching from URL:', url)
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${this.apiToken}`,
          'Content-Type': 'application/json'
        },
        cache: 'no-store'
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error('Printify API error:', {
          status: response.status,
          statusText: response.statusText,
          error: errorText,
          url,
          shopId: this.shopId,
          hasToken: !!this.apiToken
        })
        throw new Error(`Failed to fetch products: ${response.statusText}`)
      }

      const rawData = await response.json()
      console.log('Raw Printify API response structure:', Object.keys(rawData))
      console.log('Raw Printify API response data count:', rawData.data?.length || 0)
      
      // Check if we have the expected data structure
      if (!rawData.data || !Array.isArray(rawData.data)) {
        console.error('Unexpected API response structure:', rawData)
        
        // Create a dummy product for testing
        const dummyProduct = {
          id: 'dummy-product',
          title: 'Sample Product',
          description: 'This is a sample product for testing purposes.',
          images: [{ src: '/placeholder.jpg' }],
          variants: [
            {
              id: 'dummy-variant',
              title: 'Sample Variant',
              price: 19.99,
              is_enabled: true,
              options: {}
            }
          ],
          options: []
        }
        
        return { data: [dummyProduct] }
      }

      // Transform the data to match our expected format
      const transformedData = {
        data: (rawData.data || []).map((product: any) => {
          // Process images to ensure we have valid URLs and prioritize front/main images
          const processedImages = Array.isArray(product.images) 
            ? product.images
                .filter((img: any) => img && img.src)
                .map((img: any) => ({
                  src: img.src.replace(/^http:/, 'https:')
                }))
            : [{ src: '/placeholder.jpg' }];
          
          // Sort images to prioritize front/main images
          processedImages.sort((a: any, b: any) => {
            const aIsFront = a.src.includes('front') || a.src.includes('main');
            const bIsFront = b.src.includes('front') || b.src.includes('main');
            
            if (aIsFront && !bIsFront) return -1;
            if (!aIsFront && bIsFront) return 1;
            return 0;
          });
          
          return {
            id: String(product.id),
            title: product.title || 'Untitled Product',
            description: product.description || '',
            images: processedImages,
            variants: Array.isArray(product.variants) ? product.variants.map((variant: any) => ({
              id: String(variant.id || 'unknown'),
              title: variant.title || '',
              price: variant && variant.price ? variant.price / 100 : 19.99, // Convert cents to dollars
              is_enabled: variant.is_enabled !== false, // Default to true if not specified
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
            options: product.options || []
          };
        })
      }

      console.log('Transformed data count:', transformedData.data.length)
      if (transformedData.data.length > 0) {
        console.log('First transformed product:', {
          id: transformedData.data[0].id,
          title: transformedData.data[0].title,
          hasImages: transformedData.data[0].images?.length > 0,
          hasVariants: transformedData.data[0].variants?.length > 0
        })
      }
      
      return transformedData
    } catch (error) {
      console.error('Error in PrintifyClient.getProducts:', error)
      
      // Return a dummy product in case of error
      const dummyProduct = {
        id: 'error-product',
        title: 'Error Loading Products',
        description: 'There was an error loading products. Please try again later.',
        images: [{ src: '/placeholder.jpg' }],
        variants: [
          {
            id: 'error-variant',
            title: 'Default',
            price: 19.99,
            is_enabled: true,
            options: {}
          }
        ],
        options: []
      }
      
      return { data: [dummyProduct] }
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

      // Process images to ensure we have valid URLs and prioritize front/main images
      const processedImages = Array.isArray(rawData.images) 
        ? rawData.images
            .filter((img: any) => img && img.src)
            .map((img: any) => ({
              src: img.src.replace(/^http:/, 'https:')
            }))
        : [{ src: '/placeholder.jpg' }];
      
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
        variants: Array.isArray(rawData.variants) ? rawData.variants.map((variant: any) => ({
          id: String(variant.id || 'unknown'),
          title: variant.title || '',
          price: variant && variant.price ? variant.price / 100 : 19.99, // Convert cents to dollars
          is_enabled: variant.is_enabled !== false, // Default to true if not specified
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