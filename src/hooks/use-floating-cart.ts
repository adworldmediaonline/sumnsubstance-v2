'use client';

import { useEffect, useState, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { useCartItems } from '@/store/cart-store';

export function useFloatingCart() {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [lastItemCount, setLastItemCount] = useState(0);
  const items = useCartItems();
  const pathname = usePathname();

  const itemCount = items.length;

  // Check if user is on cart or checkout page
  const isCartPage = pathname === '/cart' || pathname === '/checkout';

  // Show floating cart when item is added
  useEffect(() => {
    if (itemCount > lastItemCount && itemCount > 0 && !isCartPage) {
      // New item added - show cart temporarily
      setIsVisible(true);
      setIsDismissed(false);

      // Auto-hide after 5 seconds
      const timer = setTimeout(() => {
        setIsVisible(false);
        setIsDismissed(true);
      }, 5000);

      setLastItemCount(itemCount);
      return () => clearTimeout(timer);
    } else if (itemCount === 0) {
      // Cart is empty - hide and reset
      setIsVisible(false);
      setIsDismissed(false);
      setLastItemCount(itemCount);
    } else {
      // Update last item count to stay in sync
      setLastItemCount(itemCount);
    }
  }, [itemCount, isCartPage, lastItemCount]);

  // Hide when on cart/checkout page
  useEffect(() => {
    if (isCartPage) {
      setIsVisible(false);
    }
  }, [isCartPage]);

  const dismiss = useCallback(() => {
    setIsVisible(false);
    setIsDismissed(true);
  }, []);

  const show = useCallback(() => {
    setIsVisible(true);
    setIsDismissed(false);
  }, []);

  return {
    isVisible,
    dismiss,
    show,
    itemCount,
  };
}

