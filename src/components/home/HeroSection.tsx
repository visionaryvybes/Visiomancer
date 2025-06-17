"use client";

import Button from "@/components/ui/Button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Product } from "@/types";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

interface HeroSectionProps {
  featuredProduct?: Product;
}

export default function HeroSection({ featuredProduct }: HeroSectionProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <>
      {/* Large hero banner - Fully responsive and centered */}
      <section className="w-full relative overflow-hidden rounded-lg mb-8 sm:mb-12">
        <div className="w-full h-[300px] sm:h-[400px] md:h-[450px] lg:h-[500px] relative rounded-lg overflow-hidden">
          {!imageError ? (
            <>
              <Image
                src="/images/banner.jpg"
                alt="Visiomancer Banner - Aesthetics, Wallpapers, Posters and Art"
                fill
                className="object-cover"
                priority
                onError={() => setImageError(true)}
              />
              {/* Dark overlay for better text readability */}
              <div className="absolute inset-0 bg-black/40"></div>
            </>
          ) : (
            /* Fallback gradient background */
            <>
              <div className="w-full h-full bg-gradient-to-br from-gray-800 via-gray-700 to-gray-900"></div>
              {/* Animated abstract background pattern */}
              <div className="absolute inset-0">
                <div className="absolute inset-0 bg-gradient-to-r from-gray-600/20 via-transparent to-gray-600/20 animate-pulse"></div>
                <div className="absolute top-1/4 left-1/4 w-16 h-16 sm:w-32 sm:h-32 bg-white/5 rounded-full blur-3xl"></div>
                <div className="absolute bottom-1/4 right-1/4 w-24 h-24 sm:w-48 sm:h-48 bg-white/5 rounded-full blur-3xl"></div>
              </div>
              <div className="absolute bottom-2 right-2 sm:bottom-4 sm:right-4 bg-black/50 text-white text-xs p-2 rounded font-base">
                Add banner.jpg to /public/images/
              </div>
            </>
          )}
          
          {/* Hero text overlay - Fully responsive */}
          <div className="absolute inset-0 flex items-center justify-center text-center text-white px-4 sm:px-6 lg:px-8 z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="w-full max-w-4xl"
            >
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-3 sm:mb-4 lg:mb-6 font-heading leading-tight">
                VISIOMANCER
              </h1>
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl mb-6 sm:mb-8 lg:mb-10 max-w-2xl mx-auto font-base px-4">
                Serving Aesthetics, Wallpapers, Posters and Art
              </p>
              <Link href="/products">
                <Button 
                  size="lg" 
                  className="bg-white text-black hover:bg-gray-100 font-base px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base"
                >
                  Shop Collection
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
} 