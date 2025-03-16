'use client'

import { cn } from "@/lib/utils"
import Link from "next/link"
import { useSearchParams } from "next/navigation"

interface Category {
  id: string
  title: string
  description: string
  icon: string
  bgColor: string
  keywords: string[]
  count: number
  featured: boolean
}

interface MobileCategoryPillsProps {
  categories: Category[]
}

export default function MobileCategoryPills({ categories }: MobileCategoryPillsProps) {
  const searchParams = useSearchParams()
  const currentCategory = searchParams.get("category")

  return (
    <div className="no-scrollbar flex w-full gap-2 overflow-x-auto px-4 pb-2">
      <Link
        href="/products"
        className={cn(
          "flex-none rounded-full px-6 py-2 text-sm font-medium transition-colors",
          "hover:bg-blue-500 hover:text-white",
          !currentCategory 
            ? "bg-blue-500 text-white" 
            : "bg-white/10 text-white/60 backdrop-blur-sm"
        )}
      >
        All
      </Link>
      {categories.map((category) => (
        <Link
          key={category.id}
          href={`/products?category=${category.id}`}
          className={cn(
            "flex-none rounded-full px-6 py-2 text-sm font-medium transition-colors",
            "hover:bg-blue-500 hover:text-white",
            currentCategory === category.id
              ? "bg-blue-500 text-white" 
              : "bg-white/10 text-white/60 backdrop-blur-sm"
          )}
        >
          {category.title}
        </Link>
      ))}
    </div>
  )
} 