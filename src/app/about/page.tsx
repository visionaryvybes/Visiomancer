"use client";

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import {
  Sparkles, // For mission/vision
  Feather,  // For creativity/story
  Download, // For instant access
  CheckCircle, // For quality
  Heart,    // For passion/values
  Eye,      // For vision/curation
  Palette,  // For design/art
  ArrowRight
} from 'lucide-react';

// Animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      duration: 0.6, 
      ease: "easeOut" 
    }
  }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.15
    }
  }
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 text-white">
      {/* Hero Section */}
      <motion.section 
        className="py-24 md:py-32 text-center relative overflow-hidden bg-gradient-to-r from-purple-900 via-indigo-900 to-blue-900"
        initial="initial"
        animate="animate"
        variants={fadeInUp}
      >
        {/* Subtle background elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-64 h-64 bg-purple-500 rounded-full blur-3xl animate-blob"></div>
          <div className="absolute bottom-0 right-0 w-72 h-72 bg-blue-500 rounded-full blur-3xl animate-blob animation-delay-400"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div variants={fadeInUp}>
            <Sparkles className="mx-auto h-12 w-12 text-purple-400 mb-4" />
          </motion.div>
          <motion.h1 
            className="text-4xl md:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400"
            variants={fadeInUp}
          >
            About Visiomancer
          </motion.h1>
          <motion.p 
            className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-8"
            variants={fadeInUp}
          >
            Transforming your digital spaces with stunning, high-resolution visuals. We curate unique digital posters and wallpapers, instantly delivered.
          </motion.p>
        </div>
      </motion.section>

      {/* Main Content Area */}
      <div className="container mx-auto px-4 py-16 md:py-24">
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center mb-16 md:mb-24"
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          {/* Our Story Section */}
          <motion.div variants={fadeInUp}>
            <div className="flex items-center mb-4">
              <Feather className="h-8 w-8 text-indigo-400 mr-3" />
              <h2 className="text-3xl font-semibold">Our Story</h2>
            </div>
            <p className="text-gray-400 mb-4">
              Visiomancer began with a simple idea: making exceptional digital art accessible to everyone. Inspired by the opportunity to infuse digital spaces with unique artistic flair, we set out to curate a collection that inspires.
            </p>
            <p className="text-gray-400">
              Leveraging modern technology and a keen eye for design, we deliver premium, instantly downloadable designs that elevate your everyday digital experience, from desktops and mobile devices to printed posters.
            </p>
          </motion.div>

          {/* What We Offer Section */}
          <motion.div 
            variants={fadeInUp} 
            className="bg-gray-800/50 p-8 rounded-xl border border-gray-700 shadow-lg"
          >
            <div className="flex items-center mb-4">
              <Palette className="h-8 w-8 text-green-400 mr-3" />
              <h2 className="text-3xl font-semibold">What We Offer</h2>
            </div>
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-1 flex-shrink-0" />
                <span>Curated collection of unique digital posters and wallpapers.</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-1 flex-shrink-0" />
                <span>Ultra high-resolution files (300 DPI) for crisp visuals on any screen or print.</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-1 flex-shrink-0" />
                <span>Instant digital downloads via Gumroad – no waiting, no shipping fees.</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-1 flex-shrink-0" />
                <span>Designs optimized for various devices (desktop, mobile, tablet).</span>
              </li>
            </ul>
          </motion.div>
        </motion.div>

        {/* Our Values Section */}
        <motion.section 
          className="mb-16 md:mb-24 text-center"
          variants={fadeInUp}
          initial="initial"
          animate="animate"
        >
          <Heart className="mx-auto h-10 w-10 text-red-400 mb-4" />
          <h2 className="text-3xl font-semibold mb-8">Our Core Values</h2>
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={staggerContainer}
          >
            {[ 
              { icon: <Eye className="text-purple-400" />, title: "Curated Vision", desc: "Hand-picking unique and inspiring digital art." },
              { icon: <CheckCircle className="text-green-400" />, title: "Uncompromising Quality", desc: "Ensuring every design meets high-resolution standards." },
              { icon: <Download className="text-blue-400" />, title: "Instant Accessibility", desc: "Making beautiful art instantly available worldwide." }
            ].map((value) => (
              <motion.div 
                key={value.title} 
                variants={fadeInUp}
                className="bg-gray-800/40 p-6 rounded-lg border border-gray-700 hover:border-purple-500 transition-colors duration-300"
              >
                <div className="mb-3 inline-block p-3 bg-gray-700/50 rounded-full">
                  {React.cloneElement(value.icon, { size: 24 })}
                </div>
                <h3 className="text-xl font-semibold mb-2 text-white">{value.title}</h3>
                <p className="text-gray-400 text-sm">{value.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.section>

        {/* Call to Action Section */}
        <motion.section 
          className="text-center bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg py-12 px-6"
          variants={fadeInUp}
          initial="initial"
          animate="animate"
        >
          <h2 className="text-3xl font-bold mb-4">Ready to Reimagine Your Space?</h2>
          <p className="text-indigo-100 mb-8 max-w-xl mx-auto">
            Explore our collection and find the perfect digital artwork to express your style.
          </p>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button asChild size="lg" variant="secondary" className="bg-white text-indigo-700 hover:bg-gray-100">
              <Link href="/products">
                Browse Products <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </motion.div>
        </motion.section>

      </div>
    </div>
  );
} 