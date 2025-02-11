import React from 'react'
import Link from 'next/link'
import Image from 'next/image'

interface Product {
  id: string
  title: string
  images: Array<{ src: string }>
  variants: Array<{
    id: string
    price: number
    title: string
    is_enabled: boolean
    options: Record<string, string>
  }>
}

interface RelatedProductsProps {
  products: Product[]
}

export default function RelatedProducts({ products }: RelatedProductsProps) {
  if (products.length === 0) return null

  return (
    <div className="mt-16">
      <h2 className="text-2xl font-bold mb-8">Related Products</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {products.map((product) => (
          <Link
            key={product.id}
            href={`/products/${product.id}`}
            className="group block overflow-hidden rounded-lg bg-white"
          >
            <div className="relative aspect-square bg-white">
              <Image
                src={product.images[0]?.src || '/placeholder.jpg'}
                alt={product.title}
                fill
                className="object-contain p-4"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
            </div>
            <div className="bg-black p-4">
              <h3 className="text-sm font-medium text-white line-clamp-2 mb-2">
                {product.title}
              </h3>
              <p className="text-lg font-bold text-white">
                ${product.variants[0]?.price.toFixed(2)} <span className="text-sm text-white/60">CAD</span>
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
} 