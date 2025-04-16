export type ProductSource = 'gumroad'

export interface ProductVariant {
  id: string | number // Keep flexible as Gumroad might use strings or numbers
  name: string // e.g., "Size", "Color"
  options: string[] // e.g., ["S", "M", "L"] or ["Red", "Blue"]
  // Potentially add price differences per option if needed
}

export interface ProductImage {
  url: string
  altText?: string
}

// Add a type for storing price per specific variant combination
// Note: This might become less relevant if Gumroad variants are simpler
export interface ProductVariantDetail {
  optionKey: string // e.g., "Black_L" or "A1"
  price: number
  variantId?: number | string // Adjusted to be optional and allow string
}

export interface ProductRating {
  value: number;
  count: number;
}

// Unified Product Interface
export interface Product {
  id: string // Unique ID (prefixed with 'gumroad-')
  source: ProductSource
  name: string
  slug?: string
  description: string
  price: number // Base price
  maxPrice?: number // Optional max price (less likely needed for Gumroad basic)
  salePrice?: number
  images: ProductImage[]
  variants?: ProductVariant[]
  variantDetails?: ProductVariantDetail[] // Keep for now, might be simplified later
  tags?: string[]
  rating?: ProductRating
  isNew?: boolean
  isBestSeller?: boolean
  isSale?: boolean
  colors?: string[]
  sizes?: string[]
  material?: string

  // Source-specific fields
  gumroadUrl?: string

  variantImageMap?: Record<string, string> // Keep for now, useful if variants have images
}

// Interface for Cart Item, including source and selected variant
// Note: Keeping this separate from Product for clarity in cart logic
export interface CartItem {
  product: Product;
  quantity: number;
  selectedVariantId?: string | number; // Keep flexible
  selectedOptions?: Record<string, string>;
}

// Keeping ProductVariantOption separate as it was in the original index.ts
// and might be used elsewhere. If not, it can be removed later.
export interface ProductVariantOption {
  name: string;
  values: string[];
} 