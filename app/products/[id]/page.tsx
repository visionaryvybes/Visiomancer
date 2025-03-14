import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { PrintifyClient } from '@/app/api/printify/client'
import { type PrintifyImage } from '@/types'
import dynamic from 'next/dynamic'

// Mark this page as dynamic to prevent static generation attempts
export const dynamicParams = true;
export const fetchCache = 'force-no-store';
export const revalidate = 0;

const ProductPageClient = dynamic(() => import('./ProductPageClient'))

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

  console.log('Server-side product data:', {
    variants: product.variants.map((v: {
      title: string;
      options: Record<string, string>;
      price: number;
      is_enabled: boolean;
    }) => ({
      title: v.title,
      options: v.options,
      price: v.price,
      is_enabled: v.is_enabled
    }))
  })

  return <ProductPageClient initialProduct={product} />
} 