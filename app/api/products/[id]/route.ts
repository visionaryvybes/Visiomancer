import { NextRequest, NextResponse } from 'next/server'
import { PrintifyClient } from '../../printify/client'

interface Image {
  src: string
}

interface Variant {
  id: string
  title: string
  price: number
  is_enabled: boolean
  options: Record<string, string>
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!params.id) {
    return NextResponse.json(
      { error: 'Product ID is required' },
      { status: 400 }
    )
  }

  try {
    const token = process.env.PRINTIFY_API_TOKEN
    if (!token) {
      return NextResponse.json(
        { error: 'API token not configured' },
        { status: 500 }
      )
    }

    const client = new PrintifyClient(token)
    const product = await client.getProduct(params.id)
    
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    // Transform the product data
    const transformedProduct = {
      ...product,
      images: product.images.map((img: Image) => ({
        src: img.src.replace(/^http:/, 'https:')
          .replace('cdn.printify.com', 'images-api.printify.com')
          .replace(/[?&]preview=\d+/, '')
      })),
      variants: product.variants.map((variant: Variant) => ({
        ...variant,
        price: variant.price,
        is_enabled: variant.is_enabled || true,
        options: variant.options || {}
      })),
      options: product.options || []
    }

    return NextResponse.json(transformedProduct)
  } catch (error) {
    console.error('Failed to fetch product:', error)
    return NextResponse.json(
      { error: 'Failed to fetch product. Please try again later.' },
      { status: 500 }
    )
  }
} 