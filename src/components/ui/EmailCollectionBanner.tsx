'use client';

import React, { useState } from 'react';
import { useConversions } from '@/context/ConversionsContext';

interface EmailCollectionBannerProps {
  isVisible: boolean;
  onClose: () => void;
}

export default function EmailCollectionBanner({ isVisible, onClose }: EmailCollectionBannerProps) {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { setUserEmail } = useConversions();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !email.includes('@')) {
      setError('Please enter a valid email');
      return;
    }

    setIsLoading(true);

    try {
      // Store email for Pinterest tracking
      setUserEmail(email);
      
      // Close banner after brief delay
      setTimeout(() => {
        onClose();
        setIsLoading(false);
      }, 1000);
      
    } catch (err) {
      setError('Something went wrong. Please try again.');
      setIsLoading(false);
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-2 sm:py-3">
        
        {/* Mobile Layout */}
        <div className="sm:hidden">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-medium flex-1">
              📧 Get exclusive updates
            </p>
            <button
              onClick={onClose}
              className="p-1 hover:bg-white/20 rounded-md transition-colors"
              aria-label="Close banner"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <form onSubmit={handleSubmit} className="flex items-center space-x-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your.email@example.com"
              className="flex-1 px-2 py-1 text-xs rounded border-0 bg-white/90 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-white/50"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading}
              className="px-3 py-1 text-xs bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded font-medium transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Saving...' : 'Save'}
            </button>
          </form>
          {error && (
            <div className="mt-1 text-xs text-red-200">
              {error}
            </div>
          )}
        </div>

        {/* Desktop Layout */}
        <div className="hidden sm:flex items-center justify-between">
          {/* Left side - Message */}
          <div className="flex items-center space-x-4 flex-1">
            <div className="hidden lg:block">
              <svg className="w-5 h-5 text-purple-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">
                📧 Get updates on new artwork and exclusive offers
              </p>
            </div>
          </div>

          {/* Center - Email Form */}
          <form onSubmit={handleSubmit} className="flex items-center space-x-2 mx-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your.email@example.com"
              className="px-3 py-1.5 text-sm rounded-md border-0 bg-white/90 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/50 w-48 lg:w-56"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-1.5 text-sm bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-md font-medium transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Saving...' : 'Save'}
            </button>
          </form>

          {/* Right side - Close button */}
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/20 rounded-md transition-colors ml-2"
            aria-label="Close banner"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Desktop Error message */}
        {error && (
          <div className="hidden sm:block mt-2 text-sm text-red-200">
            {error}
          </div>
        )}
      </div>
    </div>
  );
} 