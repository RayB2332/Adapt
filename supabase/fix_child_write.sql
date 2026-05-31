-- Allow children to save progress back to parent's adapt_data
-- Children are not Supabase auth users, so auth.uid() is null for them
-- We allow writes when the parent_id exists in child_accounts

DROP POLICY IF EXISTS "data_insert" ON public.adapt_data;
DROP POLICY IF EXISTS "data_update" ON public.adapt_data;

-- Combined write policy: allows parent (authenticated) OR child (via child_accounts)
CREATE POLICY "data_write" ON public.adapt_data
  FOR ALL
  USING (
    auth.uid() = user_id
    OR
    EXISTS (
      SELECT 1 FROM public.child_accounts
      WHERE child_accounts.parent_id = adapt_data.user_id
    )
  )
  WITH CHECK (
    auth.uid() = user_id
    OR
    EXISTS (
      SELECT 1 FROM public.child_accounts
      WHERE child_accounts.parent_id = adapt_data.user_id
    )
  );
