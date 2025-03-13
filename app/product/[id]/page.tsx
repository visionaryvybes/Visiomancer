import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { PrintifyClient } from '@/app/api/printify/client'
import ProductContent from '@/components/ProductContent'
import { type PrintifyImage } from '@/types'

interface ProductPageProps {
  params: {
    id: string
  }
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const client = new PrintifyClient()
  const product = await client.getProduct(params.id)

  if (!product) {
    return {
      title: 'Product Not Found',
      description: 'The requested product could not be found.',
    }
  }

  return {
    title: `${product.title} | VISIOMANCER`,
    description: product.description,
    openGraph: {
      title: product.title,
      description: product.description,
      images: product.images.map((img: PrintifyImage) => ({
        url: img.src,
        width: 800,
        height: 800,
        alt: product.title,
      })),
    },
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const client = new PrintifyClient()
  const product = await client.getProduct(params.id)

  if (!product) {
    notFound()
  }

  return (
    <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="py-16">
        <ProductContent product={product} />
      </div>
    </main>
  )
} 