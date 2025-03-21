import { NextRequest, NextResponse } from 'next/server'

const PRINTIFY_API_URL = 'https://api.printify.com/v1'

export const dynamic = 'force-dynamic'

export async function GET(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  try {
    const apiKey = process.env.PRINTIFY_API_TOKEN
    if (!apiKey) {
      throw new Error('PRINTIFY_API_TOKEN is not set')
    }

    const path = params.path.join('/')
    const url = `${PRINTIFY_API_URL}/${path}`

    console.log('Fetching from Printify:', url)

    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      throw new Error(`Printify API error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    console.log('Printify API response:', {
      path,
      variants: data.variants?.map((v: any) => ({
        title: v.title,
        options: v.options,
        price: v.price,
        is_enabled: v.is_enabled
      }))
    })

    // Transform prices from cents to dollars if needed
    if (path.includes('/products/')) {
      if (Array.isArray(data.data)) {
        // List of products
        data.data = data.data.map((product: any) => ({
          ...product,
          variants: product.variants.map((variant: any) => ({
            ...variant,
            price: variant.price,
            is_enabled: variant.is_enabled || true,
            options: variant.options || {}
          }))
        }))
      } else if (data.variants) {
        // Single product
        data.variants = data.variants.map((variant: any) => ({
          ...variant,
          price: variant.price,
          is_enabled: variant.is_enabled || true,
          options: variant.options || {}
        }))
      }
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error in Printify API route:', error)
    return NextResponse.json(
      { error: 'Failed to fetch from Printify API' },
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  try {
    const token = process.env.PRINTIFY_API_TOKEN
    if (!token) {
      return NextResponse.json(
        { error: 'Printify API token not configured' },
        { status: 500 }
      )
    }

    const path = params.path.join('/')
    const url = `${PRINTIFY_API_URL}/${path}.json`
    
    console.log(`[Printify API Route] Forwarding POST request to: ${url}`)
    
    let body
    try {
      body = await request.json()
    } catch (e) {
      body = {}
    }

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`[Printify API Route] Error response (${response.status}):`, errorText)
      return NextResponse.json(
        { error: `Printify API error: ${response.status} ${response.statusText}`, details: errorText },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('[Printify API Route] Error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
} 