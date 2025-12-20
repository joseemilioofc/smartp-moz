import { useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowRight, Building2, Mail, Phone, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Pedido() {
  const [searchParams] = useSearchParams();
  const preselectedPackage = searchParams.get("pacote") || "";
  const preselectedPlan = searchParams.get("plano") || "";
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    businessName: "",
    businessType: "",
    package: preselectedPackage,
    plan: preselectedPlan,
    description: "",
    preferences: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!acceptTerms) {
      toast({
        title: "Termos não aceites",
        description: "Por favor, aceite os termos e condições para continuar.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    // Simulated submission
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Pedido enviado com sucesso!",
        description: "Entraremos em contacto em breve via WhatsApp ou email.",
      });
    }, 2000);
  };

  return (
    <div className="min-h-screen py-24">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <Badge variant="warning" className="mb-4">
              Formulário de Pedido
            </Badge>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Solicite o Seu Site Profissional
            </h1>
            <p className="text-muted-foreground">
              Preencha o formulário abaixo e entraremos em contacto para discutir o seu projecto.
            </p>
          </motion.div>

          {/* Form */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            onSubmit={handleSubmit}
            className="space-y-8 p-8 rounded-2xl bg-card border border-border shadow-soft"
          >
            {/* Personal Info */}
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-primary" />
                Informações Pessoais
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome Completo *</Label>
                  <Input
                    id="name"
                    placeholder="Seu nome"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="seu@email.com"
                      className="pl-10"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="phone">Telefone (WhatsApp) *</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+258 84 XXX XXXX"
                      className="pl-10"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Business Info */}
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-primary" />
                Informações do Negócio
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="businessName">Nome do Negócio *</Label>
                  <Input
                    id="businessName"
                    placeholder="Nome da sua empresa"
                    value={formData.businessName}
                    onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="businessType">Tipo de Negócio *</Label>
                  <Select
                    value={formData.businessType}
                    onValueChange={(value) => setFormData({ ...formData, businessType: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="restaurante">Restaurante/Café</SelectItem>
                      <SelectItem value="loja">Loja/Comércio</SelectItem>
                      <SelectItem value="servicos">Serviços</SelectItem>
                      <SelectItem value="saude">Saúde/Beleza</SelectItem>
                      <SelectItem value="educacao">Educação</SelectItem>
                      <SelectItem value="imobiliaria">Imobiliária</SelectItem>
                      <SelectItem value="outro">Outro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Package & Plan */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Pacote e Plano</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="package">Pacote de Criação</Label>
                  <Select
                    value={formData.package}
                    onValueChange={(value) => setFormData({ ...formData, package: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um pacote" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="basico">Básico - 5.000 MZN</SelectItem>
                      <SelectItem value="padrão">Padrão - 12.500 MZN</SelectItem>
                      <SelectItem value="premium">Premium - 25.000 MZN</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="plan">Plano de Gestão (Opcional)</Label>
                  <Select
                    value={formData.plan}
                    onValueChange={(value) => setFormData({ ...formData, plan: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um plano" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="nenhum">Sem plano mensal</SelectItem>
                      <SelectItem value="essencial">Essencial - 1.500 MZN/mês</SelectItem>
                      <SelectItem value="profissional">Profissional - 3.500 MZN/mês</SelectItem>
                      <SelectItem value="total">Total - 7.500 MZN/mês</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Descreva o seu negócio *</Label>
              <Textarea
                id="description"
                placeholder="O que faz o seu negócio? Quais são os seus produtos/serviços principais?"
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="preferences">Preferências de design (opcional)</Label>
              <Textarea
                id="preferences"
                placeholder="Cores preferidas, sites que admira, estilo visual desejado..."
                rows={3}
                value={formData.preferences}
                onChange={(e) => setFormData({ ...formData, preferences: e.target.value })}
              />
            </div>

            {/* Terms */}
            <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
              <Checkbox
                id="terms"
                checked={acceptTerms}
                onCheckedChange={(checked) => setAcceptTerms(checked as boolean)}
              />
              <Label htmlFor="terms" className="text-sm text-muted-foreground leading-relaxed cursor-pointer">
                Li e aceito os{" "}
                <Link to="/politicas/termos" className="text-primary hover:underline">
                  Termos de Uso
                </Link>{" "}
                e a{" "}
                <Link to="/politicas/privacidade" className="text-primary hover:underline">
                  Política de Privacidade
                </Link>
                . Entendo que será gerado um contrato digital após a confirmação do pedido.
              </Label>
            </div>

            <Button
              type="submit"
              variant="hero"
              size="xl"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? "Enviando pedido..." : "Enviar Pedido"}
              <ArrowRight className="ml-2" />
            </Button>
          </motion.form>
        </div>
      </div>
    </div>
  );
}
