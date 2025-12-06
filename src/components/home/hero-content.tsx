'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { staticProducts } from '@/constants/static-products-data';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
export default function HeroContent() {

  return (
    <section className="relative bg-primary overflow-x-hidden pt-24 pb-10 sm:pt-28 sm:pb-12 lg:pt-32 lg:pb-16">
      {/* Main Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
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
          </div>
        </div>
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
    <Link
      href={`/products/${product.slug}`}
      className="group block bg-[#f6f6f6] rounded-2xl lg:rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 h-full"
    >
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
    </Link>
  );
}

