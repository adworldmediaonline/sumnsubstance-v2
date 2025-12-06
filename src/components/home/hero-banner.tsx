'use client';

import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
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
              <div className="w-[200px] sm:w-[240px] md:w-[280px] aspect-[2/3] rounded-lg overflow-hidden relative">
                <Image
                  src="https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&h=500&fit=crop&crop=center"
                  alt="Premium Skincare Product"
                  fill
                  className="object-contain"
                  sizes="(max-width: 640px) 200px, (max-width: 768px) 240px, 280px"
                />
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
