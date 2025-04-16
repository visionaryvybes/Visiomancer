"use client"; // Mark this component as a Client Component

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingBagIcon,
  HeartIcon,
  MagnifyingGlassIcon,
  SunIcon,
  MoonIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { useCart } from '@/context/CartContext'; // Import useCart

interface StoreLayoutProps {
  children: React.ReactNode;
}

export default function StoreLayout({ children }: StoreLayoutProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { getItemCount } = useCart(); // Get getItemCount from context

  // Check if page is scrolled
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle theme switching
  useEffect(() => {
    console.log('[DarkMode Init] Starting theme initialization');
    // Check local storage or system preference
    const storedDarkMode = localStorage.getItem('darkMode');
    console.log('[DarkMode Init] darkMode value in localStorage:', storedDarkMode);
    
    let newDarkMode: boolean;
    if (storedDarkMode !== null) {
      // Use stored preference if available
      newDarkMode = storedDarkMode === 'true';
      console.log('[DarkMode Init] Using stored preference:', newDarkMode);
    } else {
      // Otherwise check system preference
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      newDarkMode = systemPrefersDark;
      console.log('[DarkMode Init] No stored preference, using system preference:', newDarkMode);
      // Store the system preference
      localStorage.setItem('darkMode', systemPrefersDark.toString());
    }
    
    // Always ensure state and DOM are in sync
    setIsDarkMode(newDarkMode);
    document.documentElement.classList.toggle('dark', newDarkMode);
    console.log('[DarkMode Init] Set dark mode to:', newDarkMode);
    console.log('[DarkMode Init] Dark class applied to HTML:', document.documentElement.classList.contains('dark'));
  }, []);

  const toggleDarkMode = () => {
    console.log('[toggleDarkMode] Before toggle. Current isDarkMode:', isDarkMode);
    setIsDarkMode(!isDarkMode);
    console.log('[toggleDarkMode] After toggle. New isDarkMode value will be:', !isDarkMode);
    document.documentElement.classList.toggle('dark');
    console.log('[toggleDarkMode] Updated document class. dark class applied:', document.documentElement.classList.contains('dark'));
    localStorage.setItem('darkMode', (!isDarkMode).toString());
    console.log('[toggleDarkMode] Updated localStorage. New darkMode value:', (!isDarkMode).toString());
  };

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Products', href: '/products' },
    { name: 'About', href: '/about' },
  ];

  // Search state and handler
  const [searchQuery, setSearchQuery] = useState('');
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-gray-950">
      {/* Header */}
      <header 
        className={`sticky top-0 z-40 transition-all duration-300 ${
          isScrolled 
            ? 'bg-white/80 backdrop-blur-md shadow-sm dark:bg-gray-900/80' 
            : 'bg-white dark:bg-gray-900'
        }`}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link href="/">
                <motion.div 
                  className="flex items-center"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {/* Apply gradient text effect */}
                  <span className="text-2xl font-bold 
                                 bg-gradient-to-r from-blue-400 to-purple-500 
                                 text-transparent bg-clip-text">
                    Visiomancer
                  </span>
                </motion.div>
              </Link>
            </div>
            
            {/* Navigation - Desktop */}
            <nav className="hidden md:flex space-x-8">
              {navLinks.map((link) => (
                <Link key={link.name} href={link.href}>
                  <motion.span 
                    className={`inline-flex items-center px-1 pt-1 text-sm font-medium transition-colors ${
                      pathname === link.href
                        ? 'border-b-2 border-indigo-500 text-gray-900 dark:text-white'
                        : 'border-b-2 border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-300 dark:hover:border-gray-700 dark:hover:text-gray-200'
                    }`}
                    whileHover={{ y: -1 }}
                    whileTap={{ y: 0 }}
                  >
                    {link.name}
                  </motion.span>
                </Link>
              ))}
            </nav>

            {/* Icons - Reordered for better hierarchy */}
            <div className="flex items-center space-x-3">
              {/* Search - Updated to be a form (Keep first) */}
              <form onSubmit={handleSearchSubmit} className="relative">
                <input 
                  type="search" 
                  placeholder="Search..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="hidden md:block w-48 rounded-full p-2 pl-4 pr-10 border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  aria-label="Search products"
                />
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="absolute right-0 top-0 h-full px-3 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white md:bg-transparent md:dark:bg-transparent md:hover:bg-transparent md:dark:hover:bg-transparent"
                  aria-label="Submit search"
                >
                  <MagnifyingGlassIcon className="h-5 w-5" />
                </motion.button>
              </form>
              
              {/* Wishlist - Updated to link (Second) */}
              <Link href="/wishlist" passHref>
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white cursor-pointer"
                  aria-label="Wishlist"
                >
                  <HeartIcon className="h-5 w-5" />
                </motion.div>
              </Link>

              {/* Cart - Link already exists (Third) */}
              <Link href="/cart" passHref>
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="relative rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white cursor-pointer"
                  aria-label="Shopping Cart"
                >
                  <ShoppingBagIcon className="h-5 w-5" />
                  {getItemCount() > 0 && (
                    <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-xs font-medium text-white">
                      {getItemCount()}
                    </span>
                  )}
                </motion.div>
              </Link>

              {/* Dark mode toggle (Fourth) */}
              <motion.button
                whileHover={{ scale: 1.1, rotate: 15 }}
                whileTap={{ scale: 0.9 }}
                className="rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
                onClick={toggleDarkMode}
                aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                <AnimatePresence mode="wait">
                  {isDarkMode ? (
                    <motion.div
                      key="moon"
                      initial={{ opacity: 0, rotate: -90 }}
                      animate={{ opacity: 1, rotate: 0 }}
                      exit={{ opacity: 0, rotate: 90 }}
                      transition={{ duration: 0.3 }}
                    >
                      <SunIcon className="h-5 w-5" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="sun"
                      initial={{ opacity: 0, rotate: 90 }}
                      animate={{ opacity: 1, rotate: 0 }}
                      exit={{ opacity: 0, rotate: -90 }}
                      transition={{ duration: 0.3 }}
                    >
                      <MoonIcon className="h-5 w-5" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
                            
              {/* Mobile menu button (Keep last) */}
              <div className="flex md:hidden">
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  className="inline-flex items-center justify-center rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  aria-expanded={isMobileMenuOpen}
                >
                  <span className="sr-only">Open main menu</span>
                  {isMobileMenuOpen ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </motion.button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Mobile Navigation Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden"
            >
              <div className="space-y-1 px-2 pb-3 pt-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`block rounded-md px-3 py-2 text-base font-medium transition-colors ${
                      pathname === link.href
                        ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900 dark:text-white'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)} // Close menu on click
                  >
                    {link.name}
                  </Link>
                ))}
                {/* Add mobile links for icons */}
                <Link href="/wishlist" className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white" onClick={() => setIsMobileMenuOpen(false)}>Wishlist</Link>
                {/* Add mobile search input */}
                <form onSubmit={handleSearchSubmit} className="px-3 pt-2">
                  <input 
                    type="search" 
                    placeholder="Search..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full rounded-md p-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    aria-label="Search products mobile"
                  />
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 dark:bg-gray-900 py-6 mt-auto">
        <div className="container mx-auto px-4 text-center text-gray-500 dark:text-gray-400 text-sm">
          &copy; {new Date().getFullYear()} Visiomancer, Inc. All rights reserved.
        </div>
      </footer>
    </div>
  );
} 