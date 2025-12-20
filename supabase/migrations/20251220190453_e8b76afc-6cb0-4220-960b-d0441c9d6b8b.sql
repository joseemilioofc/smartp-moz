-- Make order_number and contract_number nullable for auto-generation by triggers
ALTER TABLE public.orders ALTER COLUMN order_number DROP NOT NULL;
ALTER TABLE public.orders ALTER COLUMN order_number SET DEFAULT NULL;

ALTER TABLE public.contracts ALTER COLUMN contract_number DROP NOT NULL;
ALTER TABLE public.contracts ALTER COLUMN contract_number SET DEFAULT NULL;