"use client";

import React, { Fragment } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline'; // Using Heroicons for close icon
import ProductFilters from './ProductFilters';
import { FilterDefinition, Filters } from './types';

interface MobileFilterDialogProps {
  open: boolean;
  onClose: () => void;
  filters: Record<string, FilterDefinition>;
  activeFilters: Filters;
  onFilterChange: (filterId: string, optionId: string, checked: boolean) => void;
}

export default function MobileFilterDialog({ 
  open, 
  onClose, 
  filters, 
  activeFilters, 
  onFilterChange 
}: MobileFilterDialogProps) {
  
  // Basic modal implementation without external libraries for simplicity
  if (!open) {
    return null;
  }

  return (
    <div 
      className="fixed inset-0 z-50 flex items-start justify-center pt-10 bg-black/50 backdrop-blur-sm" 
      onClick={onClose} // Close on backdrop click
      aria-modal="true" 
      role="dialog"
    >
      <div 
        className="relative w-full max-w-sm mx-4 bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">Filters</h2>
          <button
            type="button"
            className="-mr-2 flex h-10 w-10 items-center justify-center rounded-md p-2 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
            onClick={onClose}
          >
            <span className="sr-only">Close filters</span>
            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>

        <div className="p-4">
          {/* Render the actual filters */}
          <ProductFilters 
            filters={filters} 
            activeFilters={activeFilters} 
            onChange={onFilterChange}
          />
        </div>
        
        {/* Optional: Add Apply/View Results button if needed */}
        <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700">
           <button
            type="button"
            className="w-full rounded-md bg-purple-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
            onClick={onClose}
          >
            View Results
          </button>
        </div>
      </div>
    </div>
  );
} 