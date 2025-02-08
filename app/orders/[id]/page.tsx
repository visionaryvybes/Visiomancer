'use client'

import React, { useEffect, useState } from "react"
import { WarpBackground } from "../../../components/ui/warp-background"
import { CheckCircle, Loader2 } from "lucide-react"
import Link from "next/link"

interface OrderPageProps {
  params: {
    id: string
  }
}

interface OrderStatus {
  id: string
  status: string
  shipping_address: {
    first_name: string
    last_name: string
    address1: string
    city: string
    state: string
    zip: string
    country: string
  }
  line_items: Array<{
    product_id: string
    title: string
    quantity: number
    price: number
  }>
  total: number
  created_at: string
}

export default function OrderPage({ params }: OrderPageProps) {
  const [order, setOrder] = useState<OrderStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchOrder() {
      try {
        const response = await fetch(`/api/printify/cart?orderId=${params.id}`)
        const data = await response.json()

        if (data.error) {
          throw new Error(data.error)
        }

        setOrder(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch order')
      } finally {
        setLoading(false)
      }
    }

    fetchOrder()
  }, [params.id])

  if (loading) {
    return (
      <WarpBackground>
        <div className="flex min-h-[50vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </WarpBackground>
    )
  }

  if (error || !order) {
    return (
      <WarpBackground>
        <div className="mx-auto max-w-2xl px-4 py-16 text-center">
          <div className="rounded-lg border border-red-500/10 bg-red-500/5 p-4 text-red-500">
            {error || 'Order not found'}
          </div>
          <Link
            href="/"
            className="mt-4 inline-block rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground hover:bg-primary/90"
          >
            Return to Home
          </Link>
        </div>
      </WarpBackground>
    )
  }

  return (
    <WarpBackground>
      <div className="mx-auto max-w-2xl px-4 py-16">
        <div className="mb-8 text-center">
          <div className="mb-4 flex justify-center">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          <h1 className="mb-2 text-3xl font-bold">Order Confirmed!</h1>
          <p className="text-muted-foreground">
            Thank you for your order. We'll send you shipping updates via email.
          </p>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <div className="mb-6">
            <h2 className="mb-4 text-lg font-semibold">Order Details</h2>
            <div className="grid gap-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Order Number:</span>
                <span>{order.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Date:</span>
                <span>{new Date(order.created_at).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status:</span>
                <span className="capitalize">{order.status}</span>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="mb-4 text-lg font-semibold">Shipping Address</h2>
            <div className="text-sm text-muted-foreground">
              <p>{order.shipping_address.first_name} {order.shipping_address.last_name}</p>
              <p>{order.shipping_address.address1}</p>
              <p>
                {order.shipping_address.city}, {order.shipping_address.state}{' '}
                {order.shipping_address.zip}
              </p>
              <p>{order.shipping_address.country}</p>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="mb-4 text-lg font-semibold">Order Summary</h2>
            <div className="space-y-4">
              {order.line_items.map((item) => (
                <div key={item.product_id} className="flex justify-between">
                  <div>
                    <p>{item.title}</p>
                    <p className="text-sm text-muted-foreground">
                      Quantity: {item.quantity}
                    </p>
                  </div>
                  <p>${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
              <div className="border-t pt-4">
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>${order.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <Link
              href="/products"
              className="rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground hover:bg-primary/90"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </WarpBackground>
  )
} 