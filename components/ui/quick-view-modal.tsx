'use client'

import React from 'react'
import Image from 'next/image'
import { X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import ProductVariantSelector from '../ProductVariantSelector'
import AddToCartButton from '../AddToCartButton'

interface QuickViewModalProps {
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
  isOpen: boolean
  onClose: () => void
}

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: {
      duration: 0.2
    }
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.2,
      when: "afterChildren"
    }
  }
}

const modalVariants = {
  hidden: { 
    opacity: 0,
    scale: 0.95,
    y: 20
  },
  visible: { 
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30,
      when: "beforeChildren",
      staggerChildren: 0.1
    }
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 20,
    transition: {
      duration: 0.2
    }
  }
}

const contentVariants = {
  hidden: { opacity: 0, y: 20 },
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

export function QuickViewModal({ product, isOpen, onClose }: QuickViewModalProps) {
  const [selectedVariantId, setSelectedVariantId] = React.useState(
    product.variants[0]?.id || ''
  )

  const selectedVariant = product.variants.find(v => v.id === selectedVariantId)

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          className="fixed inset-0 z-50 flex items-center justify-center"
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={overlayVariants}
        >
          <motion.div
            className="absolute inset-0 bg-black/50"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          <motion.div
            className="relative bg-background rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto"
            variants={modalVariants}
          >
            <motion.button
              onClick={onClose}
              className="absolute right-4 top-4 text-foreground/60 hover:text-foreground transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <X size={24} />
              <span className="sr-only">Close quick view</span>
            </motion.button>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
              <motion.div 
                className="relative aspect-square"
                variants={contentVariants}
              >
                <motion.div
                  initial={{ opacity: 0, scale: 1.1 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4 }}
                >
                  <Image
                    src={product.images[0]?.src || ''}
                    alt={product.title}
                    fill
                    className="object-cover rounded-lg"
                  />
                </motion.div>
              </motion.div>
              
              <motion.div variants={contentVariants}>
                <motion.h2 
                  className="text-2xl font-bold mb-2"
                  variants={contentVariants}
                >
                  {product.title}
                </motion.h2>
                <motion.p 
                  className="text-lg font-semibold mb-4"
                  variants={contentVariants}
                >
                  ${selectedVariant?.price.toFixed(2)}
                </motion.p>
                <motion.div 
                  className="prose prose-sm mb-6"
                  variants={contentVariants}
                >
                  <p>{product.description}</p>
                </motion.div>
                
                <motion.div variants={contentVariants}>
                  <ProductVariantSelector
                    variants={product.variants}
                    selectedVariantId={selectedVariantId}
                    onVariantChange={setSelectedVariantId}
                    optionNames={product.options.map(opt => opt.name)}
                  />
                </motion.div>
                
                <motion.div 
                  className="mt-6"
                  variants={contentVariants}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <AddToCartButton
                    product={product}
                    variantId={selectedVariantId}
                  />
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
} 