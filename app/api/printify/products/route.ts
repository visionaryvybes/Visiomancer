import { NextResponse } from 'next/server';
import { PrintifyClient, PrintifyProduct } from '../client';

// Base64 encoded placeholder image (1x1 pixel transparent PNG)
const PLACEHOLDER_IMAGE = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";

export const maxDuration = 300; // Set max duration to 5 minutes
export const dynamic = 'force-dynamic'; // Disable static generation

export async function GET(request: Request) {
  try {
    const token = process.env.PRINTIFY_API_TOKEN;
    if (!token) {
      throw new Error('Printify API token is not configured');
    }

    console.log('Initializing Printify client...');
    const client = new PrintifyClient(token);
    
    // Get products for the shop
    console.log('Fetching products...');
    const productsResponse = await client.getProducts();
    
    // Process first 20 products
    const products = productsResponse.data.slice(0, 20).map((product: PrintifyProduct) => {
      // Process images
      const images = product.images.map((img: { src: string }) => {
        let src = img.src;
        
        if (!src) {
          return { src: PLACEHOLDER_IMAGE };
        }

        try {
          src = src.replace(/^http:/, 'https:')
                  .replace('cdn.printify.com', 'images-api.printify.com')
                  .replace(/[?&]preview=\d+/, '');
          
          return { src };
        } catch (error) {
          return { src: PLACEHOLDER_IMAGE };
        }
      });

      return {
        id: product.id,
        title: product.title,
        description: product.description,
        images: images.slice(0, 5), // Limit images to first 5
        variants: product.variants.map(variant => ({
          id: variant.id,
          title: variant.title,
          price: variant.price, // Price is already converted by PrintifyClient
          is_enabled: variant.is_enabled,
          options: variant.options
        })),
        options: product.options
      };
    });

    // Filter out products without images
    const validProducts = products.filter((product: PrintifyProduct) => 
      product.images.length > 0
    );

    console.log(`Successfully processed ${validProducts.length} valid products`);

    return NextResponse.json({
      data: validProducts,
      total: validProducts.length,
      shop_id: client.shopId
    });
  } catch (error) {
    console.error('Error fetching Printify products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
} 