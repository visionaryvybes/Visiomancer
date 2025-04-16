import React from 'react';
import { motion } from 'framer-motion';
import { MinusIcon, PlusIcon } from '@heroicons/react/24/outline';

interface ProductQuantitySelectorProps {
  quantity: number;
  onChange: (quantity: number) => void;
  minQuantity?: number;
  maxQuantity?: number;
  className?: string;
  disabled?: boolean;
}

export default function ProductQuantitySelector({
  quantity,
  onChange,
  minQuantity = 1,
  maxQuantity = 99,
  className = '',
  disabled = false
}: ProductQuantitySelectorProps) {
  const handleDecrease = () => {
    if (quantity > minQuantity && !disabled) {
      onChange(quantity - 1);
    }
  };

  const handleIncrease = () => {
    if (quantity < maxQuantity && !disabled) {
      onChange(quantity + 1);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value, 10);
    if (!isNaN(newValue) && newValue >= minQuantity && newValue <= maxQuantity && !disabled) {
      onChange(newValue);
    }
  };

  return (
    <div className={`flex items-center ${className}`}>
      <label htmlFor="quantity" className="mr-3 text-sm font-medium text-gray-900 dark:text-gray-100">
        Quantity
      </label>
      <div className="relative flex h-10 items-center rounded-md border border-gray-200 dark:border-gray-700">
        <motion.button
          whileHover={{ backgroundColor: 'rgb(243, 244, 246)' }}
          whileTap={{ scale: 0.95 }}
          onClick={handleDecrease}
          className={`
            flex h-full w-10 items-center justify-center rounded-l-md border-r border-gray-200 
            dark:border-gray-700 dark:hover:bg-gray-700
            ${quantity <= minQuantity || disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
          `}
          disabled={quantity <= minQuantity || disabled}
          aria-label="Decrease quantity"
        >
          <MinusIcon className="h-4 w-4 text-gray-600 dark:text-gray-400" />
        </motion.button>
        
        <input
          type="number"
          id="quantity"
          name="quantity"
          min={minQuantity}
          max={maxQuantity}
          value={quantity}
          onChange={handleInputChange}
          className="w-12 border-0 bg-transparent p-0 text-center text-sm text-gray-900 focus:outline-none focus:ring-0 dark:text-gray-100"
          disabled={disabled}
        />
        
        <motion.button
          whileHover={{ backgroundColor: 'rgb(243, 244, 246)' }}
          whileTap={{ scale: 0.95 }}
          onClick={handleIncrease}
          className={`
            flex h-full w-10 items-center justify-center rounded-r-md border-l border-gray-200
            dark:border-gray-700 dark:hover:bg-gray-700
            ${quantity >= maxQuantity || disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
          `}
          disabled={quantity >= maxQuantity || disabled}
          aria-label="Increase quantity"
        >
          <PlusIcon className="h-4 w-4 text-gray-600 dark:text-gray-400" />
        </motion.button>
      </div>
    </div>
  );
} 