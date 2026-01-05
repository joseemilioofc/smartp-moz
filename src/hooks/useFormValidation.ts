import { useState } from "react";
import { z } from "zod";

// Schemas de validação
export const pedidoCriacaoSchema = z.object({
  fullName: z.string().trim().min(3, "Nome deve ter pelo menos 3 caracteres").max(100, "Nome muito longo"),
  businessName: z.string().trim().min(2, "Nome do negócio é obrigatório").max(100, "Nome muito longo"),
  email: z.string().trim().email("Email inválido"),
  phone: z.string().trim().min(9, "Telefone deve ter pelo menos 9 dígitos"),
  whatsapp: z.string().trim().min(9, "WhatsApp deve ter pelo menos 9 dígitos"),
  location: z.string().trim().min(3, "Localização é obrigatória"),
  projectType: z.string().min(1, "Selecione o tipo de projeto"),
  projectObjective: z.string().min(1, "Selecione o objetivo do projeto"),
  hasLogo: z.string().min(1, "Indique se tem logotipo"),
  packageId: z.string().min(1, "Selecione um pacote"),
});

export const pedidoGestaoSchema = z.object({
  fullName: z.string().trim().min(3, "Nome deve ter pelo menos 3 caracteres").max(100, "Nome muito longo"),
  siteName: z.string().trim().min(2, "Nome do site/app é obrigatório").max(100, "Nome muito longo"),
  email: z.string().trim().email("Email inválido"),
  phone: z.string().trim().min(9, "Telefone deve ter pelo menos 9 dígitos"),
  whatsapp: z.string().trim().min(9, "WhatsApp deve ter pelo menos 9 dígitos"),
  businessType: z.string().trim().min(2, "Tipo de negócio é obrigatório"),
  managementTypes: z.array(z.string()).min(1, "Selecione pelo menos um tipo de gestão"),
  frequency: z.string().min(1, "Selecione a frequência desejada"),
  planId: z.string().min(1, "Selecione um plano"),
});

export interface ValidationErrors {
  [key: string]: string;
}

export function useFormValidation<T extends z.ZodObject<any>>(schema: T) {
  const [errors, setErrors] = useState<ValidationErrors>({});

  const validate = (data: z.infer<T>): boolean => {
    const result = schema.safeParse(data);
    
    if (!result.success) {
      const newErrors: ValidationErrors = {};
      result.error.errors.forEach((err) => {
        const path = err.path.join(".");
        newErrors[path] = err.message;
      });
      setErrors(newErrors);
      return false;
    }
    
    setErrors({});
    return true;
  };

  const getError = (field: string): string | undefined => errors[field];
  
  const clearError = (field: string) => {
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  };

  const clearAllErrors = () => setErrors({});

  return { errors, validate, getError, clearError, clearAllErrors };
}
