import Button from "@/components/ui/Button";
import Link from "next/link";
import { ArrowRight, Sparkles, TrendingUp } from "lucide-react";
import { Product } from "@/types";
import { useEffect, useState, Suspense } from "react";
import dynamic from 'next/dynamic';
import { motion } from "framer-motion";

// Dynamic import for HeroScene
const HeroScene = dynamic(() => import('@/components/three/HeroScene'), {
  loading: () => <div className="absolute inset-0 bg-black/30 flex items-center justify-center text-white rounded-lg">Loading Scene...</div>,
  ssr: false 
});

interface HeroSectionProps {
  featuredProduct?: Product;
}

export default function HeroSection({ featuredProduct }: HeroSectionProps) {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className="w-full max-w-6xl relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-900 to-purple-900 mb-16">
      {/* Animated background pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute right-0 bottom-0 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-blob"></div>
        <div className="absolute left-20 top-20 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl animate-blob delay-400"></div>
        <div className="absolute left-1/2 bottom-1/4 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-blob delay-800"></div>
      </div>
      
      <div className="relative z-10 py-20 px-8 md:px-16 flex flex-col md:flex-row items-center">
        <div className={`md:w-1/2 mb-10 md:mb-0 md:pr-8 transition-all duration-700 ease-in-out ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <span className="inline-block px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium mb-4">
            <Sparkles size={14} className="inline mr-1" /> New Collection 2025
          </span>
          <motion.h1
            className="text-4xl font-bold mb-6 leading-tight md:text-5xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Discover Stunning Digital Posters & Wallpapers!
          </motion.h1>
          <p className="text-lg mb-8 text-gray-300 max-w-xl mx-auto">
            High-Resolution (300 DPI) designs for your home or phone. Instant Download via Gumroad – no waiting, no shipping. Start creating your perfect space today!
          </p>
          <div className="flex gap-4">
            <Link href="/products" passHref>
              <Button size="lg" className="flex items-center gap-2 hover:scale-105 transition-transform shadow-lg shadow-purple-900/30">
                Shop Now <ArrowRight size={18} />
              </Button>
            </Link>
            <Link href="#trending" passHref>
              <Button size="lg" className="bg-white/10 hover:bg-white/20 text-white flex items-center gap-2 hover:scale-105 transition-transform backdrop-blur-sm">
                Trending <TrendingUp size={18} />
              </Button>
            </Link>
          </div>
        </div>
        <div className={`md:w-1/2 relative h-64 md:h-80 transition-all duration-700 ease-in-out delay-400 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="absolute inset-0 transform hover:scale-105 transition-transform duration-300">
            <Suspense fallback={<div className="absolute inset-0 bg-black/30 flex items-center justify-center text-white rounded-lg">Loading Fallback...</div>}>
              <HeroScene />
            </Suspense>
          </div>
        </div>
      </div>
    </section>
  );
} 