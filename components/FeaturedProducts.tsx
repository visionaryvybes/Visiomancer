'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ShoppingCart, Eye } from 'lucide-react'
import { Card, CardContent } from './ui/card'
import { Button } from './ui/button'
import { formatPrice } from '../lib/utils'
import { PrintifyProduct } from '../app/api/printify/client'
import { useCart } from '../context/CartContext'
import { QuickView } from './ui/quick-view'

interface FeaturedProductsProps {
  products: PrintifyProduct[]
}

export function FeaturedProducts({ products }: FeaturedProductsProps) {
  const [selectedProduct, setSelectedProduct] = React.useState<PrintifyProduct | null>(null)
  const { addToCart } = useCart()

  const handleQuickAdd = (e: React.MouseEvent, product: PrintifyProduct) => {
    e.preventDefault()
    if (product.variants[0]) {
      addToCart({
        id: product.id,
        title: product.title,
        price: product.variants[0].price,
        image: product.images[0]?.src || '',
        variantId: product.variants[0].id
      })
    }
  }

  const handleQuickView = (e: React.MouseEvent, product: PrintifyProduct) => {
    e.preventDefault()
    setSelectedProduct(product)
  }

  return (
    <section className="py-16 bg-[#1e1e6f]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl font-bold text-white mb-4"
          >
            Featured Products
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-white/70"
          >
            Discover our most popular and trending items
          </motion.p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.slice(0, 3).map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="h-full"
            >
              <Card className="h-full">
                <Link href={`/products/${product.id}`}>
                  <div className="relative aspect-square">
                    <Image
                      src={product.images[0]?.src || '/placeholder.jpg'}
                      alt={product.title}
                      fill
                      className="object-cover rounded-t-lg"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-lg text-white mb-2 line-clamp-2">
                      {product.title}
                    </h3>
                    <div className="flex items-center justify-between mt-4">
                      <div className="text-xl font-bold text-white">
                        ${product.variants[0]?.price.toFixed(2)}
                      </div>
                      <span className="text-sm text-white/80 hover:text-white transition-colors">
                        View Details →
                      </span>
                    </div>
                  </CardContent>
                </Link>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href="/products">
            <Button size="lg" className="bg-white text-[#1e1e6f] hover:bg-white/90">
              View All Products
            </Button>
          </Link>
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