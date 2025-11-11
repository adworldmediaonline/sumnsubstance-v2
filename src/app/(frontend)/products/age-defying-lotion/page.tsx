import { staticProducts } from '@/constants/static-products-data';
import ProductDetailsClient from '@/components/products/product-details-client';

export default function AgeDefyingLotionPage() {
  const product = staticProducts[2];

  return <ProductDetailsClient product={product as any} />;
}

