import { NextRequest, NextResponse } from 'next/server';
import { CartItem } from '@/types';
import { buildGumroadCheckoutUrl } from '@/lib/gumroad-utils';

/**
 * Creates a checkout summary for multiple items since Gumroad doesn't support true bundle checkout.
 * @route POST /api/checkout/create-bundle
 * @param {NextRequest} request - The incoming request, expecting cart items in the body.
 * @returns {NextResponse} - The response with checkout instructions or an error.
 */
export async function POST(request: NextRequest) {
  try {
    const cartItems: CartItem[] = await request.json();

    if (!cartItems || cartItems.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    }

    // Calculate total and create summary
    const total = cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    
    const summary = {
      items: cartItems.map(item => ({
        name: item.product.name,
        quantity: item.quantity,
        price: item.product.price,
        total: item.product.price * item.quantity,
        gumroadUrl: item.product.gumroadUrl
      })),
      totalItems: cartItems.reduce((sum, item) => sum + item.quantity, 0),
      totalPrice: total,
      message: `Multi-item cart: ${cartItems.length} different products, ${cartItems.reduce((sum, item) => sum + item.quantity, 0)} total items`
    };

    // Since Gumroad doesn't support true bundle creation via API,
    // we'll return the first product's URL with a note about the limitation
    const firstItem = cartItems[0];
    const firstItemUrl = firstItem.product.gumroadUrl;
    
    if (!firstItemUrl) {
      return NextResponse.json({ error: 'No checkout URL available' }, { status: 400 });
    }

    const checkoutUrl = buildGumroadCheckoutUrl(firstItemUrl, firstItem.quantity);

    return NextResponse.json({ 
      checkoutUrl,
      summary,
      warning: "Due to Gumroad limitations, you'll need to checkout each product separately. Only the first item is shown.",
      multipleItems: cartItems.length > 1
    });

  } catch (error) {
    console.error('[API_CREATE_BUNDLE_ERROR]', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ error: 'Failed to process checkout.', details: errorMessage }, { status: 500 });
  }
} 