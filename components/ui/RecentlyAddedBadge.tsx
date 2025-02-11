import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'

interface RecentlyAddedBadgeProps {
  createdAt: Date
  daysToShow?: number
}

export function RecentlyAddedBadge({ createdAt, daysToShow = 7 }: RecentlyAddedBadgeProps) {
  const isRecent = (new Date().getTime() - new Date(createdAt).getTime()) / (1000 * 3600 * 24) <= daysToShow

  if (!isRecent) return null

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="absolute right-2 top-2 z-30 flex items-center gap-1 rounded-full bg-gradient-to-r from-purple-500/90 to-blue-500/90 px-3 py-1 text-xs font-medium text-white shadow-lg backdrop-blur-sm"
    >
      <Sparkles className="h-3 w-3" />
      <span>New</span>
    </motion.div>
  )
} 