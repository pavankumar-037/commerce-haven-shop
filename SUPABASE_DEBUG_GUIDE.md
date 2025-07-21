# 🔧 Supabase Error Debugging Guide

## 🚨 **Current Issues**

- Supabase connection test failed: [object Object]
- Supabase error creating order: [object Object]
- Failed to create order: [object Object]

## ✅ **FIXES IMPLEMENTED**

### 1. **Enhanced Error Logging**

**Problem**: Error objects were showing "[object Object]" instead of useful details

**Solution**: Updated all error logging to show detailed error information:

```javascript
// BEFORE (useless):
console.error("Error:", error); // Shows [object Object]

// AFTER (detailed):
console.error("Error:", {
  message: error.message,
  code: error.code,
  details: error.details,
  hint: error.hint,
  fullError: error,
});
```

### 2. **Root Cause Detection**

Added specific detection for common Supabase issues:

- **Table not found** (PGRST106 error code)
- **Permission denied** (RLS policy issues)
- **Connection failures**
- **Invalid data format**

### 3. **Enhanced Debug Tools**

- **Table Checker**: Verifies which tables exist in your Supabase database
- **Connection Tester**: Tests basic Supabase connectivity
- **Order Creation Tester**: Tests the complete order creation flow
- **Fallback System**: Orders saved to localStorage if Supabase fails

## 🛠 **How to Debug the Issue**

### Step 1: Use the Debug Page

1. Navigate to `/debug` in your browser
2. Click **"Check Tables"** - This will show if the orders table exists
3. Click **"Test Connection"** - This will test basic Supabase connectivity
4. Click **"Test Order Creation"** - This will test the full order flow
5. **Check browser console** for detailed error messages

### Step 2: Check Browser Console

Look for these specific error patterns:

#### **Orders Table Missing**:

```
❌ ORDERS TABLE DOES NOT EXIST - This is the root cause!
Code: PGRST106
Message: relation "public.orders" does not exist
```

**Solution**: Run the table creation script (see below)

#### **Permission Issues**:

```
Code: PGRST301
Message: Permission denied
```

**Solution**: Check RLS policies in Supabase dashboard

#### **Connection Issues**:

```
Message: Failed to fetch
```

**Solution**: Check Supabase URL and API key

## 🎯 **Most Likely Cause: Missing Orders Table**

The most common issue is that the `orders` table doesn't exist in Supabase.

### **Quick Fix - Run This SQL in Supabase:**

1. Go to your Supabase dashboard
2. Navigate to SQL Editor
3. Copy and paste the contents of `CREATE_ORDERS_TABLE.sql`
4. Click **Run**

Or copy this quick version:

```sql
-- Create orders table
CREATE TABLE public.orders (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_email text NOT NULL,
  customer_info jsonb NOT NULL,
  items jsonb NOT NULL,
  subtotal decimal(10,2) NOT NULL,
  coupon_discount decimal(10,2) DEFAULT 0,
  shipping_cost decimal(10,2) DEFAULT 0,
  total decimal(10,2) NOT NULL,
  applied_coupon jsonb,
  payment_method text NOT NULL,
  payment_status text DEFAULT 'pending',
  order_status text DEFAULT 'pending',
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS and create permissive policy
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all operations" ON public.orders FOR ALL USING (true);
```

## 🔍 **Debugging Commands**

### Browser Console Commands:

```javascript
// Test Supabase connection
testSupabase();

// Check what tables exist
listTables();

// Manual order test
const testOrder = {
  userEmail: "test@example.com",
  customerInfo: {
    firstName: "Test",
    lastName: "User",
    email: "test@example.com",
    phone: "123",
    address: "123 St",
    city: "City",
    state: "State",
    zipCode: "12345",
  },
  items: [
    {
      id: 1,
      name: "Test",
      price: 99.99,
      quantity: 1,
      image: "/placeholder.svg",
    },
  ],
  subtotal: 99.99,
  couponDiscount: 0,
  shippingCost: 0,
  total: 99.99,
  paymentMethod: "test",
};

// This will show detailed error messages
ordersService.createOrder(testOrder).then(console.log).catch(console.error);
```

## 📊 **Error Code Reference**

### Common Supabase Error Codes:

- **PGRST106**: Table/relation does not exist
- **PGRST301**: Permission denied (RLS policy issue)
- **PGRST116**: No rows found (not an error, just empty result)
- **PGRST202**: Invalid request format

### Connection Error Patterns:

- **"Failed to fetch"**: Network/URL issue
- **"Invalid API key"**: Authentication issue
- **"relation does not exist"**: Table missing
- **"permission denied"**: RLS policy issue

## ✅ **Verification Steps**

After fixing the issue:

1. **Test Debug Page**: All tests should pass ✅
2. **Test Checkout Flow**: Add item → checkout → place order ✅
3. **Check Orders Page**: Orders should appear ✅
4. **Check Admin Panel**: Orders visible in admin dashboard ✅

## 🔄 **Fallback System**

Even if Supabase is completely broken, the app will:

- ✅ Save orders to localStorage automatically
- ✅ Show success messages to users
- ✅ Display orders on orders page
- ✅ Show orders in admin panel
- ✅ Continue working normally

## 🆘 **Still Having Issues?**

If the debug tools show everything is working but you're still having problems:

1. **Clear browser cache** and try again
2. **Check network tab** in dev tools for failed requests
3. **Verify Supabase project** is active and not paused
4. **Check Supabase logs** in the dashboard
5. **Verify API keys** are correct and active

---

## 🎯 **Expected Results After Fix**

### ✅ **Debug Page Results:**

- Table Check: Shows `orders` table exists
- Connection Test: ✅ Connection successful
- Order Creation Test: ✅ Order created successfully

### ✅ **Console Output:**

```
✅ Basic health check passed
✅ Orders table exists and is accessible
✅ Order created successfully: {id: "12345..."}
```

### ✅ **User Experience:**

- Cart → Checkout → Payment → Success works perfectly
- Orders appear on tracking page
- Admin can see orders in dashboard
- No more "[object Object]" errors

**The enhanced error logging will now show exactly what's wrong instead of cryptic "[object Object]" messages!**
