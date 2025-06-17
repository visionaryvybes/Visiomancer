import { NextRequest, NextResponse } from 'next/server';
import { getCartTotal } from '@/lib/cart'; // Assuming you have cart helper functions
import { GumroadAPI } from '@/lib/api/gumroad-client'; // Assuming a new Gumroad API client
import { CartItem } from '@/types';

/**
 * Creates a dynamic bundle product on Gumroad for checkout.
 * @route POST /api/checkout/create-bundle
 * @param {NextRequest} request - The incoming request, expecting cart items in the body.
 * @returns {NextResponse} - The response with the checkout URL or an error.
 */
export async function POST(request: NextRequest) {
  try {
    const cartItems: CartItem[] = await request.json();

    if (!cartItems || cartItems.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    }

    const gumroad = new GumroadAPI(process.env.GUMROAD_ACCESS_TOKEN!);

    // 1. Calculate total price and generate a description
    const total = getCartTotal(cartItems); // You'll need to create this helper
    const description = cartItems
      .map(item => `${item.quantity} x ${item.product.name}`)
      .join('\n');
    const name = `Custom Order - ${new Date().toISOString()}`;

    // 2. Get all file paths from the products in the cart
    const filePaths = cartItems.flatMap(item => item.product.files || []); // Assuming files are stored on product

    // 3. Create the bundle product on Gumroad
    const bundleProduct = await gumroad.createProduct({
      name,
      price: total * 100, // Gumroad API expects price in cents
      description,
      // url: '', // You might need a placeholder URL for the digital file
      // file_paths: filePaths, // This part is speculative, need to confirm how to add files
    });

    if (!bundleProduct || !bundleProduct.short_url) {
      throw new Error('Failed to create Gumroad bundle product.');
    }

    // 4. Return the direct checkout URL for the new bundle
    const checkoutUrl = `${bundleProduct.short_url}?wanted=true`;
    
    return NextResponse.json({ checkoutUrl });

  } catch (error) {
    console.error('[API_CREATE_BUNDLE_ERROR]', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ error: 'Failed to create checkout bundle.', details: errorMessage }, { status: 500 });
  }
} 