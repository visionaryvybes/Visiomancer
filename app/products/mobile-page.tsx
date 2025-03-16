'use client'

import React from "react"
import { useSearchParams } from "next/navigation"
import MobileCategoryPills from "@/components/mobile/MobileCategoryPills"
import ProductGridMobile from "@/components/ProductGridMobile"
import { PrintifyProduct } from "../api/printify/client"
import { useProducts } from "@/hooks/useProducts"

// Define categories
const categories = [
  {
    id: "posters",
    title: "Posters",
    description: "High-quality art prints and posters",
    icon: "🖼️",
    bgColor: "bg-gradient-to-br from-blue-600 to-purple-700",
    keywords: ["poster", "print", "art print"],
    count: 3,
    featured: true
  },
  {
    id: "apparel",
    title: "Apparel",
    description: "T-shirts and clothing items",
    icon: "👕",
    bgColor: "bg-gradient-to-br from-green-600 to-teal-700",
    keywords: ["shirt", "t-shirt", "clothing"],
    count: 3,
    featured: true
  },
  {
    id: "accessories",
    title: "Accessories",
    description: "Various accessories",
    icon: "🎒",
    bgColor: "bg-gradient-to-br from-red-600 to-orange-700",
    keywords: ["accessory", "accessories"],
    count: 1,
    featured: true
  },
  {
    id: "home-decor",
    title: "Home Decor",
    description: "Decorative items for your home",
    icon: "🏠",
    bgColor: "bg-gradient-to-br from-amber-600 to-yellow-700",
    keywords: ["home", "decor", "decoration"],
    count: 3,
    featured: false
  }
]

export default function MobileProductsPage() {
  const searchParams = useSearchParams()
  const category = searchParams.get("category")
  const { products, isLoading, error } = useProducts()

  // Filter products by category if one is selected
  const filteredProducts = React.useMemo(() => {
    if (!products) return null
    if (!category) return products

    // Find the category object
    const categoryObj = categories.find(c => c.id === category)
    if (!categoryObj) return products

    // Filter products based on category keywords
    return products.filter((product: PrintifyProduct) => {
      const productTitle = product.title.toLowerCase()
      const productDescription = product.description?.toLowerCase() || ""
      
      // Check if any of the category keywords match
      return categoryObj.keywords.some(keyword => 
        productTitle.includes(keyword.toLowerCase()) ||
        productDescription.includes(keyword.toLowerCase())
      )
    })
  }, [products, category])

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-black to-black/80 px-4">
        <p className="text-center text-white/60">
          Failed to load products. Please try again later.
        </p>
      </div>
    )
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-black to-black/80">
      {/* Header */}
      <div className="container mx-auto px-4 pb-4 pt-6">
        <h1 className="mb-6 text-3xl font-bold text-white">Products</h1>
        <MobileCategoryPills categories={categories} />
      </div>

      {/* Featured Section */}
      <div className="container mx-auto px-4">
        <h2 className="mb-4 text-xl font-semibold text-white">Featured</h2>
      </div>

      {/* Products Grid */}
      <ProductGridMobile 
        products={filteredProducts} 
        isLoading={isLoading} 
      />
    </div>
  )
} 