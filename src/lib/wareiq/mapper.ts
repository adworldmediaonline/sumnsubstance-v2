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

    // EasyEcom API supports multiple ways to identify products:
    // 1. Sku - primary SKU (must exist in WareIQ)
    // 2. ean - EAN/barcode (alternative identifier)
    // 3. AccountingSku - accounting SKU (alternative identifier)
    //
    // Strategy: Use AccountingSku as primary identifier since SKUs might not exist in WareIQ yet.
    // If SKU exists, we'll use it; otherwise use AccountingSku.
    // This allows orders to be created even if SKUs aren't pre-registered in WareIQ.
    const easyEcomItem: EasyEcomOrderItem = {
      OrderItemId: item.id || `item_${index + 1}_${Date.now()}`,
      productName: item.name,
      Quantity: item.quantity,
      Price: price,
      itemDiscount: 0,
    };

    // SOLUTION: Use productName as primary identifier, with fallback options
    // This approach allows WareIQ to auto-create products from order data
    // when products don't exist, avoiding the need to manually create 1000s of products
    //
    // Strategy (in order of preference):
    // 1. Use productName (required) - WareIQ's primary identifier
    // 2. Use ean (barcode) - Some systems accept generic barcodes for auto-creation
    // 3. Include AccountingSku for reference/accounting purposes
    // 4. Don't include Sku field to avoid "SKU Not Found" errors
    //
    // This way, WareIQ can:
    // - Auto-create products using productName + ean
    // - Or match existing products by productName
    // - Use AccountingSku for accounting/reference purposes
    if (sku) {
      // Generate a simple EAN/barcode from SKU (format: 8-digit number)
      // This allows WareIQ to potentially auto-create products
      const eanCode = sku.replace(/[^0-9]/g, '').padStart(8, '0').substring(0, 8);
      if (eanCode.length >= 8) {
        easyEcomItem.ean = eanCode;
      }

      // Include AccountingSku for reference
      easyEcomItem.AccountingSku = sku;
    }
    // Note: We're NOT including Sku field - this allows WareIQ to auto-create products

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
  const easyEcomItems = mapToEasyEcomOrderItems(
    order.items.map((item) => ({
      ...item,
      productSnapshot:
        typeof item.productSnapshot === 'object' &&
          item.productSnapshot !== null &&
          !Array.isArray(item.productSnapshot)
          ? (item.productSnapshot as Record<string, unknown>)
          : {},
    }))
  );

  // Determine payment mode: 1 = Prepaid, 2 = COD
  // For prepaid orders (payment completed), use mode 1
  // For COD orders, use mode 2
  const paymentMode = order.paymentStatus === 'COMPLETED' ? 1 : 2;

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
    prepaidDiscount: paymentMode === 1 ? discount : 0,
    paymentMode,
    // Only include paymentGateway for prepaid orders (paymentMode 1)
    ...(paymentMode === 1 && order.paymentMethod === 'razorpay' && { paymentGateway: 'razorpay' }),
    shippingMethod: 1,
    is_market_shipped: 0,
    // Only include company_carrier_id if provided and valid
    ...(options?.companyCarrierId && { company_carrier_id: options.companyCarrierId }),
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

