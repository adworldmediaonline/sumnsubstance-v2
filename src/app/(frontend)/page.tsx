import { staticProducts } from '@/constants/static-products-data';
import { FeaturedProductsV3 } from '../../components/home';
import HeroContent from '../../components/home/hero-content';

export default function Home() {
  // Use all static products data
  const featuredProducts = staticProducts.map(product => ({
    ...product,
    isWishlisted: false,
    inStock: true,
    featured: true,
    reviewStats: {
      totalReviews: 0,
      averageRating: 0,
      ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
    },
  }));

  return (
    <>
      <HeroContent />
      <FeaturedProductsV3 products={featuredProducts as any} />
    </>
  );
}
