import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import {
  Package,
  Clock,
  Eye,
  Plus,
  FileText,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Loader2,
  User,
  LogOut,
  Edit,
  ExternalLink,
} from "lucide-react";

interface Order {
  id: string;
  order_number: string;
  status: string;
  business_name: string;
  created_at: string;
  demo_url: string | null;
  final_url: string | null;
  packages: { name: string; price: number } | null;
}

const statusConfig: Record<string, { label: string; color: "warning" | "info" | "success" | "secondary"; icon: any }> = {
  pendente: { label: "Pendente", color: "warning", icon: AlertCircle },
  em_andamento: { label: "Em Andamento", color: "info", icon: Loader2 },
  demo: { label: "Demo Disponível", color: "info", icon: Eye },
  avaliacao: { label: "Em Avaliação", color: "warning", icon: Clock },
  concluido: { label: "Concluído", color: "success", icon: CheckCircle2 },
  cancelado: { label: "Cancelado", color: "secondary", icon: AlertCircle },
};

export default function ClienteDashboard() {
  const navigate = useNavigate();
  const { user, profile, role, loading, signOut } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;

      const { data, error } = await supabase
        .from("orders")
        .select(`
          id,
          order_number,
          status,
          business_name,
          created_at,
          demo_url,
          final_url,
          packages:package_id (name, price)
        `)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (!error && data) {
        setOrders(data as Order[]);
      }
      setLoadingOrders(false);
    };

    fetchOrders();
  }, [user]);

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const stats = {
    total: orders.length,
    pending: orders.filter((o) => o.status === "pendente" || o.status === "em_andamento").length,
    completed: orders.filter((o) => o.status === "concluido").length,
  };

  return (
    <div className="min-h-screen py-8 bg-muted/30">
      <div className="container mx-auto px-4">
        <Breadcrumbs />

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Olá, {profile?.full_name?.split(" ")[0] || "Cliente"}! 👋
            </h1>
            <p className="text-muted-foreground">
              Bem-vindo ao seu painel. Aqui pode acompanhar os seus pedidos e sites.
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => navigate("/cliente/perfil")}>
              <User className="w-4 h-4 mr-2" />
              Meu Perfil
            </Button>
            <Button variant="ghost" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </Button>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          <div className="p-6 rounded-2xl bg-card border border-border shadow-soft">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center">
                <Package className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-sm text-muted-foreground">Total de Pedidos</p>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-card border border-border shadow-soft">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                <Clock className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.pending}</p>
                <p className="text-sm text-muted-foreground">Em Andamento</p>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-card border border-border shadow-soft">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-secondary/20 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-secondary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.completed}</p>
                <p className="text-sm text-muted-foreground">Concluídos</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-wrap gap-4 mb-8"
        >
          <Button variant="hero" asChild>
            <Link to="/pedido">
              <Plus className="w-4 h-4" />
              Novo Pedido
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/planos">Ver Planos de Gestão</Link>
          </Button>
        </motion.div>

        {/* Orders Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-card rounded-2xl border border-border shadow-soft overflow-hidden"
        >
          <div className="p-6 border-b border-border">
            <h2 className="text-xl font-semibold">Meus Pedidos</h2>
          </div>

          {loadingOrders ? (
            <div className="p-12 text-center">
              <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
            </div>
          ) : orders.length === 0 ? (
            <div className="p-12 text-center">
              <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Nenhum pedido ainda</h3>
              <p className="text-muted-foreground mb-4">
                Comece agora a transformar o seu negócio digital.
              </p>
              <Button variant="hero" asChild>
                <Link to="/pedido">Fazer Primeiro Pedido</Link>
              </Button>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {orders.map((order) => {
                const status = statusConfig[order.status] || statusConfig.pendente;
                const StatusIcon = status.icon;

                return (
                  <div
                    key={order.id}
                    className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                        <FileText className="w-5 h-5 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="font-semibold">{order.order_number}</p>
                        <p className="text-sm text-muted-foreground">
                          {order.business_name} • {order.packages?.name || "Pacote"} •{" "}
                          {new Date(order.created_at).toLocaleDateString("pt-MZ")}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <Badge variant={status.color}>
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {status.label}
                      </Badge>

                      {order.demo_url && (
                        <Button variant="ghost" size="sm" asChild>
                          <a href={order.demo_url} target="_blank" rel="noopener noreferrer">
                            <Eye className="w-4 h-4 mr-1" />
                            Ver Demo
                          </a>
                        </Button>
                      )}

                      {order.final_url && (
                        <Button variant="ghost" size="sm" asChild>
                          <a href={order.final_url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="w-4 h-4 mr-1" />
                            Ver Site
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-8 p-8 rounded-2xl gradient-primary text-primary-foreground text-center"
        >
          <h3 className="text-xl font-bold mb-2">Precisa de Ajuda?</h3>
          <p className="text-primary-foreground/80 mb-4">
            A nossa equipa está disponível para ajudar com qualquer questão.
          </p>
          <Button
            variant="heroOutline"
            className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 border-0"
            asChild
          >
            <a
              href="https://wa.me/258841234567"
              target="_blank"
              rel="noopener noreferrer"
            >
              Contactar via WhatsApp
              <ArrowRight className="ml-2" />
            </a>
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
