import { useEffect, useState } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowRight, Building2, Mail, Phone, User, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Package {
  id: string;
  name: string;
  price: number;
}

interface Plan {
  id: string;
  name: string;
  price_monthly: number;
}

export default function Pedido() {
  const [searchParams] = useSearchParams();
  const preselectedPackage = searchParams.get("pacote") || "";
  const preselectedPlan = searchParams.get("plano") || "";
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [packages, setPackages] = useState<Package[]>([]);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [digitalSignature, setDigitalSignature] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    businessName: "",
    businessType: "",
    packageId: "",
    planId: "",
    description: "",
    preferences: "",
  });

  useEffect(() => {
    const fetchOptions = async () => {
      const { data: packagesData } = await supabase
        .from("packages")
        .select("id, name, price")
        .eq("is_active", true);

      const { data: plansData } = await supabase
        .from("management_plans")
        .select("id, name, price_monthly")
        .eq("is_active", true);

      if (packagesData) {
        setPackages(packagesData);
        // Set preselected package if exists
        if (preselectedPackage) {
          const pkg = packagesData.find(
            (p) => p.name.toLowerCase() === preselectedPackage.toLowerCase()
          );
          if (pkg) {
            setFormData((prev) => ({ ...prev, packageId: pkg.id }));
          }
        }
      }

      if (plansData) {
        setPlans(plansData);
        // Set preselected plan if exists
        if (preselectedPlan) {
          const plan = plansData.find(
            (p) => p.name.toLowerCase() === preselectedPlan.toLowerCase()
          );
          if (plan) {
            setFormData((prev) => ({ ...prev, planId: plan.id }));
          }
        }
      }
    };

    fetchOptions();
  }, [preselectedPackage, preselectedPlan]);

  useEffect(() => {
    if (profile) {
      setFormData((prev) => ({
        ...prev,
        name: profile.full_name || "",
        email: profile.email || "",
        phone: profile.phone || "",
        businessName: profile.business_name || "",
      }));
    }
  }, [profile]);

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

    if (!digitalSignature.trim()) {
      toast({
        title: "Assinatura necessária",
        description: "Por favor, digite o seu nome completo como assinatura digital.",
        variant: "destructive",
      });
      return;
    }

    if (!user) {
      toast({
        title: "Login necessário",
        description: "Por favor, faça login para submeter o pedido.",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }

    setIsLoading(true);

    try {
      // Create order
      const { data: orderData, error: orderError } = await supabase
        .from("orders")
        .insert([{
          user_id: user.id,
          package_id: formData.packageId || null,
          plan_id: formData.planId || null,
          business_name: formData.businessName,
          business_type: formData.businessType,
          description: formData.description,
          preferences: formData.preferences,
          status: "pendente" as const,
        }])
        .select()
        .single();

      if (orderError) throw orderError;

      // Get package details for contract
      const selectedPackage = packages.find((p) => p.id === formData.packageId);
      const selectedPlan = plans.find((p) => p.id === formData.planId);
      const totalValue =
        (selectedPackage?.price || 0) + (selectedPlan?.price_monthly || 0);

      // Create contract
      const { error: contractError } = await supabase.from("contracts").insert([{
        order_id: orderData.id,
        user_id: user.id,
        client_name: formData.name,
        client_email: formData.email,
        client_phone: formData.phone,
        service_description: `${selectedPackage?.name || "Pacote não selecionado"}${
          selectedPlan ? ` + Plano ${selectedPlan.name}` : ""
        }`,
        total_value: totalValue,
        terms_accepted: true,
        digital_signature: digitalSignature,
        signed_at: new Date().toISOString(),
      }]);

      if (contractError) throw contractError;

      toast({
        title: "Pedido enviado com sucesso!",
        description: `O seu pedido ${orderData.order_number} foi registado. Entraremos em contacto em breve.`,
      });

      navigate("/cliente");
    } catch (error: any) {
      console.error("Order error:", error);
      toast({
        title: "Erro ao enviar pedido",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <Breadcrumbs />

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
                  <Label htmlFor="package">Pacote de Criação *</Label>
                  <Select
                    value={formData.packageId}
                    onValueChange={(value) => setFormData({ ...formData, packageId: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um pacote" />
                    </SelectTrigger>
                    <SelectContent>
                      {packages.map((pkg) => (
                        <SelectItem key={pkg.id} value={pkg.id}>
                          {pkg.name} - {pkg.price.toLocaleString()} MT
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="plan">Plano de Gestão (Opcional)</Label>
                  <Select
                    value={formData.planId}
                    onValueChange={(value) => setFormData({ ...formData, planId: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um plano" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Sem plano mensal</SelectItem>
                      {plans.map((plan) => (
                        <SelectItem key={plan.id} value={plan.id}>
                          {plan.name} - {plan.price_monthly.toLocaleString()} MT/mês
                        </SelectItem>
                      ))}
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

            {/* Contract Section */}
            <div className="p-6 rounded-xl bg-muted/50 border border-border">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                Contrato Digital
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
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
                    . Entendo que será gerado um contrato digital vinculativo após a confirmação do pedido.
                  </Label>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signature">Assinatura Digital (digite o seu nome completo) *</Label>
                  <Input
                    id="signature"
                    placeholder="Nome Completo"
                    value={digitalSignature}
                    onChange={(e) => setDigitalSignature(e.target.value)}
                    className="font-serif italic"
                  />
                  <p className="text-xs text-muted-foreground">
                    Ao digitar o seu nome, está a assinar electronicamente este pedido.
                  </p>
                </div>
              </div>
            </div>

            <Button
              type="submit"
              variant="hero"
              size="xl"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? "Enviando pedido..." : "Enviar Pedido e Gerar Contrato"}
              <ArrowRight className="ml-2" />
            </Button>
          </motion.form>
        </div>
      </div>
    </div>
  );
}
