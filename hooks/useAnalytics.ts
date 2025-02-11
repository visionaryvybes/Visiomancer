import { useCallback } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { track } from '@vercel/analytics'

interface AnalyticsEvent {
  name: string
  properties?: Record<string, any>
}

interface UseAnalyticsReturn {
  trackEvent: (event: AnalyticsEvent) => void
  trackPageView: () => void
  trackAddToCart: (product: { id: string; name: string; price: number }) => void
  trackPurchase: (orderId: string, total: number) => void
  trackSearch: (query: string) => void
  trackShare: (platform: string) => void
}

export function useAnalytics(): UseAnalyticsReturn {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const trackEvent = useCallback(({ name, properties = {} }: AnalyticsEvent) => {
    track(name, {
      ...properties,
      path: pathname,
      search: searchParams.toString(),
      timestamp: new Date().toISOString(),
    })
  }, [pathname, searchParams])

  const trackPageView = useCallback(() => {
    trackEvent({
      name: 'page_view',
      properties: {
        title: document.title,
      },
    })
  }, [trackEvent])

  const trackAddToCart = useCallback((product: { id: string; name: string; price: number }) => {
    trackEvent({
      name: 'add_to_cart',
      properties: {
        product_id: product.id,
        product_name: product.name,
        price: product.price,
      },
    })
  }, [trackEvent])

  const trackPurchase = useCallback((orderId: string, total: number) => {
    trackEvent({
      name: 'purchase',
      properties: {
        order_id: orderId,
        total,
      },
    })
  }, [trackEvent])

  const trackSearch = useCallback((query: string) => {
    trackEvent({
      name: 'search',
      properties: {
        query,
      },
    })
  }, [trackEvent])

  const trackShare = useCallback((platform: string) => {
    trackEvent({
      name: 'share',
      properties: {
        platform,
      },
    })
  }, [trackEvent])

  return {
    trackEvent,
    trackPageView,
    trackAddToCart,
    trackPurchase,
    trackSearch,
    trackShare,
  }
} 