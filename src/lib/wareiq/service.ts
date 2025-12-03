/**
 * EasyEcom/WareIQ Service
 * High-level service for order fulfillment integration
 * Works directly with Prisma Order model
 */

import { initializeEasyEcomClient } from './index';
import { mapOrderToEasyEcom } from './mapper';
import type { OrderWithItems } from '@/types/order';
import type { EasyEcomApiResponse, EasyEcomOrderPayload } from './types';

export class WareIQService {
  private client = initializeEasyEcomClient();
  private marketplaceId: number;

  constructor(marketplaceId?: number) {
    this.marketplaceId =
      marketplaceId || Number(process.env.EASYECOM_MARKETPLACE_ID || '10');
  }

  /**
   * Sync order to EasyEcom/WareIQ
   * Call this after order is created in database
   */
  async syncOrderToWareIQ(
    order: OrderWithItems,
    options?: {
      packageWeight?: number;
      packageDimensions?: { height: number; width: number; length: number };
      companyCarrierId?: number;
    }
  ): Promise<EasyEcomApiResponse> {
    try {
      // Map order to EasyEcom format
      const easyEcomOrder = mapOrderToEasyEcom(
        order,
        this.marketplaceId,
        options
      );

      // Create order in EasyEcom
      const result = await this.client.createRetailOrder(easyEcomOrder);

      return result;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error occurred';
      return {
        success: false,
        error: errorMessage,
        message: `Failed to sync order to WareIQ: ${errorMessage}`,
      };
    }
  }

  /**
   * Get order status from WareIQ
   */
  async getOrderStatus(orderNumber: string): Promise<EasyEcomApiResponse> {
    return this.client.getOrderStatus(orderNumber);
  }

  /**
   * Update order in WareIQ
   */
  async updateOrder(
    orderNumber: string,
    updates: Partial<EasyEcomOrderPayload>
  ): Promise<EasyEcomApiResponse> {
    return this.client.updateOrder(orderNumber, updates);
  }
}

/**
 * Create WareIQ service instance
 */
export function createWareIQService(
  marketplaceId?: number
): WareIQService {
  return new WareIQService(marketplaceId);
}
