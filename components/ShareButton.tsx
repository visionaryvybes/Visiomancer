import React from 'react'
import { Share2 } from 'lucide-react'
import { useShare } from '../hooks/useShare'

interface ShareButtonProps {
  title: string
  text?: string
  url: string
}

export default function ShareButton({ title, text, url }: ShareButtonProps) {
  const { isSharing, shareProduct } = useShare({
    title,
    text,
    url,
  })

  return (
    <button
      onClick={shareProduct}
      disabled={isSharing}
      className="inline-flex items-center gap-2 rounded-lg bg-white/5 px-4 py-2 text-sm font-medium text-white hover:bg-white/10 disabled:opacity-50"
      aria-label="Share product"
    >
      <Share2 className="h-4 w-4" />
      {isSharing ? 'Sharing...' : 'Share'}
    </button>
  )
} 