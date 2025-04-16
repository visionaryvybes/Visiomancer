import React from 'react';
import { motion } from 'framer-motion';

export interface SizeOption {
  id: string;
  name: string;
  inStock: boolean;
  isLowStock?: boolean; // Optional flag for low stock warning
}

interface ProductSizeSelectorProps {
  sizes: SizeOption[];
  selectedSize: string | null;
  onSelectSize: (sizeId: string) => void;
  className?: string;
  layout?: 'grid' | 'inline';
}

export default function ProductSizeSelector({
  sizes,
  selectedSize,
  onSelectSize,
  className = '',
  layout = 'grid'
}: ProductSizeSelectorProps) {
  if (!sizes || sizes.length === 0) {
    return null;
  }
  
  return (
    <div className={className}>
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">Size</h3>
        {selectedSize ? (
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {sizes.find(s => s.id === selectedSize)?.name || 'Select a size'}
          </span>
        ) : (
          <span className="text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-500 dark:hover:text-primary-300">
            Size guide
          </span>
        )}
      </div>
      
      <div className={`
        ${layout === 'grid' ? 'grid grid-cols-4 gap-2 sm:grid-cols-6 md:grid-cols-8' : 'flex flex-wrap gap-2'}
      `}>
        {sizes.map((size) => {
          const isSelected = size.id === selectedSize;
          
          return (
            <motion.button
              key={size.id}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => size.inStock && onSelectSize(size.id)}
              disabled={!size.inStock}
              className={`
                group flex h-10 items-center justify-center rounded-md px-3 text-sm font-medium transition-all
                ${isSelected 
                  ? 'border-primary-500 bg-primary-50 text-primary-700 dark:bg-primary-900 dark:bg-opacity-20 dark:text-primary-300' 
                  : 'border border-gray-200 bg-white text-gray-900 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700'}
                ${!size.inStock ? 'cursor-not-allowed border-gray-200 bg-gray-50 text-gray-400 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-600' : 'cursor-pointer'}
                ${size.isLowStock && size.inStock ? 'ring-1 ring-yellow-400 dark:ring-yellow-600' : ''}
              `}
              aria-label={`Size ${size.name}${!size.inStock ? ' (Out of Stock)' : size.isLowStock ? ' (Low Stock)' : ''}`}
              title={`${size.name}${!size.inStock ? ' (Out of Stock)' : size.isLowStock ? ' (Low Stock)' : ''}`}
            >
              {size.name}
              
              {/* Low stock indicator */}
              {size.isLowStock && size.inStock && (
                <span className="ml-1 inline-flex h-1.5 w-1.5 rounded-full bg-yellow-500 dark:bg-yellow-600" />
              )}
              
              {/* Strikethrough for out of stock */}
              {!size.inStock && (
                <span className="absolute inset-0 flex items-center justify-center">
                  <span className="h-px w-full rotate-45 transform bg-gray-400 dark:bg-gray-600" />
                </span>
              )}
            </motion.button>
          );
        })}
      </div>
      
      {sizes.some(size => size.isLowStock && size.inStock) && (
        <p className="mt-2 flex items-center text-xs text-yellow-600 dark:text-yellow-500">
          <span className="mr-1 inline-flex h-1.5 w-1.5 rounded-full bg-yellow-500 dark:bg-yellow-600" />
          Items marked with a dot are low in stock
        </p>
      )}
    </div>
  );
} 