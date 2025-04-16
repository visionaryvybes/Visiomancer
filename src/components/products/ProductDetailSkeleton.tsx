import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

export default function ProductDetailSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl animate-pulse">
      {/* Breadcrumbs Skeleton */}
      <div className="mb-6 flex space-x-2">
        <div className="h-4 w-10 bg-gray-700 rounded"></div>
        <div className="h-4 w-4 bg-gray-700 rounded"></div>
        <div className="h-4 w-20 bg-gray-700 rounded"></div>
        <div className="h-4 w-4 bg-gray-700 rounded"></div>
        <div className="h-4 w-32 bg-gray-700 rounded"></div>
      </div>

      {/* Main Content Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-12 mb-10">
        {/* Image Gallery Skeleton */}
        <div className="space-y-4">
          {/* Main Image Skeleton */}
          <div className="aspect-square bg-gray-800 rounded-xl"></div>
          
          {/* Thumbnail Grid Skeleton */}
          <div className="grid grid-cols-5 gap-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="aspect-square bg-gray-700 rounded-md"></div>
            ))}
          </div>
        </div>

        {/* Product Info Skeleton */}
        <div className="flex flex-col">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-6 w-24 bg-gray-700 rounded"></div>
            <div className="h-4 w-32 bg-gray-700 rounded"></div>
          </div>
          
          {/* Title Skeleton */}
          <div className="h-8 w-3/4 bg-gray-700 rounded mb-4"></div>
          
          {/* Price Skeleton */}
          <div className="flex items-baseline gap-3 mb-6">
            <div className="h-8 w-24 bg-gray-700 rounded"></div>
            <div className="h-6 w-16 bg-gray-700 rounded"></div>
          </div>
          
          {/* Description Skeleton */}
          <div className="space-y-2 mb-8">
            <div className="h-4 w-full bg-gray-700 rounded"></div>
            <div className="h-4 w-5/6 bg-gray-700 rounded"></div>
            <div className="h-4 w-4/6 bg-gray-700 rounded"></div>
          </div>
          
          {/* Options Skeleton */}
          <div className="mb-8 space-y-6 bg-gray-800/50 p-5 rounded-xl border border-gray-700">
            <div className="space-y-3">
              <div className="h-5 w-20 bg-gray-700 rounded"></div>
              <div className="grid grid-cols-3 gap-2">
                <div className="h-10 bg-gray-700 rounded"></div>
                <div className="h-10 bg-gray-700 rounded"></div>
                <div className="h-10 bg-gray-700 rounded"></div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="h-10 w-32 bg-gray-700 rounded"></div>
              <div className="h-10 flex-1 bg-gray-700 rounded"></div>
            </div>
          </div>
          
          {/* Features Skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-700 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs Skeleton */}
      <div className="border-t border-gray-700 pt-10 pb-16">
        <div className="mb-8 border-b border-gray-700">
          <div className="flex flex-wrap -mb-px">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-10 w-24 bg-gray-700 rounded-t-lg mr-2"></div>
            ))}
          </div>
        </div>
        
        {/* Tab Content Skeleton */}
        <div className="space-y-4">
          <div className="h-6 w-48 bg-gray-700 rounded mb-6"></div>
          <div className="h-4 w-full bg-gray-700 rounded"></div>
          <div className="h-4 w-5/6 bg-gray-700 rounded"></div>
          <div className="h-4 w-4/6 bg-gray-700 rounded"></div>
          <div className="h-4 w-full bg-gray-700 rounded"></div>
          <div className="h-4 w-3/4 bg-gray-700 rounded"></div>
        </div>
      </div>
      
      {/* Related Products Skeleton */}
      <div className="border-t border-gray-700 pt-10">
        <div className="h-6 w-48 bg-gray-700 rounded mb-8"></div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-gray-800/50 rounded-xl overflow-hidden">
              <div className="aspect-square bg-gray-700"></div>
              <div className="p-4 space-y-2">
                <div className="h-5 w-3/4 bg-gray-700 rounded"></div>
                <div className="h-4 w-5/6 bg-gray-700 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 