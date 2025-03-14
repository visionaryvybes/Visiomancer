import { NextResponse } from 'next/server';
import { PrintifyClient } from '../client';

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
    
    // Only process first 20 products to prevent timeouts
    const limitedProducts = productsResponse.data.slice(0, 20);
    console.log(`Processing ${limitedProducts.length} products...`);
    
    // Get detailed information for each product
    const productsWithDetails = await Promise.all(
      limitedProducts.map(async (product: any) => {
        try {
          const details = await client.getProduct(product.id);
          
          if (!details) {
            console.error(`No details found for product ${product.id}`);
            return null;
          }
          
          // Process images
          const images = details.images.map((img: any) => {
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
            id: details.id,
            title: details.title,
            description: details.description,
            images: images.slice(0, 5), // Limit images to first 5
            variants: details.variants.map((variant: any) => ({
              id: variant.id,
              title: variant.title,
              price: parseFloat((variant.price / 100).toFixed(2)),
              is_enabled: variant.is_enabled,
              options: variant.options
            })),
            options: details.options
          };
        } catch (error) {
          console.error(`Error fetching details for product ${product.id}:`, error);
          return null;
        }
      })
    );

    // Filter out any failed product fetches
    const validProducts = productsWithDetails.filter((product): product is NonNullable<typeof product> => 
      product !== null && product.images.length > 0
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