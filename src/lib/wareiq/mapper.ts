/**
 * EasyEcom/WareIQ Order Mapper
 * Maps Prisma Order to EasyEcom API format
 */

import type {
  EasyEcomOrderPayload,
  EasyEcomOrderItem,
  EasyEcomAddress,
  EasyEcomCustomer,
} from './types';
import type { OrderWithItems } from '@/types/order';
import { staticProducts } from '@/constants/static-products-data';

/**
 * Format date to EasyEcom format: "YYYY-MM-DD HH:mm:ss"
 */
function formatEasyEcomDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

/**
 * Map shipping address to EasyEcom address format
 */
function mapToEasyEcomAddress(
  address: {
    fullName: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    phone: string;
    email: string;
  },
  includeCoordinates = false
): EasyEcomAddress {
  const easyEcomAddress: EasyEcomAddress = {
    name: address.fullName,
    addressLine1: address.addressLine1,
    addressLine2: address.addressLine2,
    postalCode: address.postalCode,
    city: address.city,
    state: address.state,
    country: address.country,
    contact: address.phone,
    email: address.email,
  };

  // Add coordinates if available and requested
  // TODO: Implement geocoding if needed
  if (includeCoordinates) {
    // easyEcomAddress.latitude = geocodedLatitude;
    // easyEcomAddress.longitude = geocodedLongitude;
  }

  return easyEcomAddress;
}

/**
 * Map order items to EasyEcom order items format
 */
function mapToEasyEcomOrderItems(
  orderItems: Array<{
    id: string;
    name: string;
    price: number | { toNumber: () => number };
    quantity: number;
    productSnapshot: Record<string, unknown>;
  }>
): EasyEcomOrderItem[] {
  return orderItems.map((item, index) => {
    // Extract product ID from productSnapshot
    const productId = (item.productSnapshot as { id?: string })?.id;

    // Find product in static products to get SKU
    const staticProduct = productId
      ? staticProducts.find(p => p.id === productId)
      : null;

    const sku = staticProduct?.sku || '';

    // Handle Decimal type from Prisma
    const price =
      typeof item.price === 'object' && 'toNumber' in item.price
        ? item.price.toNumber()
        : item.price;

    const easyEcomItem: EasyEcomOrderItem = {
      OrderItemId: item.id || `item_${index + 1}_${Date.now()}`,
      Sku: sku,
      productName: item.name,
      Quantity: item.quantity,
      Price: price,
      itemDiscount: 0,
    };

    // Add AccountingSku if available
    if (staticProduct?.sku) {
      easyEcomItem.AccountingSku = staticProduct.sku;
    }

    return easyEcomItem;
  });
}

/**
 * Map Prisma Order to EasyEcom order payload
 * Works directly with Order model from database
 */
export function mapOrderToEasyEcom(
  order: OrderWithItems,
  marketplaceId: number,
  options?: {
    expDeliveryDate?: Date;
    packageWeight?: number;
    packageDimensions?: { height: number; width: number; length: number };
    companyCarrierId?: number;
  }
): EasyEcomOrderPayload {
  const orderDate = order.createdAt;

  // Calculate expected delivery date (default: 5-7 days)
  const expDeliveryDate =
    options?.expDeliveryDate ||
    calculateExpectedDeliveryDate(orderDate, 1);

  // Parse shipping address (stored as JSON in Prisma)
  const shippingAddress =
    typeof order.shippingAddress === 'string'
      ? JSON.parse(order.shippingAddress)
      : (order.shippingAddress as Record<string, unknown>);

  // Parse billing address or use shipping address
  const billingAddressData = order.billingAddress
    ? typeof order.billingAddress === 'string'
      ? JSON.parse(order.billingAddress)
      : (order.billingAddress as Record<string, unknown>)
    : shippingAddress;

  // Get customer email and name
  const customerEmail = order.user?.email || order.guestEmail || '';
  const customerName = order.user?.name || order.guestName || '';

  // Map addresses
  const easyEcomShippingAddress = mapToEasyEcomAddress({
    fullName: (shippingAddress.fullName as string) || customerName,
    addressLine1: (shippingAddress.addressLine1 as string) || '',
    addressLine2: (shippingAddress.addressLine2 as string) || undefined,
    city: (shippingAddress.city as string) || '',
    state: (shippingAddress.state as string) || '',
    postalCode: (shippingAddress.postalCode as string) || '',
    country: (shippingAddress.country as string) || 'India',
    phone: (shippingAddress.phone as string) || '',
    email: customerEmail,
  });

  const easyEcomBillingAddress = mapToEasyEcomAddress({
    fullName: (billingAddressData.fullName as string) || customerName,
    addressLine1: (billingAddressData.addressLine1 as string) || '',
    addressLine2: (billingAddressData.addressLine2 as string) || undefined,
    city: (billingAddressData.city as string) || '',
    state: (billingAddressData.state as string) || '',
    postalCode: (billingAddressData.postalCode as string) || '',
    country: (billingAddressData.country as string) || 'India',
    phone: (billingAddressData.phone as string) || '',
    email: customerEmail,
  });

  // Map order items
  const easyEcomItems = mapToEasyEcomOrderItems(order.items);

  // Determine payment mode: 1 = COD, 2 = Prepaid
  const paymentMode = order.paymentStatus === 'COMPLETED' ? 2 : 1;

  // Handle Decimal types from Prisma
  const shippingCost =
    typeof order.shipping === 'object' && 'toNumber' in order.shipping
      ? order.shipping.toNumber()
      : Number(order.shipping);
  const discount =
    typeof order.discount === 'object' && 'toNumber' in order.discount
      ? order.discount.toNumber()
      : Number(order.discount);

  // Build EasyEcom order payload
  const easyEcomOrder: EasyEcomOrderPayload = {
    orderType: 'retailorder',
    marketplaceId,
    orderNumber: order.orderNumber,
    orderDate: formatEasyEcomDate(orderDate),
    expDeliveryDate: formatEasyEcomDate(expDeliveryDate),
    remarks1: order.notes || undefined,
    shippingCost,
    discount,
    walletDiscount: 0,
    promoCodeDiscount: 0,
    prepaidDiscount: paymentMode === 2 ? discount : 0,
    paymentMode,
    paymentGateway: order.paymentMethod === 'razorpay' ? 'razorpay' : undefined,
    shippingMethod: 1,
    is_market_shipped: 0,
    company_carrier_id: options?.companyCarrierId,
    packageWeight: options?.packageWeight,
    packageHeight: options?.packageDimensions?.height,
    packageWidth: options?.packageDimensions?.width,
    packageLength: options?.packageDimensions?.length,
    paymentTransactionNumber:
      order.razorpayPaymentId || order.razorpayOrderId || undefined,
    items: easyEcomItems,
    customer: [
      {
        billing: easyEcomBillingAddress,
        shipping: easyEcomShippingAddress,
      },
    ],
  };

  return easyEcomOrder;
}

/**
 * Calculate expected delivery date based on shipping method
 */
export function calculateExpectedDeliveryDate(
  orderDate: Date,
  shippingMethod: number
): Date {
  // Default: 5-7 days for standard shipping
  const daysToAdd = shippingMethod === 1 ? 5 : 3; // Adjust based on your shipping methods
  const deliveryDate = new Date(orderDate);
  deliveryDate.setDate(deliveryDate.getDate() + daysToAdd);
  return deliveryDate;
}

