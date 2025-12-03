/**
 * EasyEcom/WareIQ API Types
 * Types for integrating with EasyEcom API for order fulfillment
 */

export interface EasyEcomOrderItem {
  OrderItemId: string;
  Sku?: string;
  ean?: string;
  AccountingSku?: string;
  productName: string;
  Quantity: number | string;
  Price: number;
  itemDiscount: number;
  custom_fields?: Array<{
    id: number;
    value: string;
  }>;
}

export interface EasyEcomAddress {
  name: string;
  addressLine1: string;
  addressLine2?: string;
  postalCode: string;
  city: string;
  state: string;
  country: string;
  contact: string;
  email: string;
  latitude?: string;
  longitude?: string;
}

export interface EasyEcomCustomer {
  gst_number?: string;
  billing: EasyEcomAddress;
  shipping: EasyEcomAddress;
}

export interface EasyEcomOrderPayload {
  orderType: 'retailorder' | 'wholesaleorder';
  marketplaceId: number;
  orderNumber: string;
  orderDate: string; // Format: "YYYY-MM-DD HH:mm:ss"
  expDeliveryDate?: string; // Format: "YYYY-MM-DD HH:mm:ss"
  remarks1?: string;
  remarks2?: string;
  shippingCost: number;
  discount: number;
  walletDiscount?: number;
  promoCodeDiscount?: number;
  prepaidDiscount?: number;
  paymentMode: number; // 1 = COD, 2 = Prepaid
  paymentGateway?: string;
  shippingMethod: number;
  is_market_shipped?: number; // 0 or 1
  company_carrier_id?: number;
  packageWeight?: number; // in grams
  packageHeight?: number; // in cm
  packageWidth?: number; // in cm
  packageLength?: number; // in cm
  paymentTransactionNumber?: string | number;
  items: EasyEcomOrderItem[];
  customer: EasyEcomCustomer[];
}

export interface EasyEcomApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface EasyEcomAuthCredentials {
  email: string;
  password: string;
  location_key: string;
}

export interface EasyEcomTokenResponse {
  token?: string;
  access_token?: string;
  message?: string;
  error?: string;
}

export interface EasyEcomConfig {
  apiKey: string;
  baseUrl?: string;
  marketplaceId: number;
  defaultShippingMethod?: number;
  defaultCompanyCarrierId?: number;
  // Authentication credentials
  email?: string;
  password?: string;
  location_key?: string;
}

// Removed EasyEcomOrderMappingOptions - now using direct Order model mapping

