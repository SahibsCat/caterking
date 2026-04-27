# Sahibs Catering - Database Schema Documentation

This document describes the MongoDB collections and schemas used in the Sahibs Catering application.

## 1. User Collection
Stores user profiles and authentication data for admins and customers.

| Field | Type | Description |
| :--- | :--- | :--- |
| `mobile` | String | Unique identifier (required). |
| `name` | String | User's full name. |
| `email` | String | User's email address. |
| `password` | String | Hashed password (for admins). |
| `role` | Enum | `guest`, `user`, or `admin` (default: `guest`). |
| `otp` | String | One-time password for login. |
| `otpExpires`| Date | Expiration time for the OTP. |
| `createdAt` | Date | Timestamp of account creation. |
| `updatedAt` | Date | Timestamp of last update. |

---

## 2. MenuItem Collection
Stores individual food items available for catering and meal boxes.

| Field | Type | Description |
| :--- | :--- | :--- |
| `name` | String | Name of the dish (required). |
| `description`| String | Brief description of the item. |
| `base_price` | Number | Price per unit (required). |
| `weight_ratio_per_10_guests` | Number | Multiplier for portion calculation (e.g., `1` = 1kg per 10 guests). |
| `dietary_tag`| Enum | `Veg`, `Non-Veg`, or `Mixed` (required). |
| `category` | String | e.g., 'Main Course', 'Starter', 'Rice', 'Dessert'. |
| `packages` | String[] | Specific tiers this item belongs to (e.g., `Standard`, `Premium`). |
| `occasions` | String[] | Specific occasions this item is suggested for. |
| `image` | String | URL to the item image. |
| `is_active` | Boolean | Whether the item is available for selection. |

---

## 3. Package Collection
Stores predefined catering packages with selection limits.

| Field | Type | Description |
| :--- | :--- | :--- |
| `name` | Enum | `Standard`, `Premium`, or `Elite` (unique). |
| `base_price_per_guest` | Number | Cost per head (required). |
| `max_main_course` | Number | Max number of main course items allowed. |
| `max_starters`| Number | Max number of starters allowed. |
| `max_desserts`| Number | Max number of desserts allowed. |
| `inclusions` | String[] | List of items included by default (e.g., Bread, Salad). |
| `is_active` | Boolean | Whether the package is currently offered. |

---

## 4. Order Collection
Stores customer bookings and pricing details.

| Field | Type | Description |
| :--- | :--- | :--- |
| `orderId` | String | Unique human-readable order ID (e.g., ORD-171...). |
| `userId` | ObjectId | Reference to the `User` who placed the order. |
| `eventDetails`| Object | `venue`, `date`, `guestCount`, `occasion`, `foodPreference`, `serviceType`. |
| `packageId` | ObjectId | Reference to the selected `Package`. |
| `selectedMenu`| Array | List of items with `itemId`, `name`, `category`, and `calculatedWeight`. |
| `customerDetails`| Object | `name`, `email`, `phone`, `deliveryAddress` (flatVilla, street, area, landmark). |
| `pricing` | Object | `foodCost`, `serviceCost`, `transportCost`, `vat`, `total`. |
| `status` | Enum | `pending`, `confirmed`, `unfulfilled`, `preparing delivery`, `delivery`, `fulfilled`, `cancelled`. |
| `paymentIntentId`| String | Stripe payment identifier. |

---

## 5. Lead Collection
Stores potential customer data captured before or during the booking flow.

| Field | Type | Description |
| :--- | :--- | :--- |
| `name` | String | Name of the lead (required). |
| `mobile` | String | Contact number (required). |
| `email` | String | Email address. |
| `source` | String | Origin of the lead (e.g., `initial_popup`, `booking_flow`). |
| `address` | Object | `flatVilla`, `street`, `area`, `landmark`. |

---

## 6. AvailableDate Collection
Manages booking availability for specific calendar dates.

| Field | Type | Description |
| :--- | :--- | :--- |
| `date` | Date | The specific date (unique). |
| `is_active` | Boolean | Whether booking is allowed on this date. |

---

## 7. OccasionMenu Collection
Maps specific occasions to recommended menu items for each package tier.

| Field | Type | Description |
| :--- | :--- | :--- |
| `occasion` | String | Name of the occasion (e.g., `Wedding`). |
| `package` | Enum | `Standard`, `Premium`, or `Elite`. |
| `items` | Array | Objects with `itemId` and `defaultQuantity`. |
| `basePrice` | Number | Optional price override for this specific occasion menu. |
| `is_active` | Boolean | Whether this preset is active. |

---

## 8. MealBoxMenu Collection
Defines item selections for different meal box types and tiers.

| Field | Type | Description |
| :--- | :--- | :--- |
| `boxType` | Enum | `Adult`, `Kids`, or `Snack`. |
| `package` | Enum | `Standard`, `Premium`, or `Elite`. |
| `items` | Array | Objects with `itemId` and `defaultQuantity`. |
| `is_active` | Boolean | Availability status. |

---

## 9. ServiceConfig Collection
Stores global system settings and fee configurations.

| Field | Type | Description |
| :--- | :--- | :--- |
| `key` | String | Unique config key (e.g., `transport_base_fee`). |
| `value` | Mixed | Any value (number, string, or object). |
| `description`| String | Explanation of the setting's purpose. |
