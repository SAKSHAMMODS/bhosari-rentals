# Bhosari Rentals | High-Performance Fleet Hub

This is a premium bike rental application built for modern operatives. It features a standardized fleet, flexible booking schedules, and secure multi-gateway payment processing.

## 🚀 Key Features

- **Standardized Fleet**: Curated selection of high-performance motorcycles (Royal Enfield, Suzuki).
- **Flexible Scheduling**: Dynamic start/end date selection with real-time price calculation.
- **Multi-Gateway Checkout**: Secure integration with Razorpay and PayPal.
- **Operative Dashboard**: Secure "My Fleet" section to track active and past assignments.
- **AI-Powered Fleet Descriptions**: Automated generation of compelling bike profiles.

## 🛠️ Code Paths & Architecture

### 1. Booking Flow
- **Fleet Catalog**: `src/app/page.tsx` displays the active inventory.
- **Deployment Configuration**: `src/app/book/[bikeId]/page.tsx` handles date selection and operative identification.
- **Fleet Data**: `src/lib/bikes.ts` contains the authoritative list of equipment and pricing.

### 2. Checkout & Payment Gateways
- **Secure Gateway**: `src/app/checkout/page.tsx` is the central hub for payment processing.
- **Razorpay Integration**: Uses the official Razorpay script and handles INR settlements.
- **PayPal Protocol**: `src/components/PayPalPlaceholder.tsx` handles international/alternative payment methods.
- **Confirmation Logic**: Successful transactions trigger a Firestore write to `users/{uid}/bookings/{id}`.

### 3. Identity & Security
- **Authentication**: `src/app/login/page.tsx` and `src/app/signup/page.tsx` manage operative access.
- **Security Rules**: `firestore.rules` enforces user-level data isolation for rental records.

## 🔐 Environment Configuration

Ensure the following variables are set in your `.env` for full operational capacity:

- `NEXT_PUBLIC_RAZORPAY_KEY_ID`: Your Razorpay Test/Live Key.
- `NEXT_PUBLIC_PAYPAL_CLIENT_ID`: Your PayPal REST API Client ID.
- `PAYPAL_SECRET_KEY`: Your PayPal REST API Secret.

## 🏁 Deployment Protocols

Pick-up protocols and electronic documents are dispatched to the operative's registered email identifier upon successful order confirmation.
