import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { Layout } from "./components/Layout";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Registro from "./pages/Registro";
import Servicos from "./pages/Servicos";
import Planos from "./pages/Planos";
import Sobre from "./pages/Sobre";
import Pedido from "./pages/Pedido";
import PedidoCriacao from "./pages/PedidoCriacao";
import PedidoGestao from "./pages/PedidoGestao";
import PedidoConfirmado from "./pages/PedidoConfirmado";
import Politicas from "./pages/Politicas";
import ClienteDashboard from "./pages/ClienteDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Instalar from "./pages/Instalar";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Auth routes without layout */}
            <Route path="/login" element={<Login />} />
            <Route path="/registro" element={<Registro />} />

            {/* Dashboard routes without public layout */}
            <Route path="/cliente" element={<ClienteDashboard />} />
            <Route path="/admin" element={<AdminDashboard />} />

            {/* Public routes with layout */}
            <Route element={<Layout />}>
              <Route path="/" element={<Index />} />
              <Route path="/servicos" element={<Servicos />} />
              <Route path="/planos" element={<Planos />} />
              <Route path="/sobre" element={<Sobre />} />
              <Route path="/pedido" element={<Pedido />} />
              <Route path="/pedido-criacao" element={<PedidoCriacao />} />
              <Route path="/pedido-gestao" element={<PedidoGestao />} />
              <Route path="/pedido-confirmado" element={<PedidoConfirmado />} />
              <Route path="/politicas/:tipo" element={<Politicas />} />
              <Route path="/instalar" element={<Instalar />} />
            </Route>

            {/* Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
