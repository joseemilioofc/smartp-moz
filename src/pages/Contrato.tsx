import { useEffect, useState, useRef } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import {
  FileText,
  Download,
  ArrowLeft,
  Calendar,
  User,
  Mail,
  Phone,
  Building2,
  CheckCircle,
  Signature,
} from "lucide-react";

interface ContractData {
  id: string;
  contract_number: string;
  client_name: string;
  client_email: string;
  client_phone: string;
  service_description: string;
  total_value: number;
  terms_accepted: boolean;
  digital_signature: string;
  signed_at: string;
  created_at: string;
  order_id: string;
}

export default function Contrato() {
  const [searchParams] = useSearchParams();
  const contractId = searchParams.get("id");
  const orderId = searchParams.get("pedido");
  const { user } = useAuth();
  const [contract, setContract] = useState<ContractData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const contractRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchContract = async () => {
      if (!contractId && !orderId) {
        setError("Contrato não encontrado");
        setIsLoading(false);
        return;
      }

      try {
        let query = supabase.from("contracts").select("*");
        
        if (contractId) {
          query = query.eq("id", contractId);
        } else if (orderId) {
          query = query.eq("order_id", orderId);
        }

        const { data, error: fetchError } = await query.maybeSingle();

        if (fetchError) throw fetchError;

        if (!data) {
          setError("Contrato não encontrado");
        } else {
          setContract(data);
        }
      } catch (err: any) {
        console.error("Error fetching contract:", err);
        setError("Erro ao carregar contrato");
      } finally {
        setIsLoading(false);
      }
    };

    fetchContract();
  }, [contractId, orderId]);

  const handleDownload = () => {
    if (!contractRef.current || !contract) return;

    // Create a printable version
    const printContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Contrato - ${contract.contract_number || 'SmartPresence'}</title>
  <style>
    body { font-family: 'Georgia', serif; padding: 40px; max-width: 800px; margin: 0 auto; line-height: 1.6; }
    h1 { text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; }
    .header { text-align: center; margin-bottom: 40px; }
    .section { margin: 30px 0; }
    .section-title { font-weight: bold; font-size: 1.1em; margin-bottom: 10px; border-bottom: 1px solid #ddd; padding-bottom: 5px; }
    .field { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px dotted #eee; }
    .field-label { color: #666; }
    .signature-box { margin-top: 40px; padding: 20px; border: 2px solid #333; text-align: center; }
    .signature { font-family: 'Brush Script MT', cursive; font-size: 24px; margin: 20px 0; }
    .footer { margin-top: 40px; text-align: center; font-size: 0.9em; color: #666; }
    .terms { font-size: 0.85em; color: #555; margin: 30px 0; padding: 20px; background: #f9f9f9; }
  </style>
</head>
<body>
  <div class="header">
    <h1>CONTRATO DE PRESTAÇÃO DE SERVIÇOS</h1>
    <p><strong>SmartPresence - Soluções Digitais</strong></p>
    <p>Contrato Nº: ${contract.contract_number || 'N/A'}</p>
  </div>

  <div class="section">
    <div class="section-title">DADOS DO CLIENTE</div>
    <div class="field"><span class="field-label">Nome:</span> <span>${contract.client_name}</span></div>
    <div class="field"><span class="field-label">Email:</span> <span>${contract.client_email}</span></div>
    <div class="field"><span class="field-label">Telefone:</span> <span>${contract.client_phone || 'N/A'}</span></div>
  </div>

  <div class="section">
    <div class="section-title">SERVIÇOS CONTRATADOS</div>
    <div class="field"><span class="field-label">Descrição:</span> <span>${contract.service_description}</span></div>
    <div class="field"><span class="field-label">Valor Total:</span> <span><strong>${contract.total_value.toLocaleString()} MT</strong></span></div>
  </div>

  <div class="terms">
    <div class="section-title">TERMOS E CONDIÇÕES</div>
    <p>1. O presente contrato entra em vigor na data de assinatura digital.</p>
    <p>2. O prazo de entrega será acordado entre as partes após confirmação do pagamento.</p>
    <p>3. O pagamento deve ser efectuado conforme as instruções fornecidas.</p>
    <p>4. A SmartPresence compromete-se a entregar os serviços conforme especificado.</p>
    <p>5. Alterações ao escopo do projecto podem resultar em custos adicionais.</p>
    <p>6. Este contrato é regido pelas leis de Moçambique.</p>
  </div>

  <div class="signature-box">
    <p><strong>ASSINATURA DIGITAL</strong></p>
    <p class="signature">${contract.digital_signature}</p>
    <p>Data: ${new Date(contract.signed_at || contract.created_at).toLocaleDateString('pt-MZ', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
    <p>✓ Termos aceites electronicamente</p>
  </div>

  <div class="footer">
    <p>Documento gerado electronicamente por SmartPresence</p>
    <p>${new Date().toLocaleDateString('pt-MZ')} às ${new Date().toLocaleTimeString('pt-MZ')}</p>
  </div>
</body>
</html>
    `;

    const blob = new Blob([printContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `contrato-${contract.contract_number || contract.id}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Carregando contrato...</div>
      </div>
    );
  }

  if (error || !contract) {
    return (
      <div className="min-h-screen py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <FileText className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h1 className="text-2xl font-bold mb-2">{error || "Contrato não encontrado"}</h1>
            <p className="text-muted-foreground mb-6">
              O contrato solicitado não foi encontrado ou não tem permissão para o visualizar.
            </p>
            <Link to="/cliente">
              <Button>
                <ArrowLeft className="mr-2 w-4 h-4" />
                Voltar aos meus pedidos
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

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
            className="text-center mb-8"
          >
            <Badge variant="success" className="mb-4">
              Contrato Assinado
            </Badge>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              Contrato de Prestação de Serviços
            </h1>
            <p className="text-muted-foreground">
              Contrato Nº: {contract.contract_number || "Em processamento"}
            </p>
          </motion.div>

          {/* Download Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-wrap gap-4 justify-center mb-8 print:hidden"
          >
            <Button onClick={handleDownload} variant="hero">
              <Download className="mr-2 w-4 h-4" />
              Baixar Contrato
            </Button>
            <Button onClick={handlePrint} variant="outline">
              <FileText className="mr-2 w-4 h-4" />
              Imprimir
            </Button>
          </motion.div>

          {/* Contract Content */}
          <motion.div
            ref={contractRef}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-card border border-border rounded-2xl shadow-soft overflow-hidden print:shadow-none print:border-none"
          >
            {/* Contract Header */}
            <div className="bg-primary/5 p-6 text-center border-b border-border">
              <h2 className="text-2xl font-bold">SmartPresence</h2>
              <p className="text-sm text-muted-foreground">Soluções Digitais Inteligentes</p>
            </div>

            {/* Contract Body */}
            <div className="p-6 md:p-8 space-y-8">
              {/* Client Info */}
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <User className="w-5 h-5 text-primary" />
                  Dados do Cliente
                </h3>
                <div className="grid md:grid-cols-2 gap-4 p-4 bg-muted/30 rounded-xl">
                  <div className="flex items-center gap-3">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Nome</p>
                      <p className="font-medium">{contract.client_name}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Email</p>
                      <p className="font-medium">{contract.client_email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Telefone</p>
                      <p className="font-medium">{contract.client_phone || "N/A"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Data do Contrato</p>
                      <p className="font-medium">
                        {new Date(contract.created_at).toLocaleDateString("pt-MZ")}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Service Info */}
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-primary" />
                  Serviços Contratados
                </h3>
                <div className="p-4 bg-muted/30 rounded-xl space-y-4">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Descrição do Serviço</p>
                    <p className="font-medium">{contract.service_description}</p>
                  </div>
                  <div className="flex justify-between items-center pt-4 border-t border-border">
                    <span className="font-semibold">Valor Total</span>
                    <span className="text-2xl font-bold text-primary">
                      {contract.total_value.toLocaleString()} MT
                    </span>
                  </div>
                </div>
              </div>

              {/* Terms */}
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" />
                  Termos e Condições
                </h3>
                <div className="p-4 bg-muted/30 rounded-xl text-sm text-muted-foreground space-y-2">
                  <p>1. O presente contrato entra em vigor na data de assinatura digital.</p>
                  <p>2. O prazo de entrega será acordado entre as partes após confirmação do pagamento.</p>
                  <p>3. O pagamento deve ser efectuado conforme as instruções fornecidas.</p>
                  <p>4. A SmartPresence compromete-se a entregar os serviços conforme especificado.</p>
                  <p>5. Alterações ao escopo do projecto podem resultar em custos adicionais.</p>
                  <p>6. Este contrato é regido pelas leis de Moçambique.</p>
                </div>
              </div>

              {/* Digital Signature */}
              <div className="p-6 bg-success/10 border border-success/20 rounded-xl">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Signature className="w-5 h-5 text-success" />
                  Assinatura Digital
                </h3>
                <div className="text-center space-y-4">
                  <div className="py-4">
                    <p className="text-3xl font-serif italic text-foreground">
                      {contract.digital_signature}
                    </p>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-success">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-medium">Termos aceites electronicamente</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Assinado em:{" "}
                    {new Date(contract.signed_at || contract.created_at).toLocaleString("pt-MZ")}
                  </p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-muted/30 p-4 text-center text-sm text-muted-foreground border-t border-border">
              <p>Documento gerado electronicamente por SmartPresence</p>
              <p>Este contrato tem validade legal conforme a legislação moçambicana</p>
            </div>
          </motion.div>

          {/* Back Button */}
          <div className="mt-8 text-center print:hidden">
            <Link to="/cliente">
              <Button variant="outline">
                <ArrowLeft className="mr-2 w-4 h-4" />
                Voltar aos meus pedidos
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
