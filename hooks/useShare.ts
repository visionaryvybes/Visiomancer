import { useState } from 'react'
import { toast } from 'sonner'

interface ShareOptions {
  title: string
  text?: string
  url: string
}

interface UseShareReturn {
  isSharing: boolean
  shareProduct: () => Promise<void>
  copyToClipboard: () => Promise<void>
}

export function useShare(options: ShareOptions): UseShareReturn {
  const [isSharing, setIsSharing] = useState(false)

  const shareProduct = async () => {
    setIsSharing(true)
    try {
      if (navigator.share) {
        await navigator.share({
          title: options.title,
          text: options.text,
          url: options.url,
        })
        toast.success('Shared successfully')
      } else {
        await copyToClipboard()
      }
    } catch (error) {
      if ((error as Error)?.name !== 'AbortError') {
        console.error('Error sharing:', error)
        toast.error('Failed to share')
      }
    } finally {
      setIsSharing(false)
    }
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(options.url)
      toast.success('Link copied to clipboard')
    } catch (error) {
      console.error('Error copying to clipboard:', error)
      toast.error('Failed to copy link')
    }
  }

  return {
    isSharing,
    shareProduct,
    copyToClipboard,
  }
} 