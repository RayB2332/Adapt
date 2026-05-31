-- Fix child login: allow reading parent's adapt_data via child_accounts lookup
-- Drop the old restrictive policy and add a new one that also allows child access

DROP POLICY IF EXISTS "data_select" ON public.adapt_data;

CREATE POLICY "data_select" ON public.adapt_data
  FOR SELECT USING (
    -- Parent can read their own data
    auth.uid() = user_id
    OR
    -- Child can read parent's data (child authenticated via child_accounts table)
    EXISTS (
      SELECT 1 FROM public.child_accounts
      WHERE child_accounts.parent_id = adapt_data.user_id
    )
  );
