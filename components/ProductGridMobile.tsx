'use client'

import React from "react"
import { motion } from "framer-motion"
import { PrintifyProduct } from "../app/api/printify/client"
import { ProductGridSkeleton } from "./ui/product-skeleton"
import { useInView } from "react-intersection-observer"
import MobileProductCard from "./mobile/MobileProductCard"

interface ProductGridMobileProps {
  products: PrintifyProduct[] | null
  isLoading?: boolean
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05
    }
  }
}

const productVariants = {
  hidden: { 
    opacity: 0,
    y: 10
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 25
    }
  }
}

export default function ProductGridMobile({ products, isLoading = false }: ProductGridMobileProps) {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: false
  })

  if (isLoading) {
    return (
      <div className="container mx-auto px-4">
        <ProductGridSkeleton />
      </div>
    )
  }

  if (!products || products.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="container mx-auto flex min-h-[200px] items-center justify-center p-4"
      >
        <p className="text-base text-white/60">No products found</p>
      </motion.div>
    )
  }

  return (
    <div className="w-full pb-24 pt-4 md:pb-16">
      <div className="container mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 gap-4 px-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
        >
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              variants={productVariants}
              className="relative h-full"
              ref={index === products.length - 1 ? ref : undefined}
            >
              <MobileProductCard 
                product={product} 
                priority={index < 4}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  )
} 