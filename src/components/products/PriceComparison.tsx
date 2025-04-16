import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type PriceOption = {
  id: string;
  storeName: string;
  storeIcon?: string;
  price: number;
  discount?: number;
  inStock: boolean;
  deliveryDays?: number;
  freeShipping?: boolean;
  url: string;
};

interface PriceComparisonProps {
  options: PriceOption[];
  className?: string;
}

export default function PriceComparison({ 
  options, 
  className = '' 
}: PriceComparisonProps) {
  const [expanded, setExpanded] = useState(false);
  
  // Sort options by price (lowest first)
  const sortedOptions = [...options].sort((a, b) => a.price - b.price);
  
  // Limit to 3 options initially, show all when expanded
  const visibleOptions = expanded ? sortedOptions : sortedOptions.slice(0, 3);
  
  // Format currency
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  // Calculate final price with discount
  const calculateFinalPrice = (price: number, discount?: number) => {
    if (!discount) return price;
    return price * (1 - discount / 100);
  };

  return (
    <div className={`rounded-lg border border-gray-200 p-4 dark:border-gray-700 ${className}`}>
      <h3 className="mb-4 text-lg font-medium">Price Comparison</h3>
      
      <div className="space-y-3">
        <AnimatePresence>
          {visibleOptions.map((option, index) => (
            <motion.div
              key={option.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2, delay: index * 0.05 }}
              className="flex flex-col rounded-lg border border-gray-100 p-3 shadow-sm transition-all hover:shadow-md dark:border-gray-800 dark:hover:border-gray-700 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex items-center">
                {option.storeIcon ? (
                  <img 
                    src={option.storeIcon} 
                    alt={option.storeName} 
                    className="mr-3 h-8 w-8 rounded-full object-contain"
                  />
                ) : (
                  <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-xs font-bold uppercase text-gray-500 dark:bg-gray-800">
                    {option.storeName.substring(0, 2)}
                  </div>
                )}
                <div>
                  <h4 className="font-medium">{option.storeName}</h4>
                  <div className="mt-1 flex flex-wrap items-center gap-x-3 text-sm text-gray-600 dark:text-gray-400">
                    {option.inStock ? (
                      <span className="flex items-center text-green-600 dark:text-green-400">
                        <svg className="mr-1 h-4 w-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        In Stock
                      </span>
                    ) : (
                      <span className="flex items-center text-red-500">
                        <svg className="mr-1 h-4 w-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                        Out of Stock
                      </span>
                    )}
                    
                    {option.deliveryDays && (
                      <span className="flex items-center">
                        <svg className="mr-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {option.deliveryDays === 1 ? "1 day delivery" : `${option.deliveryDays} days delivery`}
                      </span>
                    )}
                    
                    {option.freeShipping && (
                      <span className="flex items-center">
                        <svg className="mr-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                        </svg>
                        Free Shipping
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="mt-3 flex flex-col items-end sm:mt-0">
                <div className="flex items-center">
                  {option.discount && (
                    <span className="mr-2 text-sm line-through text-gray-500">
                      {formatPrice(option.price)}
                    </span>
                  )}
                  <span className="text-lg font-bold text-gray-900 dark:text-white">
                    {formatPrice(calculateFinalPrice(option.price, option.discount))}
                  </span>
                </div>
                
                {option.discount && (
                  <span className="mt-1 rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-800 dark:bg-red-900 dark:text-red-100">
                    Save {option.discount}%
                  </span>
                )}
                
                <a
                  href={option.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-flex items-center justify-center rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:bg-primary-500 dark:hover:bg-primary-600"
                >
                  Visit Store
                  <svg className="ml-1 -mr-1 h-4 w-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      
      {sortedOptions.length > 3 && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-4 flex w-full items-center justify-center rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
        >
          {expanded ? 'Show Less' : `Show ${sortedOptions.length - 3} More Options`}
          <svg
            className={`ml-1 h-4 w-4 transition-transform ${expanded ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      )}
    </div>
  );
} 