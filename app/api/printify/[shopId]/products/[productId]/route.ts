import { NextResponse } from 'next/server'
import { headers } from 'next/headers'

export async function GET(
  request: Request,
  { params }: { params: { shopId: string; productId: string } }
) {
  try {
    const { shopId, productId } = params
    const token = process.env.PRINTIFY_API_TOKEN
    const headersList = headers()
    const origin = headersList.get('origin') || '*'

    if (!token) {
      return NextResponse.json(
        { error: 'Printify API token not configured' },
        { 
          status: 500,
          headers: {
            'Access-Control-Allow-Origin': origin,
            'Access-Control-Allow-Methods': 'GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          }
        }
      )
    }

    const response = await fetch(
      `https://api.printify.com/v1/shops/${shopId}/products/${productId}`,
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
        { 
          status: response.status,
          headers: {
            'Access-Control-Allow-Origin': origin,
            'Access-Control-Allow-Methods': 'GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          }
        }
      )
    }

    const data = await response.json()
    
    // Transform the data to match our expected format
    const transformedData = {
      ...data,
      variants: data.variants.map((variant: any) => ({
        ...variant,
        price: variant.price,
        is_enabled: variant.is_enabled || true,
        options: variant.options || {}
      }))
    }

    return NextResponse.json(transformedData, {
      headers: {
        'Access-Control-Allow-Origin': origin,
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      }
    })
  } catch (error) {
    console.error('Error fetching product:', error)
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { 
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': origin,
          'Access-Control-Allow-Methods': 'GET, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        }
      }
    )
  }
}

// Handle OPTIONS request for CORS
export async function OPTIONS(request: Request) {
  const headersList = headers()
  const origin = headersList.get('origin') || '*'

  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
} 