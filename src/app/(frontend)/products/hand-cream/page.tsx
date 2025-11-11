import { staticProducts } from '@/constants/static-products-data';
import ProductDetailsClient from '@/components/products/product-details-client';

export default function HandCreamPage() {
  const product = staticProducts[4];

  return <ProductDetailsClient product={product as any} />;
}

