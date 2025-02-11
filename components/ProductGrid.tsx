'use client'

import React from "react"
import ProductCard from "./ProductCard"
import { motion } from "framer-motion"
import { Product } from "../types/product"
import { ProductGridSkeleton } from "./ui/product-skeleton"

interface ProductGridProps {
  products: Product[]
  isLoading?: boolean
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const productVariants = {
  hidden: { 
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30
    }
  }
}

export default function ProductGrid({ products, isLoading = false }: ProductGridProps) {
  if (isLoading) {
    return <ProductGridSkeleton />
  }

  if (!products || products.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex min-h-[400px] items-center justify-center"
      >
        <p className="text-lg text-white/60">No products found</p>
      </motion.div>
    )
  }

  return (
    <div className="w-full">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-fr"
      >
        {products.map((product, index) => (
          <motion.div
            key={product.id}
            variants={productVariants}
            className="h-full"
          >
            <ProductCard 
              product={product} 
              priority={index < 4} 
            />
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
} 