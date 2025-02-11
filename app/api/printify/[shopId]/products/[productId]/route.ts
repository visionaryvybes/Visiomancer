import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: { shopId: string; productId: string } }
) {
  try {
    const { shopId, productId } = params
    const token = process.env.PRINTIFY_API_TOKEN

    if (!token) {
      return NextResponse.json(
        { error: 'Printify API token not configured' },
        { status: 500 }
      )
    }

    const response = await fetch(
      `https://api.printify.com/v1/shops/${shopId}/products/${productId}.json`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    )

    if (!response.ok) {
      const errorText = await response.text()
      return NextResponse.json(
        { error: `Printify API error: ${response.status} ${response.statusText}`, details: errorText },
        { status: response.status }
      )
    }

    const data = await response.json()
    
    // Transform the data to match our expected format
    const transformedData = {
      ...data,
      variants: data.variants.map((variant: any) => ({
        ...variant,
        price: variant.price / 100 // Convert cents to dollars
      }))
    }

    return NextResponse.json(transformedData)
  } catch (error) {
    console.error('Error fetching product:', error)
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    )
  }
} 