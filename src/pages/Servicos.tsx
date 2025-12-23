import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Check, ArrowRight, Globe, Settings } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Package {
  id: string;
  name: string;
  price: number;
  description: string;
  features: string[];
}

interface Plan {
  id: string;
  name: string;
  price_monthly: number;
  description: string;
  features: string[];
}

export default function Servicos() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [plans, setPlans] = useState<Plan[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      // Fetch packages
      const { data: packagesData } = await supabase
        .from("packages")
        .select("*")
        .eq("is_active", true)
        .order("price", { ascending: true });

      if (packagesData) {
        setPackages(
          packagesData.map((pkg) => ({
            ...pkg,
            features: typeof pkg.features === "string" ? JSON.parse(pkg.features) : pkg.features || [],
          }))
        );
      }

      // Fetch management plans
      const { data: plansData } = await supabase
        .from("management_plans")
        .select("*")
        .eq("is_active", true)
        .order("price_monthly", { ascending: true });

      if (plansData) {
        setPlans(
          plansData.map((plan) => ({
            ...plan,
            features: typeof plan.features === "string" ? JSON.parse(plan.features) : plan.features || [],
          }))
        );
      }
    };

    fetchData();
  }, []);

  const defaultPackages = [
    {
      id: "1",
      name: "Básico",
      price: 3499,
      description: "Ideal para quem está a começar",
      features: [
        "1 página com logotipo e foto de capa",
        "Texto introdutório sobre o negócio",
        "Botão flutuante de WhatsApp",
        "Layout responsivo",
      ],
    },
    {
      id: "2",
      name: "Padrão",
      price: 5999,
      description: "Para negócios em crescimento",
      features: [
        "Até 3 páginas (início, serviços, contactos)",
        "Galeria de imagens",
        "Formulário de contacto funcional",
        "Integração WhatsApp",
        "Localização no Google Maps",
        "Design responsivo",
      ],
    },
    {
      id: "3",
      name: "Premium",
      price: 9999,
      description: "Solução completa para empresas",
      features: [
        "Até 5 páginas personalizadas",
        "Chat via WhatsApp",
        "Página de agendamento (opcional)",
        "Integração Google Analytics",
        "Design personalizado exclusivo",
        "Suporte prioritário",
      ],
    },
  ];

  const defaultPlans = [
    {
      id: "1",
      name: "Essencial",
      price_monthly: 799,
      description: "Manutenção básica para sites simples",
      features: [
        "Actualizações técnicas básicas",
        "1 alteração por mês",
        "Backup semanal",
        "Suporte por email",
        "Tempo de resposta: 72h",
      ],
    },
    {
      id: "2",
      name: "Profissional",
      price_monthly: 1499,
      description: "Gestão completa para negócios activos",
      features: [
        "Tudo do plano Essencial",
        "2 alterações de conteúdo por mês",
        "Backup diário",
        "Suporte prioritário WhatsApp",
        "Tempo de resposta: 24h",
        "Relatórios mensais",
      ],
    },
    {
      id: "3",
      name: "Total",
      price_monthly: 2499,
      description: "Solução completa com suporte ilimitado",
      features: [
        "Tudo do plano Profissional",
        "Alterações ilimitadas",
        "Backup em tempo real",
        "Suporte WhatsApp 24/7",
        "Tempo de resposta: 4h",
        "Consultor dedicado",
      ],
    },
  ];

  const displayPackages = packages.length > 0 ? packages : defaultPackages;
  const displayPlans = plans.length > 0 ? plans : defaultPlans;

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <Breadcrumbs />

        {/* Header */}
        <section className="text-center mb-12 pt-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Badge variant="warning" className="mb-4">
              Nossos Serviços
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Soluções Completas Para o Seu Negócio
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Desde a criação até à gestão contínua do seu site. Escolha o serviço ideal para si.
            </p>
          </motion.div>
        </section>

        {/* Tabs */}
        <Tabs defaultValue="criacao" className="max-w-6xl mx-auto">
          <TabsList className="grid w-full grid-cols-2 mb-12 h-14">
            <TabsTrigger value="criacao" className="text-base gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Globe className="w-5 h-5" />
              Criação de Sites
            </TabsTrigger>
            <TabsTrigger value="gestao" className="text-base gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Settings className="w-5 h-5" />
              Gestão & Manutenção
            </TabsTrigger>
          </TabsList>

          {/* Criação Tab */}
          <TabsContent value="criacao">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-center mb-10">
                <h2 className="text-2xl font-bold mb-2">Pacotes de Criação de Sites</h2>
                <p className="text-muted-foreground">Todos os preços em Meticais (MT).</p>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                {displayPackages.map((pkg, index) => {
                  const isPopular = index === 1;
                  
                  return (
                    <motion.div
                      key={pkg.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className={`relative rounded-2xl p-8 ${
                        isPopular
                          ? "bg-foreground text-primary-foreground shadow-glow scale-105"
                          : "bg-card border border-border shadow-soft"
                      }`}
                    >
                      {isPopular && (
                        <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 gradient-primary border-0">
                          Mais Popular
                        </Badge>
                      )}

                      <div className="text-center mb-8">
                        <h3 className="text-2xl font-bold mb-2">{pkg.name}</h3>
                        <p
                          className={`text-sm mb-4 ${
                            isPopular ? "text-primary-foreground/70" : "text-muted-foreground"
                          }`}
                        >
                          {pkg.description}
                        </p>
                        <div className="flex items-baseline justify-center gap-1">
                          <span className="text-4xl font-bold">
                            {pkg.price.toLocaleString()}
                          </span>
                          <span
                            className={`text-sm ${
                              isPopular ? "text-primary-foreground/70" : "text-muted-foreground"
                            }`}
                          >
                            MT
                          </span>
                        </div>
                      </div>

                      <ul className="space-y-4 mb-8">
                        {pkg.features.map((feature) => (
                          <li key={feature} className="flex items-start gap-3">
                            <div
                              className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                                isPopular ? "bg-primary" : "bg-secondary"
                              }`}
                            >
                              <Check className="w-3 h-3 text-primary-foreground" />
                            </div>
                            <span
                              className={`text-sm ${
                                isPopular ? "text-primary-foreground/90" : "text-foreground"
                              }`}
                            >
                              {feature}
                            </span>
                          </li>
                        ))}
                      </ul>

                      <Button
                        variant={isPopular ? "hero" : "outline"}
                        size="lg"
                        className={`w-full ${
                          isPopular ? "bg-primary text-primary-foreground" : ""
                        }`}
                        asChild
                      >
                        <Link to={`/pedido-criacao?pacote=${pkg.name.toLowerCase()}`}>
                          Escolher {pkg.name}
                          <ArrowRight className="ml-2" />
                        </Link>
                      </Button>
                    </motion.div>
                  );
                })}
              </div>

              {/* Features Section */}
              <div className="mt-16">
                <div className="text-center mb-10">
                  <h3 className="text-2xl font-bold mb-2">Incluído em Todos os Pacotes</h3>
                  <p className="text-muted-foreground">Qualidade garantida em qualquer opção.</p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    { title: "Design Responsivo", desc: "Perfeito em qualquer dispositivo" },
                    { title: "Carregamento Rápido", desc: "Sites optimizados para velocidade" },
                    { title: "SEO Optimizado", desc: "Apareça nos motores de busca" },
                    { title: "Segurança SSL", desc: "Conexão segura garantida" },
                  ].map((item, index) => (
                    <motion.div
                      key={item.title}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      viewport={{ once: true }}
                      className="p-6 rounded-xl bg-muted/50 text-center"
                    >
                      <h4 className="font-semibold mb-2">{item.title}</h4>
                      <p className="text-sm text-muted-foreground">{item.desc}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </TabsContent>

          {/* Gestão Tab */}
          <TabsContent value="gestao">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-center mb-10">
                <h2 className="text-2xl font-bold mb-2">Planos de Gestão e Manutenção</h2>
                <p className="text-muted-foreground">Mantenha o seu site sempre actualizado. Valores mensais em MT.</p>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                {displayPlans.map((plan, index) => {
                  const isPopular = index === 1;

                  return (
                    <motion.div
                      key={plan.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className={`relative rounded-2xl p-8 bg-card border-2 transition-all duration-300 hover:shadow-medium ${
                        isPopular ? "border-primary shadow-soft" : "border-border"
                      }`}
                    >
                      {isPopular && (
                        <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 gradient-primary border-0">
                          Recomendado
                        </Badge>
                      )}

                      <div className="mb-8">
                        <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                        <p className="text-sm text-muted-foreground mb-4">{plan.description}</p>
                        <div className="flex items-baseline gap-1">
                          <span className="text-4xl font-bold">
                            {plan.price_monthly.toLocaleString()}
                          </span>
                          <span className="text-muted-foreground">MT/mês</span>
                        </div>
                      </div>

                      <ul className="space-y-4 mb-8">
                        {plan.features.map((feature) => (
                          <li key={feature} className="flex items-start gap-3">
                            <div className="w-5 h-5 rounded-full bg-secondary flex items-center justify-center flex-shrink-0 mt-0.5">
                              <Check className="w-3 h-3 text-secondary-foreground" />
                            </div>
                            <span className="text-sm">{feature}</span>
                          </li>
                        ))}
                      </ul>

                      <Button
                        variant={isPopular ? "hero" : "outline"}
                        size="lg"
                        className="w-full"
                        asChild
                      >
                        <Link to={`/pedido-gestao?plano=${plan.name.toLowerCase()}`}>
                          Subscrever {plan.name}
                          <ArrowRight className="ml-2" />
                        </Link>
                      </Button>
                    </motion.div>
                  );
                })}
              </div>

              {/* FAQ Section */}
              <div className="mt-16 max-w-3xl mx-auto">
                <h3 className="text-2xl font-bold text-center mb-8">Perguntas Frequentes</h3>

                <div className="space-y-4">
                  {[
                    {
                      q: "Posso mudar de plano a qualquer momento?",
                      a: "Sim! Pode fazer upgrade ou downgrade do seu plano a qualquer momento.",
                    },
                    {
                      q: "O que acontece se cancelar o plano?",
                      a: "Pode cancelar a qualquer momento. O seu site continuará online sem os serviços de manutenção.",
                    },
                    {
                      q: "Como funciona o suporte?",
                      a: "Oferecemos suporte por email, WhatsApp ou 24/7 dependendo do plano escolhido.",
                    },
                  ].map((item, index) => (
                    <div key={index} className="p-5 rounded-xl bg-muted/50">
                      <h4 className="font-semibold mb-2">{item.q}</h4>
                      <p className="text-muted-foreground text-sm">{item.a}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </TabsContent>
        </Tabs>

        {/* CTA */}
        <section className="mt-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="rounded-2xl gradient-secondary p-12 text-center text-secondary-foreground max-w-4xl mx-auto"
          >
            <h2 className="text-3xl font-bold mb-4">Precisa de Ajuda a Escolher?</h2>
            <p className="text-secondary-foreground/80 mb-8 max-w-xl mx-auto">
              Fale connosco gratuitamente e ajudaremos a escolher a solução perfeita para o seu negócio.
            </p>
            <Button
              variant="heroOutline"
              size="xl"
              className="bg-secondary-foreground text-secondary hover:bg-secondary-foreground/90 border-0"
              asChild
            >
              <Link to="/pedido-criacao">
                Pedir Consultoria Grátis
                <ArrowRight className="ml-2" />
              </Link>
            </Button>
          </motion.div>
        </section>
      </div>
    </div>
  );
}
