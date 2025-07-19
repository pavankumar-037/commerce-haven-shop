import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/hooks/useTheme";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import OrderSuccess from "./pages/OrderSuccess";
import PaymentError from "./pages/PaymentError";
import Orders from "./pages/Orders";
import OrderTracking from "./pages/OrderTracking";
import ContactUs from "./pages/ContactUs";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminProducts from "./pages/AdminProducts";
import AdminSections from "./pages/AdminSections";
import AdminOrders from "./pages/AdminOrders";
import AdminOffersManager from "./pages/AdminOffersManager";
import AdminOffers from "./pages/AdminOffers";
import AdminCoupons from "./pages/AdminCoupons";
import AdminMessages from "./pages/AdminMessages";
import AdminSettings from "./pages/AdminSettings";
import Debug from "./pages/Debug";
import ErrorBoundary from "./components/ErrorBoundary";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <ErrorBoundary>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route
                path="/checkout"
                element={
                  <ErrorBoundary>
                    <Checkout />
                  </ErrorBoundary>
                }
              />
              <Route path="/auth" element={<Auth />} />
              <Route path="/order-success" element={<OrderSuccess />} />
              <Route path="/payment-error" element={<PaymentError />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/track-order" element={<OrderTracking />} />
              <Route path="/contact" element={<ContactUs />} />

              {/* Admin Routes */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/products" element={<AdminProducts />} />
              <Route path="/admin/sections" element={<AdminSections />} />
              <Route path="/admin/orders" element={<AdminOrders />} />
              <Route
                path="/admin/offers-manager"
                element={<AdminOffersManager />}
              />
              <Route path="/admin/offers" element={<AdminOffers />} />
              <Route path="/admin/coupons" element={<AdminCoupons />} />
              <Route path="/admin/messages" element={<AdminMessages />} />
              <Route path="/admin/settings" element={<AdminSettings />} />

              {/* Debug route for development */}
              <Route path="/debug" element={<Debug />} />

              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </ErrorBoundary>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
