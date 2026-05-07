-- Execute este SQL no Editor SQL do seu projeto Supabase (Dashboard -> SQL Editor)
-- Para que os objetivos sejam sincronizados entre dispositivos.

-- 1. Criar a tabela de objetivos (goals)
CREATE TABLE IF NOT EXISTS public.goals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  target_amount DECIMAL(15,2) NOT NULL,
  current_amount DECIMAL(15,2) DEFAULT 0 NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 2. Ativar Row Level Security (RLS)
ALTER TABLE public.goals ENABLE ROW LEVEL SECURITY;

-- 3. Criar políticas de acesso
CREATE POLICY "Users can manage their own goals" ON public.goals
  FOR ALL USING (auth.uid() = user_id);

-- 4. Atualizar a função de eliminação de conta para incluir objetivos
CREATE OR REPLACE FUNCTION public.delete_user()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM public.goals WHERE user_id = auth.uid();
  DELETE FROM public.transactions WHERE user_id = auth.uid();
  DELETE FROM public.profiles WHERE id = auth.uid();
  DELETE FROM auth.users WHERE id = auth.uid();
END;
$$;
