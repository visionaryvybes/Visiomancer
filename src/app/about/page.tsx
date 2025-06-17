"use client";

import StoreLayout from "@/components/layout/StoreLayout";
import NextImage from 'next/image';
import Image from 'next/image';

export default function AboutPage() {
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
              About Visiomancer
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 font-base max-w-2xl mx-auto">
              We are passionate creators serving aesthetics, wallpapers, posters and art that inspire and captivate.
            </p>
            <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-8 max-w-2xl mx-auto">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 font-heading">
                Our Vision
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4 font-base">
                At Visiomancer, we believe in the power of visual storytelling. Our mission is to create 
                stunning digital art that bridges the gap between imagination and reality.
              </p>
              <p className="text-gray-600 dark:text-gray-300 font-base">
                From concept to creation, we pour our passion into every piece, ensuring that each design 
                tells a unique story and connects with our audience on a deeper level.
              </p>
            </div>
          </div>
        </div>
      </main>
    </StoreLayout>
  );
} 