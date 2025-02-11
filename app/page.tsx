import React from "react"
import { WarpBackground } from "../components/ui/warp-background"
import ProductGrid from "../components/ProductGrid"
import { PrintifyClient } from "./api/printify/client"

export default async function Home() {
  const token = process.env.PRINTIFY_API_TOKEN
  if (!token) {
    console.error('Printify API token not configured')
    return (
      <div className="min-h-screen w-full">
        <WarpBackground>
          <div className="container mx-auto px-4 py-8">
            <div className="text-center text-red-500">Error: API token not configured</div>
          </div>
        </WarpBackground>
      </div>
    )
  }

  const client = new PrintifyClient(token)
  
  try {
    console.log('Fetching products...')
    const response = await client.getProducts()
    console.log('Products found:', response.data.length)
    
    const products = response.data.map(product => ({
      id: product.id,
      title: product.title,
      description: product.description,
      images: product.images,
      variants: product.variants.map(variant => ({
        id: variant.id,
        title: variant.title,
        price: variant.price,
        is_enabled: true,
        options: variant.options || {}
      })),
      options: product.options || [],
      category: 'All'
    }))

    if (products.length === 0) {
      return (
        <div className="min-h-screen w-full">
          <WarpBackground>
            <div className="container mx-auto px-4 py-8">
              <div className="text-center">No products available</div>
            </div>
          </WarpBackground>
        </div>
      )
    }

    return (
      <div className="min-h-screen bg-[#1e1e6f]">
        <div className="container mx-auto px-4 py-16">
          <ProductGrid products={products} />
        </div>
      </div>
    )
  } catch (error) {
    console.error('Failed to fetch products:', error)
    return (
      <div className="min-h-screen w-full">
        <WarpBackground>
          <div className="container mx-auto px-4 py-8">
            <div className="text-center text-red-500">Error loading products</div>
          </div>
        </WarpBackground>
      </div>
    )
  }
} 