'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Card } from './ui/card'
import { useCart } from '../context/CartContext'
import { Eye, ShoppingCart, Heart } from 'lucide-react'
import { Product } from '@/types'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

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
  }
  priority?: boolean
}

// Helper function to format price
const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price);
};

// Helper function for safe logging (only in development)
const safeLog = (message: string, data: any) => {
  if (process.env.NODE_ENV !== 'production') {
    console.log(message, data);
  }
};

function cleanDescription(description: string, productTitle: string): string {
  // Remove the size guide table and any empty paragraphs
  let cleaned = description
    .replace(/<table[\s\S]*?<\/table>/g, '') // Remove size guide tables
    .replace(/<p>&nbsp;<\/p>/g, '') // Remove empty paragraphs
    .replace(/<p>[\s\S]*?<\/p>/g, (match) => {
      // Keep only meaningful paragraphs
      const content = match.replace(/<\/?p>/g, '').trim()
      if (content === '&nbsp;' || content === '' || content === productTitle) {
        return ''
      }
      return content
    })
    
  // Clean up the remaining text
  cleaned = cleaned
    .replace(/&ndash;/g, '-')
    .replace(/&eacute;/g, 'é')
    .replace(/<br\s*\/?>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

  // Get only the main description (before any technical details)
  const mainDescription = cleaned.split(/\.:|\n|<br>/)[0]
  return mainDescription.trim()
}

export default function ProductCard({ product, priority = false }: ProductCardProps) {
  const { addToCart } = useCart()
  const [selectedSize, setSelectedSize] = React.useState('')
  const router = useRouter()
  const [isWishlisted, setIsWishlisted] = React.useState(false)

  // Log the raw product data for debugging (only in development)
  safeLog('ProductCard received product:', {
    id: product?.id,
    title: product?.title,
    hasImages: product?.images?.length > 0,
    hasVariants: product?.variants?.length > 0,
    imageCount: product?.images?.length,
    variantCount: product?.variants?.length
  });

  // Ensure product has all required properties with fallbacks
  const safeProduct = {
    id: product?.id || 'unknown',
    title: product?.title || 'Untitled Product',
    description: product?.description || '',
    images: Array.isArray(product?.images) ? product.images : [],
    variants: Array.isArray(product?.variants) ? product.variants : []
  }

  // Validate that the product has all required data
  const isValidProduct = React.useMemo(() => {
    // Log validation details for debugging (only in development)
    const validationDetails = {
      hasId: !!safeProduct.id,
      hasTitle: !!safeProduct.title,
      hasImages: safeProduct.images.length > 0,
      hasVariants: safeProduct.variants.length > 0,
      hasEnabledVariants: safeProduct.variants.some(v => v.is_enabled && v.price > 0),
      imagesCount: safeProduct.images.length,
      variantsCount: safeProduct.variants.length,
      enabledVariantsCount: safeProduct.variants.filter(v => v.is_enabled && v.price > 0).length
    };

    // More lenient validation - only require ID and title
    if (!validationDetails.hasId || !validationDetails.hasTitle) {
      safeLog('Product validation failed:', {
        productId: safeProduct.id,
        validationDetails
      });
      return false;
    }

    return true;
  }, [safeProduct]);

  // If the product is invalid, don't render anything
  if (!isValidProduct) {
    return null
  }

  const sanitizedTitle = safeProduct.title.replace(/<[^>]*>/g, '').trim()
  
  // Filter out duplicate mockup images, paper type images, and size guide images
  const uniqueImages = React.useMemo(() => {
    const filteredImages = safeProduct.images
      .filter(image => {
        if (!image || !image.src) {
          safeLog('Invalid image found for product:', safeProduct.id);
          return false;
        }
        return true;
      })
      // Only keep images with "front" or "main" in the URL, which are typically the main product images
      .filter(image => 
        image.src.includes('front') || 
        image.src.includes('main') || 
        (!image.src.includes('paper-type') && 
         !image.src.includes('size-guide') && 
         !image.src.includes('sizing-guide') &&
         !image.src.includes('close-up') &&
         !image.src.includes('context'))
      )
      // Remove duplicates
      .filter((image, index, self) => 
        index === self.findIndex((t) => t.src === image.src)
      );

    // Log the filtered images for debugging (only in development)
    safeLog('Filtered images for product:', {
      productId: safeProduct.id,
      originalCount: safeProduct.images.length,
      filteredCount: filteredImages.length,
      firstImageUrl: filteredImages[0]?.src
    });

    if (filteredImages.length === 0) {
      safeLog('No valid images found for product:', {
        productId: safeProduct.id,
        originalImagesCount: safeProduct.images.length
      });
    }

    return filteredImages;
  }, [safeProduct.images, safeProduct.id]);

  // Get unique sizes and sort them by dimensions
  const sizes = React.useMemo(() => {
    // Check if this is a poster product by looking at the title or variants
    const isPosterProduct = 
      safeProduct.title.toLowerCase().includes('poster') || 
      safeProduct.variants.some(v => 
        v.title.toLowerCase().includes('×') || 
        v.title.toLowerCase().includes('x') || 
        v.title.toLowerCase().includes('inch') || 
        v.title.toLowerCase().includes('"')
      );
    
    // Only process sizes for poster products
    if (!isPosterProduct) {
      return [];
    }
    
    const validSizes = safeProduct.variants
      .filter(v => {
        if (!v.is_enabled || !v.price || v.price <= 0) {
          console.warn('Invalid variant found:', {
            productId: safeProduct.id,
            variantId: v.id,
            isEnabled: v.is_enabled,
            price: v.price
          })
          return false
        }
        return true
      })
      .map(v => v.title.replace(/&Prime;/g, '"'))
      .filter(Boolean)
      .filter((value, index, self) => self.indexOf(value) === index)
      .filter(size => size.includes('×') || size.includes('x'))
      .sort((a, b) => {
        const aSize = parseInt(a.split(/[×x]/)[0])
        const bSize = parseInt(b.split(/[×x]/)[0])
        return aSize - bSize
      })

    if (validSizes.length === 0 && isPosterProduct) {
      console.warn('No valid sizes found for poster product:', {
        productId: safeProduct.id,
        variantsCount: safeProduct.variants.length
      })
    }

    return validSizes
  }, [safeProduct.variants, safeProduct.id, safeProduct.title])

  // If we don't have any valid images, use a placeholder
  const hasValidImages = uniqueImages.length > 0
  
  // Get the selected variant based on size
  const selectedVariant = React.useMemo(() => {
    if (!selectedSize) return safeProduct.variants.find(v => v.is_enabled)
    return safeProduct.variants.find(v => 
      v.title.replace(/&Prime;/g, '"') === selectedSize && v.is_enabled
    ) || safeProduct.variants.find(v => v.is_enabled)
  }, [safeProduct.variants, selectedSize])

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault()
    if (selectedVariant) {
      addToCart({
        id: safeProduct.id,
        title: sanitizedTitle,
        price: selectedVariant.price,
        image: hasValidImages ? uniqueImages[0]?.src : '/placeholder.jpg',
        variantId: selectedVariant.id,
        quantity: 1,
        size: selectedSize || undefined
      })
      toast.success(`${sanitizedTitle} added to cart!`)
    }
  }

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault()
    router.push(`/products/${safeProduct.id}`)
  }

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsWishlisted(!isWishlisted)
    if (!isWishlisted) {
      toast.success(`${sanitizedTitle} added to wishlist!`)
    } else {
      toast.success(`${sanitizedTitle} removed from wishlist!`)
    }
  }

  // If this is a size guide or non-product item, skip rendering
  if (safeProduct.title.toLowerCase().includes('size guide') || 
      safeProduct.description.toLowerCase().includes('size guide')) {
    return null
  }

  return (
    <Link href={`/products/${safeProduct.id}`} className="block h-full">
      <Card className="group relative h-full overflow-hidden rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-300">
        {/* Stock Badge */}
        {safeProduct.variants.some(v => v.is_enabled) && (
          <div className="absolute left-4 top-4 z-10">
            <span className="rounded-full bg-emerald-500/90 backdrop-blur-sm px-3 py-1 text-xs font-medium text-white shadow-lg">
              In Stock
            </span>
          </div>
        )}

        {/* Quick Actions - Visible on mobile without hover */}
        <div className="absolute right-2 sm:right-4 top-2 sm:top-4 z-10 flex flex-col gap-2 sm:opacity-0 sm:transform sm:translate-x-4 transition-all duration-300 sm:group-hover:opacity-100 sm:group-hover:translate-x-0">
          <button 
            onClick={handleQuickAdd}
            className="rounded-full bg-blue-500 p-1.5 sm:p-2 hover:bg-blue-600 transition-colors duration-200 text-white shadow-lg"
            title="Add to Cart"
          >
            <ShoppingCart className="h-3 w-3 sm:h-4 sm:w-4" />
          </button>
          <button 
            onClick={handleToggleWishlist}
            className={`rounded-full p-1.5 sm:p-2 transition-colors duration-200 text-white shadow-lg ${
              isWishlisted ? 'bg-pink-600 hover:bg-pink-700' : 'bg-pink-500 hover:bg-pink-600'
            }`}
            title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
          >
            <Heart className={`h-3 w-3 sm:h-4 sm:w-4 ${isWishlisted ? 'fill-white' : ''}`} />
          </button>
          <button 
            onClick={handleQuickView}
            className="rounded-full bg-purple-500 p-1.5 sm:p-2 hover:bg-purple-600 transition-colors duration-200 text-white shadow-lg"
            title="Quick View"
          >
            <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
          </button>
        </div>

        {/* Product Image */}
        <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-white/5 to-transparent">
          <Image
            src={hasValidImages ? uniqueImages[0]?.src : '/placeholder.jpg'}
            alt={sanitizedTitle}
            fill
            priority={priority}
            className="object-contain p-4 transition-transform duration-500 group-hover:scale-110"
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        </div>

        {/* Product Info - Dark overlay at bottom */}
        <div className="absolute bottom-0 left-0 right-0 bg-[#1a1a3a]/95 backdrop-blur-sm p-3 sm:p-4">
          <h3 className="text-sm sm:text-base font-medium text-white mb-1 sm:mb-2 line-clamp-1 group-hover:text-blue-400 transition-colors duration-300">
            {sanitizedTitle}
          </h3>
          
          {/* Price */}
          <div className="text-base sm:text-lg font-semibold text-white">
            ${selectedVariant?.price.toFixed(2)} <span className="text-xs sm:text-sm font-normal text-white/60">Excl. Tax</span>
          </div>
        </div>

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a3a]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </Card>
    </Link>
  )
} 