import React from "react"
import { Hero } from "../components/Hero"
import { FeaturedProducts } from "../components/FeaturedProducts"
import { Categories } from "../components/Categories"
import { PrintifyClient } from "./api/printify/client"

interface Product {
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
}

export default async function Home() {
  const client = new PrintifyClient()
  let products: Product[] = []
  
  try {
    const response = await client.getProducts()
    products = response.data.map(product => ({
      id: product.id,
      title: product.title,
      description: product.description || '',
      images: product.images,
      variants: product.variants.map(variant => ({
        id: variant.id,
        title: variant.title || '',
        price: variant.price,
        is_enabled: true,
        options: variant.options || {}
      }))
    }))
  } catch (error) {
    console.error('Failed to fetch products:', error)
  }
  
  return (
    <main>
      <Hero />
      <Categories />
      <FeaturedProducts products={products} />
    </main>
  )
} 