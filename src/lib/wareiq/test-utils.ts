/**
 * Test utilities for WareIQ/EasyEcom integration
 * Use these to verify the integration is working correctly
 */

import { initializeEasyEcomClient } from './index';
import { createWareIQService } from './service';
import type { EasyEcomApiResponse } from './types';

/**
 * Test authentication - verifies API credentials work
 */
export async function testAuthentication(): Promise<EasyEcomApiResponse> {
  try {
    const client = initializeEasyEcomClient();

    // Try to get a token (this will call the auth endpoint)
    // We'll use a private method access pattern or create a public test method
    const response = await fetch(
      `${process.env.EASYECOM_BASE_URL || 'https://api.easyecom.io'}/access/token`,
      {
        method: 'POST',
        headers: {
          'x-api-key': process.env.EASYECOM_API_KEY || '',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: process.env.EASYECOM_EMAIL || '',
          password: process.env.EASYECOM_PASSWORD || '',
          location_key: process.env.EASYECOM_LOCATION_KEY || '',
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.message || data.error || `Authentication failed: ${response.statusText}`,
        message: `Failed to authenticate: ${response.status}`,
        data: data, // Include full response for debugging
      };
    }

    // Check for token in various possible fields
    const token = data.token || data.access_token || data.data?.token || data.data?.access_token;
    if (!token) {
      return {
        success: false,
        error: 'Token not found in response',
        message: 'Authentication response did not contain a token',
        data: data, // Include full response for debugging
      };
    }

    // Ensure token is a string
    const tokenString = typeof token === 'string' ? token : String(token);

    return {
      success: true,
      data: {
        token: tokenString.length > 20 ? tokenString.substring(0, 20) + '...' : tokenString,
        fullResponse: data, // Include full response for debugging
      },
      message: 'Authentication successful',
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error occurred';
    return {
      success: false,
      error: errorMessage,
      message: `Authentication test failed: ${errorMessage}`,
    };
  }
}

/**
 * Test order mapping - verifies order data maps correctly to EasyEcom format
 */
export async function testOrderMapping(order: {
  orderNumber: string;
  createdAt: Date;
  shipping: number | { toNumber: () => number };
  discount: number | { toNumber: () => number };
  paymentStatus: string;
  paymentMethod?: string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  shippingAddress: string | Record<string, unknown>;
  billingAddress?: string | Record<string, unknown>;
  guestEmail?: string;
  guestName?: string;
  notes?: string;
  items: Array<{
    id: string;
    name: string;
    price: number | { toNumber: () => number };
    quantity: number;
    productSnapshot: Record<string, unknown>;
  }>;
  user?: {
    email: string;
    name: string;
  };
}): Promise<{ success: boolean; mappedOrder?: unknown; error?: string }> {
  try {
    const { mapOrderToEasyEcom } = await import('./mapper');

    // Create a mock OrderWithItems structure
    const mockOrder = {
      ...order,
      userId: null,
      status: 'PENDING' as const,
      subtotal: order.items.reduce((sum, item) => {
        const price = typeof item.price === 'object' && 'toNumber' in item.price
          ? item.price.toNumber()
          : item.price;
        return sum + price * item.quantity;
      }, 0),
      tax: 0,
      total: 0,
      updatedAt: new Date(),
      shippedAt: null,
      deliveredAt: null,
      trackingNumber: null,
    };

    const marketplaceId = Number(process.env.EASYECOM_MARKETPLACE_ID || '10');
    const mappedOrder = mapOrderToEasyEcom(mockOrder as any, marketplaceId);

    return {
      success: true,
      mappedOrder,
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error occurred';
    return {
      success: false,
      error: errorMessage,
    };
  }
}

/**
 * Test full integration - creates a test order in EasyEcom
 * WARNING: This will create an actual order in EasyEcom if successful
 */
export async function testFullIntegration(
  testOrderPayload: {
    orderNumber: string;
    items: Array<{
      id: string;
      name: string;
      price: number;
      quantity: number;
      productSnapshot: { id: string };
    }>;
    shippingAddress: Record<string, unknown>;
    billingAddress?: Record<string, unknown>;
    customerEmail: string;
    customerName: string;
  }
): Promise<EasyEcomApiResponse> {
  try {
    const wareIQService = createWareIQService();

    // Create mock order structure
    const mockOrder = {
      id: 'test-order-id',
      orderNumber: testOrderPayload.orderNumber,
      userId: null,
      guestEmail: testOrderPayload.customerEmail,
      guestName: testOrderPayload.customerName,
      status: 'PENDING' as const,
      subtotal: testOrderPayload.items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      ),
      tax: 0,
      shipping: 0,
      discount: 0,
      total: testOrderPayload.items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      ),
      paymentStatus: 'PENDING' as const,
      paymentMethod: 'razorpay',
      razorpayOrderId: null,
      razorpayPaymentId: null,
      razorpaySignature: null,
      shippingAddress: JSON.stringify(testOrderPayload.shippingAddress),
      billingAddress: testOrderPayload.billingAddress
        ? JSON.stringify(testOrderPayload.billingAddress)
        : null,
      notes: 'Test order from integration test',
      trackingNumber: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      shippedAt: null,
      deliveredAt: null,
      items: testOrderPayload.items.map(item => ({
        id: item.id,
        orderId: 'test-order-id',
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        total: item.price * item.quantity,
        productSnapshot: item.productSnapshot,
        createdAt: new Date(),
        updatedAt: new Date(),
      })),
      user: null,
    };

    const result = await wareIQService.syncOrderToWareIQ(mockOrder as any);

    return result;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error occurred';
    return {
      success: false,
      error: errorMessage,
      message: `Integration test failed: ${errorMessage}`,
    };
  }
}

