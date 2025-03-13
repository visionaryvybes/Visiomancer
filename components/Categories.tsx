'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

const categories = [
  {
    id: 'posters',
    title: 'Posters',
    description: 'High-quality art prints for your walls',
    color: 'from-blue-500 to-purple-500',
    href: '/products?category=posters'
  },
  {
    id: 'apparel',
    title: 'Apparel',
    description: 'Unique designs on comfortable clothing',
    color: 'from-purple-500 to-pink-500',
    href: '/products?category=apparel'
  },
  {
    id: 'accessories',
    title: 'Accessories',
    description: 'Complete your style with our accessories',
    color: 'from-pink-500 to-red-500',
    href: '/products?category=accessories'
  }
]

export function Categories() {
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
            Browse Categories
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-white/70"
          >
            Explore our collections across different categories
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Link href={category.href}>
                <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${category.color} p-6 h-full hover:scale-[1.02] transition-transform duration-300`}>
                  <div className="relative z-10">
                    <h3 className="text-2xl font-bold text-white mb-2">{category.title}</h3>
                    <p className="text-white/80 mb-4">{category.description}</p>
                    <div className="inline-flex items-center text-white hover:translate-x-1 transition-transform">
                      Explore <ArrowRight className="ml-2 h-4 w-4" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
} 