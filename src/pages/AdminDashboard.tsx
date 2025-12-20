import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
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
  LogOut,
  Loader2,
  Shield,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface UserWithRole {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  business_name: string | null;
  created_at: string;
  role: string;
  is_supreme_admin: boolean;
}

interface Order {
  id: string;
  order_number: string;
  status: string;
  business_name: string;
  created_at: string;
  profiles: { full_name: string } | null;
  packages: { name: string } | null;
}

interface NavigationStat {
  page_path: string;
  count: number;
}

const statusConfig: Record<string, { label: string; color: "warning" | "info" | "success" | "secondary"; icon: any }> = {
  pendente: { label: "Pendente", color: "warning", icon: AlertCircle },
  em_andamento: { label: "Em Andamento", color: "info", icon: Clock },
  demo: { label: "Demo", color: "info", icon: Eye },
  avaliacao: { label: "Avaliação", color: "warning", icon: Clock },
  concluido: { label: "Concluído", color: "success", icon: CheckCircle2 },
  cancelado: { label: "Cancelado", color: "secondary", icon: AlertCircle },
};

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { user, role, isSupremeAdmin, loading, signOut } = useAuth();
  const { toast } = useToast();
  const [users, setUsers] = useState<UserWithRole[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [navStats, setNavStats] = useState<NavigationStat[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (!loading && (!user || role !== "admin")) {
      navigate("/login");
    }
  }, [user, role, loading, navigate]);

  useEffect(() => {
    const fetchData = async () => {
      if (!user || role !== "admin") return;

      // Fetch users with roles
      const { data: profilesData } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (profilesData) {
        const usersWithRoles: UserWithRole[] = [];
        for (const profile of profilesData) {
          const { data: roleData } = await supabase
            .from("user_roles")
            .select("role, is_supreme_admin")
            .eq("user_id", profile.user_id)
            .maybeSingle();

          usersWithRoles.push({
            id: profile.id,
            user_id: profile.user_id,
            full_name: profile.full_name,
            email: profile.email,
            business_name: profile.business_name,
            created_at: profile.created_at,
            role: roleData?.role || "cliente",
            is_supreme_admin: roleData?.is_supreme_admin || false,
          });
        }
        setUsers(usersWithRoles);
      }

      // Fetch orders
      const { data: ordersData } = await supabase
        .from("orders")
        .select(`
          id,
          order_number,
          status,
          business_name,
          created_at,
          packages:package_id (name)
        `)
        .order("created_at", { ascending: false })
        .limit(10);

      if (ordersData) {
        setOrders(ordersData as Order[]);
      }

      // Fetch navigation stats
      const { data: navData } = await supabase
        .from("navigation_logs")
        .select("page_path");

      if (navData) {
        const stats: Record<string, number> = {};
        navData.forEach((log) => {
          stats[log.page_path] = (stats[log.page_path] || 0) + 1;
        });
        const sortedStats = Object.entries(stats)
          .map(([page_path, count]) => ({ page_path, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 4);
        setNavStats(sortedStats);
      }

      setLoadingData(false);
    };

    fetchData();
  }, [user, role]);

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  const handleDeleteUser = async (userId: string, userIsSupreme: boolean) => {
    if (userIsSupreme) {
      toast({
        title: "Não permitido",
        description: "O administrador supremo não pode ser removido.",
        variant: "destructive",
      });
      return;
    }

    // Here you would implement user deletion
    toast({
      title: "Funcionalidade em desenvolvimento",
      description: "A remoção de utilizadores será implementada em breve.",
    });
  };

  const exportToCSV = () => {
    const headers = ["Nome", "Email", "Negócio", "Tipo", "Data de Registo"];
    const rows = users.map((u) => [
      u.full_name,
      u.email,
      u.business_name || "",
      u.role,
      new Date(u.created_at).toLocaleDateString("pt-MZ"),
    ]);

    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `utilizadores_${new Date().toISOString().split("T")[0]}.csv`;
    link.click();

    toast({
      title: "Exportação concluída",
      description: "O ficheiro CSV foi descarregado.",
    });
  };

  if (loading || loadingData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const stats = {
    totalUsers: users.length,
    totalOrders: orders.length,
    pendingOrders: orders.filter((o) => o.status === "pendente" || o.status === "em_andamento").length,
    completedOrders: orders.filter((o) => o.status === "concluido").length,
  };

  const pageLabels: Record<string, string> = {
    "/": "Página Inicial",
    "/servicos": "Serviços",
    "/planos": "Planos",
    "/pedido": "Formulário de Pedido",
    "/sobre": "Sobre Nós",
    "/login": "Login",
    "/registro": "Registro",
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
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold">Painel Administrativo</h1>
              {isSupremeAdmin && (
                <Badge className="gradient-primary text-primary-foreground">
                  <Shield className="w-3 h-3 mr-1" />
                  Supremo
                </Badge>
              )}
            </div>
            <p className="text-muted-foreground">
              Gerencie utilizadores, pedidos e acompanhe o desempenho.
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={exportToCSV}>
              <Download className="w-4 h-4 mr-2" />
              Exportar
            </Button>
            {isSupremeAdmin && (
              <Button variant="hero">
                <UserPlus className="w-4 h-4 mr-2" />
                Adicionar Admin
              </Button>
            )}
            <Button variant="ghost" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </Button>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
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
                    user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    user.email.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map((u) => (
                  <div
                    key={u.id}
                    className="p-4 flex items-center justify-between hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center font-semibold text-muted-foreground">
                        {u.full_name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium flex items-center gap-2">
                          {u.full_name}
                          {u.is_supreme_admin && (
                            <Badge variant="default" className="text-xs">
                              Supremo
                            </Badge>
                          )}
                        </p>
                        <p className="text-sm text-muted-foreground">{u.email}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Badge variant={u.role === "admin" ? "default" : "outline"}>
                        {u.role === "admin" ? "Admin" : "Cliente"}
                      </Badge>
                      {isSupremeAdmin && !u.is_supreme_admin && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive"
                          onClick={() => handleDeleteUser(u.user_id, u.is_supreme_admin)}
                        >
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
                  <SelectItem value="pendente">Pendentes</SelectItem>
                  <SelectItem value="em_andamento">Em Andamento</SelectItem>
                  <SelectItem value="concluido">Concluídos</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="divide-y divide-border max-h-96 overflow-auto">
              {orders
                .filter((order) => filterStatus === "all" || order.status === filterStatus)
                .map((order) => {
                  const status = statusConfig[order.status] || statusConfig.pendente;
                  const StatusIcon = status.icon;

                  return (
                    <div
                      key={order.id}
                      className="p-4 flex items-center justify-between hover:bg-muted/50 transition-colors"
                    >
                      <div>
                        <p className="font-medium">{order.order_number}</p>
                        <p className="text-sm text-muted-foreground">
                          {order.business_name} • {order.packages?.name || "Pacote"}
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <Badge variant={status.color}>
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

        {/* Navigation Tracking */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-8 p-8 rounded-2xl bg-card border border-border shadow-soft"
        >
          <h2 className="text-xl font-semibold mb-6">Rastreamento de Navegação</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {navStats.length > 0 ? (
              navStats.map((item) => (
                <div key={item.page_path} className="p-4 rounded-xl bg-muted/50">
                  <p className="text-sm text-muted-foreground mb-1">
                    {pageLabels[item.page_path] || item.page_path}
                  </p>
                  <p className="text-2xl font-bold">{item.count.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">visualizações</p>
                </div>
              ))
            ) : (
              <div className="col-span-4 text-center py-8 text-muted-foreground">
                <TrendingUp className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Nenhum dado de navegação ainda.</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
