"use client"; // Need client component for hooks

import React from 'react';
import { useWishlist } from '@/context/WishlistContext';
import { useProducts } from '@/context/ProductsContext';
import ProductGrid from '@/components/products/ProductGrid';
import ProductGridSkeleton from '@/components/products/ProductGridSkeleton';
import ApiError from '@/components/ui/ApiError';
import Button from '@/components/ui/Button';
import Link from 'next/link';

export default function WishlistPage() {
  const { wishlist } = useWishlist();
  const { products: allProducts, isLoading, fetchErrors, fetcherError } = useProducts();

  // Filter all products to find the ones in the wishlist
  const wishlistedProducts = React.useMemo(() => {
    if (!allProducts || !wishlist) return [];
    return allProducts.filter(product => wishlist.includes(product.id));
  }, [allProducts, wishlist]);

  return (
    <main className="flex min-h-screen flex-col items-center p-4 md:p-8 lg:p-12">
      <div className="w-full max-w-6xl">
        <h1 className="text-4xl font-bold mb-8 text-center">Your Wishlist</h1>

        {/* Loading State */}
        {isLoading && <ProductGridSkeleton count={3} />}

        {/* Error State */} 
        <ApiError fetchErrors={fetchErrors} fetcherError={fetcherError} context="loading wishlist products" />

        {/* Content State */} 
        {!isLoading && !fetcherError && wishlistedProducts.length > 0 && (
          <ProductGrid products={wishlistedProducts} />
        )}

        {/* Empty State */} 
        {!isLoading && !fetcherError && wishlistedProducts.length === 0 && (
          <div className="text-center text-gray-500">
            <p className="mb-4">Your wishlist is currently empty.</p>
            <Button asChild>
              <Link href="/products">Browse Products</Link>
            </Button>
          </div>
        )}
      </div>
    </main>
  );
} 