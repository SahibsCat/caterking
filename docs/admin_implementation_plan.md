# Implementation Plan - Admin Module

This plan outlines the implementation of a comprehensive Admin Module for Sahibs Catering, providing management capabilities for menu items, packages, orders, and meal packs.

## Proposed Changes

### Database & Authentication
- **[MODIFY] [User.ts](file:///home/vijay/projects/sahibscatering/backend/src/models/User.ts)**: Add `password` field and hashing logic to support admin login.
- **[NEW] [authMiddleware.ts](file:///home/vijay/projects/sahibscatering/backend/src/middleware/authMiddleware.ts)**: Implement JWT-based authentication and role-based access control (RBAC).

### Backend API
- **[NEW] [adminRoutes.ts](file:///home/vijay/projects/sahibscatering/backend/src/routes/adminRoutes.ts)**: Define routes for:
    - Dashboard statistics (revenue, orders, etc.)
    - Menu item CRUD operations
    - Package management (pricing, inclusions)
    - Order status updates
    - Meal pack CRUD operations
- **[NEW] [adminController.ts](file:///home/vijay/projects/sahibscatering/backend/src/controllers/adminController.ts)**: Implement logic for the above routes.
- **[MODIFY] [index.ts](file:///home/vijay/projects/sahibscatering/backend/src/index.ts)**: Register the admin routes.

### Frontend UI
- **[NEW] [AdminLayout.tsx](file:///home/vijay/projects/sahibscatering/frontend/src/components/AdminLayout.tsx)**: Sidebar/Header layout for the admin section.
- **[NEW] [Dashboard.tsx](file:///home/vijay/projects/sahibscatering/frontend/src/pages/admin/Dashboard.tsx)**: Overview of business metrics.
- **[NEW] [MenuManager.tsx](file:///home/vijay/projects/sahibscatering/frontend/src/pages/admin/MenuManager.tsx)**: Interface for managing menu items.
- **[NEW] [OrderManager.tsx](file:///home/vijay/projects/sahibscatering/frontend/src/pages/admin/OrderManager.tsx)**: Interface for tracking and updating orders.
- **[NEW] [AdminLogin.tsx](file:///home/vijay/projects/sahibscatering/frontend/src/pages/admin/AdminLogin.tsx)**: Secure login page for administrators.
- **[MODIFY] [App.tsx](file:///home/vijay/projects/sahibscatering/frontend/src/App.tsx)**: Add protected routes for the admin section.

---

## Verification Plan

### Automated Tests
- I will create a script `scripts/test_admin_api.ts` to verify:
    - Admin login and JWT token generation.
    - Protected route access (expected 401/403 for non-admins).
    - CRUD operations for menu items via the API.

### Manual Verification
- **Login Flow**: Attempt to access `/admin` and verify redirection to `/admin/login`.
- **Dashboard**: Verify that the statistics match the data seeded in the database.
- **Menu Management**: Add a new "Test Item", verify it appear in the catering flow menu, and then delete it.
- **Order Management**: Create a test order and update its status from "pending" to "confirmed" via the admin panel.
