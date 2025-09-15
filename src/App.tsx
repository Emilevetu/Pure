import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import SavedCharts from "./pages/SavedCharts";
import ViewChart from "./pages/ViewChart";
import Friends from "./pages/Friends";
import Onboarding from "./pages/Onboarding";
import BottomNavigation from "./components/BottomNavigation";
// Pages de test supprimées - maintenant on utilise le microservice
import NotFound from "./pages/NotFound";
import { EmailConfirmationPage } from "./pages/EmailConfirmationPage";

const queryClient = new QueryClient();

const AppContent = () => {
  const location = useLocation();
  
  // Masquer la navigation pendant l'onboarding
  const showBottomNav = !location.pathname.startsWith('/onboarding');

  return (
    <>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/onboarding" element={<Onboarding />} />
        {/* Routes de test supprimées - maintenant on utilise le microservice */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/charts" element={<SavedCharts />} />
        <Route path="/friends" element={<Friends />} />
        <Route path="/chart/:chartId" element={<ViewChart />} />
        <Route path="/email-confirmation" element={<EmailConfirmationPage />} />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      {showBottomNav && <BottomNavigation />}
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
