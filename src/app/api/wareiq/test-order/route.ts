/**
 * WareIQ Order Creation Test Endpoint
 * Use this to test order creation without creating actual orders
 *
 * POST /api/wareiq/test-order - Test order creation with sample data
 */

import { NextRequest, NextResponse } from 'next/server';
import { initializeEasyEcomClient } from '@/lib/wareiq';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { testType } = body;

    if (testType === 'sample') {
      // Create a test order payload using sample data
      const testOrderPayload = {
        orderType: 'retailorder' as const,
        marketplaceId: Number(process.env.EASYECOM_MARKETPLACE_ID || '10'),
        orderNumber: `TEST-${Date.now()}`,
        orderDate: new Date().toISOString().replace('T', ' ').substring(0, 19),
        expDeliveryDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)
          .toISOString()
          .replace('T', ' ')
          .substring(0, 19),
        shippingCost: 0,
        discount: 0,
        walletDiscount: 0,
        promoCodeDiscount: 0,
        prepaidDiscount: 0,
        paymentMode: 1, // Prepaid (1 = Prepaid, 2 = COD)
        // paymentGateway: 'razorpay', // Removed - test without gateway first
        shippingMethod: 1,
        is_market_shipped: 0,
        // company_carrier_id removed - use only if you have a valid carrier ID
        packageWeight: 100,
        packageHeight: 10,
        packageWidth: 10,
        packageLength: 10,
        items: [
          {
            OrderItemId: `test-item-${Date.now()}-1`,
            // Strategy: Use only productName and AccountingSku
            // WareIQ should auto-create products from order data
            // This avoids needing to pre-create products in WareIQ
            productName: 'Barely There SPF Lotion',
            AccountingSku: 'SNS-SPF-250', // Reference SKU for accounting
            Quantity: 1,
            Price: 855,
            itemDiscount: 0,
          },
        ],
        customer: [
          {
            billing: {
              name: 'Test User',
              addressLine1: '123 Test Street',
              addressLine2: 'Test Area',
              postalCode: '400001',
              city: 'Mumbai',
              state: 'Maharashtra',
              country: 'India',
              contact: '9876543210',
              email: 'test@example.com',
            },
            shipping: {
              name: 'Test User',
              addressLine1: '123 Test Street',
              addressLine2: 'Test Area',
              postalCode: '400001',
              city: 'Mumbai',
              state: 'Maharashtra',
              country: 'India',
              contact: '9876543210',
              email: 'test@example.com',
            },
          },
        ],
      };

      const client = initializeEasyEcomClient();
      const result = await client.createRetailOrder(testOrderPayload);

      return NextResponse.json({
        success: result.success,
        message: result.message,
        data: result.data,
        error: result.error,
        test: 'order_creation',
        orderPayload: testOrderPayload,
      });
    }

    if (testType === 'from-order' && body.orderId) {
      // Test with an existing order from database
      const { orderId } = body;
      const prisma = (await import('@/lib/prisma')).default;

      const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: {
          items: true,
          user: true,
        },
      });

      if (!order) {
        return NextResponse.json(
          {
            success: false,
            error: 'Order not found',
          },
          { status: 404 }
        );
      }

      const { mapOrderToEasyEcom } = await import('@/lib/wareiq/mapper');
      const marketplaceId = Number(process.env.EASYECOM_MARKETPLACE_ID || '10');
      const easyEcomOrder = mapOrderToEasyEcom(order, marketplaceId);

      const client = initializeEasyEcomClient();
      const result = await client.createRetailOrder(easyEcomOrder);

      return NextResponse.json({
        success: result.success,
        message: result.message,
        data: result.data,
        error: result.error,
        test: 'order_creation_from_db',
        orderNumber: order.orderNumber,
      });
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Invalid test type. Use "sample" or "from-order" with orderId',
      },
      { status: 400 }
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    console.error('WareIQ test order error:', error);
    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
      },
      { status: 500 }
    );
  }
}

