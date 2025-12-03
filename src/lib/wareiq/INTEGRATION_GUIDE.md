# EasyEcom/WareIQ Integration Module

This module provides integration with EasyEcom API for order fulfillment through WareIQ.

## Overview

The module handles:
- Creating retail orders (B2C) in EasyEcom
- Mapping internal order format to EasyEcom API format
- Order status tracking
- Order updates

## Setup

### Environment Variables

Add the following environment variables to your `.env` file:

```env
# EasyEcom API Configuration (Required)
EASYECOM_API_KEY=your_api_key_here
EASYECOM_MARKETPLACE_ID=10

# Authentication - Option 1: Use credentials (recommended)
EASYECOM_EMAIL=your_email@example.com
EASYECOM_PASSWORD=your_password
EASYECOM_LOCATION_KEY=your_location_key

# Authentication - Option 2: Use JWT token directly (if you have one)
# EASYECOM_JWT_TOKEN=your_jwt_token_here

# Optional Configuration
EASYECOM_BASE_URL=https://api.easyecom.io
EASYECOM_DEFAULT_SHIPPING_METHOD=1
EASYECOM_COMPANY_CARRIER_ID=6691
```

### Generating API Key

1. Log in to your Primary Seller Account on EasyEcom
2. Go to Account Settings > Change credentials
3. Under the X-API-KEY section, click on "Generate X-API-KEY"
4. Copy the generated key and store it securely

### Authentication

The module supports two authentication methods:

**Method 1: Credentials (Recommended)**
- Provide `EASYECOM_EMAIL`, `EASYECOM_PASSWORD`, and `EASYECOM_LOCATION_KEY`
- The module will automatically fetch and cache JWT tokens
- Tokens are cached for 1 hour to reduce API calls

**Method 2: Direct JWT Token**
- Set `EASYECOM_JWT_TOKEN` if you already have a token
- Useful for testing or if you manage tokens externally

## Usage

### Basic Usage

```typescript
import { createWareIQService } from '@/lib/wareiq';
import prisma from '@/lib/prisma';

// Create service instance
const wareIQService = createWareIQService();

// After creating order in database, sync to WareIQ
const order = await prisma.order.findUnique({
  where: { id: orderId },
  include: {
    items: true,
    user: true,
  },
});

if (order) {
  const result = await wareIQService.syncOrderToWareIQ(order, {
    packageWeight: 500, // in grams (optional)
    packageDimensions: {
      height: 10,
      width: 10,
      length: 10,
    },
  });

  if (result.success) {
    console.log('Order synced to WareIQ successfully');
  } else {
    console.error('Failed to sync order:', result.error);
  }
}
```

## Integration Points

### After Order Creation

Call `syncOrderToWareIQ` after successfully creating an order in your database:

```typescript
// In your order creation API route (src/app/api/orders/create/route.ts)
import { createWareIQService } from '@/lib/wareiq';
import prisma from '@/lib/prisma';

export async function POST(request: NextRequest) {
  // ... create order in database (existing code)
  const order = await prisma.order.create({
    // ... your existing order creation code
    include: {
      items: true,
      user: true,
    },
  });

  // Sync to WareIQ (non-blocking - don't fail order if this fails)
  try {
    const wareIQService = createWareIQService();
    const syncResult = await wareIQService.syncOrderToWareIQ(order);

    if (!syncResult.success) {
      // Log error but don't fail the order creation
      console.error('WareIQ sync failed:', syncResult.error);
    }
  } catch (error) {
    console.error('WareIQ sync error:', error);
    // Continue - order is already created in database
  }

  return NextResponse.json({ data: order });
}
```

## Order Mapping

The module automatically maps from your Prisma Order model:
- **Order items**: Extracts SKU from `productSnapshot.id` → finds product in `staticProducts` → uses `sku` field
- **Shipping & billing addresses**: Parses JSON addresses from Prisma
- **Payment information**: Maps `paymentStatus` (COMPLETED = prepaid, others = COD)
- **Order dates**: Uses `createdAt` and calculates expected delivery date
- **Package dimensions**: Optional - can be passed when syncing

## Payment Modes

- `cod` (Cash on Delivery) → `paymentMode: 1`
- `prepaid` → `paymentMode: 2`

## Error Handling

All API methods return `EasyEcomApiResponse` with:
- `success`: boolean indicating success/failure
- `data`: response data if successful
- `error`: error message if failed
- `message`: human-readable message

## Rate Limiting

EasyEcom APIs have rate limiting at the X-API-Key level. The default tier allows for testing. For production, contact EasyEcom support to upgrade your tier.

## Testing

1. Set up test environment variables
2. Create a test order
3. Call `syncOrderToWareIQ` with the test order
4. Verify order appears in EasyEcom dashboard

## Support

For EasyEcom API support:
- Email: care@easyecom.io
- Website: https://easyecom.io

## Notes

- Currently focused on Retail Orders (B2C)
- All orders are created with `orderType: 'retailorder'`
- SKU mapping uses product SKU from `static-products-data.ts`
- Shipping cost defaults to 0 (free shipping)

