/**
 * Generate WareIQ CSV from static products data
 *
 * Usage: npx tsx scripts/generate-wareiq-csv.ts > wareiq-products.csv
 */

import { staticProducts } from '../src/constants/static-products-data';

// WareIQ CSV Headers
const headers = [
  'Brand*',
  'Category*',
  'Model Name',
  'Model Number*',
  'Description',
  'Manufacturer Description',
  'EAN|UPC',
  'SKU*',
  'Parent SKU',
  'Material Type*',
  'IS_MPS',
  'Mrp',
  'Cost*',
  'Weight(gms)',
  'Length(cms)',
  'Height(cms)',
  'Width(cms)',
  'Primary Image URL',
  'Product Tax Code',
  'Color',
  'Size',
  'AccountingSKU',
  'AccountingUnit',
  'Flammable*',
  'ProductTaxRule*',
  'CESS',
];

// Helper function to escape CSV values
function escapeCSV(value: string | number | undefined | null): string {
  if (value === undefined || value === null) return '';
  const str = String(value);
  // If contains comma, quote, or newline, wrap in quotes and escape quotes
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

// Helper function to strip HTML tags from description
function stripHTML(html: string | undefined): string {
  if (!html) return '';
  return html
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .trim();
}

// Generate CSV row for a product
function generateCSVRow(product: typeof staticProducts[0]): string {
  const row: string[] = [];

  // Brand* - Required
  row.push(escapeCSV('SumNSubstance'));

  // Category* - Required (extract from product.category or use default)
  const category = product.category?.name || 'Skincare';
  row.push(escapeCSV(category));

  // Model Name
  row.push(escapeCSV(product.name));

  // Model Number* - Required (use SKU as model number)
  row.push(escapeCSV(product.sku || product.id));

  // Description
  const description = stripHTML(product.description || product.excerpt || '');
  row.push(escapeCSV(description.substring(0, 500))); // Limit length

  // Manufacturer Description
  row.push(escapeCSV(stripHTML(product.description || '')));

  // EAN|UPC - Generate from SKU (8-digit number)
  const ean = product.sku?.replace(/[^0-9]/g, '').padStart(8, '0').substring(0, 8) || '';
  row.push(escapeCSV(ean));

  // SKU* - Required
  row.push(escapeCSV(product.sku || product.id));

  // Parent SKU
  row.push(escapeCSV(''));

  // Material Type* - Required (default to "Liquid" for skincare products)
  row.push(escapeCSV('Liquid'));

  // IS_MPS (Is Multi-Pack SKU)
  row.push(escapeCSV('0'));

  // Mrp (Maximum Retail Price)
  row.push(escapeCSV(product.price.toString()));

  // Cost* - Required (use price as cost, or you can set a different cost)
  row.push(escapeCSV(product.price.toString()));

  // Weight(gms) - Default weight (you may need to update per product)
  row.push(escapeCSV('250')); // Default 250g, adjust per product

  // Length(cms)
  row.push(escapeCSV('10')); // Default dimensions

  // Height(cms)
  row.push(escapeCSV('15'));

  // Width(cms)
  row.push(escapeCSV('5'));

  // Primary Image URL - Convert relative URL to absolute if needed
  const imageUrl = product.mainImage?.url || '';
  // For now, keep relative URLs - user can update domain later if needed
  // Or use NEXT_PUBLIC_APP_URL from environment
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://sumnsubstance.com';
  const fullImageUrl = imageUrl.startsWith('http')
    ? imageUrl
    : imageUrl.startsWith('/')
      ? `${baseUrl}${imageUrl}`
      : imageUrl;
  row.push(escapeCSV(fullImageUrl));

  // Product Tax Code
  row.push(escapeCSV(''));

  // Color
  row.push(escapeCSV(''));

  // Size - Extract from product name or tagline if available
  const sizeMatch = product.tagline?.match(/(\d+)\s*(ml|g|gm)/i) ||
    product.name?.match(/(\d+)\s*(ml|g|gm)/i);
  const size = sizeMatch ? `${sizeMatch[1]}${sizeMatch[2]}` : '';
  row.push(escapeCSV(size));

  // AccountingSKU - Use SKU
  row.push(escapeCSV(product.sku || product.id));

  // AccountingUnit
  row.push(escapeCSV('PCS')); // Pieces

  // Flammable* - Required (default to "No" for skincare products)
  row.push(escapeCSV('No'));

  // ProductTaxRule* - Required (default tax rule, adjust as needed)
  row.push(escapeCSV('GST_18')); // 18% GST, adjust based on your tax rules

  // CESS
  row.push(escapeCSV(''));

  return row.join(',');
}

// Generate CSV
function generateCSV(): string {
  const lines: string[] = [];

  // Add header row
  lines.push(headers.join(','));

  // Add product rows
  for (const product of staticProducts) {
    if (!product.sku) {
      console.error(`Warning: Product ${product.id} (${product.name}) has no SKU, skipping...`);
      continue;
    }
    lines.push(generateCSVRow(product));
  }

  return lines.join('\n');
}

// Main execution
if (require.main === module) {
  const csv = generateCSV();
  console.log(csv);
}

export { generateCSV, generateCSVRow };

