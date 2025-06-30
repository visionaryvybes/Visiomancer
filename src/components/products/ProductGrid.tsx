import { Product } from '@/types'
import ProductCard from './ProductCard'

interface ProductGridProps {
  products: Product[]
}

export default function ProductGrid({ products }: ProductGridProps) {
  if (!products || products.length === 0) {
    return <p className="text-center text-gray-500 dark:text-gray-400">No products found.</p>
  }

  // Filter out any invalid products
  const validProducts = products.filter(product => product && product.id);

  if (validProducts.length === 0) {
    return <p className="text-center text-gray-500 dark:text-gray-400">No valid products found.</p>
  }

  const priorityCount = 4; // Number of initial cards to prioritize

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {validProducts.map((product) => (
        <ProductCard 
          key={product.id} 
          product={product}
        />
      ))}
    </div>
  )
} 