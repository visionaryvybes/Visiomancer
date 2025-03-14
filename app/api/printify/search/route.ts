import { NextResponse } from 'next/server';

// Mark this route as dynamic to prevent static generation attempts
export const dynamic = 'force-dynamic';

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

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const category = searchParams.get('category');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');

    // Get the first shop
    const shops = await fetchPrintify('/shops.json');
    const shopId = shops[0]?.id;

    if (!shopId) {
      return NextResponse.json({ error: 'No shop found' }, { status: 404 });
    }

    // Get all products
    const products = await fetchPrintify(`/shops/${shopId}/products.json`);

    // Filter products based on search criteria
    const filteredProducts = products.data.filter((product: any) => {
      const matchesQuery = query ? 
        product.title.toLowerCase().includes(query.toLowerCase()) ||
        product.description?.toLowerCase().includes(query.toLowerCase()) : true;

      const matchesCategory = category ? 
        product.tags.includes(category) : true;

      const price = product.variants[0]?.price || 0;
      const matchesPrice = 
        (!minPrice || price >= Number(minPrice)) &&
        (!maxPrice || price <= Number(maxPrice));

      return matchesQuery && matchesCategory && matchesPrice;
    });

    return NextResponse.json({
      data: filteredProducts,
      total: filteredProducts.length
    });
  } catch (error) {
    console.error('Error searching Printify products:', error);
    return NextResponse.json(
      { error: 'Failed to search products' },
      { status: 500 }
    );
  }
} 