import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingBagIcon } from '@heroicons/react/24/outline';
import { CheckCircleIcon } from '@heroicons/react/24/solid';

interface ProductAddToCartButtonProps {
  onClick: () => void;
  isLoading?: boolean;
  isDisabled?: boolean;
  isAdded?: boolean;
  className?: string;
  fullWidth?: boolean;
  children?: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
}

export default function ProductAddToCartButton({
  onClick,
  isLoading = false,
  isDisabled = false,
  isAdded = false,
  className = '',
  fullWidth = false,
  children = 'Add to Cart',
  variant = 'primary',
  size = 'medium',
}: ProductAddToCartButtonProps) {
  // Determine the styles based on variant
  const variantStyles = {
    primary: `bg-primary-600 text-white hover:bg-primary-700 active:bg-primary-800 disabled:bg-primary-300 dark:bg-primary-500 dark:hover:bg-primary-600 dark:active:bg-primary-700 dark:disabled:bg-primary-800 dark:disabled:bg-opacity-50`,
    secondary: `bg-gray-900 text-white hover:bg-gray-800 active:bg-gray-950 disabled:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 dark:active:bg-gray-800 dark:disabled:bg-gray-900 dark:disabled:bg-opacity-50`,
    outline: `bg-white text-gray-900 border border-gray-300 hover:bg-gray-50 active:bg-gray-100 disabled:bg-gray-50 disabled:text-gray-400 dark:bg-transparent dark:text-gray-100 dark:border-gray-700 dark:hover:bg-gray-800 dark:active:bg-gray-700 dark:disabled:bg-gray-900 dark:disabled:bg-opacity-50 dark:disabled:text-gray-600`,
  };
  
  // Determine the size styles
  const sizeStyles = {
    small: 'py-2 px-4 text-sm',
    medium: 'py-3 px-6 text-base',
    large: 'py-4 px-8 text-lg',
  };
  
  // Added state styles
  const addedStyles = isAdded
    ? 'bg-green-600 text-white hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-700'
    : '';
  
  return (
    <motion.button
      onClick={onClick}
      disabled={isDisabled || isLoading}
      whileHover={!isDisabled && !isLoading ? { scale: 1.02 } : {}}
      whileTap={!isDisabled && !isLoading ? { scale: 0.98 } : {}}
      className={`
        flex items-center justify-center rounded-md font-medium transition-colors
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${fullWidth ? 'w-full' : ''}
        ${isLoading ? 'cursor-wait' : ''}
        ${isDisabled ? 'cursor-not-allowed' : 'cursor-pointer'}
        ${isAdded ? addedStyles : ''}
        ${className}
      `}
    >
      {isLoading ? (
        <div className="flex items-center space-x-2">
          <svg className="h-5 w-5 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>Loading...</span>
        </div>
      ) : isAdded ? (
        <div className="flex items-center space-x-2">
          <CheckCircleIcon className="h-5 w-5" />
          <span>Added to Cart</span>
        </div>
      ) : (
        <div className="flex items-center space-x-2">
          <ShoppingBagIcon className="h-5 w-5" />
          <span>{children}</span>
        </div>
      )}
    </motion.button>
  );
} 