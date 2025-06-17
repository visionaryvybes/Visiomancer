import { NextResponse, NextRequest } from 'next/server'
import { getProductById } from '@/lib/api/products'

// Standard App Router dynamic route segment handler
export async function GET(
  request: NextRequest, // Use NextRequest
  { params }: { params: { id: string } } // Destructure params from the second argument
) {
  // Destructure and decode the URL-encoded ID parameter
  const { id: rawId } = params;
  const id = decodeURIComponent(rawId); 

  if (!id) {
    // This check might be redundant if the route matching ensures an id, but good practice
    return NextResponse.json({ message: "Product ID is required" }, { status: 400 })
  }

  try {
    console.log(`API Route [id]: Fetching product ${id}`);
    const product = await getProductById(id)
    
    if (!product) {
      // getProductById returns null if fetch resulted in 404 or mapping failed
      console.log(`API Route [id]: Product ${id} not found (getProductById returned null).`);
      return NextResponse.json({ message: "Product not found" }, { status: 404 })
    }
    
    console.log(`API Route [id]: Successfully fetched and mapped product ${id}`);
    return NextResponse.json(product)

  } catch (error: unknown) {
    // Catch errors propagated from getProductById (e.g., non-404 fetch errors)
    let errorMessage = "An unknown error occurred while fetching product details.";
    if (error instanceof Error) {
        errorMessage = error.message;
    }
    console.error(`API Route [id]: Error processing product ${id}:`, error) 
    
    return NextResponse.json(
      { message: errorMessage },
      { status: 500 } // Internal Server Error for unexpected fetch/processing issues
    )
  }
} 