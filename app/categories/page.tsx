'use client'

import React from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { 
  Shirt, 
  Backpack,
  ShoppingBag, 
  Palette, 
  Laptop, 
  Home, 
  Coffee,
  ChevronRight,
  Sparkles
} from "lucide-react"

const categories = [
  {
    name: "T-Shirts",
    icon: Shirt,
    description: "Premium quality graphic t-shirts",
    itemCount: "24+ Items",
    color: "from-blue-500 to-indigo-500"
  },
  {
    name: "Hoodies",
    icon: Backpack,
    description: "Comfortable & stylish hoodies",
    itemCount: "12+ Items",
    color: "from-purple-500 to-pink-500"
  },
  {
    name: "Accessories",
    icon: ShoppingBag,
    description: "Trendy accessories & more",
    itemCount: "18+ Items",
    color: "from-amber-500 to-red-500"
  },
  {
    name: "Art Prints",
    icon: Palette,
    description: "Beautiful wall art & prints",
    itemCount: "30+ Items",
    color: "from-emerald-500 to-teal-500"
  },
  {
    name: "Tech",
    icon: Laptop,
    description: "Phone cases & laptop sleeves",
    itemCount: "15+ Items",
    color: "from-cyan-500 to-blue-500"
  },
  {
    name: "Home Decor",
    icon: Home,
    description: "Stylish home accessories",
    itemCount: "20+ Items",
    color: "from-rose-500 to-pink-500"
  },
  {
    name: "Mugs",
    icon: Coffee,
    description: "Designer coffee mugs",
    itemCount: "10+ Items",
    color: "from-violet-500 to-purple-500"
  }
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const itemVariants = {
  hidden: { 
    opacity: 0,
    y: 20
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

export default function CategoriesPage() {
  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-black to-black/80 pb-24 pt-4">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mb-2 flex items-center justify-center gap-2">
            <Sparkles className="h-6 w-6 text-blue-400" />
            <h1 className="text-3xl font-bold text-white">Categories</h1>
          </div>
          <p className="text-base text-white/60">
            Explore our curated collection of products
          </p>
        </div>

        {/* Categories Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {categories.map((category) => {
            const Icon = category.icon
            return (
              <motion.div
                key={category.name}
                variants={itemVariants}
              >
                <Link
                  href={`/products?category=${category.name.toLowerCase()}`}
                  className="group block h-full"
                >
                  <div className={`relative overflow-hidden rounded-xl bg-gradient-to-br ${category.color} p-6 shadow-lg transition-transform duration-300 hover:scale-[1.02]`}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="mb-4 inline-flex rounded-full bg-white/10 p-3 backdrop-blur-sm">
                          <Icon className="h-6 w-6 text-white" />
                        </div>
                        <h3 className="mb-1 text-xl font-semibold text-white">
                          {category.name}
                        </h3>
                        <p className="mb-2 text-sm text-white/80">
                          {category.description}
                        </p>
                        <p className="text-sm font-medium text-white/60">
                          {category.itemCount}
                        </p>
                      </div>
                      
                      <div className="ml-4 mt-1 rounded-full bg-white/10 p-2 transition-colors group-hover:bg-white/20">
                        <ChevronRight className="h-5 w-5 text-white" />
                      </div>
                    </div>

                    {/* Decorative Elements */}
                    <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/10 blur-2xl" />
                    <div className="absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-white/5 blur-2xl" />
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </div>
  )
} 