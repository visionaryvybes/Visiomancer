'use client'

import React, { useState } from "react"
import Image from "next/image"
import Link from "next/link"

interface ProductCardProps {
  product: {
    id: string
    title: string
    description: string
    images: { src: string }[]
    variants: Array<{
      id: string
      title: string
      price: number
      is_enabled: boolean
      options: Record<string, string>
    }>
    options: Array<{
      name: string
      values: string[]
    }>
  }
  priority?: boolean
}

// Base64 encoded placeholder image (1x1 pixel transparent PNG)
const PLACEHOLDER_IMAGE = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="

export default function ProductCard({ product, priority = false }: ProductCardProps) {
  const [imageError, setImageError] = useState(false)
  const [imageLoading, setImageLoading] = useState(true)

  const imageUrl = product.images?.[0]?.src || ''
  const price = product.variants[0]?.price || 0
  const isInStock = product.variants.some(v => v.is_enabled)

  const getImageUrl = (url: string) => {
    if (!url) return PLACEHOLDER_IMAGE
    try {
      // Convert http to https
      let processedUrl = url.replace(/^http:/, 'https:')
      
      // Use images-api.printify.com instead of cdn.printify.com
      processedUrl = processedUrl.replace('cdn.printify.com', 'images-api.printify.com')
      
      // Remove preview parameter as it might be causing issues
      processedUrl = processedUrl.replace(/[?&]preview=\d+/, '')
      
      return processedUrl
    } catch (error) {
      console.error(`Error processing image URL for ${product.title}:`, error)
      return PLACEHOLDER_IMAGE
    }
  }

  return (
    <Link 
      href={`/products/${product.id}`} 
      className="group block animate-fade-in"
    >
      <div className="relative w-full overflow-hidden rounded-lg bg-card shadow-card transition-all duration-300 hover:shadow-card-hover">
        <div className="relative pb-[100%]">
          <div className="absolute inset-0">
            <Image
              src={getImageUrl(imageUrl)}
              alt={product.title}
              fill
              priority={priority}
              className={`object-cover transition-all duration-500 ${
                imageLoading ? 'scale-105 blur-sm' : 'scale-100 blur-0'
              } group-hover:scale-105`}
              onError={() => {
                console.error(`Image load error for ${product.title}`)
                setImageError(true)
                setImageLoading(false)
              }}
              onLoad={() => {
                console.log(`Image loaded successfully for ${product.title}`)
                setImageLoading(false)
              }}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
              quality={75}
              loading={priority ? 'eager' : 'lazy'}
              unoptimized // Use original image from Printify CDN
            />
            {/* Quick view overlay */}
            <div className="absolute inset-0 bg-primary/0 transition-all duration-300 group-hover:bg-primary/10">
              <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <span className="rounded-full bg-accent px-6 py-2 text-sm font-medium text-white shadow-lg">
                  Quick View
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4">
          <h3 className="text-base font-medium text-primary transition-colors group-hover:text-accent">
            {product.title}
          </h3>
          <div className="mt-2 flex items-center justify-between">
            <p className="text-lg font-semibold text-primary">
              ${price.toFixed(2)} <span className="text-sm text-text-light">CAD</span>
            </p>
            <div className={`rounded-full px-3 py-1 ${
              isInStock 
                ? 'bg-highlight/10 text-highlight-dark' 
                : 'bg-red-500/10 text-red-400'
            }`}>
              <span className="text-xs font-medium">
                {isInStock ? 'In Stock' : 'Sold Out'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
} 