# Testing WareIQ/EasyEcom Integration

This guide explains how to test if the WareIQ integration is working correctly.

## Prerequisites

1. Set up environment variables in `.env`:
```env
EASYECOM_API_KEY=your_api_key
EASYECOM_EMAIL=your_email@example.com
EASYECOM_PASSWORD=your_password
EASYECOM_LOCATION_KEY=your_location_key
EASYECOM_MARKETPLACE_ID=10
```

## Testing Methods

### Method 1: Test Authentication (Recommended First Step)

Test if your credentials work:

```bash
# Using curl
curl http://localhost:3000/api/wareiq/test

# Or open in browser
http://localhost:3000/api/wareiq/test
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Authentication successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs..."
  },
  "test": "authentication"
}
```

### Method 2: Test Order Mapping

Test if order data maps correctly to EasyEcom format (doesn't create actual order):

```bash
curl -X POST http://localhost:3000/api/wareiq/test \
  -H "Content-Type: application/json" \
  -d '{
    "testType": "mapping",
    "orderData": {
      "orderNumber": "TEST-001",
      "createdAt": "2024-01-15T10:00:00Z",
      "shipping": 0,
      "discount": 0,
      "paymentStatus": "COMPLETED",
      "paymentMethod": "razorpay",
      "razorpayOrderId": "order_test123",
      "shippingAddress": {
        "fullName": "Test User",
        "addressLine1": "123 Test St",
        "city": "Mumbai",
        "state": "Maharashtra",
        "postalCode": "400001",
        "country": "India",
        "phone": "9876543210",
        "email": "test@example.com"
      },
      "items": [
        {
          "id": "item1",
          "name": "Test Product",
          "price": 100,
          "quantity": 2,
          "productSnapshot": {
            "id": "1"
          }
        }
      ],
      "guestEmail": "test@example.com",
      "guestName": "Test User"
    }
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "mappedOrder": {
    "orderType": "retailorder",
    "orderNumber": "TEST-001",
    "items": [...],
    "customer": [...]
  },
  "test": "order_mapping"
}
```

### Method 3: Test Full Integration (Creates Actual Order)

⚠️ **WARNING**: This will create an actual order in EasyEcom!

```bash
curl -X POST http://localhost:3000/api/wareiq/test \
  -H "Content-Type: application/json" \
  -d '{
    "testType": "full",
    "orderData": {
      "orderNumber": "TEST-ORDER-' + Date.now() + '",
      "items": [
        {
          "id": "item1",
          "name": "Barely There SPF Lotion",
          "price": 855,
          "quantity": 1,
          "productSnapshot": {
            "id": "1"
          }
        }
      ],
      "shippingAddress": {
        "fullName": "Test User",
        "addressLine1": "123 Test Street",
        "city": "Mumbai",
        "state": "Maharashtra",
        "postalCode": "400001",
        "country": "India",
        "phone": "9876543210",
        "email": "test@example.com"
      },
      "customerEmail": "test@example.com",
      "customerName": "Test User"
    }
  }'
```

### Method 4: Test with Real Order from Database

Create a test script to test with an actual order:

```typescript
// scripts/test-wareiq.ts
import { createWareIQService } from '@/lib/wareiq';
import prisma from '@/lib/prisma';

async function testWithRealOrder() {
  // Get a real order from database
  const order = await prisma.order.findFirst({
    include: {
      items: true,
      user: true,
    },
  });

  if (!order) {
    console.log('No orders found in database');
    return;
  }

  console.log('Testing with order:', order.orderNumber);

  const wareIQService = createWareIQService();
  const result = await wareIQService.syncOrderToWareIQ(order);

  if (result.success) {
    console.log('✅ Order synced successfully!');
    console.log('Response:', result.data);
  } else {
    console.error('❌ Failed to sync order:', result.error);
  }
}

testWithRealOrder();
```

## Testing Checklist

- [ ] **Authentication Test** - Verify credentials work
- [ ] **Order Mapping Test** - Verify order data maps correctly
- [ ] **SKU Mapping** - Verify product SKUs are extracted correctly
- [ ] **Address Mapping** - Verify shipping/billing addresses map correctly
- [ ] **Payment Mode** - Verify COD vs Prepaid detection works
- [ ] **Full Integration** - Create a test order in EasyEcom (optional)

## Common Issues

### Authentication Fails
- Check if `EASYECOM_API_KEY` is set correctly
- Verify email, password, and location_key are correct
- Check if account has API access enabled

### SKU Not Found
- Verify products in `static-products-data.ts` have `sku` field
- Check if `productSnapshot.id` matches product IDs

### Order Creation Fails
- Verify order data structure matches expected format
- Check if all required fields are present
- Review EasyEcom API error messages

## Debugging

Enable detailed logging:

```typescript
// In your test code
const result = await wareIQService.syncOrderToWareIQ(order);
console.log('Full response:', JSON.stringify(result, null, 2));
```

Check browser console or server logs for detailed error messages.

