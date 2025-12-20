import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Download, Smartphone, Check, Apple, Monitor } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function Instalar() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
    }

    // Check if iOS
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(isIOSDevice);

    // Listen for install prompt
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === "accepted") {
      setIsInstalled(true);
    }
    setDeferredPrompt(null);
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <Breadcrumbs />

        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <Badge variant="warning" className="mb-4">
              <Smartphone className="w-4 h-4 mr-1" />
              App Móvel
            </Badge>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Instale o SmartPresence
            </h1>
            <p className="text-muted-foreground">
              Aceda rapidamente à sua conta e acompanhe os seus pedidos directamente do seu telemóvel.
            </p>
          </motion.div>

          {isInstalled ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-8 rounded-2xl bg-success/10 border border-success/20 text-center"
            >
              <Check className="w-16 h-16 mx-auto text-success mb-4" />
              <h2 className="text-2xl font-bold text-success mb-2">App Instalado!</h2>
              <p className="text-muted-foreground">
                O SmartPresence já está instalado no seu dispositivo.
              </p>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="space-y-6"
            >
              {/* Android/Desktop Install Button */}
              {deferredPrompt && (
                <div className="p-8 rounded-2xl bg-card border border-border shadow-soft text-center">
                  <Monitor className="w-12 h-12 mx-auto text-primary mb-4" />
                  <h2 className="text-xl font-bold mb-2">Instalar Agora</h2>
                  <p className="text-muted-foreground mb-6">
                    Clique no botão abaixo para adicionar o app ao seu dispositivo.
                  </p>
                  <Button variant="hero" size="xl" onClick={handleInstall}>
                    <Download className="mr-2" />
                    Instalar SmartPresence
                  </Button>
                </div>
              )}

              {/* iOS Instructions */}
              {isIOS && (
                <div className="p-8 rounded-2xl bg-card border border-border shadow-soft">
                  <Apple className="w-12 h-12 mx-auto text-primary mb-4" />
                  <h2 className="text-xl font-bold mb-4 text-center">Instalar no iPhone/iPad</h2>
                  <ol className="space-y-4">
                    <li className="flex gap-3">
                      <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                        1
                      </span>
                      <span>
                        Toque no ícone <strong>Partilhar</strong> (quadrado com seta para cima) na barra inferior do Safari.
                      </span>
                    </li>
                    <li className="flex gap-3">
                      <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                        2
                      </span>
                      <span>
                        Deslize para baixo e toque em <strong>"Adicionar ao Ecrã Inicial"</strong>.
                      </span>
                    </li>
                    <li className="flex gap-3">
                      <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                        3
                      </span>
                      <span>
                        Toque em <strong>"Adicionar"</strong> no canto superior direito.
                      </span>
                    </li>
                  </ol>
                </div>
              )}

              {/* Android Instructions (when prompt not available) */}
              {!deferredPrompt && !isIOS && (
                <div className="p-8 rounded-2xl bg-card border border-border shadow-soft">
                  <Smartphone className="w-12 h-12 mx-auto text-primary mb-4" />
                  <h2 className="text-xl font-bold mb-4 text-center">Instalar no Android</h2>
                  <ol className="space-y-4">
                    <li className="flex gap-3">
                      <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                        1
                      </span>
                      <span>
                        Toque no menu <strong>(três pontos)</strong> no canto superior direito do Chrome.
                      </span>
                    </li>
                    <li className="flex gap-3">
                      <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                        2
                      </span>
                      <span>
                        Seleccione <strong>"Instalar app"</strong> ou <strong>"Adicionar ao ecrã inicial"</strong>.
                      </span>
                    </li>
                    <li className="flex gap-3">
                      <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                        3
                      </span>
                      <span>
                        Confirme tocando em <strong>"Instalar"</strong>.
                      </span>
                    </li>
                  </ol>
                </div>
              )}

              {/* Benefits */}
              <div className="p-6 rounded-xl bg-muted/50 border border-border">
                <h3 className="font-semibold mb-4">Vantagens do App:</h3>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-success" />
                    Acesso rápido sem abrir o navegador
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-success" />
                    Funciona offline (páginas visitadas)
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-success" />
                    Carregamento mais rápido
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-success" />
                    Experiência de app nativo
                  </li>
                </ul>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
