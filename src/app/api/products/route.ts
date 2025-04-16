import { NextResponse, NextRequest } from 'next/server'
import { getAllProducts, GetAllProductsResult } from '@/lib/api/products'
import { ProductSource } from '@/types'

// GET /api/products
// Optional query parameter: ?source=gumroad|printful

// Helper function to validate source parameter
function isValidSource(source: string | null): source is ProductSource {
  return source === 'gumroad' || source === 'printful'
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const sourceParam = searchParams.get('source')

  let source: ProductSource | undefined = undefined
  let error: string | null = null

  if (sourceParam) {
    if (isValidSource(sourceParam)) {
      source = sourceParam
    } else {
      error = 'Invalid source parameter. Must be \'gumroad\' or \'printful\'.'
      console.error(error)
      return NextResponse.json({ error }, { status: 400 })
    }
  }

  try {
    console.log(`Fetching products... Source: ${source || 'all'}`)
    const result: GetAllProductsResult = await getAllProducts(source)
    console.log(
      `Fetched ${result.products.length} products. Errors: ${JSON.stringify(result.errors)}`,
    )

    // Return both products and any errors encountered during fetching
    return NextResponse.json(result, { status: 200 })
  } catch (err: any) {
    console.error('Failed to fetch products:', err)
    // Return a generic server error if the function throws unexpectedly
    return NextResponse.json(
      {
        products: [],
        errors: {
          internal: `Server error: ${err.message || 'Unknown error'}`,
        },
      },
      { status: 500 },
    )
  }
} 