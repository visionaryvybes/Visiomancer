import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

const ProductCardSkeleton = () => {
  return (
    <div className="border rounded-lg overflow-hidden shadow-sm">
      <Skeleton height={200} /> {/* Image Placeholder */}
      <div className="p-4">
        <Skeleton height={20} width="80%" className="mb-2" /> {/* Title */}
        <Skeleton height={24} width="40%" /> {/* Price */}
      </div>
    </div>
  )
}

export default ProductCardSkeleton 