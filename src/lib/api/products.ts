import { Product, ProductImage, ProductVariant, ProductSource, ProductVariantDetail } from '@/types'
import {
  getGumroadProducts,
  getGumroadProductById,
  RawGumroadProduct,
  formatGumroadPrice,
  getGumroadPurchaseUrl,
} from './gumroad'

// --- Helper Functions for mapping API data ---

function mapGumroadProduct(gumroadData: RawGumroadProduct): Product {
  console.log(`[mapGumroadProduct] Mapping product ID: ${gumroadData.id}, Raw short_url: ${gumroadData.short_url}`);
  
  // Handle images - prefer thumbnail_url over preview_url
  const images: ProductImage[] = []
  if (gumroadData.thumbnail_url) {
    images.push({ 
      url: gumroadData.thumbnail_url, 
      altText: gumroadData.name 
    })
  } else if (gumroadData.preview_url) {
    images.push({ 
      url: gumroadData.preview_url, 
      altText: gumroadData.name 
    })
  }

  // Convert variants if they exist
  const variants: ProductVariant[] = []
  if (gumroadData.variants && gumroadData.variants.length > 0) {
    gumroadData.variants.forEach(variant => {
      variants.push({
        id: variant.title.toLowerCase().replace(/\s+/g, '_'),
        name: variant.title,
        options: variant.options.map(option => option.name)
      })
    })
  }

  // Extract tags from Gumroad data
  const tags = gumroadData.tags || []

  return {
    id: `gumroad-${gumroadData.id}`,
    source: 'gumroad',
    name: gumroadData.name,
    slug: gumroadData.custom_permalink || gumroadData.id,
    description: gumroadData.description || gumroadData.custom_summary || '',
    price: formatGumroadPrice(gumroadData.price), // Convert from cents
    images,
    gumroadUrl: getGumroadPurchaseUrl(gumroadData),
    variants,
    tags,
    // Add additional Gumroad-specific fields
    isNew: false, // Could be determined by creation date if available
    isBestSeller: false, // Could be determined by sales_count if available
    isSale: false, // Could be determined by price differences
  }
}

// --- API Service Functions ---

// Define a structure for the return type including potential errors
export interface GetAllProductsResult {
  products: Product[];
  errors: {
    gumroad?: string;
  };
}

export async function getAllProducts(sourceFilter: ProductSource | null = null): Promise<GetAllProductsResult> {
  console.log(`Fetching products... Source: ${sourceFilter === 'gumroad' ? 'gumroad' : 'all (gumroad only)'}`)
  const result: GetAllProductsResult = { products: [], errors: {} };

  // Only fetch if filter is 'gumroad' or null (defaults to all, which is now only gumroad)
  if (sourceFilter && sourceFilter !== 'gumroad') {
     console.log('Source filter is not gumroad, skipping fetch.');
     return result; // Return empty if filtered for a non-gumroad source
  }

  try {
    // Fetch only Gumroad products
    const gumroadProducts = await getGumroadProducts();

    // Process Gumroad results
    if (Array.isArray(gumroadProducts)) {
      try {
        gumroadProducts.forEach((p: RawGumroadProduct) => result.products.push(mapGumroadProduct(p)))
        if (gumroadProducts.length > 0) {
           console.log(`Successfully mapped ${gumroadProducts.length} Gumroad products.`)
        }
      } catch (mapError) {
         console.error("Error mapping Gumroad products:", mapError)
         result.errors.gumroad = mapError instanceof Error ? mapError.message : "Failed to map Gumroad products"
      }
    } else {
        // Handle case where getGumroadProducts might not return an array (though it should)
        console.error("Gumroad products fetch did not return an array:", gumroadProducts);
        result.errors.gumroad = "Invalid response format from Gumroad fetch";
    }

  } catch (fetchError) {
     // Catch errors specifically from getGumroadProducts()
      console.error("Error fetching Gumroad products:", fetchError)
      result.errors.gumroad = fetchError instanceof Error ? fetchError.message : "Failed to fetch Gumroad products"
  }

  console.log(`Finished processing products. Total mapped: ${result.products.length}. Errors:`, JSON.stringify(result.errors));
  return result;
}

export async function getProductById(id: string): Promise<Product | null> {
  console.log(`Fetching product by ID: ${id}`)
  try {
    if (id.startsWith('gumroad-')) {
      const gumroadId = id.substring('gumroad-'.length)
      const productData = await getGumroadProductById(gumroadId)
      return productData ? mapGumroadProduct(productData) : null
    }
    else {
      console.warn(`Product ID format not recognized: ${id}`)
      return null
    }
  } catch (error) {
    console.error(`Error fetching product with ID ${id}:`, error)
    return null
  }
}