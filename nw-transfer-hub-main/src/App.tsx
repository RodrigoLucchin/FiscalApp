import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SidebarProvider, useSidebar } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { FloatingDrone } from "@/components/FloatingDrone";
import Login from "./pages/Login";
import Index from "./pages/Index";
import SerialControl from "./pages/SerialControl";
import Custos from "./pages/Custos";
import PrecosCusto from "./pages/PrecosCusto";
import Transferencia from "./pages/Transferencia";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppLayout = () => {
  const { open } = useSidebar();
  
  return (
    <>
      {/* Drones decorativos - canto inferior esquerdo */}
      <FloatingDrone 
        position={{ bottom: "20px", left: "20px" }} 
        delay={0} 
        size="large" 
        variant="quad" 
        sidebarCollapsed={!open}
      />
      <FloatingDrone 
        position={{ bottom: "140px", left: "60px" }} 
        delay={1.5} 
        size="medium" 
        variant="racing" 
        sidebarCollapsed={!open}
      />
      <FloatingDrone 
        position={{ bottom: "80px", left: "180px" }} 
        delay={3} 
        size="small" 
        variant="mini" 
        sidebarCollapsed={!open}
      />
      
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <main className="flex-1">
          <Routes>
            <Route path="/app" element={<Index />} />
            <Route path="/controle-seriais" element={<SerialControl />} />
            <Route path="/custos" element={<Custos />} />
            <Route path="/custos/precos-custo" element={<PrecosCusto />} />
              <Route path="/transferencia" element={<Transferencia />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Temporarily skip Login: redirect root to app */}
          <Route path="/" element={<Navigate to="/app" replace />} />
          <Route
            path="/*"
            element={
              <SidebarProvider>
                <AppLayout />
              </SidebarProvider>
            }
          />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
