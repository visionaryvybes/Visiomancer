'use client';

import React, { createContext, useContext, useCallback, ReactNode, useState } from 'react';

interface ConversionEvent {
  event_name: 'page_visit' | 'add_to_cart' | 'checkout';
  action_source: 'website';
  event_time: number;
  event_id: string;
  email?: string; // Add email to the event data
  user_data: {
    em?: string[]; // hashed emails
    external_id?: string;
    click_id?: string;
    client_ip_address?: string;
    client_user_agent?: string;
  };
  custom_data: {
    product_ids?: string[];
    value?: number;
    currency?: string;
    content_name?: string;
    content_category?: string;
    num_items?: number;
  };
}

interface ConversionsContextType {
  trackPageVisit: (productId?: string, productName?: string, category?: string, email?: string) => void;
  trackAddToCart: (productId: string, productName: string, value: number, currency?: string, email?: string) => void;
  trackCheckout: (productIds: string[], value: number, currency?: string, numItems?: number, email?: string) => void;
  getConversions: () => ConversionEvent[];
  clearConversions: () => void;
  setUserEmail: (email: string) => void;
  getUserEmail: () => string | null;
}

const ConversionsContext = createContext<ConversionsContextType | undefined>(undefined);

export const ConversionsProvider = ({ children }: { children: ReactNode }) => {
  // Store conversions in memory for this session
  const conversions: ConversionEvent[] = [];
  const [userEmail, setUserEmailState] = useState<string | null>(null);

  const generateEventId = useCallback(() => {
    return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }, []);

  const getUserData = useCallback(() => {
    return {
      client_ip_address: undefined, // Will be set server-side
      client_user_agent: typeof window !== 'undefined' ? window.navigator.userAgent : undefined,
    };
  }, []);

  const setUserEmail = useCallback((email: string) => {
    setUserEmailState(email);
    // Store in localStorage for persistence
    if (typeof window !== 'undefined') {
      localStorage.setItem('visiomancer_user_email', email);
    }
  }, []);

  const getUserEmail = useCallback(() => {
    if (userEmail) return userEmail;
    // Try to get from localStorage
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('visiomancer_user_email');
      if (stored) {
        setUserEmailState(stored);
        return stored;
      }
    }
    return null;
  }, [userEmail]);

  const trackPageVisit = useCallback((productId?: string, productName?: string, category?: string, email?: string) => {
    const currentEmail = email || getUserEmail();
    
    const event: ConversionEvent = {
      event_name: 'page_visit',
      action_source: 'website',
      event_time: Math.floor(Date.now() / 1000),
      event_id: generateEventId(),
      ...(currentEmail && { email: currentEmail }),
      user_data: getUserData(),
      custom_data: {
        ...(productId && { product_ids: [productId] }),
        ...(productName && { content_name: productName }),
        ...(category && { content_category: category }),
      }
    };

    conversions.push(event);
    
    // Send to Pinterest API
    sendConversionEvent(event);
    
    console.log('[Conversions] Page Visit tracked:', event);
  }, [generateEventId, getUserData, getUserEmail]);

  const trackAddToCart = useCallback((productId: string, productName: string, value: number, currency: string = 'USD', email?: string) => {
    const currentEmail = email || getUserEmail();
    
    const event: ConversionEvent = {
      event_name: 'add_to_cart',
      action_source: 'website',
      event_time: Math.floor(Date.now() / 1000),
      event_id: generateEventId(),
      ...(currentEmail && { email: currentEmail }),
      user_data: getUserData(),
      custom_data: {
        product_ids: [productId],
        content_name: productName,
        value: value,
        currency: currency,
        num_items: 1
      }
    };

    conversions.push(event);
    
    // Send to Pinterest API
    sendConversionEvent(event);
    
    console.log('[Conversions] Add to Cart tracked:', event);
  }, [generateEventId, getUserData, getUserEmail]);

  const trackCheckout = useCallback((productIds: string[], value: number, currency: string = 'USD', numItems?: number, email?: string) => {
    const currentEmail = email || getUserEmail();
    
    const event: ConversionEvent = {
      event_name: 'checkout',
      action_source: 'website',
      event_time: Math.floor(Date.now() / 1000),
      event_id: generateEventId(),
      ...(currentEmail && { email: currentEmail }),
      user_data: getUserData(),
      custom_data: {
        product_ids: productIds,
        value: value,
        currency: currency,
        num_items: numItems || productIds.length
      }
    };

    conversions.push(event);
    
    // Send to Pinterest API
    sendConversionEvent(event);
    
    console.log('[Conversions] Checkout tracked:', event);
  }, [generateEventId, getUserData, getUserEmail]);

  const sendConversionEvent = useCallback(async (event: ConversionEvent) => {
    try {
      const response = await fetch('/api/conversions/track', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(event),
      });

      if (!response.ok) {
        console.error('[Conversions] Failed to send event:', response.statusText);
      } else {
        const result = await response.json();
        console.log('[Conversions] Event sent successfully:', result);
      }
    } catch (error) {
      console.error('[Conversions] Error sending event:', error);
    }
  }, []);

  const getConversions = useCallback(() => {
    return [...conversions];
  }, []);

  const clearConversions = useCallback(() => {
    conversions.length = 0;
  }, []);

  return (
    <ConversionsContext.Provider value={{
      trackPageVisit,
      trackAddToCart,
      trackCheckout,
      getConversions,
      clearConversions,
      setUserEmail,
      getUserEmail
    }}>
      {children}
    </ConversionsContext.Provider>
  );
};

export const useConversions = () => {
  const context = useContext(ConversionsContext);
  if (context === undefined) {
    throw new Error('useConversions must be used within a ConversionsProvider');
  }
  return context;
}; 