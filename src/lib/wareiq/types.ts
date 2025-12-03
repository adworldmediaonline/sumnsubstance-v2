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
  token?: string | { jwt_token?: string; token_type?: string; expires_in?: number };
  access_token?: string;
  data?: {
    token?: { jwt_token?: string; token_type?: string; expires_in?: number };
    [key: string]: unknown;
  };
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

// Product Creation Types
export interface EasyEcomCreateProductPayload {
  // Required fields
  Brand: string; // Required
  Sku: string; // Required
  Category: string; // Required
  ModelNumber: string; // Required
  Cost: number; // Required (as number/double)
  Weight: number; // Required (in grams, as integer)
  Length: number; // Required (in cm, as integer)
  Height: number; // Required (in cm, as integer)
  Width: number; // Required (in cm, as integer)
  TaxRate: number; // Required (integer: 0, 3, 5, 12, 18, 28)
  TaxRuleName: string; // Required (API requires this even though docs mention TaxRate)
  materialType: number; // Required (1 = Finished Good, 2 = Raw Good, 3 = Packaging Material, 4 = Marketing Material)

  // Optional fields
  AccountingSKU?: string;
  AccountingUnit?: string;
  ModelName?: string;
  Description?: string;
  EANUPC?: string; // EAN/UPC
  Mrp?: number; // Maximum Retail Price (as number/double)
  ProductTaxCode?: string; // HSN Code
  Size?: string;
  Color?: string;
  ImageURL?: string;
  shelf_life?: number; // Shelf life in days (use EITHER this OR shelfLifePercentage)
  shelfLifePercentage?: number; // Shelf life percentage (use EITHER this OR shelf_life)
  itemType?: number; // Optional (0 = Combo, 1 = Kit/BOM, 2 = Regular product)
  subProducts?: Array<{ sku: string; quantity: number }>; // Required for itemType 1 and 2, array of at least 2 products
  customFields?: Record<string, string>;
}

// Product Update Types
export interface EasyEcomUpdateProductPayload {
  productId: number; // Required - Product ID from WareIQ
  // Optional fields that can be updated
  Color?: string;
  Cost?: string;
  Description?: string;
  ModelName?: string;
  shelf_life?: number;
  Mrp?: string;
  customFields?: Record<string, string>;
  // Add other updatable fields as needed
  Brand?: string;
  Category?: string;
  Size?: string;
  ImageURL?: string;
  Weight?: string;
  Height?: string;
  Length?: string;
  Width?: string;
}

// Removed EasyEcomOrderMappingOptions - now using direct Order model mapping

