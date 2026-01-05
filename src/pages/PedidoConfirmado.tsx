import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { supabase } from "@/integrations/supabase/client";
import { 
  CheckCircle, 
  MessageCircle, 
  CreditCard, 
  Copy, 
  Phone, 
  ArrowRight,
  FileText,
  Home
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface OrderDetails {
  order_number: string;
  business_name: string;
  total_value: number;
  package_name: string;
  plan_name: string | null;
}

export default function PedidoConfirmado() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("pedido");
  const { toast } = useToast();
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Admin WhatsApp number
  const ADMIN_WHATSAPP = "258840000000"; // Replace with actual admin number

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!orderId) {
        setIsLoading(false);
        return;
      }

      try {
        const { data: order, error: orderError } = await supabase
          .from("orders")
          .select(`
            order_number,
            business_name,
            packages(name, price),
            management_plans(name, price_monthly)
          `)
          .eq("id", orderId)
          .single();

        if (orderError) throw orderError;

        const packageData = order.packages as { name: string; price: number } | null;
        const planData = order.management_plans as { name: string; price_monthly: number } | null;

        const totalValue = (packageData?.price || 0) + (planData?.price_monthly || 0);

        setOrderDetails({
          order_number: order.order_number || "N/A",
          business_name: order.business_name,
          total_value: totalValue,
          package_name: packageData?.name || "Não selecionado",
          plan_name: planData?.name || null,
        });
      } catch (error) {
        console.error("Error fetching order:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copiado!",
      description: `${label} copiado para a área de transferência.`,
    });
  };

  const openWhatsApp = () => {
    const message = encodeURIComponent(
      `Olá! Acabei de fazer um pedido na SmartPresence.\n\n` +
      `📋 Número do Pedido: ${orderDetails?.order_number || "N/A"}\n` +
      `🏢 Negócio: ${orderDetails?.business_name || "N/A"}\n` +
      `📦 Pacote: ${orderDetails?.package_name || "N/A"}\n` +
      `💰 Valor: ${orderDetails?.total_value?.toLocaleString() || 0} MT\n\n` +
      `Gostaria de saber os próximos passos.`
    );
    window.open(`https://wa.me/${ADMIN_WHATSAPP}?text=${message}`, "_blank");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <Breadcrumbs />

        <div className="max-w-2xl mx-auto">
          {/* Success Header */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-8"
          >
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-success/20 flex items-center justify-center">
              <CheckCircle className="w-12 h-12 text-success" />
            </div>
            <Badge variant="success" className="mb-4">
              Pedido Confirmado
            </Badge>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              Obrigado pelo seu pedido!
            </h1>
            <p className="text-muted-foreground">
              O seu pedido foi registado com sucesso. Siga os passos abaixo para completar.
            </p>
          </motion.div>

          {/* Order Summary */}
          {orderDetails && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="p-6 rounded-2xl bg-card border border-border shadow-soft mb-6"
            >
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                Resumo do Pedido
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Número do Pedido:</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-semibold">{orderDetails.order_number}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => copyToClipboard(orderDetails.order_number, "Número do pedido")}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Negócio:</span>
                  <span className="font-medium">{orderDetails.business_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Pacote:</span>
                  <span className="font-medium">{orderDetails.package_name}</span>
                </div>
                {orderDetails.plan_name && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Plano Mensal:</span>
                    <span className="font-medium">{orderDetails.plan_name}</span>
                  </div>
                )}
                <div className="border-t border-border pt-3 mt-3">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Total:</span>
                    <span className="text-2xl font-bold text-primary">
                      {orderDetails.total_value.toLocaleString()} MT
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Payment Instructions - Paypay MZ */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="p-6 rounded-2xl bg-warning/10 border border-warning/20 mb-6"
          >
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-warning" />
              Instruções de Pagamento - Paypay
            </h3>
            
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Para confirmar o seu pedido, efectue o pagamento via Paypay para os dados abaixo:
              </p>
              
              <div className="bg-background/50 rounded-xl p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Nome:</span>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">SmartPresence, Lda</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => copyToClipboard("SmartPresence, Lda", "Nome")}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Número Paypay:</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-semibold text-lg">84 000 0000</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => copyToClipboard("840000000", "Número Paypay")}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Valor:</span>
                  <span className="font-bold text-xl text-primary">
                    {orderDetails?.total_value?.toLocaleString() || 0} MT
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Referência:</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono">{orderDetails?.order_number || "N/A"}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => copyToClipboard(orderDetails?.order_number || "", "Referência")}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <div className="bg-muted/50 rounded-lg p-3 text-sm">
                <p className="font-medium mb-1">Como pagar com Paypay:</p>
                <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
                  <li>Abra o app Paypay no seu telemóvel</li>
                  <li>Seleccione "Enviar Dinheiro"</li>
                  <li>Introduza o número acima</li>
                  <li>Coloque o número do pedido na referência</li>
                  <li>Confirme o pagamento</li>
                </ol>
              </div>
            </div>
          </motion.div>

          {/* WhatsApp Contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="p-6 rounded-2xl bg-success/10 border border-success/20 mb-6"
          >
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-success" />
              Fale Connosco no WhatsApp
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Após efectuar o pagamento, envie o comprovativo pelo WhatsApp para confirmarmos o seu pedido rapidamente.
            </p>
            <Button
              variant="hero"
              size="lg"
              className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white"
              onClick={openWhatsApp}
            >
              <Phone className="mr-2" />
              Enviar Mensagem no WhatsApp
              <ArrowRight className="ml-2" />
            </Button>
          </motion.div>

          {/* Next Steps */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="p-6 rounded-xl bg-muted/50 border border-border mb-8"
          >
            <h3 className="font-semibold mb-4">Próximos Passos:</h3>
            <ol className="space-y-3">
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                  1
                </span>
                <span>Efectue o pagamento via Paypay com os dados acima</span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                  2
                </span>
                <span>Envie o comprovativo pelo WhatsApp</span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                  3
                </span>
                <span>Aguarde a nossa confirmação (até 24h úteis)</span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                  4
                </span>
                <span>Receba actualizações sobre o progresso do seu site</span>
              </li>
            </ol>
          </motion.div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to={`/contrato?pedido=${orderId}`} className="flex-1">
              <Button variant="hero" size="lg" className="w-full">
                <FileText className="mr-2" />
                Ver Contrato Digital
              </Button>
            </Link>
            <Link to="/cliente" className="flex-1">
              <Button variant="outline" size="lg" className="w-full">
                Ver Meus Pedidos
              </Button>
            </Link>
            <Link to="/" className="flex-1">
              <Button variant="ghost" size="lg" className="w-full">
                <Home className="mr-2" />
                Voltar ao Início
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
