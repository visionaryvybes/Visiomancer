import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowUp } from 'lucide-react'

export function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    window.addEventListener('scroll', toggleVisibility)
    return () => window.removeEventListener('scroll', toggleVisibility)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-white/20 via-white/10 to-transparent backdrop-blur-xl transition-all duration-300 hover:from-white/30 hover:via-white/20 hover:to-transparent"
          aria-label="Scroll to top"
        >
          <motion.div
            animate={{ y: [2, -2, 2] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <ArrowUp className="h-5 w-5 text-white" />
          </motion.div>
        </motion.button>
      )}
    </AnimatePresence>
  )
} 