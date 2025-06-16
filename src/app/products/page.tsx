"use client";

import StoreLayout from "@/components/layout/StoreLayout";
import NextImage from 'next/image';
import { useProducts } from '@/context/ProductsContext';
import ProductGrid from '@/components/products/ProductGrid';
import ProductGridSkeleton from '@/components/products/ProductGridSkeleton';
import ApiError from '@/components/ui/ApiError';

export default function ProductsPage() {
  const { products, isLoading, fetchErrors, fetcherError } = useProducts();

  // Show loading state
  if (isLoading) {
    return (
      <StoreLayout>
        <main className="flex-1 px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl py-16">
            <div className="text-center mb-12">
              <div className="mb-8">
                <NextImage 
                  src="/images/logo.png" 
                  alt="Visiomancer Logo" 
                  width={120} 
                  height={120} 
                  className="mx-auto object-contain"
                  priority
                />
              </div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 font-heading">
                All Products
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 font-base">
                Loading our premium digital art collection...
              </p>
            </div>
            <ProductGridSkeleton count={8} />
          </div>
        </main>
      </StoreLayout>
    );
  }

  // Show error state if there's a critical error
  if (fetcherError && (!products || products.length === 0)) {
    return (
      <StoreLayout>
        <main className="flex-1 px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl py-16">
            <div className="text-center">
              <div className="mb-8">
                <NextImage 
                  src="/images/logo.png" 
                  alt="Visiomancer Logo" 
                  width={120} 
                  height={120} 
                  className="mx-auto object-contain"
                  priority
                />
              </div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 font-heading">
                All Products
              </h1>
              <ApiError 
                fetcherError={fetcherError}
                context="loading products"
              />
            </div>
          </div>
        </main>
      </StoreLayout>
    );
  }

  // Show empty state if no products
  if (!isLoading && (!products || products.length === 0)) {
    return (
      <StoreLayout>
        <main className="flex-1 px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl py-16">
            <div className="text-center">
              <div className="mb-8">
                <NextImage 
                  src="/images/logo.png" 
                  alt="Visiomancer Logo" 
                  width={120} 
                  height={120} 
                  className="mx-auto object-contain"
                  priority
                />
              </div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 font-heading">
                All Products
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 font-base">
                No products are currently available.
              </p>
              <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-8 max-w-md mx-auto">
                <p className="text-gray-600 dark:text-gray-300 font-base">
                  We're working on adding new products to our collection. 
                  Please check back soon!
                </p>
              </div>
            </div>
          </div>
        </main>
      </StoreLayout>
    );
  }

  return (
    <StoreLayout>
      <main className="flex-1 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl py-16">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="mb-8">
              <NextImage 
                src="/images/logo.png" 
                alt="Visiomancer Logo" 
                width={120} 
                height={120} 
                className="mx-auto object-contain"
                priority
              />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 font-heading">
              All Products
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 font-base">
              Discover our collection of {products?.length || 0} premium digital products
            </p>

            {/* Show warnings for fetch errors but still display products */}
            {fetchErrors?.gumroad && (
              <div className="mb-8 max-w-2xl mx-auto">
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                        Partial Loading Issue
                      </h3>
                      <p className="mt-1 text-sm text-yellow-700 dark:text-yellow-300">
                        Some products might not be displaying correctly: {fetchErrors.gumroad}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Products Grid */}
          {products && products.length > 0 && (
            <ProductGrid products={products} />
          )}
        </div>
      </main>
    </StoreLayout>
  );
} 