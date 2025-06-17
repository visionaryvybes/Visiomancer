"use client";

import StoreLayout from "@/components/layout/StoreLayout";
import NextImage from 'next/image';
import Image from 'next/image';

export default function BlogPage() {
  return (
    <StoreLayout>
      <main className="flex-1 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl py-16">
          <div className="text-center">
            <div className="flex justify-center mb-8">
              <Image
                src="/logo visiomancer.png"
                alt="VisionMancer"
                width={120}
                height={120}
                className="object-contain"
              />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 font-heading">
              Blog
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 font-base">
              Insights, tutorials, and inspiration from the world of digital art.
            </p>
            <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-8 max-w-md mx-auto">
              <p className="text-gray-600 dark:text-gray-300 font-base">
                We're working on bringing you amazing content about digital art, 
                design trends, and creative inspiration. Stay tuned!
              </p>
            </div>
          </div>
        </div>
      </main>
    </StoreLayout>
  );
} 