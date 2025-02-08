'use client'

import React, { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { WarpBackground } from "../../components/ui/warp-background"
import { Loader2 } from "lucide-react"

interface Category {
  id: string
  name: string
  productCount: number
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await fetch('/api/printify/categories')
        const data = await response.json()

        if (data.error) {
          throw new Error(data.error)
        }

        setCategories(data.data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch categories')
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  if (loading) {
    return (
      <WarpBackground>
        <div className="flex min-h-[50vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </WarpBackground>
    )
  }

  if (error) {
    return (
      <WarpBackground>
        <div className="mx-auto max-w-2xl px-4 py-16 text-center">
          <div className="rounded-lg border border-red-500/10 bg-red-500/5 p-4 text-red-500">
            {error}
          </div>
          <Link
            href="/"
            className="mt-4 inline-block rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground hover:bg-primary/90"
          >
            Return to Home
          </Link>
        </div>
      </WarpBackground>
    )
  }

  return (
    <div className="min-h-screen">
      <WarpBackground>
        <div className="py-8">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="mb-4 text-4xl font-bold">Shop by Category</h1>
              <p className="mb-8 text-lg text-muted-foreground">
                Explore our collections and find what you love
              </p>
            </div>

            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {categories.map((category) => (
                <Link 
                  key={category.id}
                  href={`/categories/${category.id}`}
                  className="group block"
                >
                  <div className="overflow-hidden rounded-lg border bg-card shadow-sm transition-all hover:shadow-md">
                    <div className="relative aspect-[4/3]">
                      <Image
                        src={`https://picsum.photos/seed/${category.id}/800/600`}
                        alt={category.name}
                        fill
                        className="object-cover transition-transform group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/20" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <h2 className="text-2xl font-bold text-white">{category.name}</h2>
                          <span className="mt-4 inline-block rounded-full bg-white/20 px-4 py-2 text-sm text-white">
                            {category.productCount} Products
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Featured Collections */}
            <div className="mt-16">
              <h2 className="mb-8 text-center text-3xl font-bold">Featured Collections</h2>
              <div className="grid gap-8 md:grid-cols-2">
                <Link href="/collections/new-arrivals" className="group block">
                  <div className="relative aspect-[2/1] overflow-hidden rounded-lg">
                    <Image
                      src="https://picsum.photos/seed/new-arrivals/800/400"
                      alt="New Arrivals"
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-0 left-0 p-6">
                      <h3 className="text-2xl font-bold text-white">New Arrivals</h3>
                      <p className="mt-2 text-white/90">Check out our latest products</p>
                    </div>
                  </div>
                </Link>

                <Link href="/collections/best-sellers" className="group block">
                  <div className="relative aspect-[2/1] overflow-hidden rounded-lg">
                    <Image
                      src="https://picsum.photos/seed/best-sellers/800/400"
                      alt="Best Sellers"
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-0 left-0 p-6">
                      <h3 className="text-2xl font-bold text-white">Best Sellers</h3>
                      <p className="mt-2 text-white/90">Our most popular items</p>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </WarpBackground>
    </div>
  )
} 