import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Globe, Settings } from "lucide-react";

export function FormNavigation() {
  const location = useLocation();
  const isCriacao = location.pathname === "/pedido-criacao";
  const isGestao = location.pathname === "/pedido-gestao";

  return (
    <div className="flex justify-center gap-2 mb-8">
      <Link
        to="/pedido-criacao"
        className={cn(
          "flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all text-sm",
          isCriacao
            ? "bg-primary text-primary-foreground shadow-md"
            : "bg-muted text-muted-foreground hover:bg-muted/80"
        )}
      >
        <Globe className="w-4 h-4" />
        Criação de Site
      </Link>
      <Link
        to="/pedido-gestao"
        className={cn(
          "flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all text-sm",
          isGestao
            ? "bg-primary text-primary-foreground shadow-md"
            : "bg-muted text-muted-foreground hover:bg-muted/80"
        )}
      >
        <Settings className="w-4 h-4" />
        Gestão / Manutenção
      </Link>
    </div>
  );
}
