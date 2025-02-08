import { NextResponse } from 'next/server';
import { PrintifyClient } from '../client';

// Base64 encoded placeholder image (1x1 pixel transparent PNG)
const PLACEHOLDER_IMAGE = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";

export async function GET(request: Request) {
  try {
    const token = process.env.PRINTIFY_API_TOKEN;
    if (!token) {
      throw new Error('Printify API token is not configured');
    }

    console.log('Initializing Printify client...');
    const client = new PrintifyClient(token);

    // Get the first shop
    console.log('Fetching shops...');
    const shopsResponse = await client.getShops();
    console.log('Shops response:', shopsResponse);
    
    const shopId = shopsResponse[0]?.id;
    if (!shopId) {
      console.error('No shop found in response:', shopsResponse);
      return NextResponse.json({ error: 'No shop found' }, { status: 404 });
    }

    console.log('Using shop ID:', shopId);

    // Get products for the shop
    console.log('Fetching products...');
    const productsResponse = await client.getProducts(shopId.toString());
    console.log(`Found ${productsResponse.data?.length || 0} products`);
    
    // Get detailed information for each product
    const productsWithDetails = await Promise.all(
      productsResponse.data.map(async (product) => {
        try {
          console.log(`Fetching details for product ${product.id}...`);
          const details = await client.getProduct(shopId.toString(), product.id);
          
          // Process images
          const images = details.images.map(img => {
            let src = img.src;
            
            if (!src) {
              console.error('Invalid image URL for product:', details.title);
              return { src: PLACEHOLDER_IMAGE };
            }

            try {
              // Convert http to https
              src = src.replace(/^http:/, 'https:');
              
              // Use images-api.printify.com for better reliability
              src = src.replace('cdn.printify.com', 'images-api.printify.com');
              
              // Remove preview parameter as it might be causing issues
              src = src.replace(/[?&]preview=\d+/, '');
              
              console.log('Final processed URL:', src);
              return { src };
            } catch (error) {
              console.error('Error processing image URL:', error);
              return { src: PLACEHOLDER_IMAGE };
            }
          });

          return {
            id: details.id,
            title: details.title,
            description: details.description,
            images,
            variants: details.variants.map(variant => ({
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
      shop_id: shopId
    });
  } catch (error) {
    console.error('Error fetching Printify products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
} 