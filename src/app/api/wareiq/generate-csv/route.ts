/**
 * Generate WareIQ CSV from static products
 *
 * GET /api/wareiq/generate-csv - Download CSV file for WareIQ bulk import
 */

import { NextResponse } from 'next/server';
import { staticProducts } from '@/constants/static-products-data';

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
    .replace(/&#39;/g, "'")
    .trim();
}

// Extract size from product name/tagline
function extractSize(product: typeof staticProducts[0]): string {
  const sizeMatch =
    product.tagline?.match(/(\d+)\s*(ml|g|gm|oz)/i) ||
    product.name?.match(/(\d+)\s*(ml|g|gm|oz)/i) ||
    product.excerpt?.match(/(\d+)\s*(ml|g|gm|oz)/i);

  if (sizeMatch) {
    return `${sizeMatch[1]}${sizeMatch[2].toLowerCase()}`;
  }
  return '';
}

// Extract weight from size (rough estimate)
function extractWeight(product: typeof staticProducts[0]): string {
  const sizeMatch =
    product.tagline?.match(/(\d+)\s*(ml|g|gm|oz)/i) ||
    product.name?.match(/(\d+)\s*(ml|g|gm|oz)/i) ||
    product.excerpt?.match(/(\d+)\s*(ml|g|gm|oz)/i);

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

  // Default weights based on product type
  if (product.category?.name?.toLowerCase().includes('cream')) {
    return '75'; // Default for creams
  }
  return '250'; // Default for lotions
}

// Generate CSV row for a product
function generateCSVRow(product: typeof staticProducts[0], index: number): string {
  const row: string[] = [];

  // Brand* - Required
  row.push(escapeCSV('SumNSubstance'));

  // Category* - Required
  const category = product.category?.name || 'Skincare';
  row.push(escapeCSV(category));

  // Model Name
  row.push(escapeCSV(product.name));

  // Model Number* - Required (use SKU as model number)
  row.push(escapeCSV(product.sku || product.id));

  // Description (first 500 chars, strip HTML)
  const description = stripHTML(product.description || product.excerpt || '');
  row.push(escapeCSV(description.substring(0, 500)));

  // Manufacturer Description
  row.push(escapeCSV(stripHTML(product.description || '')));

  // EAN|UPC - Generate from SKU (8-digit number)
  const ean = product.sku?.replace(/[^0-9]/g, '').padStart(8, '0').substring(0, 8) ||
    String(index + 1).padStart(8, '0');
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

  // Cost* - Required (use price as cost)
  row.push(escapeCSV(product.price.toString()));

  // Weight(gms)
  row.push(escapeCSV(extractWeight(product)));

  // Length(cms) - Default dimensions
  row.push(escapeCSV('10'));

  // Height(cms)
  row.push(escapeCSV('15'));

  // Width(cms)
  row.push(escapeCSV('5'));

  // Primary Image URL
  const imageUrl = product.mainImage?.url || '';
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

  // Size
  row.push(escapeCSV(extractSize(product)));

  // AccountingSKU - Use SKU
  row.push(escapeCSV(product.sku || product.id));

  // AccountingUnit
  row.push(escapeCSV('PCS')); // Pieces

  // Flammable* - Required (default to "No" for skincare products)
  row.push(escapeCSV('No'));

  // ProductTaxRule* - Required (default tax rule - adjust as needed)
  row.push(escapeCSV('GST_18')); // 18% GST - adjust based on your tax rules

  // CESS
  row.push(escapeCSV(''));

  return row.join(',');
}

export async function GET() {
  try {
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

    const lines: string[] = [];

    // Add header row
    lines.push(headers.join(','));

    // Add product rows
    staticProducts.forEach((product, index) => {
      if (!product.sku) {
        console.warn(`Warning: Product ${product.id} (${product.name}) has no SKU, skipping...`);
        return;
      }
      lines.push(generateCSVRow(product, index));
    });

    const csv = lines.join('\n');

    // Return CSV file
    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="wareiq-products-${new Date().toISOString().split('T')[0]}.csv"`,
      },
    });
  } catch (error) {
    console.error('CSV generation error:', error);
    return NextResponse.json(
      {
        error: 'Failed to generate CSV',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

