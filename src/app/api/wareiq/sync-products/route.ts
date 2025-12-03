/**
 * Bulk Product Sync Endpoint
 * Syncs all products from static-products-data.ts to WareIQ
 * Run this once to bulk-create all products in WareIQ
 *
 * POST /api/wareiq/sync-products - Sync all products to WareIQ
 *
 * Query params:
 * - test=true - Test with single product first
 * - sku=<SKU> - Create specific product by SKU
 * - update=true - Update existing product (requires productId in body)
 *
 * Body for update:
 * {
 *   "productId": 123456,
 *   "sku": "SNS-SPF-250",
 *   ...other fields to update
 * }
 */

import { NextRequest, NextResponse } from 'next/server';
import { createProductSyncService } from '@/lib/wareiq/product-sync';
import { staticProducts } from '@/constants/static-products-data';
import type { EasyEcomUpdateProductPayload } from '@/lib/wareiq/types';

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const testMode = searchParams.get('test') === 'true';
    const sku = searchParams.get('sku');
    const updateMode = searchParams.get('update') === 'true';

    const productSyncService = createProductSyncService();

    // Update mode: Update existing product
    if (updateMode) {
      const body = await request.json().catch(() => ({}));
      const { productId, sku: updateSku, ...updates } = body as EasyEcomUpdateProductPayload & { sku?: string };

      if (!productId) {
        return NextResponse.json(
          {
            success: false,
            error: 'productId is required for update',
          },
          { status: 400 }
        );
      }

      // Find product by SKU if provided, otherwise use first product
      const product = updateSku
        ? staticProducts.find(p => p.sku === updateSku)
        : staticProducts[0];

      if (!product) {
        return NextResponse.json(
          {
            success: false,
            error: updateSku ? `Product with SKU ${updateSku} not found` : 'No products found',
          },
          { status: 404 }
        );
      }

      const result = await productSyncService.updateProduct(productId, product, updates);

      return NextResponse.json({
        success: result.success,
        message: result.success
          ? `Product updated successfully: ${product.sku}`
          : `Product update failed: ${result.error}`,
        data: result.data,
        error: result.error,
        product: {
          productId,
          sku: product.sku,
          name: product.name,
        },
      });
    }

    // Test mode: Create single product
    if (testMode || sku) {
      // Check if user wants to test with exact payload structure
      const useExactPayload = searchParams.get('exact') === 'true';

      if (useExactPayload) {
        // Use exact payload structure matching user's provided example
        // Note: Cost, Mrp, Weight, Height, Length, Width are strings (as per API)
        // subProduct is excluded as requested
        const exactPayload = {
          AccountingSKU: 'test_shirt1121',
          AccountingUnit: '12451',
          Brand: 'Test1',
          Category: 'Shirt1',
          Color: 'Black',
          Cost: '2152.72', // String as per API
          shelf_life: 30,
          Description: 'It is an test product',
          EANUPC: '1223456',
          Height: '3', // String as per API
          Length: '2', // String as per API
          ModelName: 'shirt model name',
          ModelNumber: 'Shirt1451',
          Mrp: '2400.00', // String as per API
          ProductTaxCode: '123',
          Size: 'L',
          Sku: 'Test_kit_11',
          TaxRate: 18, // Tax rate as integer (0, 3, 5, 12, 18, 28)
          TaxRuleName: process.env.EASYECOM_TAX_RULE_NAME || 'GST18', // Must match tax rule name created in WareIQ dashboard
          ImageURL: 'https://contents.mediadecathlon.com/p1484240/ab565f3675dbdd7e3c486175e2c16583/p1484240.jpg',
          Weight: '10', // String as per API
          Width: '2', // String as per API
          // itemType: Omitted for simple standalone product (without sub-products)
          materialType: 1, // Integer
          // subProduct: Excluded as requested
          customFields: {
            Door: '2',
            'With Adapter': 'yes',
          },
        };

        // Import client directly to use exact payload
        const { initializeEasyEcomClient } = await import('@/lib/wareiq');
        const client = initializeEasyEcomClient();
        const result = await client.createProduct(exactPayload);

        return NextResponse.json({
          success: result.success,
          message: result.success
            ? 'Test product created successfully with exact payload'
            : `Test product creation failed: ${result.error}`,
          data: result.data,
          error: result.error,
          payload: exactPayload,
        });
      }

      const product = sku
        ? staticProducts.find(p => p.sku === sku)
        : staticProducts[0]; // Use first product for test

      if (!product) {
        return NextResponse.json(
          {
            success: false,
            error: sku ? `Product with SKU ${sku} not found` : 'No products found',
          },
          { status: 404 }
        );
      }

      const result = await productSyncService.createProduct(product, 0);

      return NextResponse.json({
        success: result.success,
        message: result.success
          ? `Test product created successfully: ${product.sku}`
          : `Test product creation failed: ${result.error}`,
        data: result.data,
        error: result.error,
        product: {
          sku: product.sku,
          name: product.name,
        },
      });
    }

    // Full sync: Create all products
    const results = await productSyncService.syncAllProducts();

    return NextResponse.json({
      success: results.failed === 0,
      message: `Product sync completed: ${results.success} succeeded, ${results.failed} failed`,
      data: results,
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    console.error('Product sync error:', error);
    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
      },
      { status: 500 }
    );
  }
}

