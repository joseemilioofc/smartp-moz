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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  ArrowRight,
  Mail,
  Phone,
  User,
  FileText,
  Globe,
  Settings,
  Clock,
  MessageSquare,
  Building2,
  Link as LinkIcon,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Plan {
  id: string;
  name: string;
  price_monthly: number;
  description: string;
  features: string[];
}

export default function PedidoGestao() {
  const [searchParams] = useSearchParams();
  const preselectedPlan = searchParams.get("plano") || "";
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [digitalSignature, setDigitalSignature] = useState("");

  const [formData, setFormData] = useState({
    // 1. Dados do Cliente
    fullName: "",
    siteName: "",
    siteLink: "",
    email: "",
    phone: "",
    whatsapp: "",
    businessType: "",

    // 2. Tipo de Gestão
    managementTypes: [] as string[],
    managementOther: "",

    // 3. Frequência
    frequency: "",

    // 4. Plano
    planId: "",

    // 5. Observações
    observations: "",
  });

  const defaultPlans = [
    {
      id: "1",
      name: "Essencial",
      price_monthly: 799,
      description: "Manutenção básica mensal",
      features: [],
    },
    {
      id: "2",
      name: "Profissional",
      price_monthly: 1499,
      description: "Gestão completa quinzenal",
      features: [],
    },
    {
      id: "3",
      name: "Total",
      price_monthly: 2499,
      description: "Suporte ilimitado semanal",
      features: [],
    },
  ];

  useEffect(() => {
    const fetchPlans = async () => {
      const { data } = await supabase
        .from("management_plans")
        .select("*")
        .eq("is_active", true)
        .order("price_monthly", { ascending: true });

      if (data && data.length > 0) {
        setPlans(
          data.map((plan) => ({
            ...plan,
            features: typeof plan.features === "string" ? JSON.parse(plan.features) : plan.features || [],
          }))
        );

        if (preselectedPlan) {
          const plan = data.find(
            (p) => p.name.toLowerCase() === preselectedPlan.toLowerCase()
          );
          if (plan) {
            setFormData((prev) => ({ ...prev, planId: plan.id }));
          }
        }
      } else {
        setPlans(defaultPlans);
        if (preselectedPlan) {
          const plan = defaultPlans.find(
            (p) => p.name.toLowerCase() === preselectedPlan.toLowerCase()
          );
          if (plan) {
            setFormData((prev) => ({ ...prev, planId: plan.id }));
          }
        }
      }
    };

    fetchPlans();
  }, [preselectedPlan]);

  useEffect(() => {
    if (profile) {
      setFormData((prev) => ({
        ...prev,
        fullName: profile.full_name || "",
        email: profile.email || "",
        phone: profile.phone || "",
        whatsapp: profile.phone || "",
        siteName: profile.business_name || "",
      }));
    }
  }, [profile]);

  const managementOptions = [
    { value: "conteudo", label: "Atualização de conteúdo" },
    { value: "seguranca", label: "Segurança e backups" },
    { value: "desempenho", label: "Acompanhamento de desempenho" },
    { value: "suporte", label: "Suporte técnico" },
    { value: "monitoramento", label: "Monitoramento de visitas" },
    { value: "outro", label: "Outros" },
  ];

  const frequencyOptions = [
    { value: "basico", label: "Básico (mensal)" },
    { value: "medio", label: "Médio (quinzenal)" },
    { value: "avancado", label: "Avançado (semanal)" },
    { value: "personalizado", label: "Personalizado" },
  ];

  const toggleManagement = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      managementTypes: prev.managementTypes.includes(value)
        ? prev.managementTypes.filter((v) => v !== value)
        : [...prev.managementTypes, value],
    }));
  };

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

    if (!formData.planId) {
      toast({
        title: "Plano não selecionado",
        description: "Por favor, selecione um plano de gestão.",
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
      const managementValue = formData.managementTypes.includes("outro")
        ? [...formData.managementTypes.filter((m) => m !== "outro"), formData.managementOther].join(", ")
        : formData.managementTypes.join(", ");

      const description = `
Tipo de Gestão: ${managementValue}
Frequência: ${formData.frequency}
Link do Site: ${formData.siteLink || "Não informado"}
Tipo de Negócio: ${formData.businessType}
Observações: ${formData.observations || "Nenhuma"}
      `.trim();

      const { data: orderData, error: orderError } = await supabase
        .from("orders")
        .insert([
          {
            user_id: user.id,
            plan_id: formData.planId,
            business_name: formData.siteName,
            business_type: formData.businessType,
            description: description,
            preferences: `Link atual: ${formData.siteLink || "N/A"}`,
            status: "pendente" as const,
          },
        ])
        .select()
        .single();

      if (orderError) throw orderError;

      const selectedPlan = plans.find((p) => p.id === formData.planId);
      const totalValue = selectedPlan?.price_monthly || 0;

      const { error: contractError } = await supabase.from("contracts").insert([
        {
          order_id: orderData.id,
          user_id: user.id,
          client_name: formData.fullName,
          client_email: formData.email,
          client_phone: formData.whatsapp || formData.phone,
          service_description: `Gestão/Manutenção - Plano ${selectedPlan?.name || "N/A"} (${formData.frequency})`,
          total_value: totalValue,
          terms_accepted: true,
          digital_signature: digitalSignature,
          signed_at: new Date().toISOString(),
        },
      ]);

      if (contractError) throw contractError;

      toast({
        title: "Pedido enviado com sucesso!",
        description: "O seu pedido foi registado. Siga as instruções de pagamento.",
      });

      navigate(`/pedido-confirmado?pedido=${orderData.id}`);
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

  const displayPlans = plans.length > 0 ? plans : defaultPlans;

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <Breadcrumbs />

        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <Badge variant="success" className="mb-4">
              Formulário de Gestão
            </Badge>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Pedido de Gestão / Manutenção de Site Web/App
            </h1>
            <p className="text-muted-foreground">
              Preencha os campos abaixo para solicitar a gestão e manutenção do seu site ou aplicação.
            </p>
          </motion.div>

          {/* Form */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            onSubmit={handleSubmit}
            className="space-y-8 p-6 md:p-8 rounded-2xl bg-card border border-border shadow-soft"
          >
            {/* 1. Dados do Cliente */}
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-primary" />
                1. Dados do Cliente
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Nome completo *</Label>
                  <Input
                    id="fullName"
                    placeholder="Seu nome completo"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="siteName">Nome do site/app *</Label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="siteName"
                      placeholder="Nome do seu site ou app"
                      className="pl-10"
                      value={formData.siteName}
                      onChange={(e) => setFormData({ ...formData, siteName: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="siteLink">Link (se já existir)</Label>
                  <div className="relative">
                    <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="siteLink"
                      type="url"
                      placeholder="https://www.seusite.com"
                      className="pl-10"
                      value={formData.siteLink}
                      onChange={(e) => setFormData({ ...formData, siteLink: e.target.value })}
                    />
                  </div>
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
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone *</Label>
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
                <div className="space-y-2">
                  <Label htmlFor="whatsapp">WhatsApp *</Label>
                  <div className="relative">
                    <MessageSquare className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="whatsapp"
                      type="tel"
                      placeholder="+258 84 XXX XXXX"
                      className="pl-10"
                      value={formData.whatsapp}
                      onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="businessType">Tipo de negócio *</Label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="businessType"
                      placeholder="Ex: Restaurante, Loja, Clínica..."
                      className="pl-10"
                      value={formData.businessType}
                      onChange={(e) => setFormData({ ...formData, businessType: e.target.value })}
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Tipo de Gestão */}
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Settings className="w-5 h-5 text-primary" />
                2. Tipo de Gestão Necessária *
              </h3>
              <div className="grid md:grid-cols-2 gap-3">
                {managementOptions.map((option) => (
                  <div key={option.value} className="flex items-center space-x-2">
                    <Checkbox
                      id={`mgmt-${option.value}`}
                      checked={formData.managementTypes.includes(option.value)}
                      onCheckedChange={() => toggleManagement(option.value)}
                    />
                    <Label htmlFor={`mgmt-${option.value}`} className="cursor-pointer">
                      {option.label}
                    </Label>
                  </div>
                ))}
              </div>
              {formData.managementTypes.includes("outro") && (
                <Input
                  className="mt-3"
                  placeholder="Especifique outros tipos de gestão"
                  value={formData.managementOther}
                  onChange={(e) => setFormData({ ...formData, managementOther: e.target.value })}
                />
              )}
            </div>

            {/* 3. Frequência */}
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                3. Frequência Desejada *
              </h3>
              <RadioGroup
                value={formData.frequency}
                onValueChange={(value) => setFormData({ ...formData, frequency: value })}
                className="grid md:grid-cols-2 gap-3"
              >
                {frequencyOptions.map((freq) => (
                  <div key={freq.value} className="flex items-center space-x-2">
                    <RadioGroupItem value={freq.value} id={`freq-${freq.value}`} />
                    <Label htmlFor={`freq-${freq.value}`} className="cursor-pointer">
                      {freq.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            {/* 4. Planos */}
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                4. Plano *
              </h3>
              <RadioGroup
                value={formData.planId}
                onValueChange={(value) => setFormData({ ...formData, planId: value })}
                className="grid md:grid-cols-3 gap-4"
              >
                {displayPlans.map((plan) => (
                  <div
                    key={plan.id}
                    className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      formData.planId === plan.id
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    }`}
                    onClick={() => setFormData({ ...formData, planId: plan.id })}
                  >
                    <RadioGroupItem value={plan.id} id={`plan-${plan.id}`} className="sr-only" />
                    <div className="text-center">
                      <h4 className="font-bold text-lg">{plan.name}</h4>
                      <p className="text-2xl font-bold text-primary mt-2">
                        {plan.price_monthly.toLocaleString()} MT
                        <span className="text-sm font-normal text-muted-foreground">/mês</span>
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">{plan.description}</p>
                    </div>
                  </div>
                ))}
              </RadioGroup>
            </div>

            {/* 5. Observações */}
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-primary" />
                5. Observações adicionais
              </h3>
              <Textarea
                placeholder="Detalhes específicos sobre a gestão desejada, problemas actuais, prioridades..."
                rows={4}
                value={formData.observations}
                onChange={(e) => setFormData({ ...formData, observations: e.target.value })}
              />
            </div>

            {/* Contract Section */}
            <div className="p-6 rounded-xl bg-warning/10 border border-warning/30">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-warning" />
                6. Aceitação do Contrato de Gestão
              </h3>

              <p className="text-sm text-muted-foreground mb-4">
                ⚠️ Após o envio, será gerado um <strong>contrato digital</strong> com os termos do
                serviço de gestão, para assinatura e download.
              </p>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Checkbox
                    id="terms"
                    checked={acceptTerms}
                    onCheckedChange={(checked) => setAcceptTerms(checked as boolean)}
                  />
                  <Label
                    htmlFor="terms"
                    className="text-sm text-muted-foreground leading-relaxed cursor-pointer"
                  >
                    Li e aceito os{" "}
                    <Link to="/politicas/termos" className="text-primary hover:underline">
                      Termos de Uso
                    </Link>{" "}
                    e a{" "}
                    <Link to="/politicas/privacidade" className="text-primary hover:underline">
                      Política de Privacidade
                    </Link>
                    . Entendo que será gerado um contrato digital vinculativo para o serviço de gestão mensal.
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
                    Ao digitar o seu nome, está a assinar electronicamente este pedido de gestão.
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
