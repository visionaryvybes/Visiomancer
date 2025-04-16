import ProductCardSkeleton from './ProductCardSkeleton'

interface ProductGridSkeletonProps {
  count?: number // Number of skeletons to display
}

const ProductGridSkeleton = ({ count = 8 }: ProductGridSkeletonProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </div>
  )
}

export default ProductGridSkeleton 