import { NextResponse } from 'next/server'
import { PrintifyClient } from '../printify/client'

export const dynamic = 'force-dynamic' // Disable caching for this route

export async function GET(request: Request) {
  try {
    const apiToken = process.env.PRINTIFY_API_TOKEN
    console.log('API Token present:', !!apiToken)
    console.log('API Token length:', apiToken?.length || 0)
    
    if (!apiToken) {
      console.error('PRINTIFY_API_TOKEN environment variable is not set')
      return NextResponse.json(
        { error: 'API configuration error', data: [] },
        { status: 500 }
      )
    }

    console.log('Initializing Printify client...')
    const client = new PrintifyClient(apiToken)
    
    console.log('Fetching products from Printify...')
    const response = await client.getProducts()
    
    const productCount = response.data?.length || 0
    console.log(`Successfully fetched ${productCount} products`)
    
    // Log detailed information about each product for debugging
    if (response.data && response.data.length > 0) {
      console.log('First product details:', {
        id: response.data[0].id,
        title: response.data[0].title,
        hasImages: response.data[0].images?.length > 0,
        hasVariants: response.data[0].variants?.length > 0,
        imageCount: response.data[0].images?.length,
        variantCount: response.data[0].variants?.length
      })
    } else {
      console.log('No products returned from Printify API')
    }

    return NextResponse.json({
      data: response.data || []
    })
  } catch (error) {
    console.error('Error in /api/products:', error)
    
    // Determine if it's an authentication error
    const message = error instanceof Error ? error.message : 'Unknown error'
    const isAuthError = message.toLowerCase().includes('unauthorized') || 
                       message.toLowerCase().includes('authentication')
    
    return NextResponse.json(
      { 
        error: isAuthError ? 'Invalid API token' : message,
        data: [] 
      },
      { status: isAuthError ? 401 : 500 }
    )
  }
} 