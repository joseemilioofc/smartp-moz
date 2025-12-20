import { useLocation, Link } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";

const pathLabels: Record<string, string> = {
  "": "Início",
  servicos: "Serviços",
  planos: "Planos",
  sobre: "Sobre Nós",
  pedido: "Fazer Pedido",
  login: "Entrar",
  registro: "Criar Conta",
  cliente: "Meu Painel",
  admin: "Painel Admin",
  politicas: "Políticas",
  privacidade: "Privacidade",
  termos: "Termos de Uso",
  seguranca: "Segurança",
  perfil: "Meu Perfil",
  contratos: "Contratos",
};

export function Breadcrumbs() {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  // Don't show breadcrumbs on home page
  if (pathnames.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb" className="py-4">
      <ol className="flex items-center gap-2 text-sm">
        <li>
          <Link
            to="/"
            className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
          >
            <Home className="w-4 h-4" />
            <span className="sr-only md:not-sr-only">Início</span>
          </Link>
        </li>

        {pathnames.map((value, index) => {
          const to = `/${pathnames.slice(0, index + 1).join("/")}`;
          const isLast = index === pathnames.length - 1;
          const label = pathLabels[value] || value.charAt(0).toUpperCase() + value.slice(1);

          return (
            <li key={to} className="flex items-center gap-2">
              <ChevronRight className="w-4 h-4 text-muted-foreground/50" />
              {isLast ? (
                <span className="text-foreground font-medium">{label}</span>
              ) : (
                <Link
                  to={to}
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
