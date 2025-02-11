'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Share2, Heart } from 'lucide-react'
import AddToCartButton from './AddToCartButton'

interface ProductDetailsProps {
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
}

const SIZES = [
  { size: '11" x 14"', price: 9.28 },
  { size: '12" x 18"', price: 14.53 },
  { size: '16" x 20"', price: 16.83 },
  { size: '18" x 24"', price: 16.62 },
  { size: '20" x 30"', price: 19.38 },
  { size: '24" x 36"', price: 24.73 },
  { size: '9" x 11"', price: 7.77 },
  { size: '10" x 20"', price: 14.63 }
]

// Function to organize images and prevent duplicates
function organizeImages(images: Array<{ src: string }>) {
  // Create a Set to track unique image URLs
  const uniqueUrls = new Set<string>()
  const uniqueImages: Array<{ src: string }> = []

  // Keywords to identify different types of images
  const imageTypes = {
    main: ['main', 'primary', 'default'],
    room: ['room', 'interior', 'wall', 'decor'],
    packaging: ['tube', 'package', 'packaging', 'ship'],
    detail: ['close', 'detail', 'texture', 'zoom']
  }

  // First pass: Add main product image
  for (const image of images) {
    const src = image.src.toLowerCase()
    if (!uniqueUrls.has(src)) {
      const isMainImage = !Object.values(imageTypes)
        .flat()
        .some(keyword => src.includes(keyword))
      
      if (isMainImage) {
        uniqueUrls.add(src)
        uniqueImages.push(image)
        break // Only need one main image
      }
    }
  }

  // Second pass: Add one of each type of supplementary image
  for (const image of images) {
    const src = image.src.toLowerCase()
    if (!uniqueUrls.has(src)) {
      // Check each image type
      for (const [type, keywords] of Object.entries(imageTypes)) {
        if (keywords.some(keyword => src.includes(keyword))) {
          uniqueUrls.add(src)
          uniqueImages.push(image)
          break // Move to next image after finding a match
        }
      }
    }
  }

  // If we don't have enough images, add any remaining unique ones
  for (const image of images) {
    const src = image.src.toLowerCase()
    if (!uniqueUrls.has(src) && uniqueImages.length < 4) {
      uniqueUrls.add(src)
      uniqueImages.push(image)
    }
  }

  // Ensure we always return exactly 4 images
  while (uniqueImages.length < 4 && uniqueImages.length > 0) {
    uniqueImages.push(uniqueImages[0]) // Duplicate the first image if needed
  }

  return uniqueImages
}

export default function ProductDetails({ product }: ProductDetailsProps) {
  const router = useRouter()
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [selectedSize, setSelectedSize] = useState(SIZES[0])
  const uniqueImages = organizeImages(product.images)

  return (
    <div className="container mx-auto px-4 py-8">
      <button
        onClick={() => router.back()}
        className="mb-8 flex items-center gap-2 text-sm text-white/60 hover:text-white group"
      >
        <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
        Back to products
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Image Gallery */}
        <div className="space-y-4">
          <div className="aspect-square relative overflow-hidden rounded-lg bg-gradient-to-br from-white to-gray-100">
            <Image
              src={uniqueImages[currentImageIndex]?.src || ''}
              alt={product.title}
              fill
              className="object-contain p-4"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          </div>

          {/* Thumbnail Grid */}
          <div className="grid grid-cols-4 gap-4">
            {uniqueImages.map((image, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`relative aspect-square overflow-hidden rounded-lg border transition-all ${
                  currentImageIndex === index 
                    ? 'border-blue-500 ring-2 ring-blue-500/20' 
                    : 'border-white/10 hover:border-white/20'
                }`}
              >
                <Image
                  src={image.src}
                  alt={`${product.title} - View ${index + 1}`}
                  fill
                  className="object-contain p-2"
                  sizes="25vw"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-8">
          {/* Title and Price */}
          <div>
            <h1 className="text-3xl font-bold mb-4">{product.title}</h1>
            <div className="flex items-baseline gap-2">
              <p className="text-3xl font-bold text-blue-400">
                ${selectedSize.price.toFixed(2)}
              </p>
              <span className="text-lg text-white/60">Excl. Tax</span>
            </div>
          </div>

          {/* Description */}
          <div className="prose prose-invert max-w-none">
            <p className="text-lg text-white/80">
              {product.description}
            </p>
          </div>

          {/* Product Features */}
          <div>
            <h3 className="text-lg font-medium mb-4">Product features</h3>
            <ul className="space-y-2 text-white/80">
              <li className="flex items-start gap-2">
                <span className="text-blue-400">•</span>
                Archival museum grade paper
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400">•</span>
                Versatile hanging options
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400">•</span>
                Bright and intense colors
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400">•</span>
                For indoor use only
              </li>
            </ul>
          </div>

          {/* Care Instructions */}
          <div>
            <h3 className="text-lg font-medium mb-4">Care instructions</h3>
            <p className="text-white/80">
              If the print does gather any dust, you may wipe it off gently with a clean, dry cloth.
            </p>
          </div>

          {/* Available Options */}
          <div>
            <h3 className="text-lg font-medium mb-4">Available Options</h3>
            <div className="grid grid-cols-2 gap-4">
              {SIZES.map((size) => (
                <button
                  key={size.size}
                  onClick={() => setSelectedSize(size)}
                  className={`rounded-lg border px-4 py-3 text-left transition-all ${
                    selectedSize.size === size.size
                      ? 'border-blue-500 bg-blue-500/10 ring-2 ring-blue-500/20'
                      : 'border-white/10 hover:border-white/20 hover:bg-white/5'
                  }`}
                >
                  <div className="text-sm font-medium">{size.size} / Matte</div>
                  <div className="text-white/60">${size.price.toFixed(2)}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Add to Cart */}
          <AddToCartButton 
            product={product}
            variant={{
              id: selectedSize.size,
              price: selectedSize.price
            }}
          />
        </div>
      </div>
    </div>
  )
} 