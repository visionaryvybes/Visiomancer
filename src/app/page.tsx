"use client";

import StoreLayout from "@/components/layout/StoreLayout";
import HeroSection from "@/components/home/HeroSection";
import ProductGrid from "@/components/products/ProductGrid";
import ProductGridSkeleton from "@/components/products/ProductGridSkeleton";
import { useProducts } from "@/context/ProductsContext";
import Link from "next/link";
import Button from "@/components/ui/Button";
import { ArrowRight } from "lucide-react";

export default function Home() {
  const { products, isLoading, fetchErrors } = useProducts();

  // Show featured products (first 4 products)
  const featuredProducts = products?.slice(0, 4) || [];

  return (
    <StoreLayout>
      <main className="flex-1 w-full">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
          <HeroSection />
          
          {/* Featured Products Section */}
          <section className="mt-12 sm:mt-16 lg:mt-20">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4 font-heading">
                Featured Products
              </h2>
              <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 font-base max-w-2xl mx-auto px-4">
                Discover our latest premium digital art designs and visual assets
              </p>
            </div>

            {/* Loading State */}
            {isLoading && (
              <div className="mb-8">
                <ProductGridSkeleton count={4} />
              </div>
            )}

            {/* Products Grid */}
            {!isLoading && featuredProducts.length > 0 && (
              <div className="mb-8">
                <ProductGrid products={featuredProducts} />
              </div>
            )}

            {/* Error State */}
            {!isLoading && fetchErrors?.gumroad && featuredProducts.length === 0 && (
              <div className="flex justify-center mb-8">
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6 max-w-md w-full mx-4">
                  <p className="text-yellow-700 dark:text-yellow-300 font-base text-center">
                    Unable to load featured products. Visit our full collection to see all available items.
                  </p>
                </div>
              </div>
            )}

            {/* Empty State */}
            {!isLoading && !fetchErrors?.gumroad && featuredProducts.length === 0 && (
              <div className="flex justify-center mb-8">
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
                  <p className="text-gray-600 dark:text-gray-300 font-base text-center">
                    New products coming soon! Check back for updates.
                  </p>
                </div>
              </div>
            )}

            {/* View All Products Button */}
            {!isLoading && featuredProducts.length > 0 && (
              <div className="text-center">
                <Link href="/products">
                  <Button 
                    size="lg" 
                    className="bg-purple-600 hover:bg-purple-700 text-white font-medium px-6 sm:px-8 py-3 sm:py-4"
                  >
                    View All Products
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            )}
          </section>
        </div>
      </main>
    </StoreLayout>
  );
}