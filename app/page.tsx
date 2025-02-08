import React from "react"
import { WarpBackground } from "../components/ui/warp-background"
import ProductGrid from "../components/ProductGrid"

export default function Home() {
  return (
    <main>
      <WarpBackground>
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <ProductGrid />
        </div>
      </WarpBackground>
    </main>
  )
} 