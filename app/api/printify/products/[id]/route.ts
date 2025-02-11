import { NextRequest, NextResponse } from 'next/server';
import { PrintifyClient } from '../../client';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const token = process.env.PRINTIFY_API_TOKEN;
  if (!token) {
    return NextResponse.json(
      { error: 'API token not configured' },
      { status: 500 }
    );
  }

  try {
    const client = new PrintifyClient(token);
    const product = await client.getProduct(params.id);
    return NextResponse.json(product);
  } catch (error) {
    console.error('Failed to fetch product:', error);
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    );
  }
} 