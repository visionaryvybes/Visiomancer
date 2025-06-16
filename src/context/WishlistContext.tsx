'use client';

import React, { createContext, useState, useContext, useEffect, useCallback, ReactNode } from 'react';
import toast from 'react-hot-toast';

interface WishlistContextType {
  wishlist: string[]; // Array of product IDs
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  loadWishlist: () => void; // Function to explicitly load from storage if needed
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'storeWishlist';

export const WishlistProvider = ({ children }: { children: ReactNode }) => {
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false); // Flag to prevent hydration issues

  // Load wishlist from localStorage on initial mount (client-side only)
  useEffect(() => {
    try {
      const storedWishlist = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (storedWishlist) {
        const parsed = JSON.parse(storedWishlist);
        setWishlist(parsed);
      }
    } catch (error) {
      console.error("Error reading wishlist from localStorage:", error);
    }
    setIsLoaded(true); // Mark as loaded after attempting to read
  }, []);

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    if (isLoaded) { // Only save after initial load
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(wishlist));
      } catch (error) {
        console.error("Error saving wishlist to localStorage:", error);
      }
    }
  }, [wishlist, isLoaded]);

  const toggleWishlist = useCallback((productId: string) => {
    setWishlist(prev => {
      const isCurrentlyInWishlist = prev.includes(productId);
      
      let newWishlist;
      if (isCurrentlyInWishlist) {
        newWishlist = prev.filter(id => id !== productId);
        toast.success('Removed from wishlist', { id: `wishlist-${productId}` });
      } else {
        newWishlist = [...prev, productId];
        toast.success('Added to wishlist', { id: `wishlist-${productId}` });
      }
      return newWishlist;
    });
  }, []);

  const isInWishlist = useCallback((productId: string): boolean => {
    return wishlist.includes(productId);
  }, [wishlist]);

  // Function to manually trigger loading (might be useful in some scenarios)
  const loadWishlist = useCallback(() => {
     try {
      const storedWishlist = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (storedWishlist) {
        setWishlist(JSON.parse(storedWishlist));
      }
    } catch (error) {
      console.error("Error reading wishlist from localStorage:", error);
    }
  }, []);

  // Prevent rendering children until loaded state is confirmed to avoid hydration mismatch
  if (!isLoaded) {
    return null; // Or a loading indicator if preferred
  }

  return (
    <WishlistContext.Provider value={{ wishlist, toggleWishlist, isInWishlist, loadWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

// Custom hook to use the wishlist context
export const useWishlist = (): WishlistContextType => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}; 