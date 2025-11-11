import { staticProducts } from '@/constants/static-products-data';
import { FeaturedProductsV3 } from '../../components/home';
import HeroContent from '../../components/home/hero-content';

export default function Home() {
  // Filter out the featured product from the products section since it's shown in hero
  const productsForSection = staticProducts
    .filter(product => !product.featured)
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
      <HeroContent />
      <FeaturedProductsV3 products={productsForSection as any} />
    </>
  );
}
