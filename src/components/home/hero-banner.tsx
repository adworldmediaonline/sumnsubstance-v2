'use client';

import Image from 'next/image';
import { ArrowRight, Star, Shield, Sparkles, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function HeroBanner() {
  return (
    <section className="relative min-h-[700px] bg-primary overflow-hidden">

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center min-h-[700px] py-20">
          {/* Enhanced Left Content */}
          <div className="space-y-10">





            {/* Enhanced Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-6">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-white px-10 py-6 text-xl font-bold rounded-full shadow-lg hover:shadow-2xl"
              >
                Shop Now
                <ArrowRight className="w-6 h-6 ml-3" />
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="border-2 border-primary text-primary hover:bg-primary hover:text-white px-10 py-6 text-xl font-semibold rounded-full bg-white/80 backdrop-blur-sm shadow-lg"
              >
                Learn More
              </Button>
            </div>
          </div>

          {/* Enhanced Right Product Display */}
          <div className="relative flex justify-center items-center">
            <div className="relative">
              {/* Main Product Showcase */}
              <div className="relative border-2 border-white/20 rounded-3xl p-10 shadow-2xl">
                <div className="w-80 h-80 rounded-2xl overflow-hidden shadow-inner border-2 border-white/20 relative">
                  <Image
                    src="https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&h=500&fit=crop&crop=center"
                    alt="Premium Skincare Product"
                    fill
                    className="object-cover"
                    sizes="320px"
                  />
                </div>

                {/* Premium Badge */}
                <div className="absolute -top-4 -right-4 bg-white text-primary px-6 py-3 rounded-full text-lg font-bold shadow-xl border-2 border-white">
                  ✨ Best Seller
                </div>

                {/* Price Tag */}
                <div className="absolute -bottom-4 -left-4 bg-white text-primary px-6 py-3 rounded-full shadow-xl">
                  <span className="text-lg font-bold">₹1,299</span>
                  <span className="text-sm ml-2 line-through opacity-70">
                    ₹1,599
                  </span>
                </div>
              </div>

              {/* Floating Product Cards */}
              <div className="absolute -bottom-8 -right-8 border-2 border-white/30 rounded-2xl p-6 shadow-xl">
                <div className="w-24 h-24 rounded-xl overflow-hidden border-2 border-white/20 relative">
                  <Image
                    src="https://images.unsplash.com/photo-1570554886111-e80fcca6a029?w=300&h=300&fit=crop&crop=center"
                    alt="Vitamin C Serum"
                    fill
                    className="object-cover"
                    sizes="96px"
                  />
                </div>
                <div className="mt-3 text-center">
                  <p className="text-sm font-semibold text-white">
                    Vitamin C
                  </p>
                  <p className="text-xs text-white/70">Serum</p>
                </div>
              </div>

              <div className="absolute -top-8 -left-8 border-2 border-white/30 rounded-2xl p-6 shadow-xl">
                <div className="w-24 h-24 rounded-xl overflow-hidden border-2 border-white/20 relative">
                  <Image
                    src="https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=300&h=300&fit=crop&crop=center"
                    alt="Moisturizer"
                    fill
                    className="object-cover"
                    sizes="96px"
                  />
                </div>
                <div className="mt-3 text-center">
                  <p className="text-sm font-semibold text-white">
                    Hydrating
                  </p>
                  <p className="text-xs text-white/70">Moisturizer</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Wave Separator */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" className="w-full h-20 fill-white">
          <path d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,69.3C960,85,1056,107,1152,112C1248,117,1344,107,1392,101.3L1440,96L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"></path>
        </svg>
      </div>
    </section>
  );
}
