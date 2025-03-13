'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { WishlistButton } from './ui/wishlist-button'
import ShareButton from './ShareButton'
import AddToCartButton from './AddToCartButton'
import ImageGallery from './ImageGallery'
import SizeSelector from './SizeSelector'
import RelatedProducts from './RelatedProducts'
import { Star, Truck, Shield, RotateCcw, ChevronDown } from 'lucide-react'

interface ProductContentProps {
  product: {
    id: string
    title: string
    description: string
    images: Array<{ src: string }>
    variants: Array<{
      id: string
      title: string
      price: number
      is_enabled: boolean
      options: Record<string, string>
    }>
  }
  relatedProducts?: any[]
}

export default function ProductContent({ product, relatedProducts = [] }: ProductContentProps) {
  const [selectedVariantId, setSelectedVariantId] = useState(product.variants[0]?.id || '')
  const [expandedSection, setExpandedSection] = useState<string | null>('description')
  const selectedVariant = product.variants.find(v => v.id === selectedVariantId)

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section)
  }

  const features = [
    {
      icon: <Truck className="h-5 w-5" />,
      title: 'Free Shipping',
      description: 'On orders over $50'
    },
    {
      icon: <Shield className="h-5 w-5" />,
      title: 'Secure Payment',
      description: '100% secure payment'
    },
    {
      icon: <RotateCcw className="h-5 w-5" />,
      title: 'Easy Returns',
      description: '30 day return policy'
    }
  ]

  return (
    <div className="min-h-screen w-full overflow-y-auto bg-[#1a1f4d]">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Column - Image Gallery */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:sticky lg:top-24"
          >
            <ImageGallery images={product.images} title={product.title} />
          </motion.div>

          {/* Right Column - Product Details */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col gap-8"
          >
            {/* Header Section */}
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h1 className="text-4xl font-bold text-white mb-2">{product.title}</h1>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                      ))}
                    </div>
                    <span className="text-sm text-white/60">150 reviews</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <WishlistButton product={product} />
                  <ShareButton
                    title={product.title}
                    url={typeof window !== 'undefined' ? window.location.href : ''}
                  />
                </div>
              </div>

              <div className="text-3xl font-bold text-white">
                ${selectedVariant?.price.toFixed(2)} 
                <span className="text-sm text-white/60 ml-2">CAD</span>
              </div>
            </div>

            {/* Size Selection */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-white">Select Size</h3>
              <SizeSelector
                variants={product.variants}
                selectedVariantId={selectedVariantId}
                onVariantChange={setSelectedVariantId}
              />
            </div>

            {/* Add to Cart Section */}
            <div className="space-y-4">
              {selectedVariant && (
                <AddToCartButton
                  product={product}
                  variant={selectedVariant}
                />
              )}
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-6 border-y border-white/10">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-3 p-4 rounded-lg bg-white/5">
                  <div className="text-blue-400">
                    {feature.icon}
                  </div>
                  <div>
                    <h4 className="font-medium text-white">{feature.title}</h4>
                    <p className="text-sm text-white/60">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Accordion Sections */}
            <div className="space-y-4">
              {/* Description */}
              <div className="border border-white/10 rounded-lg overflow-hidden">
                <button
                  onClick={() => toggleSection('description')}
                  className="w-full flex items-center justify-between p-4 text-left"
                >
                  <h3 className="text-lg font-medium text-white">Description</h3>
                  <ChevronDown 
                    className={`h-5 w-5 text-white/60 transition-transform ${
                      expandedSection === 'description' ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {expandedSection === 'description' && (
                  <div className="p-4 pt-0">
                    <div className="prose prose-invert max-w-none">
                      <p className="text-white/90">
                        {product.description}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Specifications */}
              <div className="border border-white/10 rounded-lg overflow-hidden">
                <button
                  onClick={() => toggleSection('specifications')}
                  className="w-full flex items-center justify-between p-4 text-left"
                >
                  <h3 className="text-lg font-medium text-white">Specifications</h3>
                  <ChevronDown 
                    className={`h-5 w-5 text-white/60 transition-transform ${
                      expandedSection === 'specifications' ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {expandedSection === 'specifications' && (
                  <div className="p-4 pt-0">
                    <div className="grid gap-4">
                      <div className="rounded-lg bg-white/5 p-4">
                        <h4 className="font-medium text-white mb-2">Material & Weight</h4>
                        <p className="text-sm text-white/70">
                          Premium quality materials ensuring durability and comfort.
                        </p>
                      </div>
                      <div className="rounded-lg bg-white/5 p-4">
                        <h4 className="font-medium text-white mb-2">Dimensions</h4>
                        <p className="text-sm text-white/70">
                          Available in multiple sizes to suit your needs.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Shipping */}
              <div className="border border-white/10 rounded-lg overflow-hidden">
                <button
                  onClick={() => toggleSection('shipping')}
                  className="w-full flex items-center justify-between p-4 text-left"
                >
                  <h3 className="text-lg font-medium text-white">Shipping & Returns</h3>
                  <ChevronDown 
                    className={`h-5 w-5 text-white/60 transition-transform ${
                      expandedSection === 'shipping' ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {expandedSection === 'shipping' && (
                  <div className="p-4 pt-0 space-y-4">
                    <div>
                      <h4 className="font-medium text-white mb-2">Shipping Information</h4>
                      <ul className="list-disc list-inside space-y-2 text-white/70 text-sm">
                        <li>Free shipping on orders over $50</li>
                        <li>Standard shipping: 5-7 business days</li>
                        <li>Express shipping: 2-3 business days</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-white mb-2">Return Policy</h4>
                      <ul className="list-disc list-inside space-y-2 text-white/70 text-sm">
                        <li>30-day return window</li>
                        <li>Free returns on all orders</li>
                        <li>Items must be unused and in original packaging</li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-24"
          >
            <RelatedProducts products={relatedProducts} />
          </motion.div>
        )}
      </div>
    </div>
  )
} 