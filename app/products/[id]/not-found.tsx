import Link from 'next/link'
import { WarpBackground } from '@/components/ui/warp-background'

export default function NotFound() {
  return (
    <WarpBackground>
      <div className="container mx-auto px-4 py-24 text-center">
        <h2 className="text-4xl font-bold mb-4">Product Not Found</h2>
        <p className="text-lg text-white/70 mb-8">
          Sorry, we couldn't find the product you're looking for.
        </p>
        <Link
          href="/products"
          className="inline-flex items-center justify-center rounded-md bg-blue-600 px-8 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-black"
        >
          Back to Products
        </Link>
      </div>
    </WarpBackground>
  )
} 