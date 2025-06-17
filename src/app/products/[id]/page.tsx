import { Product } from '@/types'
import { notFound } from 'next/navigation'
import ProductDetailClient from '@/components/products/ProductDetailClient'
import StoreLayout from '@/components/layout/StoreLayout'
// Remove import for ProductDetailSkeleton if not used for Suspense boundary here
import { getAllProducts, getProductById } from '@/lib/api/products' // Import direct fetchers

// Function to fetch all product IDs for static generation
export async function generateStaticParams() {
  try {
    // Use the direct function instead of fetch
    const result = await getAllProducts(null); // Fetch all sources
    
    // Check for hard failures or no products
    if (!result || !result.products || result.products.length === 0) {
       if (result.errors && result.errors.gumroad) {
         console.warn("[Page] generateStaticParams: Fetching failed for Gumroad, proceeding with potentially partial list:", result.errors);
       } else {
         console.error("[Page] generateStaticParams: Failed to fetch any products.");
         return [];
       }
    }

    // Map the products to the format required by generateStaticParams
    const paths = result.products.map((product) => ({
      id: product.id, 
    }));
    
    console.log('[Page] Generated static paths:', paths.length);
    return paths;

  } catch (error) {
    console.error("[Page] Error in generateStaticParams:", error);
    return []; // Return empty array on error to prevent build failure
  }
}

// Remove the old server-side getProduct function
// async function getProduct(id: string): Promise<{ product: Product | null; error?: Error & { status?: number } }> { ... }

interface ProductDetailPageProps {
  params: {
    id: string;
  };
}

// Type for serialized error passed to client
interface SerializableError {
  message: string;
  status?: number;
}

// This is now a Server Component
export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  // Decode the URL-encoded ID parameter
  const { id: rawId } = params;
  const id = decodeURIComponent(rawId);
  
  let product: Product | null = null;
  let serializableError: SerializableError | undefined = undefined;

  try {
    // Fetch data directly on the server using the imported function
    product = await getProductById(id);

    // If getProductById returns null, it implies not found (based on its internal logic)
    if (!product) {
      notFound(); // Trigger Next.js 404 page
    }

  } catch (error: any) {
      // Catch unexpected errors from getProductById (e.g., network, API errors)
      console.error(`[Page] Error fetching product ${id} using getProductById:`, error);
      // Prepare a serializable error object for the client
      serializableError = {
          message: error.message || "An unexpected error occurred fetching product data.",
          // Attempt to get a status code if available, otherwise default or leave undefined
          status: error.status || 500 
      };
      // Note: We don't call notFound() here for general errors, 
      // let the client component display the error message.
  }

  // Render the Client Component, passing the fetched data/error
  return (
    <StoreLayout>
      <ProductDetailClient product={product} fetcherError={serializableError} />
    </StoreLayout>
  );
}