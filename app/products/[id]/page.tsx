'use client'

import React, { useState } from "react"
import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { WarpBackground } from "../../../components/ui/warp-background"
import { PrintifyClient } from "../../api/printify/client"
import AddToCartButton from "../../../components/AddToCartButton"
import ImageGallery from "../../../components/ImageGallery"
import SizeSelector from "../../../components/SizeSelector"
import RelatedProducts from "../../../components/RelatedProducts"
import ShareButton from "../../../components/ShareButton"
import { ErrorBoundary } from "../../../components/ErrorBoundary"

interface Variant {
  id: string
  title: string
  price: number
  is_enabled: boolean
  options: Record<string, string>
  sku?: string
  grams?: number
  is_default?: boolean
}

interface Product {
  id: string
  title: string
  description: string
  images: Array<{ src: string }>
  variants: Variant[]
  options: Array<{
    name: string
    values: string[]
  }>
  tags?: string[]
}

interface PrintifyProduct extends Product {
  tags: string[]
}

interface ProductPageProps {
  params: {
    id: string
  }
}

function ProductContent({ params }: ProductPageProps) {
  const [product, setProduct] = useState<Product | null>(null)
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedVariantId, setSelectedVariantId] = useState<string>('')
  const [error, setError] = useState<string | null>(null)

  React.useEffect(() => {
    let mounted = true

    async function fetchProduct() {
      try {
        setLoading(true)
        setError(null)

        const token = process.env.NEXT_PUBLIC_PRINTIFY_API_TOKEN
        if (!token) {
          throw new Error('Printify API token not configured')
        }

        const client = new PrintifyClient(token)
        console.log(`[Product Page] Fetching product ${params.id}`)
        
        const productData = await client.getProduct(params.id) as PrintifyProduct
        
        if (!mounted) return
        
        if (!productData) {
          console.error('[Product Page] Product data is null')
          notFound()
        }

        // Fetch related products based on tags or category
        console.log(`[Product Page] Fetching related products for ${params.id}`)
        const relatedData = (await client.getProducts(4)).data
          .filter(p => p.id !== params.id)
          .filter(p => {
            // Match by tags if available
            if (productData.tags && productData.tags.length > 0) {
              const otherProduct = p as PrintifyProduct
              return productData.tags.some(tag => otherProduct.tags?.includes(tag))
            }
            return true
          })
          .slice(0, 4)
          .map(p => ({
            id: p.id,
            title: p.title,
            description: p.description,
            images: p.images,
            variants: p.variants,
            options: p.options
          }))

        if (!mounted) return

        setProduct({
          id: productData.id,
          title: productData.title,
          description: productData.description,
          images: productData.images,
          variants: productData.variants,
          options: productData.options
        })
        setRelatedProducts(relatedData)

        // Set the first enabled variant as selected
        const defaultVariant = productData.variants.find(v => v.is_default) || 
                             productData.variants.find(v => v.is_enabled) ||
                             productData.variants[0]
        
        if (defaultVariant) {
          setSelectedVariantId(defaultVariant.id)
        }
      } catch (error) {
        console.error('[Product Page] Error fetching product:', error)
        if (mounted) {
          if (error instanceof Error) {
            if (error.message.includes('Product not found')) {
              notFound()
            } else {
              setError(error.message)
            }
          } else {
            setError('Failed to load product. Please try again later.')
          }
        }
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    fetchProduct()

    return () => {
      mounted = false
    }
  }, [params.id])

  if (loading) {
    return (
      <div className="min-h-screen">
        <WarpBackground>
          <div className="container mx-auto px-4 py-8">
            <div className="animate-pulse">
              <div className="h-8 w-64 bg-white/10 rounded mb-8" />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div className="aspect-square bg-white/10 rounded-lg" />
                <div className="space-y-4">
                  <div className="h-12 w-3/4 bg-white/10 rounded" />
                  <div className="h-8 w-1/4 bg-white/10 rounded" />
                  <div className="space-y-2">
                    <div className="h-4 w-full bg-white/10 rounded" />
                    <div className="h-4 w-5/6 bg-white/10 rounded" />
                    <div className="h-4 w-4/6 bg-white/10 rounded" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </WarpBackground>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen">
        <WarpBackground>
          <div className="container mx-auto px-4 py-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-red-400 mb-4">Error</h2>
              <p className="text-white/70">{error}</p>
              <Link href="/products" className="text-blue-400 hover:text-blue-300 mt-4 inline-block">
                Return to Products
              </Link>
            </div>
          </div>
        </WarpBackground>
      </div>
    )
  }

  if (!product) return null

  const selectedVariant = product.variants.find(
    (v: any) => v.id === selectedVariantId
  )

  const shareUrl = typeof window !== 'undefined' ? window.location.href : ''

  return (
    <div className="min-h-screen">
      <WarpBackground>
        <div className="container mx-auto px-4 py-8">
          {/* Breadcrumbs */}
          <nav className="mb-8 flex items-center gap-2 text-sm text-white/60">
            <Link href="/" className="hover:text-white">Home</Link>
            <span>/</span>
            <Link href="/products" className="hover:text-white">Products</Link>
            <span>/</span>
            <span className="text-white">{product.title}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Image Gallery */}
            <ImageGallery images={product.images} title={product.title} />

            {/* Product Info */}
            <div className="space-y-8">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h1 className="text-4xl font-bold mb-4">{product.title}</h1>
                  <p className="text-3xl font-bold text-blue-400">
                    ${selectedVariant?.price.toFixed(2)} <span className="text-lg text-white/60">CAD</span>
                  </p>
                </div>
                <ShareButton
                  title={product.title}
                  text={`Check out ${product.title} on VISIOMANCER`}
                  url={shareUrl}
                />
              </div>

              {/* Size Selection */}
              {product.variants.length > 1 && (
                <SizeSelector
                  variants={product.variants}
                  selectedVariantId={selectedVariantId}
                  onVariantChange={setSelectedVariantId}
                />
              )}

              {/* Description */}
              <div className="prose prose-invert max-w-none">
                <h3 className="text-lg font-medium mb-4">Description</h3>
                <div 
                  dangerouslySetInnerHTML={{ 
                    __html: product.description
                  }}
                  className="text-white/80"
                />
              </div>

              {/* Add to Cart */}
              {selectedVariant && (
                <AddToCartButton 
                  product={{
                    id: product.id,
                    title: product.title,
                    images: product.images
                  }}
                  variant={{
                    id: selectedVariant.id,
                    price: selectedVariant.price
                  }}
                />
              )}

              {/* Additional Info */}
              <div className="space-y-6 border-t border-white/10 pt-8">
                <div>
                  <h3 className="text-lg font-medium mb-2">Shipping</h3>
                  <p className="text-white/70">
                    Free shipping on orders over $50. Estimated delivery time: 5-7 business days.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-2">Returns</h3>
                  <p className="text-white/70">
                    Easy returns within 30 days. See our return policy for more details.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Related Products */}
          <RelatedProducts products={relatedProducts} />
        </div>
      </WarpBackground>
    </div>
  )
}

export default function ProductPage(props: ProductPageProps) {
  return (
    <ErrorBoundary>
      <ProductContent {...props} />
    </ErrorBoundary>
  )
} 