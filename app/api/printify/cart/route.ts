import { NextResponse } from 'next/server';

const PRINTIFY_API_URL = 'https://api.printify.com/v1';

async function fetchPrintify(endpoint: string, options: RequestInit = {}) {
  const token = process.env.PRINTIFY_API_TOKEN;
  if (!token) {
    throw new Error('Printify API token is not configured');
  }

  const response = await fetch(`${PRINTIFY_API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`Printify API error: ${response.statusText}`);
  }

  return response.json();
}

// Create order in Printify
export async function POST(request: Request) {
  try {
    const { items, shippingAddress } = await request.json();

    // Get the first shop
    const shops = await fetchPrintify('/shops.json');
    const shopId = shops[0]?.id;

    if (!shopId) {
      return NextResponse.json({ error: 'No shop found' }, { status: 404 });
    }

    // Format order data for Printify
    const orderData = {
      external_id: `order_${Date.now()}`,
      shipping_method: 1, // Standard shipping
      shipping_address: shippingAddress,
      line_items: items.map((item: any) => ({
        product_id: item.id,
        variant_id: item.variantId,
        quantity: item.quantity
      }))
    };

    // Create order
    const order = await fetchPrintify(`/shops/${shopId}/orders.json`, {
      method: 'POST',
      body: JSON.stringify(orderData)
    });

    return NextResponse.json(order);
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}

// Get order status
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('orderId');

    if (!orderId) {
      return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
    }

    // Get the first shop
    const shops = await fetchPrintify('/shops.json');
    const shopId = shops[0]?.id;

    if (!shopId) {
      return NextResponse.json({ error: 'No shop found' }, { status: 404 });
    }

    const order = await fetchPrintify(`/shops/${shopId}/orders/${orderId}.json`);
    return NextResponse.json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    return NextResponse.json(
      { error: 'Failed to fetch order' },
      { status: 500 }
    );
  }
} 