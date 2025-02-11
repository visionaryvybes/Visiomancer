import { NextRequest, NextResponse } from 'next/server'

const PRINTIFY_API_URL = 'https://api.printify.com/v1'

export const dynamic = 'force-dynamic'

export async function GET(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  try {
    const token = process.env.PRINTIFY_API_TOKEN
    if (!token) {
      console.error('[Printify API Route] No API token configured')
      return NextResponse.json(
        { error: 'Printify API token not configured' },
        { status: 500 }
      )
    }

    // Reconstruct the path
    const path = params.path.join('/')
    const url = `${PRINTIFY_API_URL}/${path}.json`

    console.log(`[Printify API Route] Forwarding GET request to: ${url}`)

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'User-Agent': 'Visiomancer/1.0'
      },
      next: { revalidate: 60 }, // Cache for 60 seconds
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`[Printify API Route] Error response (${response.status}):`, errorText)
      
      // Handle specific error cases
      if (response.status === 404) {
        return NextResponse.json(
          { error: 'Product not found', details: errorText },
          { status: 404 }
        )
      }
      
      if (response.status === 401) {
        return NextResponse.json(
          { error: 'Unauthorized - Invalid API token', details: errorText },
          { status: 401 }
        )
      }
      
      return NextResponse.json(
        { error: `Printify API error: ${response.status} ${response.statusText}`, details: errorText },
        { status: response.status }
      )
    }

    const data = await response.json()

    // Transform prices from cents to dollars if needed
    if (path.includes('/products/')) {
      if (Array.isArray(data.data)) {
        // List of products
        data.data = data.data.map((product: any) => ({
          ...product,
          variants: product.variants.map((variant: any) => ({
            ...variant,
            price: variant.price / 100
          }))
        }))
      } else if (data.variants) {
        // Single product
        data.variants = data.variants.map((variant: any) => ({
          ...variant,
          price: variant.price / 100
        }))
      }
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('[Printify API Route] Error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : String(error) },
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