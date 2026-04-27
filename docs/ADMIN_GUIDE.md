# Sahibs Catering - Admin Management Guide

This guide explains how to use the Admin Panel to manage the catering platform effectively.

## 🔐 Accessing the Admin Panel
- **URL**: [http://localhost:5173/admin](http://localhost:5173/admin)
- **Login**: Use the admin credentials configured in the database.

---

## 🛠 Management Modules

### 1. Dashboard
Overview of total orders, revenue metrics, and pending booking requests.

### 2. Menu Manager
- **Add/Edit Items**: Define base prices, weight ratios (kg per 10 guests), and dietary tags.
- **Tiers & Occasions**: Assign items to specific packages (Standard/Premium/Elite) or occasions (Wedding/Corporate) to enable smart filtering in the booking flow.

### 3. Date Manager
- **Booking Control**: Open or close specific dates on the calendar.
- **Blackout Dates**: Close dates for holidays or when the kitchen is at full capacity.

### 4. Occasion Menu Manager (New)
- **Presets**: Define exactly which items should appear by default when a customer selects a specific occasion and package tier.
- **Effortless Booking**: This ensures customers see a "recommended" menu immediately, which they can then customize.

### 5. Meal Box Menu Manager
- **Box Specialization**: Configure default menus for Adult, Kids, and Snack boxes across different price tiers.

### 6. Customer & Lead Manager
- **Lead Capture**: View data from potential customers who started the booking flow but didn't finish.
- **Customer CRM**: Maintain a database of past customers and their contact details.

### 7. Order Management
- **Status Updates**: Move orders through `pending`, `confirmed`, `preparing delivery`, and `fulfilled`.
- **Payment Verification**: Track Stripe payment status directly within the order view.

---

## ⚙️ Global Configuration
System-wide settings are managed via the `ServiceConfig` collection (accessible via the database or API), including:
- **Transport Fees**: Base fee and per-km rates.
- **Service Personnel Costs**: Rates for waiters and supervisors.
- **Minimum Order Quantities (MOQ)**: Global and category-specific MOQs.
