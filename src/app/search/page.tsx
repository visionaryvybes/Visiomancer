"use client";

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import ProductGrid from '@/components/products/ProductGrid';
import ProductGridSkeleton from '@/components/products/ProductGridSkeleton';
import { useProducts } from '@/context/ProductsContext';
import ApiError from '@/components/ui/ApiError';

function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams ? searchParams.get('q') || '' : '';
  const { products, isLoading, fetchErrors, fetcherError } = useProducts(); // Assuming useProducts can be filtered or fetched with query

  // Simple filtering logic (replace with actual API search/filtering)
  const filteredProducts = query
    ? products?.filter(p => p.name.toLowerCase().includes(query.toLowerCase()))
    : products;

  return (
    <div className="w-full max-w-6xl">
      <h1 className="text-4xl font-bold mb-8">
        Search Results for: <span className="text-purple-400">"{query}"</span>
      </h1>

      {/* Loading State */}
      {isLoading && <ProductGridSkeleton count={9} />}

      {/* Error State */}
      <ApiError fetchErrors={fetchErrors} fetcherError={fetcherError} context="searching products" />

      {/* Content State */}
      {!isLoading && !fetcherError && filteredProducts && filteredProducts.length > 0 && (
        <ProductGrid products={filteredProducts} />
      )}

      {/* No Results State */}
      {!isLoading && !fetcherError && (!filteredProducts || filteredProducts.length === 0) && (
        <p className="text-center text-gray-500">No products found matching "{query}".</p>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <main className="flex min-h-screen flex-col items-center p-4 md:p-8 lg:p-12">
      <Suspense fallback={<ProductGridSkeleton count={9} />}>
        <SearchResults />
      </Suspense>
    </main>
  );
} 