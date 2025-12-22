import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Check, ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Plan {
  id: string;
  name: string;
  price_monthly: number;
  description: string;
  features: string[];
}

export default function Planos() {
  const [plans, setPlans] = useState<Plan[]>([]);

  useEffect(() => {
    const fetchPlans = async () => {
      const { data } = await supabase
        .from("management_plans")
        .select("*")
        .eq("is_active", true)
        .order("price_monthly", { ascending: true });

      if (data) {
        setPlans(
          data.map((plan) => ({
            ...plan,
            features: JSON.parse(plan.features as string) || [],
          }))
        );
      }
    };

    fetchPlans();
  }, []);

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

  const displayPlans = plans.length > 0 ? plans : defaultPlans;

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <Breadcrumbs />

        {/* Header */}
        <section className="text-center mb-16 pt-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Badge variant="success" className="mb-4">
              Planos de Gestão
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Mantenha o Seu Site Sempre Actualizado
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Planos mensais de manutenção e gestão para garantir que o seu site funciona sempre na perfeição.
            </p>
          </motion.div>
        </section>

        {/* Plans Grid */}
        <section>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
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
        </section>

        {/* FAQ Preview */}
        <section className="mt-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-3xl font-bold text-center mb-12">Perguntas Frequentes</h2>

            <div className="space-y-6">
              {[
                {
                  q: "Posso mudar de plano a qualquer momento?",
                  a: "Sim! Pode fazer upgrade ou downgrade do seu plano a qualquer momento. As alterações entram em vigor no próximo ciclo de facturação.",
                },
                {
                  q: "O que acontece se cancelar o plano?",
                  a: "Pode cancelar a qualquer momento. O seu site continuará online, mas sem os serviços de manutenção incluídos no plano.",
                },
                {
                  q: "Como funciona o suporte?",
                  a: "Dependendo do plano, oferecemos suporte por email, WhatsApp ou 24/7. O tempo de resposta varia conforme o plano escolhido.",
                },
              ].map((item, index) => (
                <div key={index} className="p-6 rounded-xl bg-muted/50">
                  <h4 className="font-semibold mb-2">{item.q}</h4>
                  <p className="text-muted-foreground text-sm">{item.a}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </section>
      </div>
    </div>
  );
}
