'use client'

import React, { useState } from "react"
import Image from "next/image"
import { WarpBackground } from "../../../components/ui/warp-background"
import AddToCartButton from "../../../components/AddToCartButton"

interface ProductPageProps {
  params: {
    id: string
  }
}

export default function ProductPage({ params }: ProductPageProps) {
  const [quantity, setQuantity] = useState(1)

  // In a real app, fetch product data based on params.id
  const product = {
    id: parseInt(params.id),
    title: "Minimalist Watch",
    description: "Elegant timepiece with a clean design. Features a premium leather strap, scratch-resistant sapphire crystal, and Japanese quartz movement.",
    price: 199.99,
    image: `https://picsum.photos/seed/watch${params.id}/800/600`,
    specs: [
      "Premium leather strap",
      "Sapphire crystal glass",
      "Water-resistant up to 30m",
      "Japanese quartz movement",
      "1-year warranty"
    ]
  }

  const handleAddToCart = () => {
    // TODO: Implement cart functionality
    console.log('Adding to cart:', { ...product, quantity })
  }

  return (
    <div className="min-h-screen">
      <WarpBackground>
        <div className="py-8">
          <div className="mx-auto max-w-6xl px-4">
            <div className="grid gap-8 md:grid-cols-2">
              {/* Image Section */}
              <div className="relative aspect-square overflow-hidden rounded-lg">
                <Image
                  src={product.image}
                  alt={product.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>

              {/* Product Details */}
              <div className="flex flex-col">
                <h1 className="mb-4 text-3xl font-bold">{product.title}</h1>
                <p className="mb-6 text-xl font-bold">${product.price.toFixed(2)}</p>
                <p className="mb-6 text-muted-foreground">{product.description}</p>

                {/* Specifications */}
                <div className="mb-6">
                  <h2 className="mb-3 text-xl font-semibold">Specifications</h2>
                  <ul className="list-inside list-disc space-y-2">
                    {product.specs.map((spec, index) => (
                      <li key={index} className="text-muted-foreground">{spec}</li>
                    ))}
                  </ul>
                </div>

                {/* Add to Cart Section */}
                <div className="mt-auto space-y-4">
                  <div className="flex items-center gap-4">
                    <label htmlFor="quantity" className="font-medium">
                      Quantity:
                    </label>
                    <select
                      id="quantity"
                      className="rounded-lg border bg-background px-4 py-2"
                      value={quantity}
                      onChange={(e) => setQuantity(Number(e.target.value))}
                    >
                      {[1, 2, 3, 4, 5].map((num) => (
                        <option key={num} value={num}>
                          {num}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="w-full">
                    <AddToCartButton onClick={handleAddToCart} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </WarpBackground>
    </div>
  )
} 