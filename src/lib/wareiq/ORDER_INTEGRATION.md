# WareIQ Order Integration

This document explains how WareIQ/EasyEcom order syncing is integrated into the order creation flow.

## Integration Points

### Order Sync (Prepaid Orders Only)

**Note:** This system only uses prepaid orders (Razorpay). COD is not supported.

**Location:** `src/app/api/payments/verify/route.ts`

**When:** After payment verification and order confirmation

**Flow:**
1. Order is created in database with `status: 'PENDING'`
2. Customer completes payment via Razorpay
3. Payment is verified via Razorpay webhook/verification
4. Order status is updated to `CONFIRMED`
5. Payment status is updated to `COMPLETED`
6. Order confirmation email is sent
7. **WareIQ sync is triggered automatically**
8. Payment verification continues even if WareIQ sync fails (non-blocking)

**Code:**
```typescript
// After order confirmation
try {
  const wareIQService = createWareIQService();
  const syncResult = await wareIQService.syncOrderToWareIQ(order);
  // Log success/failure but don't block payment verification
} catch (wareIQError) {
  // Continue - payment is already verified
}
```

## Error Handling

- **Non-blocking:** WareIQ sync failures do not prevent order creation or payment verification
- **Logging:** All sync attempts and errors are logged to console
- **Graceful degradation:** Orders are created successfully even if WareIQ is unavailable

## Order Data Mapping

The integration automatically maps:
- **Order items:** Extracts SKU from `productSnapshot.id` → finds in `staticProducts` → uses `sku` field
- **Shipping & billing addresses:** Parses JSON addresses from Prisma
- **Payment information:** Maps `paymentStatus` (COMPLETED = prepaid, others = COD)
- **Order dates:** Uses `createdAt` and calculates expected delivery date
- **Package dimensions:** Optional - can be configured per order

## Testing

**Test Prepaid Order:**
1. Create order with `paymentMethod: 'razorpay'`
2. Complete payment verification
3. Check server logs for WareIQ sync attempt
4. Verify order appears in EasyEcom dashboard

**Expected Log Output:**
- `Order synced to WareIQ successfully: [orderNumber]` - Success
- `WareIQ sync failed for confirmed order: [error]` - Failure (non-blocking)

## Monitoring

Monitor the following in your logs:
- `Order synced to WareIQ successfully: [orderNumber]` - Success
- `WareIQ sync failed for [order type] order: [error]` - Failure
- `WareIQ sync error (non-blocking): [error]` - Exception

## Configuration

Ensure these environment variables are set:
```env
EASYECOM_API_KEY=your_api_key
EASYECOM_EMAIL=your_email@example.com
EASYECOM_PASSWORD=your_password
EASYECOM_LOCATION_KEY=your_location_key
EASYECOM_MARKETPLACE_ID=10
```

## Future Enhancements

- Add retry mechanism for failed syncs
- Store sync status in database
- Add admin UI to manually retry failed syncs
- Add webhook to receive order status updates from WareIQ

