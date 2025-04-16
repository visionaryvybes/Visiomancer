"use client"; // Make it a client component to use hooks

import { useProducts } from "@/context/ProductsContext";
import ProductGrid from "@/components/products/ProductGrid";
import ProductGridSkeleton from "@/components/products/ProductGridSkeleton";
import ApiError from "@/components/ui/ApiError";
import Button from "@/components/ui/Button";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { 
  ShoppingCart, 
  Search, 
  Star, 
  TrendingUp, 
  Zap, 
  Heart,
  Package, 
  ShieldCheck,
  ChevronRight,
  ArrowDownRight,
  ArrowUp,
  Download,
  Image as ImageIcon,
  Monitor,
  Smartphone,
  Tablet,
  CheckCircle,
  Award,
  Orbit,
  Shapes,
  Mountain,
  Square,
  MousePointer,
  CarFront,
  Trophy,
  Rocket,
  Drama,
  TreePine,
  PartyPopper,
  AppWindow,
  Spline,
  GlassWater,
  Sparkles,
  Sparkle
} from "lucide-react";
import { Icon } from "lucide-react";
import { planet } from "@lucide/lab";
import '@/styles/animations.css';
import AnnouncementBar from "@/components/home/AnnouncementBar";
import HeroSection from "@/components/home/HeroSection";
import Image from 'next/image';
import ProductTabs from '@/components/home/ProductTabs';
import HomeProductCard from '@/components/home/ProductCard';
import { motion, AnimatePresence } from 'framer-motion';
import AnimatedIcon from '@/components/ui/AnimatedIcon';
import TiltCard from '@/components/ui/TiltCard';

export default function Home() {
  const { products, isLoading, fetchErrors, fetcherError } = useProducts();
  const [isVisible, setIsVisible] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const [visibleSections, setVisibleSections] = useState<{ [key: string]: boolean }>({
    hero: false,
    search: false,
    features: false,
    categories: false,
    products: false,
    about: false,
    newsletter: false
  });
  
  // Animation on page load
  useEffect(() => {
    setIsVisible(true);
    
    // Add scroll listener for back-to-top button
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Intersection Observer for section animations
  useEffect(() => {
    const observerOptions = {
      rootMargin: '0px',
      threshold: 0.15,
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.id;
          setVisibleSections(prev => ({ ...prev, [sectionId]: true }));
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    
    // Observe all sections
    document.querySelectorAll('section[id]').forEach(section => {
      observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  // Products for different sections
  const newArrivals = products?.slice(0, 4) || [];
  const bestSellers = products?.slice(0, 4) || [];
  const trending = products?.slice(0, 4) || [];
  
  // Scroll to top handler
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  // Announcement messages for the bar
  const announcements = [
    "✨ NEW DESIGNS! Fresh Digital Posters just added to our collection!",
    "🔥 All wallpapers optimized for desktop, mobile & tablet devices",
  ];

  // Features data
  const features = [
    {
      icon: <ImageIcon className="text-purple-400" />,
      title: "High Resolution",
      description: "All posters are 300 DPI for crisp, detailed prints"
    },
    {
      icon: <Download className="text-blue-400" />,
      title: "Instant Download",
      description: "Get your files immediately after purchase"
    },
    {
      icon: <Monitor className="text-green-400" />,
      title: "Multi-Device Ready",
      description: "Optimized for desktops, phones, and tablets"
    },
    {
      icon: <CheckCircle className="text-rose-400" />,
      title: "Print Ready",
      description: "Perfect for home printing or professional services"
    }
  ];

  // Categories with examples - UPDATED FOR NEW LIST AND GROUPING
  const categories = [
    {
      id: "automotive",
      name: "Automotive",
      icon: <CarFront size={24} />,
      color: "from-red-900 to-orange-800",
    },
    {
      id: "motorsports",
      name: "Motorsports",
      icon: <Trophy size={24} />,
      color: "from-gray-800 to-gray-700",
    },
    {
      id: "cosmic",
      name: "Cosmic & Space",
      icon: <Icon iconNode={planet} size={24} />,
      color: "from-indigo-900 to-purple-800",
    },
    {
      id: "anime",
      name: "Anime & Manga",
      icon: <Drama size={24} />,
      color: "from-pink-900 to-rose-800",
    },
    {
      id: "nature",
      name: "Nature & Wildlife",
      icon: <TreePine size={24} />,
      color: "from-emerald-900 to-green-800",
    },
    {
      id: "festivals",
      name: "Festivals",
      icon: <PartyPopper size={24} />,
      color: "from-yellow-800 to-amber-700",
    },
    {
      id: "digital_art",
      name: "Digital Art Styles",
      icon: <AppWindow size={24} />,
      color: "from-cyan-900 to-sky-800",
    },
    {
      id: "abstract",
      name: "Abstract & Patterns",
      icon: <Spline size={24} />,
      color: "from-blue-900 to-indigo-800",
    },
  ];

  // Device types for the responsive section
  const deviceTypes = [
    { id: "desktop", name: "Desktop", icon: <Monitor size={24} />, size: "1920×1080" },
    { id: "mobile", name: "Mobile", icon: <Smartphone size={24} />, size: "1080×1920" },
    { id: "tablet", name: "Tablet", icon: <Tablet size={24} />, size: "2048×1536" }
  ];

  // Animation variants for staggered children
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
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-4 md:p-8 lg:p-12 overflow-hidden bg-gradient-to-b from-gray-900 to-gray-950">
      {/* Floating interactive elements - REMOVED */}
      {/* 
      <div className="fixed top-1/2 right-4 -translate-y-1/2 flex flex-col gap-3 z-40">
        <motion.button 
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="w-10 h-10 rounded-full bg-white/10 backdrop-filter backdrop-blur-lg flex items-center justify-center hover:bg-purple-500 transition-colors duration-300"
          aria-label="View wishlist"
        >
          <Heart size={18} />
        </motion.button>
        <motion.button 
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="w-10 h-10 rounded-full bg-white/10 backdrop-filter backdrop-blur-lg flex items-center justify-center hover:bg-purple-500 transition-colors duration-300" 
          aria-label="View cart"
        >
          <ShoppingCart size={18} />
        </motion.button>
        <motion.button 
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="w-10 h-10 rounded-full bg-white/10 backdrop-filter backdrop-blur-lg flex items-center justify-center hover:bg-purple-500 transition-colors duration-300" 
          aria-label="View downloads"
        >
          <Download size={18} />
        </motion.button>
      </div>
      */}
      
      {/* Announcement Bar with enhanced styling */}
      <motion.div 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-6xl mb-8"
      >
        <AnnouncementBar messages={announcements} />
      </motion.div>

      {/* Hero Section with more dynamic animation */}
      <section id="hero" className="w-full max-w-6xl mb-16">
        <HeroSection featuredProduct={products?.[0]} />
      </section>

      {/* Products Tabs Section - MOVED UP */}
      <section 
        id="products" 
        className={`w-full max-w-6xl mb-16 transition-all duration-700 ease-in-out ${visibleSections.products ? 'opacity-100' : 'opacity-0'}`}
      >
        <ProductTabs 
          newArrivals={newArrivals} 
          bestSellers={bestSellers} 
          trending={trending} 
          isLoading={isLoading}
        />
      </section>
      
      {/* Enhanced Search Bar - MOVED UP */}
      <section 
        id="search" 
        ref={searchRef}
        className={`w-full max-w-4xl mb-16 transition-all duration-700 ease-in-out ${visibleSections.search ? 'opacity-100' : 'opacity-0'}`}
      >
        <div className="mb-6 text-center">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={visibleSections.search ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-bold mb-2"
          >
            Find Your Perfect Design
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={visibleSections.search ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-gray-400"
          >
            Browse through our collection of high-quality digital art
          </motion.p>
        </div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={visibleSections.search ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="relative group"
        >
          <input 
            type="text" 
            placeholder="Search posters, wallpapers, or art styles..." 
            className="w-full p-5 pr-12 rounded-full border-2 border-gray-700 bg-gray-800/80 backdrop-blur-sm focus:border-purple-500 outline-none transition-all group-hover:border-purple-400 text-lg shadow-lg"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-purple-600 text-white hover:bg-purple-500 transition-colors">
            <Search size={20} />
          </button>
          
          {/* Visual Filter Options */}
          <div className="mt-4 flex flex-wrap gap-2 justify-center">
            {[
              "JDM cars", "Classic cars", "Cars", "Moto Gp", "F1", "Cosmic", 
              "anime and manga", "Nature", "Animals", "Space(Cosmic)", 
              "Festivals", "2D & 3D", "Abstract", "Patterns"
            ].map(filterName => (
              <motion.button
                key={filterName}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveFilter(filterName.toLowerCase())}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeFilter === filterName.toLowerCase()
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                {filterName}
              </motion.button>
            ))}
          </div>
          
          {/* Quick search suggestions - only show if typing */}
          {searchQuery && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute top-full left-0 right-0 mt-2 bg-gray-800/90 backdrop-blur-md border border-gray-700 rounded-xl shadow-xl z-10 p-2 divide-y divide-gray-700"
            >
              <div className="p-3 hover:bg-gray-700/50 rounded-lg cursor-pointer transition-colors flex items-center gap-2">
                <ImageIcon size={16} className="text-purple-400" />
                <span>Space Nebula Digital Poster</span>
              </div>
              <div className="p-3 hover:bg-gray-700/50 rounded-lg cursor-pointer transition-colors flex items-center gap-2">
                <Monitor size={16} className="text-blue-400" />
                <span>Abstract Desktop Wallpapers</span>
              </div>
              <div className="p-3 hover:bg-gray-700/50 rounded-lg cursor-pointer transition-colors flex items-center gap-2">
                <Smartphone size={16} className="text-green-400" />
                <span>Minimalist Phone Backgrounds</span>
              </div>
            </motion.div>
          )}
        </motion.div>
      </section>
      
      {/* Categories Section with visual examples and animations */}
      <section 
        id="categories" 
        className={`w-full max-w-6xl mb-16 transition-all duration-700 ease-in-out ${visibleSections.categories ? 'opacity-100' : 'opacity-0'}`}
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={visibleSections.categories ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            className="relative inline-block"
          >
            <h2 className="text-3xl font-bold">Explore Categories</h2>
            <motion.div 
              className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-purple-600 to-pink-500 rounded-full"
              animate={{
                width: ["24%", "70%", "24%"],
                opacity: [0.7, 1, 0.7],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            ></motion.div>
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={visibleSections.categories ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ delay: 0.1 }}
            className="text-gray-400 mt-4"
          >
            Browse our curated collections to find your perfect design style
          </motion.p>
        </div>
        
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate={visibleSections.categories ? "visible" : "hidden"}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
        >
          {categories.map((category, index) => (
            <TiltCard
              key={category.id}
              perspective={800}
              tiltMaxAngleX={8}
              tiltMaxAngleY={8}
              intensity={1.1}
              scale={1.04}
              glareEffect={true}
              glareMaxOpacity={0.15}
              glareColor={index % 2 === 0 ? "rgba(192, 132, 252, 0.5)" : "rgba(96, 165, 250, 0.5)"}
              className="h-full"
            >
              <motion.div
                variants={itemVariants}
                className={`relative group overflow-hidden rounded-xl cursor-pointer bg-gradient-to-br ${category.color} border border-white/10 h-full`}
                style={{
                  boxShadow: "0 10px 30px -15px rgba(0, 0, 0, 0.5)",
                }}
              >
                {/* Modern glassmorphism background */}
                <motion.div 
                  className="absolute inset-0 opacity-40"
                  style={{ 
                    backdropFilter: "blur(8px)",
                    background: `radial-gradient(circle at 30% 30%, ${category.color.split('-')[1]}-500/30 0%, transparent 70%), radial-gradient(circle at 70% 70%, ${category.color.split('-')[2]}-500/30 0%, transparent 70%)`,
                  }}
                  animate={{
                    backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'],
                  }}
                  transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: 'linear',
                  }}
                />
                
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-300"></div>
                
                <div className="relative z-10 aspect-square sm:aspect-[4/3] p-4 flex flex-col items-center justify-center backdrop-blur-sm">
                  {/* Animated background elements */}
                  <motion.div 
                    className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -mr-12 -mt-12"
                    animate={{
                      scale: [1, 1.1, 1],
                      opacity: [0.2, 0.4, 0.2],
                      rotate: [0, 10, 0]
                    }}
                    transition={{
                      duration: 10,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: index * 0.5,
                    }}
                  ></motion.div>
                  
                  {/* Enhanced animated icon with new features */}
                  <motion.div 
                    className="relative mb-3 p-3 md:p-4 rounded-full backdrop-blur-sm border border-white/20 transition-all duration-300 
                    group-hover:border-white/30 bg-gradient-to-br from-white/5 to-white/10"
                    whileHover={{
                      boxShadow: "0 0 15px 2px rgba(255, 255, 255, 0.15)",
                      scale: 1.1,
                      transition: { duration: 0.2, ease: "easeOut" }
                    }}
                  >
                    <AnimatedIcon 
                      icon={category.icon} 
                      type={index % 4 === 0 ? "neon" : index % 4 === 1 ? "spatial" : index % 4 === 2 ? "liquid" : "tactile"}
                      size="lg"
                      className="text-white"
                      hoverEffect={index % 2 === 0 ? "glare" : "depth"}
                      glowColor={index % 3 === 0 ? "rgba(255, 255, 255, 0.7)" : index % 3 === 1 ? "rgba(142, 81, 255, 0.7)" : "rgba(59, 130, 246, 0.7)"}
                      duration={index % 2 === 0 ? 4 : 5}
                      isInteractive={true}
                      mobileOptimized={true}
                      glassmorphism={true}
                    />
                  </motion.div>
                  
                  {/* Category Name */}
                  <motion.h3 
                    className="font-bold text-sm sm:text-base md:text-lg lg:text-xl mb-1 text-center group-hover:text-white transition-colors relative z-10"
                    whileHover={{ 
                      scale: 1.05,
                      textShadow: "0 0 10px rgba(255, 255, 255, 0.6)" 
                    }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    {category.name}
                  </motion.h3>
                
                  {/* Bottom row: Spacer and Explore button */}
                  <div className="flex justify-between items-center w-full mt-1 relative z-10">
                    <div className="flex-grow"></div>

                    <Link href="/products" className="block">
                      <motion.div
                        className="flex items-center gap-1 text-white/80 group-hover:text-white transition-colors"
                        whileHover={{ x: 5, transition: { type: 'spring', stiffness: 400, damping: 10 } }}
                        initial={{ opacity: 0.8 }}
                        animate={{ opacity: 1 }}
                      >
                        <span className="relative overflow-hidden group-hover:pr-1 transition-all duration-300 text-xs sm:text-sm font-medium">
                          Explore
                          <motion.span 
                            className="absolute bottom-0 left-0 w-full h-[1.5px] bg-gradient-to-r from-purple-400 to-pink-400"
                            initial={{ scaleX: 0, originX: 0 }}
                            whileHover={{ scaleX: 1 }}
                            transition={{ duration: 0.3, ease: "easeOut" }}
                          />
                        </span>
                        <motion.div
                          animate={{ x: [0, 5, 0] }}
                          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                        >
                          <ChevronRight size={12} className="sm:w-4 sm:h-4" />
                        </motion.div>
                      </motion.div>
                    </Link>
                  </div>
                  
                  {/* Modern glass overlay effect */}
                  <motion.div 
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl overflow-hidden"
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    style={{
                      background: "radial-gradient(circle at center, rgba(255,255,255,0.08) 0%, transparent 60%)",
                      backdropFilter: "blur(3px)",
                    }}
                  />
                  
                  {/* Dynamic border effect */}
                  <motion.div 
                    className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 overflow-hidden"
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                  >
                    <motion.div 
                      className="absolute inset-0 rounded-xl"
                      style={{ 
                        background: "transparent",
                        borderRadius: "inherit",
                        border: "1px solid transparent",
                        backgroundImage: `linear-gradient(to right, ${category.color.split('-')[1]}-400, ${category.color.split('-')[2]}-400)`,
                        backgroundOrigin: "border-box",
                        backgroundClip: "content-box, border-box",
                        boxSizing: "border-box"
                      }}
                      animate={{
                        opacity: [0, 0.7, 0]
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />
                  </motion.div>
                </div>
              </motion.div>
            </TiltCard>
          ))}
        </motion.div>
      </section>
      
      {/* Quick Features Highlight - MOVED DOWN */}
      <section 
        id="features" 
        className={`w-full max-w-6xl mb-16 transition-all duration-700 ease-in-out ${visibleSections.features ? 'opacity-100' : 'opacity-0'}`}
      >
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={visibleSections.features ? "visible" : "hidden"}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8"
        >
          {features.map((feature, idx) => (
            <motion.div 
              key={feature.title}
              variants={itemVariants}
              className="bg-gray-800/50 backdrop-blur-md p-6 rounded-xl border border-gray-700 hover:border-purple-500 transition-colors duration-300 flex flex-col items-center text-center group"
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <div className="mb-4 p-3 bg-gray-700/50 rounded-full transform transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
                {feature.icon}
              </div>
              <h3 className="font-bold text-lg mb-2 text-white">{feature.title}</h3>
              <p className="text-gray-400 text-sm">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Device Compatibility Section */}
      <section className="w-full max-w-6xl mb-16 py-12 bg-gradient-to-r from-purple-900/30 to-indigo-900/30 rounded-2xl backdrop-blur-md relative overflow-hidden">
        {/* Background animated elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute w-64 h-64 -right-20 -top-20 bg-purple-600/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute w-64 h-64 -left-20 -bottom-20 bg-blue-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          
          {/* Grid pattern background */}
          <div className="absolute inset-0 opacity-10" 
            style={{ 
              backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)',
              backgroundSize: '40px 40px',
            }} 
          />
          
          {/* Animated subtle particles */}
          {[...Array(10)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-white/20 w-1 h-1"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
              }}
              animate={{
                opacity: [0, 0.5, 0],
                scale: [0, 1, 0],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 5,
              }}
            />
          ))}
        </div>
        
        <div className="relative z-10 text-center mb-10">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-500"
          >
            Perfect for Any Device
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-gray-300 max-w-xl mx-auto"
          >
            Our digital designs are optimized for all your screens. Get one design and use it everywhere!
          </motion.p>
        </div>
        
        <div className="flex flex-wrap justify-center gap-8">
          {deviceTypes.map((device, idx) => (
            <TiltCard
              key={device.id}
              perspective={1000}
              tiltMaxAngleX={15}
              tiltMaxAngleY={15}
              glareEffect={true}
              glareMaxOpacity={0.3}
              glareColor={idx === 0 ? "rgba(107, 33, 168, 0.4)" : idx === 1 ? "rgba(59, 130, 246, 0.4)" : "rgba(5, 150, 105, 0.4)"}
              className="h-full"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * (idx + 1) }}
                className="flex flex-col items-center bg-gradient-to-br from-gray-800/40 to-gray-900/50 backdrop-blur-md p-4 sm:p-6 rounded-xl border border-gray-700 hover:border-purple-500 transition-all duration-300 w-[150px] sm:w-[180px] md:w-64 relative group"
                style={{
                  boxShadow: "0 10px 30px -15px rgba(0, 0, 0, 0.3)",
                }}
              >
                {/* Animated highlight gradient overlay that moves on hover */}
                <motion.div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl overflow-hidden pointer-events-none"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                >
                  <motion.div 
                    className="absolute w-[200%] h-[200%] bg-gradient-to-r from-transparent via-purple-500/10 to-transparent"
                    animate={{
                      x: ['-200%', '0%'],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      repeatType: 'mirror',
                      ease: "easeInOut",
                    }}
                  />
                </motion.div>
                
                {/* Modern glassmorphism container for the icons */}
                <motion.div 
                  className="p-4 bg-gradient-to-tr from-purple-600/20 to-blue-600/20 rounded-full mb-4 relative group-hover:shadow-lg transition-shadow duration-300 backdrop-blur-sm border border-white/10"
                  animate={{ 
                    rotateY: [-5, 5, -5],
                    rotateX: [2, -2, 2],
                    transition: {
                      duration: 3,
                      repeat: Infinity,
                      repeatType: 'mirror',
                    }
                  }}
                >
                  <AnimatedIcon 
                    icon={device.icon} 
                    type={["spatial", idx === 0 ? "neon" : idx === 1 ? "liquid" : "tactile"]}
                    size="xl"
                    className="text-white"
                    hoverEffect="magnetic"
                    duration={2.5}
                    isInteractive={true}
                    mobileOptimized={true}
                    glassmorphism={true}
                    glowColor={idx === 0 ? "rgba(147, 51, 234, 0.7)" : idx === 1 ? "rgba(37, 99, 235, 0.7)" : "rgba(5, 150, 105, 0.7)"}
                    glowIntensity={0.6}
                  />
                  
                  {/* Decorative ring with new modern style */}
                  <motion.div 
                    className="absolute inset-0 border-2 rounded-full border-white/10"
                    animate={{ 
                      scale: [1, 1.1, 1],
                      opacity: [0.3, 0.6, 0.3],
                      rotate: [0, 360],
                      borderColor: [
                        "rgba(255, 255, 255, 0.1)",
                        `rgba(${idx === 0 ? "147, 51, 234" : idx === 1 ? "37, 99, 235" : "5, 150, 105"}, 0.3)`,
                        "rgba(255, 255, 255, 0.1)"
                      ],
                      boxShadow: [
                        "0 0 0 rgba(255, 255, 255, 0)",
                        `0 0 10px rgba(${idx === 0 ? "147, 51, 234" : idx === 1 ? "37, 99, 235" : "5, 150, 105"}, 0.3)`,
                        "0 0 0 rgba(255, 255, 255, 0)"
                      ]
                    }}
                    transition={{ 
                      duration: 6, 
                      repeat: Infinity, 
                      ease: "linear" 
                    }}
                  />
                </motion.div>
                
                <motion.h3 
                  className="text-lg sm:text-xl font-semibold mb-1 sm:mb-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-300 to-blue-300"
                  whileHover={{
                    textShadow: "0 0 8px rgba(168, 85, 247, 0.4)",
                  }}
                >
                  {device.name}
                </motion.h3>
                
                <p className="text-gray-400 mb-3 text-center text-xs sm:text-sm">Optimized for {device.name} screens</p>
                
                <motion.span 
                  className="text-xs sm:text-sm backdrop-blur-sm px-3 py-1.5 rounded-full border border-gray-700 group-hover:border-purple-500 group-hover:bg-purple-500/10 transition-all duration-300"
                  whileHover={{
                    scale: 1.05,
                  }}
                >
                  {device.size}
                </motion.span>
                
                {/* Modern highlight circle effect */}
                <motion.div
                  className="absolute -inset-1 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-xl opacity-0 group-hover:opacity-40 blur-xl group-hover:blur-2xl transition-all duration-500"
                  animate={{
                    scale: [0.95, 1.05, 0.95],
                    background: [
                      "linear-gradient(to right, rgba(147, 51, 234, 0.2), rgba(37, 99, 235, 0.2))",
                      "linear-gradient(to right, rgba(37, 99, 235, 0.2), rgba(147, 51, 234, 0.2))",
                      "linear-gradient(to right, rgba(147, 51, 234, 0.2), rgba(37, 99, 235, 0.2))",
                    ]
                  }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              </motion.div>
            </TiltCard>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="w-full max-w-5xl mb-16">
        <div className="text-center mb-10">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-bold mb-3"
          >
            How It Works
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-gray-400 max-w-xl mx-auto"
          >
            Get your perfect digital art in just a few simple steps
          </motion.p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Connecting line for desktop */}
          <div className="absolute top-1/4 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-600 to-blue-600 hidden md:block"></div>
          
          {[
            { 
              step: 1, 
              title: "Browse & Select", 
              icon: <MousePointer size={24} className="text-purple-400" />,
              description: "Choose from our extensive collection of digital posters and wallpapers"
            },
            { 
              step: 2, 
              title: "Purchase & Download", 
              icon: <ShoppingCart size={24} className="text-blue-400" />,
              description: "Securely checkout and instantly download your high-resolution files"
            },
            { 
              step: 3, 
              title: "Enjoy Your Art", 
              icon: <Heart size={24} className="text-pink-400" />,
              description: "Print your posters or set as wallpaper on any of your devices"
            }
          ].map((item, idx) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 * idx }}
              className="flex flex-col items-center text-center z-10"
            >
              <div className="w-16 h-16 rounded-full bg-gray-800 border-2 border-gray-700 flex items-center justify-center mb-4 relative">
                <div className="absolute inset-0 rounded-full bg-purple-600/20 animate-pulse"></div>
                <span className="text-xl font-bold">{item.step}</span>
              </div>
              <div className="p-6 bg-gray-800/50 backdrop-blur-md rounded-xl border border-gray-700 w-full">
                <div className="mb-3 flex justify-center">
                  <div className="p-3 bg-gray-700/50 rounded-full">
                    {item.icon}
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-400 text-sm">{item.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
      
      {/* Newsletter Section with enhanced design */}
      <section 
        id="newsletter" 
        className={`w-full max-w-5xl mb-16 transition-all duration-700 ease-in-out ${visibleSections.newsletter ? 'opacity-100' : 'opacity-0'}`}
      >
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={visibleSections.newsletter ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.7 }}
          className="bg-gradient-to-r from-purple-900 to-indigo-900 rounded-2xl p-10 md:p-12 relative overflow-hidden"
        >
          {/* Animated background elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 animate-blob"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full -ml-32 -mb-32 animate-blob delay-400"></div>
          <div className="absolute top-1/4 right-1/4 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
          
          <div className="relative z-10">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">Get Exclusive Updates</h2>
              <p className="text-gray-300 max-w-md mx-auto">
                Subscribe to our newsletter for new releases, special discounts, and design inspiration.
              </p>
            </div>
            <div className="flex flex-col md:flex-row gap-4 max-w-xl mx-auto">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="flex-grow p-4 rounded-lg border border-gray-700 bg-gray-800/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button className="whitespace-nowrap bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 w-full md:w-auto">
                  Subscribe
                </Button>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </section>
      
      {/* Back to Top Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 z-50 p-3 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 text-white shadow-lg hover:from-purple-500 hover:to-blue-500 transition-all duration-300 transform hover:scale-110"
            aria-label="Scroll back to top"
          >
            <ArrowUp size={20} />
          </motion.button>
        )}
      </AnimatePresence>
    </main>
  );
}
