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
import { FormNavigation } from "@/components/FormNavigation";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  ArrowRight,
  Building2,
  Mail,
  Phone,
  User,
  FileText,
  MapPin,
  Globe,
  Target,
  Layout,
  Image,
  Share2,
  MessageSquare,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Package {
  id: string;
  name: string;
  price: number;
  description: string;
  features: string[];
}

export default function PedidoCriacao() {
  const [searchParams] = useSearchParams();
  const preselectedPackage = searchParams.get("pacote") || "";
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [packages, setPackages] = useState<Package[]>([]);
  const [digitalSignature, setDigitalSignature] = useState("");

  const [formData, setFormData] = useState({
    // 1. Dados do Cliente
    fullName: "",
    businessName: "",
    email: "",
    phone: "",
    whatsapp: "",
    location: "",
    nuit: "",

    // 2. Tipo de Projeto
    projectType: "",
    projectTypeOther: "",

    // 3. Objetivo do Projeto
    projectObjective: "",
    projectObjectiveOther: "",

    // 4. Estrutura Desejada
    structurePages: [] as string[],
    structureOther: "",

    // 5. Logotipo
    hasLogo: "",

    // 6. Pacote
    packageId: "",

    // 7. Redes Sociais
    socialLinks: "",

    // 8. Observações
    observations: "",
  });

  const defaultPackages = [
    {
      id: "1",
      name: "Básico",
      price: 3499,
      description: "1 página, logotipo, WhatsApp",
      features: [],
    },
    {
      id: "2",
      name: "Padrão",
      price: 5999,
      description: "3 páginas, galeria, formulário",
      features: [],
    },
    {
      id: "3",
      name: "Premium",
      price: 9999,
      description: "5 páginas, design exclusivo",
      features: [],
    },
  ];

  useEffect(() => {
    const fetchPackages = async () => {
      const { data } = await supabase
        .from("packages")
        .select("*")
        .eq("is_active", true)
        .order("price", { ascending: true });

      if (data && data.length > 0) {
        setPackages(
          data.map((pkg) => ({
            ...pkg,
            features: typeof pkg.features === "string" ? JSON.parse(pkg.features) : pkg.features || [],
          }))
        );

        if (preselectedPackage) {
          const pkg = data.find(
            (p) => p.name.toLowerCase() === preselectedPackage.toLowerCase()
          );
          if (pkg) {
            setFormData((prev) => ({ ...prev, packageId: pkg.id }));
          }
        }
      } else {
        setPackages(defaultPackages);
        if (preselectedPackage) {
          const pkg = defaultPackages.find(
            (p) => p.name.toLowerCase() === preselectedPackage.toLowerCase()
          );
          if (pkg) {
            setFormData((prev) => ({ ...prev, packageId: pkg.id }));
          }
        }
      }
    };

    fetchPackages();
  }, [preselectedPackage]);

  useEffect(() => {
    if (profile) {
      setFormData((prev) => ({
        ...prev,
        fullName: profile.full_name || "",
        email: profile.email || "",
        phone: profile.phone || "",
        whatsapp: profile.phone || "",
        businessName: profile.business_name || "",
      }));
    }
  }, [profile]);

  const projectTypes = [
    { value: "website", label: "Website" },
    { value: "webapp", label: "Web App" },
    { value: "landingpage", label: "Landing Page" },
    { value: "loja", label: "Loja Online" },
    { value: "outro", label: "Outro" },
  ];

  const projectObjectives = [
    { value: "vendas", label: "Vendas" },
    { value: "marca", label: "Apresentação da marca" },
    { value: "agendamento", label: "Agendamento de serviços" },
    { value: "restaurante", label: "Restaurante/menu online" },
    { value: "outro", label: "Outro" },
  ];

  const structureOptions = [
    { value: "inicio", label: "Página inicial" },
    { value: "sobre", label: "Sobre nós" },
    { value: "produtos", label: "Produtos / serviços" },
    { value: "galeria", label: "Galeria" },
    { value: "blog", label: "Blog / Notícias" },
    { value: "cliente", label: "Área de cliente" },
    { value: "contacto", label: "Formulário de contacto" },
    { value: "whatsapp", label: "Botão WhatsApp" },
    { value: "redes", label: "Integração com redes sociais" },
    { value: "outro", label: "Outro" },
  ];

  const toggleStructure = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      structurePages: prev.structurePages.includes(value)
        ? prev.structurePages.filter((v) => v !== value)
        : [...prev.structurePages, value],
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

    if (!formData.packageId) {
      toast({
        title: "Pacote não selecionado",
        description: "Por favor, selecione um pacote.",
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
      const projectTypeValue =
        formData.projectType === "outro"
          ? formData.projectTypeOther
          : formData.projectType;
      const objectiveValue =
        formData.projectObjective === "outro"
          ? formData.projectObjectiveOther
          : formData.projectObjective;
      const structureValue = formData.structurePages.includes("outro")
        ? [...formData.structurePages.filter((s) => s !== "outro"), formData.structureOther].join(", ")
        : formData.structurePages.join(", ");

      const description = `
Tipo de Projeto: ${projectTypeValue}
Objetivo: ${objectiveValue}
Estrutura: ${structureValue}
Tem Logotipo: ${formData.hasLogo === "sim" ? "Sim" : "Não"}
Redes Sociais: ${formData.socialLinks || "Não informado"}
Observações: ${formData.observations || "Nenhuma"}
      `.trim();

      const { data: orderData, error: orderError } = await supabase
        .from("orders")
        .insert([
          {
            user_id: user.id,
            package_id: formData.packageId,
            business_name: formData.businessName,
            business_type: projectTypeValue,
            description: description,
            preferences: `Localização: ${formData.location}\nNUIT: ${formData.nuit || "N/A"}`,
            status: "pendente" as const,
          },
        ])
        .select()
        .single();

      if (orderError) throw orderError;

      const selectedPackage = packages.find((p) => p.id === formData.packageId);
      const totalValue = selectedPackage?.price || 0;

      const { error: contractError } = await supabase.from("contracts").insert([
        {
          order_id: orderData.id,
          user_id: user.id,
          client_name: formData.fullName,
          client_email: formData.email,
          client_phone: formData.whatsapp || formData.phone,
          service_description: `Criação de ${projectTypeValue} - Pacote ${selectedPackage?.name || "N/A"}`,
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

  const displayPackages = packages.length > 0 ? packages : defaultPackages;

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <Breadcrumbs />

        <div className="max-w-4xl mx-auto">
          {/* Form Navigation */}
          <FormNavigation />

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
              Pedido de Criação de Site / Web App
            </h1>
            <p className="text-muted-foreground">
              Preencha todos os campos para que possamos criar o site perfeito para o seu negócio.
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
                  <Label htmlFor="businessName">Nome do negócio *</Label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="businessName"
                      placeholder="Nome da sua empresa"
                      className="pl-10"
                      value={formData.businessName}
                      onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                      required
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
                  <Label htmlFor="location">Localização *</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="location"
                      placeholder="Cidade, Província"
                      className="pl-10"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="nuit">NUIT (opcional)</Label>
                  <Input
                    id="nuit"
                    placeholder="Número de Identificação Tributária"
                    value={formData.nuit}
                    onChange={(e) => setFormData({ ...formData, nuit: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* 2. Tipo de Projeto */}
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Globe className="w-5 h-5 text-primary" />
                2. Tipo de Projeto Desejado *
              </h3>
              <RadioGroup
                value={formData.projectType}
                onValueChange={(value) => setFormData({ ...formData, projectType: value })}
                className="grid md:grid-cols-3 gap-3"
              >
                {projectTypes.map((type) => (
                  <div key={type.value} className="flex items-center space-x-2">
                    <RadioGroupItem value={type.value} id={`type-${type.value}`} />
                    <Label htmlFor={`type-${type.value}`} className="cursor-pointer">
                      {type.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
              {formData.projectType === "outro" && (
                <Input
                  className="mt-3"
                  placeholder="Especifique o tipo de projeto"
                  value={formData.projectTypeOther}
                  onChange={(e) => setFormData({ ...formData, projectTypeOther: e.target.value })}
                />
              )}
            </div>

            {/* 3. Objetivo do Projeto */}
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-primary" />
                3. Objetivo do Projeto *
              </h3>
              <RadioGroup
                value={formData.projectObjective}
                onValueChange={(value) => setFormData({ ...formData, projectObjective: value })}
                className="grid md:grid-cols-3 gap-3"
              >
                {projectObjectives.map((obj) => (
                  <div key={obj.value} className="flex items-center space-x-2">
                    <RadioGroupItem value={obj.value} id={`obj-${obj.value}`} />
                    <Label htmlFor={`obj-${obj.value}`} className="cursor-pointer">
                      {obj.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
              {formData.projectObjective === "outro" && (
                <Input
                  className="mt-3"
                  placeholder="Especifique o objetivo"
                  value={formData.projectObjectiveOther}
                  onChange={(e) => setFormData({ ...formData, projectObjectiveOther: e.target.value })}
                />
              )}
            </div>

            {/* 4. Estrutura Desejada */}
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Layout className="w-5 h-5 text-primary" />
                4. Estrutura Desejada
              </h3>
              <div className="grid md:grid-cols-2 gap-3">
                {structureOptions.map((option) => (
                  <div key={option.value} className="flex items-center space-x-2">
                    <Checkbox
                      id={`structure-${option.value}`}
                      checked={formData.structurePages.includes(option.value)}
                      onCheckedChange={() => toggleStructure(option.value)}
                    />
                    <Label htmlFor={`structure-${option.value}`} className="cursor-pointer">
                      {option.label}
                    </Label>
                  </div>
                ))}
              </div>
              {formData.structurePages.includes("outro") && (
                <Input
                  className="mt-3"
                  placeholder="Especifique outras páginas ou funcionalidades"
                  value={formData.structureOther}
                  onChange={(e) => setFormData({ ...formData, structureOther: e.target.value })}
                />
              )}
            </div>

            {/* 5. Logotipo */}
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Image className="w-5 h-5 text-primary" />
                5. Já tem logotipo? *
              </h3>
              <RadioGroup
                value={formData.hasLogo}
                onValueChange={(value) => setFormData({ ...formData, hasLogo: value })}
                className="flex gap-6"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="sim" id="logo-sim" />
                  <Label htmlFor="logo-sim" className="cursor-pointer">
                    Sim
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="nao" id="logo-nao" />
                  <Label htmlFor="logo-nao" className="cursor-pointer">
                    Não
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* 6. Pacotes */}
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                6. Pacote *
              </h3>
              <RadioGroup
                value={formData.packageId}
                onValueChange={(value) => setFormData({ ...formData, packageId: value })}
                className="grid md:grid-cols-3 gap-4"
              >
                {displayPackages.map((pkg) => (
                  <div
                    key={pkg.id}
                    className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      formData.packageId === pkg.id
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    }`}
                    onClick={() => setFormData({ ...formData, packageId: pkg.id })}
                  >
                    <RadioGroupItem value={pkg.id} id={`pkg-${pkg.id}`} className="sr-only" />
                    <div className="text-center">
                      <h4 className="font-bold text-lg">{pkg.name}</h4>
                      <p className="text-2xl font-bold text-primary mt-2">
                        {pkg.price.toLocaleString()} MT
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">{pkg.description}</p>
                    </div>
                  </div>
                ))}
              </RadioGroup>
            </div>

            {/* 7. Redes Sociais */}
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Share2 className="w-5 h-5 text-primary" />
                7. Redes sociais (links)
              </h3>
              <Textarea
                placeholder="Facebook: https://facebook.com/...&#10;Instagram: https://instagram.com/...&#10;LinkedIn: ..."
                rows={3}
                value={formData.socialLinks}
                onChange={(e) => setFormData({ ...formData, socialLinks: e.target.value })}
              />
            </div>

            {/* 8. Observações */}
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-primary" />
                8. Observações adicionais
              </h3>
              <Textarea
                placeholder="Cores preferidas, sites que admira, requisitos específicos..."
                rows={4}
                value={formData.observations}
                onChange={(e) => setFormData({ ...formData, observations: e.target.value })}
              />
            </div>

            {/* Contract Section */}
            <div className="p-6 rounded-xl bg-warning/10 border border-warning/30">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-warning" />
                Contrato Digital
              </h3>

              <p className="text-sm text-muted-foreground mb-4">
                ⚠️ Após o envio, será gerado um <strong>contrato digital</strong> com os termos do
                serviço, para assinatura e download.
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
                    . Entendo que será gerado um contrato digital vinculativo.
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
