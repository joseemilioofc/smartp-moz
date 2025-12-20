import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, ArrowRight } from "lucide-react";

const packages = [
  {
    name: "Básico",
    price: "5.000",
    description: "Ideal para quem está a começar",
    features: [
      "1 página (landing page)",
      "Design responsivo",
      "Formulário de contacto",
      "Optimização SEO básica",
      "Domínio .co.mz por 1 ano",
      "Suporte por email",
    ],
    popular: false,
  },
  {
    name: "Padrão",
    price: "12.500",
    description: "Para negócios em crescimento",
    features: [
      "Até 5 páginas",
      "Design personalizado",
      "Integração WhatsApp",
      "Galeria de produtos/serviços",
      "Optimização SEO avançada",
      "Domínio .co.mz por 1 ano",
      "Certificado SSL",
      "Suporte prioritário",
    ],
    popular: true,
  },
  {
    name: "Premium",
    price: "25.000",
    description: "Solução completa para empresas",
    features: [
      "Páginas ilimitadas",
      "Design exclusivo premium",
      "E-commerce integrado",
      "Painel de gestão",
      "Blog integrado",
      "Integração redes sociais",
      "Domínio .co.mz por 2 anos",
      "Certificado SSL",
      "Suporte 24/7",
      "Treinamento incluído",
    ],
    popular: false,
  },
];

export default function Servicos() {
  return (
    <div className="min-h-screen py-24">
      {/* Header */}
      <section className="container mx-auto px-4 text-center mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Badge variant="warning" className="mb-4">
            Nossos Pacotes
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Escolha o Pacote Ideal Para o Seu Negócio
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Temos opções para todos os tamanhos de negócio. Todos os preços em Meticais (MZN).
          </p>
        </motion.div>
      </section>

      {/* Pricing Cards */}
      <section className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {packages.map((pkg, index) => (
            <motion.div
              key={pkg.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`relative rounded-2xl p-8 ${
                pkg.popular
                  ? "bg-foreground text-primary-foreground shadow-glow scale-105"
                  : "bg-card border border-border shadow-soft"
              }`}
            >
              {pkg.popular && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 gradient-primary border-0">
                  Mais Popular
                </Badge>
              )}

              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold mb-2">{pkg.name}</h3>
                <p
                  className={`text-sm mb-4 ${
                    pkg.popular ? "text-primary-foreground/70" : "text-muted-foreground"
                  }`}
                >
                  {pkg.description}
                </p>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-4xl font-bold">{pkg.price}</span>
                  <span
                    className={`text-sm ${
                      pkg.popular ? "text-primary-foreground/70" : "text-muted-foreground"
                    }`}
                  >
                    MZN
                  </span>
                </div>
              </div>

              <ul className="space-y-4 mb-8">
                {pkg.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                        pkg.popular ? "bg-primary" : "bg-secondary"
                      }`}
                    >
                      <Check className="w-3 h-3 text-primary-foreground" />
                    </div>
                    <span
                      className={`text-sm ${
                        pkg.popular ? "text-primary-foreground/90" : "text-foreground"
                      }`}
                    >
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <Button
                variant={pkg.popular ? "hero" : "outline"}
                size="lg"
                className={`w-full ${
                  pkg.popular ? "bg-primary text-primary-foreground" : ""
                }`}
                asChild
              >
                <Link to={`/pedido?pacote=${pkg.name.toLowerCase()}`}>
                  Escolher {pkg.name}
                  <ArrowRight className="ml-2" />
                </Link>
              </Button>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 mt-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold mb-4">O Que Está Incluído em Todos os Pacotes</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Independentemente do pacote que escolher, garantimos qualidade e profissionalismo.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
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
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 mt-24">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="rounded-2xl gradient-secondary p-12 text-center text-secondary-foreground"
        >
          <h2 className="text-3xl font-bold mb-4">Não Tem a Certeza de Qual Escolher?</h2>
          <p className="text-secondary-foreground/80 mb-8 max-w-xl mx-auto">
            Fale connosco gratuitamente e ajudaremos a escolher o pacote perfeito para o seu negócio.
          </p>
          <Button
            variant="heroOutline"
            size="xl"
            className="bg-secondary-foreground text-secondary hover:bg-secondary-foreground/90 border-0"
            asChild
          >
            <Link to="/pedido">
              Pedir Consultoria Grátis
              <ArrowRight className="ml-2" />
            </Link>
          </Button>
        </motion.div>
      </section>
    </div>
  );
}
