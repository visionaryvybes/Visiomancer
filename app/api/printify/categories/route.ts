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

export async function GET() {
  try {
    // Get the first shop
    const shops = await fetchPrintify('/shops.json');
    const shopId = shops[0]?.id;

    if (!shopId) {
      return NextResponse.json({ error: 'No shop found' }, { status: 404 });
    }

    // Get all products to extract unique categories
    const products = await fetchPrintify(`/shops/${shopId}/products.json`);

    // Extract unique categories from product tags
    const allTags = products.data.flatMap((product: any) => product.tags || []);
    const uniqueCategories = Array.from(new Set(allTags)) as string[];

    const categories = uniqueCategories.map(category => ({
      id: category,
      name: category.charAt(0).toUpperCase() + category.slice(1),
      productCount: products.data.filter((product: any) => 
        product.tags?.includes(category)
      ).length
    }));

    return NextResponse.json({
      data: categories,
      total: categories.length
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
} 