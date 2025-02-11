'use client'

import { useState } from "react"
import Link from "next/link"
import AddToCartButton from "@/components/AddToCartButton"
import ImageGallery from "@/components/ImageGallery"
import SizeSelector from "@/components/SizeSelector"
import RelatedProducts from "@/components/RelatedProducts"
import ShareButton from "@/components/ShareButton"

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

interface ProductContentProps {
  product: Product
  relatedProducts: Product[]
}

export default function ProductContent({ product, relatedProducts }: ProductContentProps) {
  const [selectedVariantId, setSelectedVariantId] = useState<string>(() => {
    const defaultVariant = 
      product.variants.find(v => v.is_default) || 
      product.variants.find(v => v.is_enabled) ||
      product.variants[0]
    return defaultVariant?.id || ''
  })

  const selectedVariant = product.variants.find(v => v.id === selectedVariantId)
  const shareUrl = typeof window !== 'undefined' ? window.location.href : ''

  return (
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
  )
} 