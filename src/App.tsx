import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { PropertyProvider } from "./context/PropertyContext";
import { ThemeProvider } from "./components/ThemeProvider";
import Index from "./pages/Index";
import PropertyDetails from "./pages/PropertyDetails";
import BuyPage from "./pages/BuyPage";
import RentPage from "./pages/RentPage";
import SellPage from "./pages/SellPage";
import FavoritesPage from "./pages/FavoritesPage";
import SearchPage from "./pages/SearchPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import AdminPage from "./pages/AdminPage";
import ProfilePage from "./pages/ProfilePage";
import MyPropertiesPage from "./pages/MyPropertiesPage";
import EditPropertyPage from "./pages/EditPropertyPage";
import PropertyComparisonPage from "./pages/PropertyComparisonPage";
import RecommendationsPage from "./pages/RecommendationsPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="light" storageKey="ui-theme">
      <TooltipProvider>
        <PropertyProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/property/:id" element={<PropertyDetails />} />
              <Route path="/buy" element={<BuyPage />} />
              <Route path="/rent" element={<RentPage />} />
              <Route path="/sell" element={<SellPage />} />
              <Route path="/favorites" element={<FavoritesPage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/my-properties" element={<MyPropertiesPage />} />
              <Route path="/edit-property/:id" element={<EditPropertyPage />} />
              <Route path="/compare" element={<PropertyComparisonPage />} />
              <Route path="/recommendations" element={<RecommendationsPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </PropertyProvider>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
