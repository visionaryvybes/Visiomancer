import { useState, useRef } from 'react';
import { Product } from '@/types';
import ProductCard from './ProductCard';
import { Clock, Star, TrendingUp, ChevronRight, ArrowUpRight } from 'lucide-react';
import ProductGridSkeleton from '@/components/products/ProductGridSkeleton';
import Button from '@/components/ui/Button';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

interface ProductTabsProps {
  newArrivals: Product[];
  bestSellers: Product[];
  trending: Product[];
  isLoading: boolean;
}

export default function ProductTabs({ 
  newArrivals, 
  bestSellers, 
  trending, 
  isLoading 
}: ProductTabsProps) {
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);
  
  // Get products for active tab
  const getActiveProducts = () => {
    switch(activeTabIndex) {
      case 0: return newArrivals;
      case 1: return bestSellers;
      case 2: return trending;
      default: return newArrivals;
    }
  };
  
  // Handle tab change with framer-motion animation
  const handleTabChange = (index: number) => {
    if (index === activeTabIndex) return;
    setActiveTabIndex(index);
  };
  
  const tabs = [
    { label: "New Arrivals", icon: <Clock size={16} /> },
    { label: "Best Sellers", icon: <Star size={16} /> },
    { label: "Trending", icon: <TrendingUp size={16} /> }
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.25, 0.1, 0.25, 1]
      }
    }
  };

  const contentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.19, 1.0, 0.22, 1.0],  // Expo out easing
        when: "beforeChildren",
        staggerChildren: 0.08
      }
    },
    exit: { 
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.3
      }
    }
  };

  const tabIndicatorVariants = {
    initial: (index: number) => ({
      left: `calc(${index * 33.33}% + 0.375rem)`,
      width: "calc(33.33% - 0.75rem)"
    })
  };

  return (
    <section id="product-tabs" className="w-full max-w-6xl mb-16">
      <motion.div 
        className="flex flex-col items-center mb-8"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <div className="relative mb-2">
          <h2 className="text-3xl font-bold text-center">Shop Our Products</h2>
          <motion.div 
            className="absolute -top-4 -right-4 w-6 h-6 bg-purple-500/20 rounded-full blur-lg"
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.5, 0.8, 0.5] 
            }}
            transition={{ 
              duration: 3, 
              ease: "easeInOut", 
              repeat: Infinity,
            }}
          />
          <motion.div 
            className="absolute -bottom-2 -left-4 w-8 h-8 bg-blue-500/20 rounded-full blur-lg"
            animate={{ 
              scale: [1, 1.3, 1],
              opacity: [0.5, 0.7, 0.5] 
            }}
            transition={{ 
              duration: 4, 
              ease: "easeInOut", 
              repeat: Infinity,
              delay: 1
            }}
          />
        </div>
        <p className="text-gray-400 text-center max-w-md mb-6">Discover our curated collection of premium products</p>
        
        {/* Tabs navigation */}
        <div className="inline-flex flex-wrap justify-center bg-gray-800 rounded-full p-1.5 mb-8 shadow-lg shadow-purple-900/10 backdrop-blur-sm relative overflow-hidden">
          {/* Animated tab indicator */}
          <motion.div
            className="absolute top-1.5 bottom-1.5 bg-gradient-to-r from-purple-600 to-purple-500 rounded-full shadow-md"
            custom={activeTabIndex}
            variants={tabIndicatorVariants}
            initial="initial"
            animate="initial"
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          />
          
          {tabs.map((tab, idx) => (
            <motion.button
              key={tab.label}
              onClick={() => handleTabChange(idx)}
              className={`flex items-center gap-1.5 px-5 py-2.5 rounded-full font-medium transition-all duration-300 z-10 relative ${
                activeTabIndex === idx 
                  ? "text-white" 
                  : "text-gray-300 hover:text-white hover:bg-white/5"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              <motion.div
                initial={{ scale: 1 }}
                animate={activeTabIndex === idx ? 
                  { scale: [1, 1.2, 1], rotate: [0, 8, 0] } : 
                  { scale: 1 }
                }
                transition={{ duration: 0.5 }}
              >
                {tab.icon}
              </motion.div>
              {tab.label}
            </motion.button>
          ))}
        </div>
      </motion.div>
      
      {/* Tab content */}
      <AnimatePresence mode="wait">
        <motion.div 
          key={activeTabIndex}
          ref={contentRef}
          variants={contentVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {isLoading ? (
              <ProductGridSkeleton count={4} />
            ) : getActiveProducts().length > 0 ? (
              <motion.div 
                className="col-span-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {getActiveProducts().map((product, idx) => (
                  <motion.div key={product.id} variants={itemVariants}>
                    <ProductCard product={product} index={idx} />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div 
                className="col-span-full flex flex-col items-center justify-center py-16 glass-effect rounded-xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <p className="text-gray-400 mb-4">No products available in this category.</p>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button 
                    onClick={() => handleTabChange(0)} 
                    className="bg-purple-600 hover:bg-purple-500 text-white"
                  >
                    View New Arrivals
                  </Button>
                </motion.div>
              </motion.div>
            )}
          </div>
          
          <motion.div 
            className="flex justify-center mt-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <motion.div 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link href="/products" className="group relative">
                <span className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-700 to-indigo-700 text-white rounded-lg font-medium transition-all duration-300 hover:shadow-lg hover:shadow-purple-600/30 transform group-hover:translate-x-1">
                  View All Products
                  <motion.div
                    animate={{ x: [0, 5, 0] }}
                    transition={{ 
                      duration: 1.5, 
                      ease: "easeInOut",
                      repeat: Infinity,
                      repeatType: "reverse" as const
                    }}
                  >
                    <ArrowUpRight size={18} />
                  </motion.div>
                </span>
                <span className="absolute inset-0 bg-gradient-to-r from-purple-700/20 to-indigo-700/20 blur-xl rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </section>
  );
} 