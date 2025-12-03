# Product Sync Solution for WareIQ Integration

## Problem
WareIQ requires products to exist before creating orders. For stores with 1000s of products, manually creating each product in WareIQ is not practical.

## Solution Options

### Option 1: Bulk Product Sync (Recommended)
Run a one-time bulk sync to create all products in WareIQ:

```bash
# Via API endpoint
POST /api/wareiq/sync-products
```

This will sync all products from `static-products-data.ts` to WareIQ once. After this, all orders will work without needing to create products again.

### Option 2: Auto-Create Products from Orders
The current implementation uses `productName` as the primary identifier. If WareIQ supports auto-creating products from order data, products will be created automatically when orders come in.

**Current Strategy:**
- Use `productName` (required) - WareIQ's primary identifier
- Include `AccountingSku` for reference (optional)
- Don't include `Sku` field to avoid "SKU Not Found" errors

### Option 3: Use WareIQ Bulk Import Feature
If WareIQ dashboard supports CSV/bulk import:
1. Export products from your system as CSV
2. Import CSV into WareIQ dashboard
3. Products will be available for orders

## Implementation Status

### Current Implementation
- ✅ Order creation uses `productName` as primary identifier
- ✅ `AccountingSku` included for reference
- ✅ `Sku` field omitted to avoid errors
- ⚠️ Product creation API not yet implemented (requires WareIQ API endpoint)

### Next Steps

1. **Check WareIQ Documentation:**
   - Does WareIQ support auto-creating products from orders?
   - Is there a product creation API endpoint?
   - Does WareIQ support bulk product import via CSV?

2. **If Product Creation API Exists:**
   - Implement `createProduct()` in `product-sync.ts`
   - Run bulk sync once: `POST /api/wareiq/sync-products`
   - Future orders will work automatically

3. **If No API Available:**
   - Use WareIQ dashboard bulk import feature
   - Or manually create products once (unfortunate but necessary)
   - After products exist, orders will work seamlessly

## Testing

Test order creation:
```bash
# Test endpoint
POST /api/wareiq/test-order
```

If you get "Unable to find product details" error:
- Products need to be created in WareIQ first
- Use bulk sync or manual creation
- Then retry order creation

## Notes

- Products only need to be created **once** in WareIQ
- After initial sync, all future orders will work automatically
- Product updates can be handled separately if needed
- The integration is designed to work with existing product data

