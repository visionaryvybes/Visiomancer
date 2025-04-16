import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCartIcon, CheckIcon } from '@heroicons/react/24/outline';
import { ProductVariant } from './ProductOptions';

interface ProductAddToCartProps {
  selectedVariant: ProductVariant | null;
  onAddToCart: () => void;
  isLoading?: boolean;
  className?: string;
}

export default function ProductAddToCart({
  selectedVariant,
  onAddToCart,
  isLoading = false,
  className = '',
}: ProductAddToCartProps) {
  const [added, setAdded] = useState(false);

  const handleAddToCart = () => {
    if (!selectedVariant || !selectedVariant.available || isLoading) return;
    
    onAddToCart();
    
    // Show success animation
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const isDisabled = !selectedVariant || !selectedVariant.available || isLoading;

  return (
    <motion.div
      className={`relative ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.button
        type="button"
        onClick={handleAddToCart}
        disabled={isDisabled}
        whileTap={{ scale: isDisabled ? 1 : 0.95 }}
        className={`
          flex w-full items-center justify-center gap-2 rounded-lg px-6 py-3 text-center text-base font-medium shadow-sm
          ${isDisabled 
            ? 'cursor-not-allowed bg-gray-300 text-gray-500 dark:bg-gray-700 dark:text-gray-400'
            : 'bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600'}
        `}
      >
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.span
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-center"
            >
              <svg 
                className="h-5 w-5 animate-spin" 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24"
              >
                <circle 
                  className="opacity-25" 
                  cx="12" 
                  cy="12" 
                  r="10" 
                  stroke="currentColor" 
                  strokeWidth="4"
                ></circle>
                <path 
                  className="opacity-75" 
                  fill="currentColor" 
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            </motion.span>
          ) : added ? (
            <motion.span
              key="added"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
            >
              <CheckIcon className="h-5 w-5" />
            </motion.span>
          ) : (
            <motion.span
              key="cart"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
            >
              <ShoppingCartIcon className="h-5 w-5" />
            </motion.span>
          )}
        </AnimatePresence>
        <span>
          {isLoading 
            ? 'Adding...' 
            : added 
              ? 'Added to Cart!' 
              : selectedVariant && !selectedVariant.available 
                ? 'Out of Stock' 
                : 'Add to Cart'}
        </span>
      </motion.button>

      {/* Optional: Add to cart animation */}
      <AnimatePresence>
        {added && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: -20 }}
            className="absolute -top-16 left-1/2 -translate-x-1/2 transform rounded-lg bg-green-100 px-4 py-2 text-sm font-medium text-green-800 shadow-md dark:bg-green-900 dark:text-green-100"
          >
            Added to cart!
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
} 