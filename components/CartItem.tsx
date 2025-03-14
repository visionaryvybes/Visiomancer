'use client'

import React, { useState } from "react"
import Image from "next/image"
import { Minus, Plus, Trash2 } from "lucide-react"
import { useCart } from "../context/CartContext"

interface CartItemProps {
  id: string
  title: string
  price: number
  image: string
  quantity: number
  variantId: string
  variantTitle: string
}

// Base64 encoded placeholder image (1x1 pixel transparent PNG)
const PLACEHOLDER_IMAGE = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="

export default function CartItem({
  id,
  title,
  price,
  image,
  quantity,
  variantId,
  variantTitle
}: CartItemProps) {
  const { updateQuantity, removeFromCart } = useCart()
  const [imageError, setImageError] = useState(false)
  const [imageLoading, setImageLoading] = useState(true)

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity < 1) return
    updateQuantity(id, variantId, newQuantity)
  }

  const handleRemove = () => {
    removeFromCart(id, variantId)
  }

  const getImageUrl = () => {
    if (imageError || !image) {
      return PLACEHOLDER_IMAGE
    }
    
    try {
      let url = image
      // Convert http to https
      url = url.replace('http://', 'https://')
      
      // Handle different Printify image URL formats
      if (url.includes('printify.com')) {
        // Ensure we're using the CDN URL
        url = url.replace('images.printify.com', 'cdn.printify.com')
        url = url.replace('images-api.printify.com', 'cdn.printify.com')
      }
      
      return url
    } catch (error) {
      console.error('Error processing image URL:', error)
      return PLACEHOLDER_IMAGE
    }
  }

  return (
    <div className="flex gap-4 rounded-lg border bg-card p-4">
      <div className="relative aspect-square h-24 w-24 flex-shrink-0 overflow-hidden rounded-md">
        <div className={`absolute inset-0 bg-gray-900/20 backdrop-blur-sm transition-opacity duration-300 ${imageLoading ? 'opacity-100' : 'opacity-0'}`} />
        <Image
          src={getImageUrl()}
          alt={title}
          fill
          className={`object-cover transition-all duration-300 ${
            imageLoading ? 'scale-105 blur-sm' : 'scale-100 blur-0'
          }`}
          onError={() => setImageError(true)}
          onLoad={() => setImageLoading(false)}
          sizes="96px"
          unoptimized={true}
        />
      </div>

      <div className="flex flex-1 flex-col">
        <div className="flex justify-between">
          <div>
            <h3 className="font-medium">{title}</h3>
            <p className="text-sm text-muted-foreground">{variantTitle}</p>
          </div>
          <button
            onClick={handleRemove}
            className="text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleQuantityChange(quantity - 1)}
              className="rounded-md border p-1 hover:bg-accent"
              disabled={quantity <= 1}
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="w-8 text-center">{quantity}</span>
            <button
              onClick={() => handleQuantityChange(quantity + 1)}
              className="rounded-md border p-1 hover:bg-accent"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
          <p className="font-medium">${(price * quantity).toFixed(2)}</p>
        </div>
      </div>
    </div>
  )
} 