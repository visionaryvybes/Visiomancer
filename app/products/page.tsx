import React from "react"
import ProductGrid from "../../components/ProductGrid"
import { WarpBackground } from "../../components/ui/warp-background"

export default function ProductsPage() {
  return (
    <div className="min-h-screen">
      <WarpBackground>
        <div className="py-8">
          <h1 className="mb-8 text-center text-4xl font-bold">Our Products</h1>
          
          {/* Filters and Sort Section */}
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap gap-4">
              <select className="rounded-lg border bg-background px-4 py-2">
                <option value="">All Categories</option>
                <option value="watches">Watches</option>
                <option value="accessories">Accessories</option>
                <option value="electronics">Electronics</option>
              </select>
              
              <select className="rounded-lg border bg-background px-4 py-2">
                <option value="">Price Range</option>
                <option value="0-50">$0 - $50</option>
                <option value="50-100">$50 - $100</option>
                <option value="100+">$100+</option>
              </select>
            </div>
            
            <select className="rounded-lg border bg-background px-4 py-2">
              <option value="newest">Newest First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
          
          <ProductGrid />
        </div>
      </WarpBackground>
    </div>
  )
} 