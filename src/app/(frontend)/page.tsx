import { Suspense } from 'react';
import { staticProducts } from '@/constants/static-products-data';
import { FeaturedProductsV3 } from '../../components/home';
import HeroContent from '../../components/home/hero-content';

export default function Home() {
  // Filter out the featured product from the products section since it's shown in hero
  const productsForSection = staticProducts
    .map(product => ({
      ...product,
      isWishlisted: false,
      inStock: true,
      featured: false,
      reviewStats: {
        totalReviews: 0,
        averageRating: 0,
        ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
      },
    }));

  return (
    <>
      <Suspense fallback={<div className="min-h-screen bg-primary" />}>
        <HeroContent />
      </Suspense>
      <Suspense fallback={<div className="py-20 bg-white" />}>
        <FeaturedProductsV3 products={productsForSection as any} />
      </Suspense>
    </>
  );
}
