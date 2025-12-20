import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
} from "lucide-react";

// Demo data - will be replaced with real data from backend
const stats = {
  totalOrders: 3,
  pendingOrders: 1,
  completedOrders: 2,
};

const orders = [
  {
    id: "PED-001",
    package: "Premium",
    status: "completed",
    date: "2024-01-15",
    site: "restaurantechave.co.mz",
  },
  {
    id: "PED-002",
    package: "Padrão",
    status: "in_progress",
    date: "2024-02-20",
    site: null,
  },
  {
    id: "PED-003",
    package: "Básico",
    status: "pending",
    date: "2024-03-10",
    site: null,
  },
];

const statusConfig = {
  pending: { label: "Pendente", color: "warning", icon: AlertCircle },
  in_progress: { label: "Em Progresso", color: "info", icon: Loader2 },
  completed: { label: "Concluído", color: "success", icon: CheckCircle2 },
};

export default function ClienteDashboard() {
  return (
    <div className="min-h-screen py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold mb-2">Olá, João! 👋</h1>
          <p className="text-muted-foreground">
            Bem-vindo ao seu painel. Aqui pode acompanhar os seus pedidos e sites.
          </p>
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
                <p className="text-2xl font-bold">{stats.totalOrders}</p>
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
                <p className="text-2xl font-bold">{stats.pendingOrders}</p>
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
                <p className="text-2xl font-bold">{stats.completedOrders}</p>
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
            <Link to="/planos">
              Ver Planos de Gestão
            </Link>
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

          <div className="divide-y divide-border">
            {orders.map((order) => {
              const status = statusConfig[order.status as keyof typeof statusConfig];
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
                      <p className="font-semibold">{order.id}</p>
                      <p className="text-sm text-muted-foreground">
                        Pacote {order.package} • {new Date(order.date).toLocaleDateString("pt-MZ")}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <Badge variant={status.color as "warning" | "info" | "success"}>
                      <StatusIcon className="w-3 h-3 mr-1" />
                      {status.label}
                    </Badge>

                    {order.site ? (
                      <Button variant="ghost" size="sm" asChild>
                        <a href={`https://${order.site}`} target="_blank" rel="noopener noreferrer">
                          <Eye className="w-4 h-4 mr-1" />
                          Ver Site
                        </a>
                      </Button>
                    ) : (
                      <Button variant="ghost" size="sm" disabled>
                        <Eye className="w-4 h-4 mr-1" />
                        Ver Demo
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
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
          >
            Contactar Suporte
            <ArrowRight className="ml-2" />
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
