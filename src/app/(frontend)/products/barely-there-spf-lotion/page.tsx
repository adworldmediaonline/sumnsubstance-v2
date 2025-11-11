import { staticProducts } from '@/constants/static-products-data';
import ProductDetailsClient from '@/components/products/product-details-client';

export default function BarelyThereSPFPage() {
  const product = staticProducts[0];

  return <ProductDetailsClient product={product as any} />;
}

