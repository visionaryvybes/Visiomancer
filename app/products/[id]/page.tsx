import { Suspense } from "react"
import { notFound } from "next/navigation"
import { PrintifyClient } from "../../api/printify/client"
import ProductContent from "@/components/ProductContent"
import { WarpBackground } from "@/components/ui/warp-background"
import { ProductSkeleton } from "@/components/ui/product-skeleton"

interface ProductPageProps {
  params: {
    id: string
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  if (!params.id) {
    notFound()
  }

  try {
    const client = new PrintifyClient()
    const product = await client.getProduct(params.id)
    
    if (!product) {
      notFound()
    }

    // Fetch related products
    const { data: relatedProducts } = await client.getProducts(4)
    const filteredRelatedProducts = relatedProducts
      .filter(p => p.id !== params.id)
      .slice(0, 4)

    return (
      <div className="min-h-screen">
        <WarpBackground>
          <Suspense fallback={<ProductSkeleton />}>
            <ProductContent 
              product={product} 
              relatedProducts={filteredRelatedProducts} 
            />
          </Suspense>
        </WarpBackground>
      </div>
    )
  } catch (error) {
    console.error('[Product Page] Error:', error)
    notFound()
  }
} 