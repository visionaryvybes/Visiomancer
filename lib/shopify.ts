import { PrintifyClient } from "../app/api/printify/client"

export interface Product {
  id: string
  title: string
  description: string
  images: { src: string }[]
  variants: {
    id: string
    title: string
    price: number
    is_enabled: boolean
    options: Record<string, any>
  }[]
  options: any[]
  category: string
}

export async function getProducts(options: any = {}): Promise<Product[]> {
  const token = process.env.PRINTIFY_API_TOKEN
  if (!token) {
    console.error('Printify API token not configured')
    return []
  }

  const client = new PrintifyClient(token)
  
  try {
    console.log('Fetching products...')
    const response = await client.getProducts()
    console.log('Products found:', response.data.length)
    
    return response.data.map(product => {
      // Ensure images are in the correct format
      const images = product.images.map(img => {
        if (typeof img === 'string') {
          return { src: img }
        }
        return img
      })

      // Format variants
      const variants = product.variants.map(variant => ({
        id: String(variant.id),
        title: variant.title || '',
        price: typeof variant.price === 'number' ? variant.price / 100 : 0,
        is_enabled: variant.is_enabled ?? true,
        options: variant.options || {}
      }))

      return {
        id: String(product.id),
        title: product.title || '',
        description: product.description || '',
        images: images,
        variants: variants,
        options: product.options || [],
        category: 'All'
      }
    })
  } catch (error) {
    console.error('Failed to fetch products:', error)
    return []
  }
} 