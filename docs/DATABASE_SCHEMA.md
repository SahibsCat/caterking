# Sahibs Catering - Database Schema Documentation

This document describes the MongoDB collections and schemas used in the Sahibs Catering application.

## 1. User Collection
Stores user profiles and authentication data.

| Field | Type | Description |
| :--- | :--- | :--- |
| `mobile` | String | Unique identifier (required). |
| `name` | String | User's full name. |
| `email` | String | User's email address. |
| `password` | String | Hashed password (for admins). |
| `role` | Enum | `guest`, `user`, or `admin` (default: `guest`). |
| `otp` | String | One-time password for login. |
| `otpExpires`| Date | Expiration time for the OTP. |
| `socialProvider`| Object | Fields for `name` and `id` (e.g., Google/Facebook). |
| `createdAt` | Date | Timestamp of account creation. |
| `updatedAt` | Date | Timestamp of last update. |

---

## 2. MenuItem Collection
Stores individual food items available for catering.

| Field | Type | Description |
| :--- | :--- | :--- |
| `name` | String | Name of the dish (required). |
| `description`| String | Brief description of the item. |
| `base_price` | Number | Price per unit (required). |
| `weight_ratio_per_10_guests` | Number | Multiplier for portion calculation (e.g., `1` = 1kg per 10 guests). |
| `dietary_tag`| Enum | `Veg`, `Non-Veg`, or `Mixed` (required). |
| `category` | String | e.g., 'Main Course', 'Starter', 'Rice', 'Dessert'. |
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
| `orderId` | String | Unique human-readable order ID. |
| `userId` | ObjectId | Reference to the `User` who placed the order. |
| `eventDetails`| Object | `venue` (Dubai/Sharjah), `date`, `guestCount`, `serviceType`. |
| `packageId` | ObjectId | Reference to the selected `Package`. |
| `selectedMenu`| Array | List of items with `itemId`, `name`, `category`, and `calculatedWeight`. |
| `additionalChoices`| Array | Extra items with `name`, `quantity`, and `price`. |
| `pricing` | Object | `foodCost`, `serviceCost`, `transportCost`, `vat`, `total`. |
| `status` | Enum | `pending`, `paid`, `confirmed`, `delivered`, `cancelled`. |
| `paymentIntentId`| String | Stripe payment identifier. |

---

## 5. MealPack Collection
Stores special boxed meal options.

| Field | Type | Description |
| :--- | :--- | :--- |
| `name` | String | Name of the meal pack. |
| `type` | Enum | `Adult`, `Snack`, or `Kids` (required). |
| `price` | Number | Fixed price for the pack. |
| `items` | String[]| List of items included in the pack. |
| `is_active` | Boolean | Availability status. |

---

## 6. ServiceConfig Collection
Stores dynamic key-value settings for the application.

| Field | Type | Description |
| :--- | :--- | :--- |
| `key` | String | Unique config key (e.g., `transport_base_fee`). |
| `value` | Mixed | Any value (number, string, or object). |
| `description`| String | Explanation of the setting's purpose. |
