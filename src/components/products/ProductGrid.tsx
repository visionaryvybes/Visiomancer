import { Product } from '@/types'
import ProductCard from './ProductCard'

interface ProductGridProps {
  products: Product[]
}

export default function ProductGrid({ products }: ProductGridProps) {
  if (!products || products.length === 0) {
    return <p className="text-center text-gray-500 dark:text-gray-400">No products found.</p>
  }

  const priorityCount = 4; // Number of initial cards to prioritize

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((product, index) => (
        <ProductCard 
          key={product.id} 
          id={product.id}
          title={product.name}
          slug={product.id}
          imageUrl={product.images?.[0]?.url || '/placeholder.jpg'}
          imageAlt={product.name || 'Product image'}
          price={{ min: product.price ?? 0, max: product.maxPrice }}
          salePrice={product.salePrice ? { min: product.salePrice } : undefined}
          vendor={{ 
            name: product.source || 'Unknown', 
            type: product.source ? product.source.toUpperCase() : 'UNKNOWN' 
          }}
          rating={product.rating}
          isNew={product.isNew}
          isSale={product.isSale}
          isBestSeller={product.isBestSeller}
          isDigital={product.source?.toLowerCase() === 'gumroad'}
          colors={product.colors}
          sizes={product.sizes}
        />
      ))}
    </div>
  )
} 