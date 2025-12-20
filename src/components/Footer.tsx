import { Link } from "react-router-dom";
import { Mail, Phone, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-foreground text-primary-foreground">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">SP</span>
              </div>
              <span className="font-bold text-xl">SmartPresence</span>
            </div>
            <p className="text-primary-foreground/70 text-sm leading-relaxed">
              Transformamos pequenos negócios em Moçambique com presença digital profissional e acessível.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Links Rápidos</h4>
            <ul className="space-y-3">
              {[
                { path: "/servicos", label: "Serviços" },
                { path: "/planos", label: "Planos" },
                { path: "/sobre", label: "Sobre Nós" },
                { path: "/pedido", label: "Fazer Pedido" },
              ].map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-primary-foreground/70 hover:text-primary transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-3">
              {[
                { path: "/politicas/privacidade", label: "Política de Privacidade" },
                { path: "/politicas/termos", label: "Termos de Uso" },
                { path: "/politicas/seguranca", label: "Segurança" },
              ].map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-primary-foreground/70 hover:text-primary transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Contacto</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-primary-foreground/70 text-sm">
                <Mail size={16} className="text-primary" />
                <span>info@smartpresence.co.mz</span>
              </li>
              <li className="flex items-center gap-2 text-primary-foreground/70 text-sm">
                <Phone size={16} className="text-primary" />
                <span>+258 84 123 4567</span>
              </li>
              <li className="flex items-start gap-2 text-primary-foreground/70 text-sm">
                <MapPin size={16} className="text-primary mt-0.5" />
                <span>Maputo, Moçambique</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-primary-foreground/10 text-center">
          <p className="text-primary-foreground/50 text-sm">
            © {new Date().getFullYear()} SmartPresence. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
