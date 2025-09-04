import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";

// Page imports
import CustomerLoginRegister from "pages/customer-login-register";
import MenuBrowseSearch from "pages/menu-browse-search";
import ItemDetailCustomization from "pages/item-detail-customization";
import ShoppingCartCheckout from "pages/shopping-cart-checkout";
import OrderTrackingStatus from "pages/order-tracking-status";
import RestaurantAdminDashboard from "pages/restaurant-admin-dashboard";
import KitchenDisplaySystem from "pages/kitchen-display-system";
import CustomerAccountOrderHistory from "pages/customer-account-order-history";
import NotFound from "pages/NotFound";

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <ScrollToTop />
        <RouterRoutes>
          <Route path="/customer-login-register" element={<CustomerLoginRegister />} />
          <Route path="/menu-browse-search" element={<MenuBrowseSearch />} />
          <Route path="/item-detail-customization" element={<ItemDetailCustomization />} />
          <Route path="/shopping-cart-checkout" element={<ShoppingCartCheckout />} />
          <Route path="/order-tracking-status" element={<OrderTrackingStatus />} />
          <Route path="/restaurant-admin-dashboard" element={<RestaurantAdminDashboard />} />
          <Route path="/kitchen-display-system" element={<KitchenDisplaySystem />} />
          <Route path="/customer-account-order-history" element={<CustomerAccountOrderHistory />} />
          <Route path="/" element={<MenuBrowseSearch />} />
          <Route path="*" element={<NotFound />} />
        </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;