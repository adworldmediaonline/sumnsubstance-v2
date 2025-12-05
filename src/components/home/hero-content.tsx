'use client';

import { Button } from '@/components/ui/button';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { staticProducts } from '@/constants/static-products-data';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import { useState } from 'react';

export default function HeroContent() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section className="relative min-h-screen bg-primary overflow-x-hidden pt-10">
      {/* Main Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 pt-16 sm:pt-20 lg:pt-24 pb-20 sm:pb-24">
        {/* Products Grid/Carousel */}
        <div className="w-full">
          {/* Desktop Grid View - Hidden on mobile/tablet */}
          <div className="hidden lg:grid lg:grid-cols-5 gap-4 xl:gap-6">
            {staticProducts.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>

          {/* Mobile/Tablet Carousel - Visible on smaller screens */}
          <div className="lg:hidden relative">
            <Swiper
              modules={[Navigation, Autoplay]}
              spaceBetween={16}
              slidesPerView={1.2}
              loop={true}
              autoplay={{
                delay: 4000,
                disableOnInteraction: false,
              }}
              navigation={{
                prevEl: '.hero-prev',
                nextEl: '.hero-next',
              }}
              breakpoints={{
                640: {
                  slidesPerView: 2,
                  spaceBetween: 20,
                },
                768: {
                  slidesPerView: 2.5,
                  spaceBetween: 24,
                },
              }}
              onSlideChange={(swiper) => {
                // Use realIndex for loop mode to get the actual slide index
                setActiveIndex(swiper.realIndex);
              }}
              className="w-full"
              style={{ overflow: 'visible' }}
            >
              {staticProducts.map((product, index) => (
                <SwiperSlide key={product.id} className="h-auto">
                  <ProductCard product={product} index={index} />
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Navigation Buttons */}
            <button
              className="hero-prev absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 bg-white/90 hover:bg-white text-primary rounded-full p-2 sm:p-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
              aria-label="Previous product"
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
            <button
              className="hero-next absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 bg-white/90 hover:bg-white text-primary rounded-full p-2 sm:p-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
              aria-label="Next product"
            >
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            {/* Carousel Indicators */}
            <div className="flex justify-center gap-2 mt-6">
              {staticProducts.map((_, index) => (
                <button
                  key={index}
                  className={`h-2 rounded-full transition-all duration-300 ${index === activeIndex
                    ? 'bg-white w-8'
                    : 'bg-white/40 w-2 hover:bg-white/60'
                    }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
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

interface ProductCardProps {
  product: typeof staticProducts[0];
  index: number;
}

function ProductCard({ product, index }: ProductCardProps) {
  return (
    <div className="group bg-white rounded-2xl lg:rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 h-full flex flex-col">
      {/* Product Image Container */}
      <div className="relative aspect-square bg-gradient-to-br from-[hsl(var(--primary))]/5 to-[hsl(var(--primary))]/10 flex items-center justify-center overflow-hidden p-4 sm:p-6 lg:p-4 xl:p-6">
        <div className="relative w-full h-full flex items-center justify-center">
          <Image
            src={product.mainImage?.url || '/products/handcream/hand-cream.webp'}
            alt={product.mainImage?.altText || product.name}
            fill
            className="object-contain transition-transform duration-500 group-hover:scale-110"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            priority={index < 2}
          />
        </div>

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[hsl(var(--primary))]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>

      {/* Product Info */}
      <div className="p-4 sm:p-5 lg:p-4 xl:p-5 flex flex-col flex-1">
        <div className="flex-1 space-y-2 sm:space-y-3">
          <h3 className="text-lg sm:text-xl lg:text-lg xl:text-xl font-bold text-gray-900 group-hover:text-primary transition-colors duration-300 overflow-hidden" style={{
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            textOverflow: 'ellipsis'
          }}>
            {product.name}
          </h3>

          {/* Price */}
          <div className="pt-2">
            <span className="text-xl sm:text-2xl lg:text-xl xl:text-2xl font-bold text-primary">
              ₹{product.price}
            </span>
          </div>
        </div>

        {/* CTA Button */}
        <Button
          asChild
          size="sm"
          className="mt-4 sm:mt-5 lg:mt-4 xl:mt-5 bg-primary hover:bg-primary/90 text-white rounded-full shadow-md hover:shadow-lg transition-all duration-300 group-hover:scale-105 w-full"
        >
          <Link href={`/products/${product.slug}`}>
            Shop Now
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </Button>
      </div>
    </div>
  );
}

