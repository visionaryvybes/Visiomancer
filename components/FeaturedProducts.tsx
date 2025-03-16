'use client'

import React from 'react'
import { PrintifyProduct } from '../app/api/printify/client'
import { QuickView } from './ui/quick-view'
import MobileProductCard from './mobile/MobileProductCard'

interface FeaturedProductsProps {
  products: PrintifyProduct[]
}

export function FeaturedProducts({ products }: FeaturedProductsProps) {
  const [selectedProduct, setSelectedProduct] = React.useState<PrintifyProduct | null>(null)

  // Filter out products without images or valid variants
  const validProducts = React.useMemo(() => {
    return products.filter(product => 
      product.images?.length > 0 && 
      product.variants?.some(v => v.is_enabled && v.price > 0)
    )
  }, [products])

  return (
    <section className="w-full bg-gradient-to-b from-black to-black/80 py-12">
      <div className="container mx-auto">
        <h2 className="mb-8 px-4 text-2xl font-bold text-white sm:text-3xl">
          Featured Products
        </h2>
        <div className="grid grid-cols-2 gap-4 px-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {validProducts.slice(0, 8).map((product, index) => (
            <div key={product.id} className="h-full">
              <MobileProductCard
                product={product}
                priority={index < 4}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Quick View Modal */}
      <QuickView
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
        product={selectedProduct!}
      />
    </section>
  )
}