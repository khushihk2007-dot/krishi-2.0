import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import Welcome from "./pages/Welcome.tsx";
import AuthFarmer from "./pages/AuthFarmer.tsx";
import AuthBuyer from "./pages/AuthBuyer.tsx";
import AuthLabourer from "./pages/AuthLabourer.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import WorkFeed from "./pages/WorkFeed.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/welcome" element={<Welcome />} />
          <Route path="/auth/farmer" element={<AuthFarmer />} />
          <Route path="/auth/buyer" element={<AuthBuyer />} />
          <Route path="/auth/labourer" element={<AuthLabourer />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/work-feed" element={<WorkFeed />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
