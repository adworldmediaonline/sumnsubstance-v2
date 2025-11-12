'use client';

import { Button } from '@/components/ui/button';
import {
  ArrowRight,
  Heart,
  Leaf,
  Shield,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { staticProducts } from '@/constants/static-products-data';

export default function HeroContent() {
  // Get the featured product
  const featuredProduct = staticProducts.find(p => p.featured);

  return (
    <section className="relative min-h-screen bg-primary overflow-x-hidden">

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 pt-20 sm:pt-24">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center min-h-[calc(100vh-120px)]">
          {/* Left Content */}
          <div className="space-y-6 sm:space-y-8 w-full">
            {/* Main Heading */}
            <div className="space-y-3 sm:space-y-4 w-full">
              {featuredProduct ? (
                <>
                  <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold text-white leading-tight w-full">
                    {featuredProduct.name}
                  </h1>
                  <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/90 font-medium w-full">
                    {featuredProduct.tagline}
                  </p>
                  <p className="text-sm sm:text-base md:text-lg lg:text-xl text-white/80 leading-relaxed w-full">
                    {featuredProduct.excerpt}
                  </p>

                  {/* Price */}
                  <div className="flex items-center gap-4">
                    <span className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">
                      ₹{featuredProduct.price}
                    </span>
                  </div>
                </>
              ) : (
                <>
                  <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold text-white leading-tight w-full">
                    Natural
                    <br />
                    <span className="text-white font-bold">
                      Beauty
                    </span>
                  </h1>

                  <p className="text-base sm:text-lg lg:text-xl text-white/90 leading-relaxed w-full">
                    Transform your skin with our premium collection of natural,
                    organic skincare products designed for radiant, healthy beauty.
                  </p>
                </>
              )}
            </div>

            {/* CTA Button */}
            {featuredProduct && (
              <Button
                asChild
                size="lg"
                className="bg-white hover:bg-white/90 text-primary px-6 py-4 sm:px-8 sm:py-6 text-base sm:text-lg font-semibold rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 w-full sm:w-auto"
              >
                <Link href={`/products/${featuredProduct.slug}`}>
                  Shop Now
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
                </Link>
              </Button>
            )}
          </div>

          {/* Right Product Display */}
          <div className="relative flex justify-center items-center mt-8 lg:mt-0">
            {/* Main Product Container */}
            <div className="relative">
              {/* Large background circle */}
              <div className="w-[280px] h-[280px] sm:w-[350px] sm:h-[350px] md:w-[400px] md:h-[400px] xl:w-[500px] xl:h-[500px] rounded-full border border-white/20 flex items-center justify-center relative overflow-hidden">
                {/* Product Image */}
                <div className="w-[250px] h-[250px] sm:w-[320px] sm:h-[320px] md:w-[350px] md:h-[350px] xl:w-[450px] xl:h-[450px] rounded-full overflow-hidden shadow-2xl relative border-2 sm:border-4 border-white/30">
                  <Image
                    src={featuredProduct?.mainImage?.url || "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&h=800&fit=crop&crop=center"}
                    alt={featuredProduct?.mainImage?.altText || "Natural Skincare Product"}
                    fill
                    className="object-cover scale-110 hover:scale-125 transition-transform duration-700"
                    sizes="(max-width: 640px) 250px, (max-width: 768px) 320px, (max-width: 1280px) 350px, 450px"
                  />

                  {/* Product highlight rings */}
                  <div className="absolute inset-8 rounded-full border-2 border-white/40 animate-pulse"></div>
                  <div className="absolute inset-16 rounded-full border border-white/30"></div>
                </div>

                {/* Floating natural elements */}
                <div className="absolute -top-8 -left-8 sm:-top-12 sm:-left-12 w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full border-2 border-white/30 flex items-center justify-center shadow-xl hover:scale-110 transition-transform duration-300">
                  <Leaf className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-white" />
                </div>

                <div className="absolute -bottom-8 -right-8 sm:-bottom-12 sm:-right-12 w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full border-2 border-white/30 flex items-center justify-center shadow-xl hover:scale-110 transition-transform duration-300">
                  <Heart className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 text-white" />
                </div>

                {/* Orbiting elements - hidden on very small screens */}
                <div className="hidden sm:block absolute top-16 right-16 w-6 h-6 md:w-8 md:h-8 border-2 border-white rounded-full animate-pulse shadow-lg"></div>
                <div className="hidden sm:block absolute bottom-16 left-16 w-4 h-4 md:w-6 md:h-6 border-2 border-white/80 rounded-full shadow-lg"></div>
                <div className="hidden md:block absolute top-1/2 left-8 w-4 h-4 border-2 border-white/60 rounded-full"></div>
                <div className="hidden md:block absolute top-1/2 right-8 w-4 h-4 border-2 border-white/60 rounded-full"></div>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* Decorative bottom wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" className="w-full h-20 fill-white">
          <path d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,69.3C960,85,1056,107,1152,112C1248,117,1344,107,1392,101.3L1440,96L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"></path>
        </svg>
      </div>
    </section>
  );
}

