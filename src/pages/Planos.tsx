import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, ArrowRight } from "lucide-react";

const plans = [
  {
    name: "Essencial",
    price: "1.500",
    period: "/mês",
    description: "Manutenção básica para sites simples",
    features: [
      "Actualizações de segurança",
      "Backup semanal",
      "Suporte por email",
      "Tempo de resposta: 48h",
      "1 hora de alterações/mês",
    ],
    color: "secondary",
  },
  {
    name: "Profissional",
    price: "3.500",
    period: "/mês",
    description: "Gestão completa para negócios activos",
    features: [
      "Tudo do plano Essencial",
      "Backup diário",
      "Suporte prioritário WhatsApp",
      "Tempo de resposta: 24h",
      "3 horas de alterações/mês",
      "Relatórios mensais",
      "Optimização de performance",
    ],
    color: "primary",
    popular: true,
  },
  {
    name: "Total",
    price: "7.500",
    period: "/mês",
    description: "Solução completa com gestão de conteúdo",
    features: [
      "Tudo do plano Profissional",
      "Backup em tempo real",
      "Suporte 24/7",
      "Tempo de resposta: 4h",
      "Alterações ilimitadas",
      "Gestão de redes sociais",
      "Análise de métricas avançada",
      "Consultor dedicado",
    ],
    color: "accent",
  },
];

export default function Planos() {
  return (
    <div className="min-h-screen py-24">
      {/* Header */}
      <section className="container mx-auto px-4 text-center mb-16">
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
      <section className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`relative rounded-2xl p-8 bg-card border-2 transition-all duration-300 hover:shadow-medium ${
                plan.popular ? "border-primary shadow-soft" : "border-border"
              }`}
            >
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 gradient-primary border-0">
                  Recomendado
                </Badge>
              )}

              <div className="mb-8">
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">{plan.description}</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground">MZN{plan.period}</span>
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
                variant={plan.popular ? "hero" : "outline"}
                size="lg"
                className="w-full"
                asChild
              >
                <Link to={`/pedido?plano=${plan.name.toLowerCase()}`}>
                  Subscrever {plan.name}
                  <ArrowRight className="ml-2" />
                </Link>
              </Button>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FAQ Preview */}
      <section className="container mx-auto px-4 mt-24">
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
  );
}
