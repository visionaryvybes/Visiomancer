"use client"; // Mark this component as a Client Component

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import NextImage from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import {
  ShoppingBagIcon,
  HeartIcon,
  MagnifyingGlassIcon,
  SunIcon,
  MoonIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { useCart } from '@/context/CartContext';
import { FaPinterest, FaTiktok } from 'react-icons/fa';

interface StoreLayoutProps {
  children: React.ReactNode;
}

export default function StoreLayout({ children }: StoreLayoutProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const pathname = usePathname();
  const router = useRouter();
  const { getItemCount } = useCart();

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
    const storedDarkMode = localStorage.getItem('darkMode');
    let newDarkMode: boolean;
    if (storedDarkMode !== null) {
      newDarkMode = storedDarkMode === 'true';
    } else {
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      newDarkMode = systemPrefersDark;
      localStorage.setItem('darkMode', systemPrefersDark.toString());
    }
    setIsDarkMode(newDarkMode);
    document.documentElement.classList.toggle('dark', newDarkMode);
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
    localStorage.setItem('darkMode', (!isDarkMode).toString());
  };

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Products', href: '/products' },
    { name: 'About', href: '/about' },
    { name: 'Analytics', href: '/conversions' },
  ];

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
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${
          isScrolled 
            ? 'bg-white/90 backdrop-blur-md shadow-sm dark:bg-gray-900/90' 
            : 'bg-white dark:bg-gray-900'
        }`}
      >
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            
            {/* Left side - Social Icons */}
            <div className="hidden lg:flex items-center space-x-4 flex-shrink-0">
              <Link 
                href="https://www.pinterest.com/VISIOMANCER/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-black dark:text-gray-400 dark:hover:text-white transition-colors"
              >
                <FaPinterest size={20} />
              </Link>
              <Link 
                href="https://www.tiktok.com/@visiomancer" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-black dark:text-gray-400 dark:hover:text-white transition-colors"
              >
                <FaTiktok size={20} />
              </Link>
            </div>

            {/* Logo - Centered on mobile, left-center on desktop */}
            <div className="flex-shrink-0 flex-1 flex justify-center lg:flex-1 lg:justify-start lg:ml-8">
              <Link href="/" className="flex items-center space-x-2 sm:space-x-3 hover:opacity-80 transition-opacity">
                <NextImage 
                  src="/images/logo.png" 
                  alt="Visiomancer Logo" 
                  width={40} 
                  height={40} 
                  className="w-8 h-8 sm:w-10 sm:h-10 object-contain"
                  priority
                />
                <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text font-heading">
                  Visiomancer
                </span>
              </Link>
            </div>
            
            {/* Navigation - Desktop */}
            <nav className="hidden lg:flex space-x-6 xl:space-x-8 flex-shrink-0">
              {navLinks.map((link) => (
                <Link key={link.name} href={link.href}>
                  <span 
                    className={`inline-flex items-center px-1 pt-1 text-sm font-medium transition-colors hover:text-gray-900 dark:hover:text-white ${
                      pathname === link.href
                        ? 'border-b-2 border-indigo-500 text-gray-900 dark:text-white'
                        : 'border-b-2 border-transparent text-gray-500 dark:text-gray-300'
                    }`}
                  >
                    {link.name}
                  </span>
                </Link>
              ))}
            </nav>

            {/* Right side icons */}
            <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
              {/* Search - Hidden on mobile */}
              <form onSubmit={handleSearchSubmit} className="relative hidden md:block">
                <input 
                  type="search" 
                  placeholder="Search..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-32 lg:w-48 rounded-full p-2 pl-4 pr-10 border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                  aria-label="Search products"
                />
                <button
                  type="submit"
                  className="absolute right-0 top-0 h-full px-3 rounded-full text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
                  aria-label="Submit search"
                >
                  <MagnifyingGlassIcon className="h-4 w-4 lg:h-5 lg:w-5" />
                </button>
              </form>
              
              {/* Mobile Search */}
              <button className="md:hidden rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white transition-colors">
                <MagnifyingGlassIcon className="h-5 w-5" />
              </button>
              
              {/* Wishlist */}
              <Link href="/wishlist" className="rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white transition-colors">
                <HeartIcon className="h-5 w-5" />
              </Link>

              {/* Cart */}
              <Link href="/cart" className="relative rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white transition-colors">
                <ShoppingBagIcon className="h-5 w-5" />
                {getItemCount() > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-xs font-medium text-white">
                    {getItemCount()}
                  </span>
                )}
              </Link>

              {/* Dark mode toggle */}
              <button
                className="rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white transition-colors"
                onClick={toggleDarkMode}
                aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {isDarkMode ? (
                  <SunIcon className="h-5 w-5" />
                ) : (
                  <MoonIcon className="h-5 w-5" />
                )}
              </button>
                            
              {/* Mobile menu button */}
              <div className="flex lg:hidden">
                <button
                  className="inline-flex items-center justify-center rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white transition-colors"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  aria-expanded={isMobileMenuOpen}
                >
                  <span className="sr-only">Open main menu</span>
                  {isMobileMenuOpen ? (
                    <XMarkIcon className="block h-6 w-6" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 dark:border-gray-700">
            <div className="space-y-1 px-4 pb-3 pt-2">
              {/* Mobile Search */}
              <form onSubmit={handleSearchSubmit} className="mb-4">
                <div className="relative">
                  <input 
                    type="search" 
                    placeholder="Search..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full rounded-full p-3 pl-4 pr-12 border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    aria-label="Search products"
                  />
                  <button
                    type="submit"
                    className="absolute right-0 top-0 h-full px-4 rounded-full text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
                    aria-label="Submit search"
                  >
                    <MagnifyingGlassIcon className="h-5 w-5" />
                  </button>
                </div>
              </form>

              {/* Mobile Navigation */}
              {navLinks.map((link) => (
                <Link key={link.name} href={link.href}>
                  <span 
                    className={`block rounded-md px-3 py-2 text-base font-medium transition-colors ${
                      pathname === link.href
                        ? 'bg-indigo-50 border-l-4 border-indigo-500 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-200'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.name}
                  </span>
                </Link>
              ))}

              {/* Mobile Social Links */}
              <div className="flex space-x-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <Link 
                  href="https://www.pinterest.com/VISIOMANCER/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-black dark:text-gray-400 dark:hover:text-white transition-colors"
                >
                  <FaPinterest size={24} />
                </Link>
                <Link 
                  href="https://www.tiktok.com/@visiomancer" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-black dark:text-gray-400 dark:hover:text-white transition-colors"
                >
                  <FaTiktok size={24} />
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <div className="flex-1 w-full">
        {children}
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            
            {/* Company Info */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <NextImage 
                  src="/images/logo.png" 
                  alt="Visiomancer Logo" 
                  width={32} 
                  height={32} 
                  className="w-8 h-8 object-contain"
                />
                <span className="text-lg font-bold bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text font-heading">
                  Visiomancer
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300 font-base">
                Premium digital art designs and visual assets for creators and businesses.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4 font-heading">
                Quick Links
              </h3>
              <ul className="space-y-2">
                {navLinks.map((link) => (
                  <li key={link.name}>
                    <Link 
                      href={link.href}
                      className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors font-base"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4 font-heading">
                Support
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/cart" className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors font-base">
                    My Cart
                  </Link>
                </li>
                <li>
                  <Link href="/wishlist" className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors font-base">
                    Wishlist
                  </Link>
                </li>
              </ul>
            </div>

            {/* Connect */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4 font-heading">
                Connect
              </h3>
              <div className="flex space-x-4">
                <Link 
                  href="https://www.pinterest.com/VISIOMANCER/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-black dark:text-gray-400 dark:hover:text-white transition-colors"
                >
                  <FaPinterest size={20} />
                </Link>
                <Link 
                  href="https://www.tiktok.com/@visiomancer" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-black dark:text-gray-400 dark:hover:text-white transition-colors"
                >
                  <FaTiktok size={20} />
                </Link>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
            <p className="text-center text-sm text-gray-600 dark:text-gray-300 font-base">
              © 2024 Visiomancer. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
} 