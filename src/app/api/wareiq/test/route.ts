/**
 * WareIQ Integration Test Endpoint
 * Use this to test if the WareIQ/EasyEcom integration is working
 *
 * GET /api/wareiq/test - Test authentication
 * POST /api/wareiq/test - Test order mapping or full integration
 */

import { NextRequest, NextResponse } from 'next/server';
import { testAuthentication, testOrderMapping, testFullIntegration } from '@/lib/wareiq/test-utils';

export async function GET(request: NextRequest) {
  try {
    // Test authentication only
    const authResult = await testAuthentication();

    return NextResponse.json({
      success: authResult.success,
      message: authResult.message,
      data: authResult.data,
      error: authResult.error,
      test: 'authentication',
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
        test: 'authentication',
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { testType, orderData } = body;

    if (testType === 'mapping' && orderData) {
      // Test order mapping only
      const mappingResult = await testOrderMapping(orderData);

      return NextResponse.json({
        success: mappingResult.success,
        mappedOrder: mappingResult.mappedOrder,
        error: mappingResult.error,
        test: 'order_mapping',
      });
    }

    if (testType === 'full' && orderData) {
      // Test full integration (will create actual order in EasyEcom)
      const integrationResult = await testFullIntegration(orderData);

      return NextResponse.json({
        success: integrationResult.success,
        message: integrationResult.message,
        data: integrationResult.data,
        error: integrationResult.error,
        test: 'full_integration',
        warning: 'This created an actual order in EasyEcom if successful',
      });
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Invalid test type. Use "mapping" or "full"',
      },
      { status: 400 }
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
      },
      { status: 500 }
    );
  }
}

