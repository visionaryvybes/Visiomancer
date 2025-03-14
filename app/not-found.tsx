import Link from 'next/link'
import { WarpBackground } from '@/components/ui/warp-background'

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <h1 className="text-4xl font-bold">404</h1>
      <p className="mt-4 text-xl">Page not found</p>
      <a href="/" className="mt-8 text-blue-500 hover:text-blue-700">
        Return Home
      </a>
    </div>
  )
} 