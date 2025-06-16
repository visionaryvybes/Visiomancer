"use client"; // Need client component for hooks

import React from 'react';
import { useWishlist } from '@/context/WishlistContext';
import { useProducts } from '@/context/ProductsContext';
import ProductGrid from '@/components/products/ProductGrid';
import ProductGridSkeleton from '@/components/products/ProductGridSkeleton';
import ApiError from '@/components/ui/ApiError';
import Button from '@/components/ui/Button';
import Link from 'next/link';
import StoreLayout from "@/components/layout/StoreLayout";
import NextImage from 'next/image';

export default function WishlistPage() {
  const { wishlist } = useWishlist();
  const { products: allProducts, isLoading, fetchErrors, fetcherError } = useProducts();

  // Filter all products to find the ones in the wishlist
  const wishlistedProducts = React.useMemo(() => {
    if (!allProducts || !wishlist) return [];
    console.log('[WishlistPage] All products:', allProducts.length);
    console.log('[WishlistPage] Wishlist IDs:', wishlist);
    const filtered = allProducts.filter(product => wishlist.includes(product.id));
    console.log('[WishlistPage] Filtered wishlist products:', filtered);
    return filtered;
  }, [allProducts, wishlist]);

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
                Wishlist
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 font-base">
                Save your favorite items for later
              </p>
            </div>
            <ProductGridSkeleton />
          </div>
        </main>
      </StoreLayout>
    );
  }

  if (fetcherError) {
    return (
      <StoreLayout>
        <main className="flex-1 px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl py-16">
            <ApiError 
              fetcherError={fetcherError}
              context="loading wishlist items"
            />
          </div>
        </main>
      </StoreLayout>
    );
  }

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
              Wishlist
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 font-base">
              Save your favorite items for later
            </p>
          </div>

          {wishlistedProducts.length === 0 ? (
            <div className="text-center">
              <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-8 max-w-md mx-auto">
                <p className="text-gray-600 dark:text-gray-300 font-base mb-4">
                  Your wishlist is empty. Browse our products to add items to your wishlist!
                </p>
                <Link href="/products">
                  <Button>
                    Browse Products
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <div>
              <div className="mb-6 text-center">
                <p className="text-gray-600 dark:text-gray-300 font-base">
                  {wishlistedProducts.length} item{wishlistedProducts.length !== 1 ? 's' : ''} in your wishlist
                </p>
              </div>
              <ProductGrid products={wishlistedProducts} />
            </div>
          )}
        </div>
      </main>
    </StoreLayout>
  );
} 