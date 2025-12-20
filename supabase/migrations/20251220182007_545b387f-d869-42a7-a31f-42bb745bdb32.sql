-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('cliente', 'admin');

-- Create enum for order status
CREATE TYPE public.order_status AS ENUM ('pendente', 'em_andamento', 'demo', 'avaliacao', 'concluido', 'cancelado');

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  business_name TEXT,
  business_type TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_roles table (separate from profiles for security)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL DEFAULT 'cliente',
  is_supreme_admin BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);

-- Create packages table
CREATE TABLE public.packages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  description TEXT,
  features JSONB NOT NULL DEFAULT '[]',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create management_plans table
CREATE TABLE public.management_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  price_monthly DECIMAL(10,2) NOT NULL,
  description TEXT,
  features JSONB NOT NULL DEFAULT '[]',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create orders table
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT NOT NULL UNIQUE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  package_id UUID REFERENCES public.packages(id),
  plan_id UUID REFERENCES public.management_plans(id),
  status order_status NOT NULL DEFAULT 'pendente',
  business_name TEXT NOT NULL,
  business_type TEXT,
  description TEXT,
  preferences TEXT,
  demo_url TEXT,
  final_url TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create contracts table
CREATE TABLE public.contracts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  contract_number TEXT NOT NULL UNIQUE,
  client_name TEXT NOT NULL,
  client_email TEXT NOT NULL,
  client_phone TEXT,
  service_description TEXT NOT NULL,
  total_value DECIMAL(10,2) NOT NULL,
  terms_accepted BOOLEAN NOT NULL DEFAULT false,
  digital_signature TEXT,
  signed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create navigation_logs table for tracking
CREATE TABLE public.navigation_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  page_path TEXT NOT NULL,
  page_title TEXT,
  referrer TEXT,
  user_agent TEXT,
  ip_address TEXT,
  session_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.management_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.navigation_logs ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Create function to check if user is supreme admin
CREATE OR REPLACE FUNCTION public.is_supreme_admin(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND is_supreme_admin = true
  )
$$;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

-- User roles policies
CREATE POLICY "Users can view own role" ON public.user_roles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles" ON public.user_roles
  FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Supreme admin can manage roles" ON public.user_roles
  FOR ALL USING (public.is_supreme_admin(auth.uid()));

-- Packages policies (public read)
CREATE POLICY "Anyone can view packages" ON public.packages
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage packages" ON public.packages
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Management plans policies (public read)
CREATE POLICY "Anyone can view plans" ON public.management_plans
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage plans" ON public.management_plans
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Orders policies
CREATE POLICY "Users can view own orders" ON public.orders
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create orders" ON public.orders
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own orders" ON public.orders
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all orders" ON public.orders
  FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update all orders" ON public.orders
  FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));

-- Contracts policies
CREATE POLICY "Users can view own contracts" ON public.contracts
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create contracts" ON public.contracts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all contracts" ON public.contracts
  FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

-- Navigation logs policies
CREATE POLICY "Admins can view all logs" ON public.navigation_logs
  FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Anyone can insert logs" ON public.navigation_logs
  FOR INSERT WITH CHECK (true);

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  is_first_admin BOOLEAN;
  user_role app_role;
BEGIN
  -- Get the role from metadata
  user_role := COALESCE(
    (NEW.raw_user_meta_data ->> 'role')::app_role,
    'cliente'
  );

  -- Create profile
  INSERT INTO public.profiles (user_id, full_name, email, phone, business_name, business_type)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', ''),
    NEW.email,
    NEW.raw_user_meta_data ->> 'phone',
    NEW.raw_user_meta_data ->> 'business_name',
    NEW.raw_user_meta_data ->> 'business_type'
  );

  -- Check if this is the first admin
  IF user_role = 'admin' THEN
    SELECT NOT EXISTS (
      SELECT 1 FROM public.user_roles WHERE role = 'admin'
    ) INTO is_first_admin;
  ELSE
    is_first_admin := false;
  END IF;

  -- Create role
  INSERT INTO public.user_roles (user_id, role, is_supreme_admin)
  VALUES (NEW.id, user_role, is_first_admin);

  RETURN NEW;
END;
$$;

-- Create trigger for new user
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to generate order number
CREATE OR REPLACE FUNCTION public.generate_order_number()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.order_number := 'PED-' || LPAD(NEXTVAL('order_number_seq')::TEXT, 5, '0');
  RETURN NEW;
END;
$$;

-- Create sequence for order numbers
CREATE SEQUENCE IF NOT EXISTS order_number_seq START WITH 1;

-- Create trigger for order number
CREATE TRIGGER set_order_number
  BEFORE INSERT ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.generate_order_number();

-- Create function to generate contract number
CREATE OR REPLACE FUNCTION public.generate_contract_number()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.contract_number := 'CTR-' || TO_CHAR(NOW(), 'YYYYMM') || '-' || LPAD(NEXTVAL('contract_number_seq')::TEXT, 4, '0');
  RETURN NEW;
END;
$$;

-- Create sequence for contract numbers
CREATE SEQUENCE IF NOT EXISTS contract_number_seq START WITH 1;

-- Create trigger for contract number
CREATE TRIGGER set_contract_number
  BEFORE INSERT ON public.contracts
  FOR EACH ROW EXECUTE FUNCTION public.generate_contract_number();

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default packages
INSERT INTO public.packages (name, price, description, features) VALUES
('Básico', 3500.00, 'Ideal para quem está a começar', '["1 página com logotipo e foto de capa", "Texto introdutório sobre o negócio", "Botão flutuante de WhatsApp", "Layout responsivo", "Domínio .co.mz por 1 ano"]'),
('Padrão', 6000.00, 'Para negócios em crescimento', '["Até 3 páginas (início, serviços, contactos)", "Galeria de imagens", "Formulário de contacto funcional", "Integração WhatsApp", "Localização no Google Maps", "Design responsivo", "Certificado SSL"]'),
('Premium', 10000.00, 'Solução completa para empresas', '["Até 5 páginas personalizadas", "Chat via WhatsApp", "Página de agendamento (opcional)", "Integração Google Analytics", "Design personalizado exclusivo", "Domínio .co.mz por 2 anos", "Certificado SSL", "Suporte prioritário"]');

-- Insert default management plans
INSERT INTO public.management_plans (name, price_monthly, description, features) VALUES
('Essencial', 800.00, 'Manutenção básica para sites simples', '["Actualizações técnicas básicas", "1 alteração por mês", "Backup semanal", "Suporte por email", "Tempo de resposta: 72h"]'),
('Profissional', 1500.00, 'Gestão completa para negócios activos', '["Tudo do plano Essencial", "2 alterações de conteúdo por mês", "Backup diário", "Suporte prioritário WhatsApp", "Tempo de resposta: 24h", "Relatórios mensais"]'),
('Total', 2500.00, 'Solução completa com suporte ilimitado', '["Tudo do plano Profissional", "Alterações ilimitadas", "Backup em tempo real", "Suporte WhatsApp 24/7", "Tempo de resposta: 4h", "Gestão de redes sociais", "Consultor dedicado"]');