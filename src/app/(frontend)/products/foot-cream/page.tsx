import { staticProducts } from '@/constants/static-products-data';
import ProductDetailsClient from '@/components/products/product-details-client';

export default function FootCreamPage() {
  const product = staticProducts[1];

  return <ProductDetailsClient product={product as any} />;
}

