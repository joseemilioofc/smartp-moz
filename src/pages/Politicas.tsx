import { motion } from "framer-motion";
import { useParams, Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Shield, FileText, Lock } from "lucide-react";

const policies = {
  privacidade: {
    title: "Política de Privacidade",
    icon: Shield,
    content: `
## 1. Introdução

A SmartPresence está comprometida em proteger a sua privacidade. Esta Política de Privacidade explica como recolhemos, usamos e protegemos as suas informações pessoais.

## 2. Informações que Recolhemos

Podemos recolher as seguintes informações:
- **Dados de identificação**: Nome, email, número de telefone
- **Dados do negócio**: Nome da empresa, tipo de negócio, preferências de design
- **Dados de utilização**: Como interage com o nosso site e serviços

## 3. Como Usamos as Suas Informações

Utilizamos as suas informações para:
- Processar e entregar os pedidos de criação de sites
- Comunicar sobre o estado dos seus projectos
- Melhorar os nossos serviços
- Enviar actualizações relevantes (com o seu consentimento)

## 4. Protecção de Dados

Implementamos medidas de segurança técnicas e organizacionais para proteger as suas informações pessoais contra acesso não autorizado, alteração ou destruição.

## 5. Partilha de Informações

Não vendemos nem partilhamos as suas informações pessoais com terceiros, excepto quando necessário para fornecer os nossos serviços ou quando exigido por lei.

## 6. Os Seus Direitos

Tem o direito de:
- Aceder às suas informações pessoais
- Corrigir dados incorrectos
- Solicitar a eliminação dos seus dados
- Retirar o consentimento para comunicações de marketing

## 7. Contacto

Para questões sobre privacidade, contacte-nos em: privacidade@smartpresence.co.mz
    `,
  },
  termos: {
    title: "Termos de Uso",
    icon: FileText,
    content: `
## 1. Aceitação dos Termos

Ao utilizar os serviços da SmartPresence, concorda em cumprir estes Termos de Uso. Se não concordar com algum termo, não utilize os nossos serviços.

## 2. Descrição dos Serviços

A SmartPresence oferece serviços de:
- Criação de websites profissionais
- Design e desenvolvimento personalizado
- Manutenção e gestão de sites
- Suporte técnico

## 3. Processo de Pedido

1. O cliente submete um pedido através do formulário online
2. A SmartPresence analisa o pedido e envia uma proposta
3. Após aprovação, é gerado um contrato digital
4. O trabalho inicia após confirmação do pagamento inicial

## 4. Pagamentos

- Os preços estão em Meticais (MZN) e podem ser alterados sem aviso prévio
- Métodos de pagamento aceites: Transferência bancária, M-Pesa, e-Mola
- Para pacotes de criação: 50% inicial, 50% na entrega
- Para planos mensais: Pagamento no início de cada período

## 5. Prazos de Entrega

Os prazos dependem do pacote escolhido:
- Pacote Básico: 7-10 dias úteis
- Pacote Padrão: 15-20 dias úteis
- Pacote Premium: 25-30 dias úteis

## 6. Propriedade Intelectual

- O código fonte pertence à SmartPresence até pagamento completo
- Após pagamento, o cliente recebe licença de uso do site
- Imagens e conteúdos fornecidos pelo cliente permanecem propriedade do mesmo

## 7. Limitação de Responsabilidade

A SmartPresence não é responsável por:
- Perdas indirectas ou consequenciais
- Interrupções de serviço de terceiros
- Conteúdo fornecido pelo cliente

## 8. Alterações aos Termos

Reservamos o direito de alterar estes termos. Alterações significativas serão comunicadas aos clientes.
    `,
  },
  seguranca: {
    title: "Segurança",
    icon: Lock,
    content: `
## 1. O Nosso Compromisso com a Segurança

A SmartPresence leva a segurança a sério. Implementamos múltiplas camadas de protecção para garantir que os seus dados e sites estejam seguros.

## 2. Medidas Técnicas de Segurança

### Encriptação
- Todas as comunicações utilizam HTTPS/TLS
- Dados sensíveis são encriptados em repouso
- Certificados SSL incluídos em todos os pacotes

### Autenticação
- Senhas armazenadas com hash seguro
- Autenticação de dois factores disponível
- Sessões com expiração automática

### Infraestrutura
- Servidores em centros de dados certificados
- Backups regulares e automatizados
- Monitorização 24/7

## 3. Práticas de Segurança

- Actualizações de segurança regulares
- Auditorias de vulnerabilidades
- Formação contínua da equipa
- Princípio do menor privilégio

## 4. Segurança dos Sites dos Clientes

Todos os sites que criamos incluem:
- Certificado SSL gratuito
- Protecção contra ataques comuns
- Actualizações de segurança
- Backups regulares (conforme o plano)

## 5. Resposta a Incidentes

Em caso de incidente de segurança:
1. Isolamento imediato do problema
2. Investigação e resolução
3. Notificação aos afectados
4. Medidas preventivas

## 6. Reporte de Vulnerabilidades

Se descobrir uma vulnerabilidade de segurança, contacte-nos imediatamente em: seguranca@smartpresence.co.mz

Tratamos todos os reportes com seriedade e confidencialidade.

## 7. Responsabilidades do Cliente

Para manter a segurança:
- Use senhas fortes e únicas
- Não partilhe credenciais de acesso
- Mantenha o seu computador seguro
- Reporte actividades suspeitas
    `,
  },
};

export default function Politicas() {
  const { tipo } = useParams<{ tipo: string }>();
  const policy = policies[tipo as keyof typeof policies];

  if (!policy) {
    return (
      <div className="min-h-screen py-24 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Página não encontrada</h1>
          <Button asChild>
            <Link to="/">Voltar ao Início</Link>
          </Button>
        </div>
      </div>
    );
  }

  const Icon = policy.icon;

  return (
    <div className="min-h-screen py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto"
        >
          {/* Back Link */}
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar ao Início
          </Link>

          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center">
              <Icon className="w-8 h-8 text-primary-foreground" />
            </div>
            <div>
              <Badge variant="secondary" className="mb-2">
                Legal
              </Badge>
              <h1 className="text-3xl font-bold">{policy.title}</h1>
            </div>
          </div>

          {/* Content */}
          <div className="prose prose-lg max-w-none">
            {policy.content.split("\n").map((line, index) => {
              if (line.startsWith("## ")) {
                return (
                  <h2 key={index} className="text-xl font-bold mt-8 mb-4 text-foreground">
                    {line.replace("## ", "")}
                  </h2>
                );
              }
              if (line.startsWith("### ")) {
                return (
                  <h3 key={index} className="text-lg font-semibold mt-6 mb-3 text-foreground">
                    {line.replace("### ", "")}
                  </h3>
                );
              }
              if (line.startsWith("- ")) {
                return (
                  <li key={index} className="text-muted-foreground ml-4">
                    {line.replace("- ", "")}
                  </li>
                );
              }
              if (line.match(/^\d+\./)) {
                return (
                  <p key={index} className="text-muted-foreground ml-4 my-1">
                    {line}
                  </p>
                );
              }
              if (line.trim()) {
                return (
                  <p key={index} className="text-muted-foreground mb-4">
                    {line}
                  </p>
                );
              }
              return null;
            })}
          </div>

          {/* Last Updated */}
          <div className="mt-12 pt-8 border-t border-border text-center text-sm text-muted-foreground">
            Última actualização: Dezembro 2024
          </div>
        </motion.div>
      </div>
    </div>
  );
}
