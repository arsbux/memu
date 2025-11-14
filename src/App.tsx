import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { RestaurantProvider } from "@/hooks/useRestaurant";
import Menu from "./pages/Menu";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminDishes from "./pages/AdminDishes";
import AdminCategories from "./pages/AdminCategories";
import AdminQRCode from "./pages/AdminQRCode";
import AdminOrders from "./pages/AdminOrders";
import AdminRestaurants from "./pages/AdminRestaurants";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <RestaurantProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<AdminLogin />} />
            <Route path="/menu/:restaurantSlug" element={<Menu />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/restaurants" element={<AdminRestaurants />} />
            <Route path="/admin/dishes" element={<AdminDishes />} />
            <Route path="/admin/categories" element={<AdminCategories />} />
            <Route path="/admin/orders" element={<AdminOrders />} />
            <Route path="/admin/qr-code" element={<AdminQRCode />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </RestaurantProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
