'use client';

import React from 'react';
import Link from 'next/link';
import {
  ShoppingCart,
  CreditCard,
  Shield,
  Truck,
  ArrowRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  useCartItems,
  useCartItemCount,
  useCartTotalPrice,
  useCartLoading,
} from '@/store/cart-store';

export function CartSummary() {
  const items = useCartItems();
  const count = useCartItemCount();
  const subtotal = useCartTotalPrice();
  const loading = useCartLoading();

  // Calculate total (GST and shipping managed from dashboard)
  const total = subtotal;

  if (items.length === 0) {
    return null;
  }

  return (
    <Card className="sticky top-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShoppingCart className="h-5 w-5" />
          Order Summary
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Order Details */}
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span>
              Subtotal ({count} {count === 1 ? 'item' : 'items'})
            </span>
            <span>₹{subtotal.toLocaleString()}</span>
          </div>

          <Separator />

          <div className="flex justify-between font-semibold text-lg">
            <span>Total</span>
            <span className="text-primary">₹{total.toLocaleString()}</span>
          </div>
        </div>

        {/* Checkout Buttons */}
        <div className="space-y-3">
          <Button
            className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-primary via-primary/90 to-primary hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-xl transition-all duration-300"
            disabled={loading}
            asChild
          >
            <Link href="/checkout">
              <CreditCard className="h-5 w-5 mr-2" />
              Proceed to Checkout
              <ArrowRight className="h-5 w-5 ml-2" />
            </Link>
          </Button>

          <Link href="/" className="block">
            <Button variant="outline" className="w-full" disabled={loading}>
              Continue Shopping
            </Button>
          </Link>
        </div>


      </CardContent>
    </Card>
  );
}
