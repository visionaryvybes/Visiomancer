import { NextRequest, NextResponse } from 'next/server'
import { PrintifyClient } from '../printify/client'

interface PrintifyProduct {
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
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get('q')

  if (!query) {
    return NextResponse.json({ error: 'Search query is required' }, { status: 400 })
  }

  const token = process.env.PRINTIFY_API_TOKEN
  if (!token) {
    return NextResponse.json({ error: 'API token not configured' }, { status: 500 })
  }

  const client = new PrintifyClient(token)

  try {
    const response = await client.getProducts()
    
    // Filter products based on search query
    const filteredProducts = response.data.filter(product => {
      const searchString = `${product.title} ${product.description}`.toLowerCase()
      return searchString.includes(query.toLowerCase())
    })

    // Transform products to match the expected format
    const products = filteredProducts.map((product: PrintifyProduct) => ({
      id: product.id,
      title: product.title,
      description: product.description,
      images: product.images,
      variants: product.variants.map(variant => ({
        id: variant.id,
        title: variant.title,
        price: variant.price,
        is_enabled: variant.is_enabled || true,
        options: variant.options || {}
      })),
      options: product.options || []
    }))

    return NextResponse.json({ products })
  } catch (error) {
    console.error('Search failed:', error)
    return NextResponse.json(
      { error: 'Failed to search products' },
      { status: 500 }
    )
  }
} 