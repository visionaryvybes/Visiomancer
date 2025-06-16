import { useEffect } from 'react';
import { useConversions } from '@/context/ConversionsContext';

export const usePageTracking = (
  productId?: string, 
  productName?: string, 
  category?: string
) => {
  const { trackPageVisit } = useConversions();

  useEffect(() => {
    // Track page visit when component mounts
    trackPageVisit(productId, productName, category);
  }, [trackPageVisit, productId, productName, category]);
}; 