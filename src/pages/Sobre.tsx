import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Target, Eye, Heart } from "lucide-react";

const values = [
  {
    icon: Target,
    title: "Foco no Cliente",
    description: "Cada decisão que tomamos é guiada pelo sucesso dos nossos clientes.",
  },
  {
    icon: Eye,
    title: "Transparência",
    description: "Comunicação clara e honesta em todas as interacções.",
  },
  {
    icon: Heart,
    title: "Paixão",
    description: "Amamos o que fazemos e isso reflecte-se no nosso trabalho.",
  },
];

export default function Sobre() {
  return (
    <div className="min-h-screen py-24">
      {/* Header */}
      <section className="container mx-auto px-4 text-center mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Badge variant="info" className="mb-4">
            Sobre Nós
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Quem Somos
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Somos uma equipa apaixonada por tecnologia e empenhada em digitalizar os pequenos negócios de Moçambique.
          </p>
        </motion.div>
      </section>

      {/* Mission & Vision */}
      <section className="container mx-auto px-4 mb-24">
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="p-8 rounded-2xl gradient-primary text-primary-foreground"
          >
            <h2 className="text-2xl font-bold mb-4">Nossa Missão</h2>
            <p className="text-primary-foreground/90 leading-relaxed">
              Democratizar o acesso à presença digital para pequenos negócios em Moçambique, 
              oferecendo soluções profissionais a preços acessíveis que impulsionam o crescimento 
              e a competitividade no mercado digital.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="p-8 rounded-2xl gradient-secondary text-secondary-foreground"
          >
            <h2 className="text-2xl font-bold mb-4">Nossa Visão</h2>
            <p className="text-secondary-foreground/90 leading-relaxed">
              Ser a principal referência em soluções digitais para pequenos negócios em Moçambique, 
              contribuindo para uma economia mais digital, inclusiva e competitiva a nível regional.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Values */}
      <section className="container mx-auto px-4 mb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold mb-4">Nossos Valores</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Os princípios que guiam tudo o que fazemos.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {values.map((value, index) => (
            <motion.div
              key={value.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="p-8 rounded-2xl bg-card border border-border text-center hover:shadow-medium transition-all"
            >
              <div className="w-16 h-16 rounded-full gradient-primary flex items-center justify-center mx-auto mb-6">
                <value.icon className="w-8 h-8 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
              <p className="text-muted-foreground">{value.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Story */}
      <section className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center"
        >
          <h2 className="text-3xl font-bold mb-6">Nossa História</h2>
          <div className="prose prose-lg mx-auto text-muted-foreground">
            <p className="mb-4">
              A SmartPresence nasceu em 2019 com uma visão clara: ajudar pequenos negócios moçambicanos 
              a competir no mundo digital. Começámos como uma pequena equipa de três pessoas, 
              todos apaixonados por tecnologia e pelo potencial dos empreendedores locais.
            </p>
            <p className="mb-4">
              Ao longo dos anos, crescemos e evoluímos, mas a nossa missão permanece a mesma: 
              oferecer soluções digitais acessíveis e de qualidade que fazem a diferença real 
              nos negócios dos nossos clientes.
            </p>
            <p>
              Hoje, temos orgulho de ter ajudado mais de 500 empresas a estabelecer a sua presença 
              online, desde pequenas lojas até empresas em crescimento. Cada projecto é uma nova 
              oportunidade de fazer a diferença.
            </p>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
