"use client";

import { useSearchParams } from 'next/navigation';
import StoreLayout from "@/components/layout/StoreLayout";
import NextImage from 'next/image';
import Image from 'next/image';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';

  return (
    <StoreLayout>
      <main className="flex-1 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl py-16">
          <div className="text-center">
            <div className="mb-8">
              <div className="flex justify-center mb-8">
                <Image
                  src="/logo visiomancer.png"
                  alt="VisionMancer"
                  width={120}
                  height={120}
                  className="object-contain"
                />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 font-heading">
              Search Results
            </h1>
            {query && (
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 font-base">
                Searching for: "{query}"
              </p>
            )}
            <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-8 max-w-md mx-auto">
              <p className="text-gray-600 dark:text-gray-300 font-base">
                Search functionality is coming soon. We're working on building 
                our product catalog for you to explore.
              </p>
            </div>
          </div>
        </div>
      </main>
    </StoreLayout>
  );
} 