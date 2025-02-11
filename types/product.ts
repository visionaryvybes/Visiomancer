export interface Product {
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
  category?: string
  stockLevel?: number
}

export interface SearchResult extends Product {
  // Additional search-specific fields can be added here
}

export interface CartItem {
  id: string
  title: string
  price: number
  quantity: number
  image?: string
  variantId?: string
  variantTitle?: string
}

export interface WishlistItem extends Product {
  addedAt: Date
} 