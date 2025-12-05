/**
 * Product Sync Service for WareIQ/EasyEcom
 * Automatically creates products in WareIQ when orders are created
 * This avoids needing to manually create all products in WareIQ
 */

import { initializeEasyEcomClient } from './index';
import type { EasyEcomApiResponse, EasyEcomCreateProductPayload, EasyEcomUpdateProductPayload } from './types';
import { staticProducts } from '@/constants/static-products-data';

export interface ProductSyncPayload {
  sku: string;
  name: string;
  price: number;
  description?: string;
}

// Helper function to strip HTML tags
function stripHTML(html: string | undefined): string {
  if (!html) return '';
  return html
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim();
}

// Extract size from product name/tagline
function extractSize(tagline?: string, name?: string, excerpt?: string): string {
  const sizeMatch =
    tagline?.match(/(\d+)\s*(ml|g|gm|oz)/i) ||
    name?.match(/(\d+)\s*(ml|g|gm|oz)/i) ||
    excerpt?.match(/(\d+)\s*(ml|g|gm|oz)/i);

  if (sizeMatch) {
    return `${sizeMatch[1]}${sizeMatch[2].toLowerCase()}`;
  }
  return '';
}

// Extract weight from size (rough estimate)
function extractWeight(tagline?: string, name?: string, excerpt?: string): string {
  const sizeMatch =
    tagline?.match(/(\d+)\s*(ml|g|gm|oz)/i) ||
    name?.match(/(\d+)\s*(ml|g|gm|oz)/i) ||
    excerpt?.match(/(\d+)\s*(ml|g|gm|oz)/i);

  if (sizeMatch) {
    const value = parseInt(sizeMatch[1]);
    const unit = sizeMatch[2].toLowerCase();

    if (unit === 'ml') {
      // Roughly 1ml = 1g for most liquids
      return value.toString();
    } else if (unit === 'g' || unit === 'gm') {
      return value.toString();
    } else if (unit === 'oz') {
      // 1 oz ≈ 30ml ≈ 30g
      return (value * 30).toString();
    }
  }

  return '250'; // Default weight
}

// Generate EAN from SKU
function generateEAN(sku: string, index: number): string {
  const ean = sku.replace(/[^0-9]/g, '').padStart(8, '0').substring(0, 8);
  return ean || String(index + 1).padStart(8, '0');
}

export class ProductSyncService {
  private client = initializeEasyEcomClient();

  /**
   * Map our product data to WareIQ API format
   */
  private mapProductToWareIQ(
    product: typeof staticProducts[0],
    index: number
  ): EasyEcomCreateProductPayload {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://sumnsubstance.com';
    const imageUrl = product.mainImage?.url || '';
    const fullImageUrl = imageUrl.startsWith('http')
      ? imageUrl
      : imageUrl.startsWith('/')
        ? `${baseUrl}${imageUrl}`
        : imageUrl;

    const size = extractSize(product.tagline, product.name, product.excerpt);
    const weight = extractWeight(product.tagline, product.name, product.excerpt);
    const ean = generateEAN(product.sku || product.id, index);

    // Build payload matching official WareIQ API specification
    // Based on API docs: TaxRate (integer), itemType (integer), Cost/Mrp (number)
    // Use a simple generic category name like the working test payload ("Shirt1")
    // Since the user confirmed categories exist in WareIQ, we'll use the product's category name
    // But if it has spaces, we'll use a simple format
    const categoryName = product.category?.name
      ? product.category.name // Use category name as-is since user confirmed they exist in WareIQ
      : process.env.EASYECOM_DEFAULT_CATEGORY || 'Skincare';

    const payload: EasyEcomCreateProductPayload = {
      // Required fields
      Brand: process.env.EASYECOM_BRAND_NAME || 'SumNSubstance', // Use env var or default
      Sku: product.sku || product.id,
      Category: categoryName,
      ModelNumber: product.sku || product.id,
      Cost: product.price.toString(), // Convert to string to match working test payload format
      Weight: (parseInt(weight) || 100).toString(), // Convert to string
      Length: '10', // Default dimensions (as strings to match working format)
      Height: '15',
      Width: '5',
      TaxRate: 18, // Tax rate: 0, 3, 5, 12, 18, or 28 (using 18% for skincare products)
      TaxRuleName: process.env.EASYECOM_TAX_RULE_NAME || 'GST18', // Must match tax rule name created in WareIQ dashboard
      materialType: 1, // 1 = Finished Good (for skincare products)

      // Optional fields
      AccountingSKU: product.sku || product.id,
      AccountingUnit: 'PCS', // Pieces
      ModelName: product.name,
      Description: stripHTML(product.description || product.excerpt || '').substring(0, 500),
      EANUPC: ean,
      Mrp: product.price.toString(), // Convert to string to match working test payload format
      Size: size,
      ImageURL: fullImageUrl,
      shelf_life: 730, // Shelf life in days (2 years default)
      ProductTaxCode: '123', // HSN code (adjust as needed)
      // itemType: Omit for simple standalone products
      // subProducts: Only include for itemType 1 (Kit/BOM) or 2, with at least 2 products
    };

    return payload;
  }

  /**
   * Create a product in WareIQ/EasyEcom
   */
  async createProduct(
    product: typeof staticProducts[0],
    index: number = 0
  ): Promise<EasyEcomApiResponse> {
    const payload = this.mapProductToWareIQ(product, index);
    return this.client.createProduct(payload);
  }

  /**
   * Sync all products from static products to WareIQ
   * This can be run once to bulk-create all products
   */
  async syncAllProducts(): Promise<{
    success: number;
    failed: number;
    errors: Array<{ sku: string; error: string }>;
  }> {
    const results = {
      success: 0,
      failed: 0,
      errors: [] as Array<{ sku: string; error: string }>,
    };

    for (let index = 0; index < staticProducts.length; index++) {
      const product = staticProducts[index];
      if (!product.sku) {
        console.warn(`Skipping product ${product.id} - no SKU`);
        continue;
      }

      try {
        // Add small delay between requests to avoid rate limiting
        if (index > 0) {
          await new Promise(resolve => setTimeout(resolve, 500)); // 500ms delay
        }

        const result = await this.createProduct(product, index);

        if (result.success) {
          results.success++;
          console.log(`✅ Created product: ${product.sku} (${product.name})`);
        } else {
          // Check if error is due to duplicate SKU (product already exists)
          const errorMessage = result.error || 'Unknown error';
          const isGenericError = errorMessage === 'Error while creating product.' ||
            errorMessage.toLowerCase().includes('error while creating');

          // Since one product succeeded, generic errors are likely duplicate SKUs
          const isDuplicateSku = result.isDuplicateSku ||
            errorMessage.toLowerCase().includes('duplicate') ||
            errorMessage.toLowerCase().includes('already exists') ||
            (errorMessage.toLowerCase().includes('sku') && (
              errorMessage.toLowerCase().includes('exist') ||
              errorMessage.toLowerCase().includes('found')
            )) ||
            isGenericError; // Treat generic errors as potential duplicates

          if (isDuplicateSku) {
            // Product likely already exists - provide helpful message
            const helpfulMessage = isGenericError
              ? `Product likely already exists in WareIQ (SKU: ${product.sku}). Check WareIQ dashboard and delete it if you want to recreate, or use update API with productId.`
              : `Product already exists in WareIQ. Delete it first or use update API.`;

            console.log(`ℹ️  ${helpfulMessage}`);
            results.errors.push({
              sku: product.sku,
              error: helpfulMessage,
            });
            results.failed++;
          } else {
            results.failed++;
            results.errors.push({
              sku: product.sku,
              error: errorMessage,
            });
            console.error(`❌ Failed to create product ${product.sku}:`, errorMessage);
          }
        }
      } catch (error) {
        results.failed++;
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        results.errors.push({
          sku: product.sku,
          error: errorMessage,
        });
        console.error(`❌ Error creating product ${product.sku}:`, errorMessage);
      }
    }

    return results;
  }

  /**
   * Update a product in WareIQ/EasyEcom
   * Requires the productId from WareIQ (obtained after product creation)
   */
  async updateProduct(
    productId: number,
    product: typeof staticProducts[0],
    updates?: Partial<EasyEcomUpdateProductPayload>
  ): Promise<EasyEcomApiResponse> {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://sumnsubstance.com';
    const imageUrl = product.mainImage?.url || '';
    const fullImageUrl = imageUrl.startsWith('http')
      ? imageUrl
      : imageUrl.startsWith('/')
        ? `${baseUrl}${imageUrl}`
        : imageUrl;

    const size = extractSize(product.tagline, product.name, product.excerpt);
    const weight = extractWeight(product.tagline, product.name, product.excerpt);

    const updatePayload: EasyEcomUpdateProductPayload = {
      productId,
      // Map product fields to update payload
      Cost: product.price.toString(),
      Description: stripHTML(product.description || product.excerpt || '').substring(0, 500),
      ModelName: product.name,
      Mrp: product.price.toString(),
      Size: size,
      ImageURL: fullImageUrl,
      Weight: weight,
      Brand: 'SumNSubstance',
      Category: product.category?.name || 'Skincare',
      shelf_life: 730, // 2 years default
      // Allow custom updates to override defaults
      ...updates,
    };

    return this.client.updateProduct(updatePayload);
  }

  /**
   * Check if a product exists in WareIQ
   * This can be used before creating orders to verify product existence
   */
  async productExists(sku: string): Promise<boolean> {
    // TODO: Implement product lookup API call when available
    // For now, assume products don't exist (will need manual creation)
    return false;
  }
}

export function createProductSyncService(): ProductSyncService {
  return new ProductSyncService();
}

