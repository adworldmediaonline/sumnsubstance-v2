import 'server-only';
import prisma from '@/lib/prisma';

/**
 * Generate a unique order number
 * Format: ORD-YYYYMMDD-XXXXXX (e.g., ORD-20241220-000001)
 */
export async function generateOrderNumber(): Promise<string> {
  const prefix = process.env.ORDER_NUMBER_PREFIX || 'ORD';
  const today = new Date();
  const dateStr = today.toISOString().slice(0, 10).replace(/-/g, '');

  // Find the last order number for today
  const lastOrder = await prisma.order.findFirst({
    where: {
      orderNumber: {
        startsWith: `${prefix}-${dateStr}`,
      },
    },
    orderBy: {
      orderNumber: 'desc',
    },
  });

  let sequence = 1;
  if (lastOrder) {
    const lastSequence = parseInt(lastOrder.orderNumber.split('-')[2] || '0');
    sequence = lastSequence + 1;
  }

  const sequenceStr = sequence.toString().padStart(6, '0');
  return `${prefix}-${dateStr}-${sequenceStr}`;
}

/**
 * Calculate order totals based on items and shipping method
 */
export function calculateOrderTotals(
  items: Array<{ price: number; quantity: number }>
) {
  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // Total is just subtotal (GST and shipping managed from dashboard)
  const total = subtotal;

  return {
    subtotal,
    shipping: 0,
    tax: 0,
    total,
    itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
  };
}

/**
 * Validate order items against static products
 *
 * Note: This function is deprecated - validation now happens in the API
 * against staticProducts from @/constants/static-products-data
 */
export async function validateOrderItems(
  items: Array<{ productId: string; quantity: number }>
) {
  // This function is no longer used - validation happens in the API
  // against staticProducts from @/constants/static-products-data
  console.warn('validateOrderItems is deprecated - use static product validation');

  const validatedItems = items.map(item => ({
    productId: item.productId,
    quantity: item.quantity,
  }));

  return validatedItems;
}

/**
 * Get order status badge color
 */
export function getOrderStatusColor(status: string): string {
  switch (status) {
    case 'PENDING':
      return 'bg-yellow-100 text-yellow-800';
    case 'CONFIRMED':
      return 'bg-blue-100 text-blue-800';
    case 'PROCESSING':
      return 'bg-purple-100 text-purple-800';
    case 'SHIPPED':
      return 'bg-indigo-100 text-indigo-800';
    case 'DELIVERED':
      return 'bg-green-100 text-green-800';
    case 'CANCELLED':
      return 'bg-red-100 text-red-800';
    case 'REFUNDED':
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

/**
 * Get payment status badge color
 */
export function getPaymentStatusColor(status: string): string {
  switch (status) {
    case 'PENDING':
      return 'bg-yellow-100 text-yellow-800';
    case 'PROCESSING':
      return 'bg-blue-100 text-blue-800';
    case 'COMPLETED':
      return 'bg-green-100 text-green-800';
    case 'FAILED':
      return 'bg-red-100 text-red-800';
    case 'CANCELLED':
      return 'bg-gray-100 text-gray-800';
    case 'REFUNDED':
      return 'bg-purple-100 text-purple-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

/**
 * Format order number for display
 */
export function formatOrderNumber(orderNumber: string): string {
  return orderNumber.replace(/-/g, ' ');
}

/**
 * Calculate estimated delivery date
 */
export function calculateDeliveryDate(
  orderDate: Date,
  shippingMethod: 'standard' | 'express' = 'standard'
): { min: Date; max: Date } {
  const days =
    shippingMethod === 'express' ? { min: 2, max: 3 } : { min: 5, max: 7 };

  const minDate = new Date(orderDate);
  minDate.setDate(minDate.getDate() + days.min);

  const maxDate = new Date(orderDate);
  maxDate.setDate(maxDate.getDate() + days.max);

  return { min: minDate, max: maxDate };
}

/**
 * Check if order can be cancelled
 */
export function canCancelOrder(
  orderStatus: string,
  paymentStatus: string
): boolean {
  const cancellableOrderStatuses = ['PENDING', 'CONFIRMED'];
  const cancellablePaymentStatuses = ['PENDING', 'FAILED', 'CANCELLED'];

  return (
    cancellableOrderStatuses.includes(orderStatus) ||
    cancellablePaymentStatuses.includes(paymentStatus)
  );
}

/**
 * Check if order can be refunded
 */
export function canRefundOrder(
  orderStatus: string,
  paymentStatus: string
): boolean {
  return orderStatus === 'DELIVERED' && paymentStatus === 'COMPLETED';
}

/**
 * Generate order receipt data
 */
export function generateOrderReceipt(order: {
  id: string;
  orderNumber: string;
  total: number;
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  createdAt: Date;
  user?: { name?: string; email?: string } | null;
  guestName?: string;
  guestEmail?: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
    total: number;
  }>;
  shippingAddress:
    | string
    | {
        fullName: string;
        addressLine1: string;
        addressLine2?: string;
        city: string;
        state: string;
        postalCode: string;
        country: string;
      };
  billingAddress?:
    | string
    | {
        fullName: string;
        addressLine1: string;
        addressLine2?: string;
        city: string;
        state: string;
        postalCode: string;
        country: string;
      }
    | null;
}) {
  return {
    orderNumber: order.orderNumber,
    orderDate: order.createdAt,
    customerInfo: {
      name: order.user?.name || order.guestName,
      email: order.user?.email || order.guestEmail,
    },
    items: order.items.map(item => ({
      name: item.name,
      quantity: item.quantity,
      price: item.price,
      total: item.total,
    })),
    totals: {
      subtotal: order.subtotal,
      shipping: order.shipping,
      tax: order.tax,
      discount: order.discount,
      total: order.total,
    },
    shippingAddress:
      typeof order.shippingAddress === 'string'
        ? JSON.parse(order.shippingAddress)
        : order.shippingAddress,
    billingAddress: order.billingAddress
      ? typeof order.billingAddress === 'string'
        ? JSON.parse(order.billingAddress)
        : order.billingAddress
      : null,
  };
}
