import { NextRequest, NextResponse } from 'next/server'

const PRINTIFY_API_URL = 'https://api.printify.com/v1'
const PRINTIFY_TOKEN = process.env.PRINTIFY_API_TOKEN

export async function GET(request: NextRequest) {
  return handleRequest(request)
}

export async function POST(request: NextRequest) {
  return handleRequest(request)
}

export async function PUT(request: NextRequest) {
  return handleRequest(request)
}

export async function DELETE(request: NextRequest) {
  return handleRequest(request)
}

async function handleRequest(request: NextRequest) {
  try {
    if (!PRINTIFY_TOKEN) {
      return NextResponse.json(
        { error: 'Printify API token not configured' },
        { status: 500 }
      )
    }

    // Get the path after /api/printify
    const pathname = request.nextUrl.pathname
    const printifyPath = pathname.replace('/api/printify', '')
    
    // Construct the full Printify API URL
    const url = `${PRINTIFY_API_URL}${printifyPath}${request.nextUrl.search}`

    // Forward the request to Printify
    const response = await fetch(url, {
      method: request.method,
      headers: {
        'Authorization': `Bearer ${PRINTIFY_TOKEN}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: request.method !== 'GET' ? await request.text() : undefined,
    })

    // Get the response data
    const data = await response.json()

    // Return the response with appropriate status
    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error('[Printify API Route] Error:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
} 