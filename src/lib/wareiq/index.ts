/**
 * EasyEcom/WareIQ Integration Module
 * Main entry point for WareIQ/EasyEcom order fulfillment integration
 */

export * from './types';
export * from './client';
export * from './mapper';
export * from './service';

import { createEasyEcomClient } from './client';
import type { EasyEcomConfig } from './types';

/**
 * Initialize EasyEcom client with environment configuration
 */
export function initializeEasyEcomClient(): ReturnType<typeof createEasyEcomClient> {
  const config: EasyEcomConfig = {
    apiKey: process.env.EASYECOM_API_KEY || '',
    baseUrl: process.env.EASYECOM_BASE_URL || 'https://api.easyecom.io',
    marketplaceId: Number(process.env.EASYECOM_MARKETPLACE_ID || '10'),
    defaultShippingMethod: Number(process.env.EASYECOM_DEFAULT_SHIPPING_METHOD || '1'),
    defaultCompanyCarrierId: process.env.EASYECOM_COMPANY_CARRIER_ID
      ? Number(process.env.EASYECOM_COMPANY_CARRIER_ID)
      : undefined,
    // Authentication credentials (optional - can use JWT_TOKEN instead)
    email: process.env.EASYECOM_EMAIL,
    password: process.env.EASYECOM_PASSWORD,
    location_key: process.env.EASYECOM_LOCATION_KEY,
  };

  if (!config.apiKey) {
    throw new Error(
      'EASYECOM_API_KEY environment variable is required for WareIQ integration'
    );
  }

  return createEasyEcomClient(config);
}

