import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Users,
  Package,
  TrendingUp,
  Eye,
  Download,
  Search,
  UserPlus,
  Trash2,
  Filter,
  CheckCircle2,
  Clock,
  AlertCircle,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Demo data
const stats = {
  totalUsers: 156,
  totalOrders: 89,
  pendingOrders: 12,
  completedOrders: 77,
  revenue: "2.450.000",
};

const users = [
  { id: 1, name: "João Silva", email: "joao@email.com", type: "cliente", orders: 3, joined: "2024-01-15" },
  { id: 2, name: "Maria Santos", email: "maria@email.com", type: "cliente", orders: 1, joined: "2024-02-20" },
  { id: 3, name: "Pedro Costa", email: "pedro@email.com", type: "admin", orders: 0, joined: "2024-01-01", isSupreme: true },
  { id: 4, name: "Ana Moreira", email: "ana@email.com", type: "cliente", orders: 5, joined: "2023-11-10" },
];

const recentOrders = [
  { id: "PED-089", client: "João Silva", package: "Premium", status: "completed", date: "2024-03-10" },
  { id: "PED-088", client: "Maria Santos", package: "Básico", status: "in_progress", date: "2024-03-09" },
  { id: "PED-087", client: "Ana Moreira", package: "Padrão", status: "pending", date: "2024-03-08" },
];

const statusConfig = {
  pending: { label: "Pendente", color: "warning", icon: AlertCircle },
  in_progress: { label: "Em Progresso", color: "info", icon: Clock },
  completed: { label: "Concluído", color: "success", icon: CheckCircle2 },
};

export default function AdminDashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  return (
    <div className="min-h-screen py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold mb-2">Painel Administrativo</h1>
            <p className="text-muted-foreground">
              Gerencie utilizadores, pedidos e acompanhe o desempenho.
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Exportar Dados
            </Button>
            <Button variant="hero">
              <UserPlus className="w-4 h-4 mr-2" />
              Adicionar Admin
            </Button>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8"
        >
          <div className="p-6 rounded-2xl bg-card border border-border shadow-soft">
            <div className="flex items-center gap-3 mb-2">
              <Users className="w-5 h-5 text-primary" />
              <span className="text-sm text-muted-foreground">Utilizadores</span>
            </div>
            <p className="text-2xl font-bold">{stats.totalUsers}</p>
          </div>

          <div className="p-6 rounded-2xl bg-card border border-border shadow-soft">
            <div className="flex items-center gap-3 mb-2">
              <Package className="w-5 h-5 text-secondary" />
              <span className="text-sm text-muted-foreground">Total Pedidos</span>
            </div>
            <p className="text-2xl font-bold">{stats.totalOrders}</p>
          </div>

          <div className="p-6 rounded-2xl bg-card border border-border shadow-soft">
            <div className="flex items-center gap-3 mb-2">
              <Clock className="w-5 h-5 text-primary" />
              <span className="text-sm text-muted-foreground">Pendentes</span>
            </div>
            <p className="text-2xl font-bold">{stats.pendingOrders}</p>
          </div>

          <div className="p-6 rounded-2xl bg-card border border-border shadow-soft">
            <div className="flex items-center gap-3 mb-2">
              <CheckCircle2 className="w-5 h-5 text-secondary" />
              <span className="text-sm text-muted-foreground">Concluídos</span>
            </div>
            <p className="text-2xl font-bold">{stats.completedOrders}</p>
          </div>

          <div className="p-6 rounded-2xl gradient-primary text-primary-foreground shadow-soft col-span-2 lg:col-span-1">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="w-5 h-5" />
              <span className="text-sm text-primary-foreground/80">Receita Total</span>
            </div>
            <p className="text-2xl font-bold">{stats.revenue} MZN</p>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Users Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-card rounded-2xl border border-border shadow-soft overflow-hidden"
          >
            <div className="p-6 border-b border-border flex items-center justify-between">
              <h2 className="text-xl font-semibold">Utilizadores</h2>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Pesquisar..."
                  className="pl-9 w-48"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="divide-y divide-border max-h-96 overflow-auto">
              {users
                .filter(
                  (user) =>
                    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    user.email.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map((user) => (
                  <div
                    key={user.id}
                    className="p-4 flex items-center justify-between hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center font-semibold text-muted-foreground">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium flex items-center gap-2">
                          {user.name}
                          {user.isSupreme && (
                            <Badge variant="default" className="text-xs">
                              Supremo
                            </Badge>
                          )}
                        </p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Badge variant={user.type === "admin" ? "default" : "outline"}>
                        {user.type === "admin" ? "Admin" : "Cliente"}
                      </Badge>
                      {!user.isSupreme && (
                        <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </motion.div>

          {/* Recent Orders */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-card rounded-2xl border border-border shadow-soft overflow-hidden"
          >
            <div className="p-6 border-b border-border flex items-center justify-between">
              <h2 className="text-xl font-semibold">Pedidos Recentes</h2>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-40">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Filtrar" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="pending">Pendentes</SelectItem>
                  <SelectItem value="in_progress">Em Progresso</SelectItem>
                  <SelectItem value="completed">Concluídos</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="divide-y divide-border">
              {recentOrders
                .filter((order) => filterStatus === "all" || order.status === filterStatus)
                .map((order) => {
                  const status = statusConfig[order.status as keyof typeof statusConfig];
                  const StatusIcon = status.icon;

                  return (
                    <div
                      key={order.id}
                      className="p-4 flex items-center justify-between hover:bg-muted/50 transition-colors"
                    >
                      <div>
                        <p className="font-medium">{order.id}</p>
                        <p className="text-sm text-muted-foreground">
                          {order.client} • {order.package}
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <Badge variant={status.color as "warning" | "info" | "success"}>
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {status.label}
                        </Badge>
                        <Button variant="ghost" size="icon">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
            </div>
          </motion.div>
        </div>

        {/* Navigation Tracking (Preview) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-8 p-8 rounded-2xl bg-card border border-border shadow-soft"
        >
          <h2 className="text-xl font-semibold mb-6">Rastreamento de Navegação</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { page: "Página Inicial", views: 1234 },
              { page: "Serviços", views: 856 },
              { page: "Planos", views: 623 },
              { page: "Formulário de Pedido", views: 412 },
            ].map((item) => (
              <div key={item.page} className="p-4 rounded-xl bg-muted/50">
                <p className="text-sm text-muted-foreground mb-1">{item.page}</p>
                <p className="text-2xl font-bold">{item.views.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">visualizações</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
