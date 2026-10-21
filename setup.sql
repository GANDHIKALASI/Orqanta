-- ==============================================================================
-- Orqanta — Master Supabase Database Setup & Schema
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- 2. AUTH & RLS HELPER FUNCTIONS
-- Reads app_metadata.org_id from JWT token claims
CREATE OR REPLACE FUNCTION auth_org_id()
RETURNS uuid LANGUAGE sql STABLE AS $$
  SELECT NULLIF(current_setting('request.jwt.claims', true)::jsonb -> 'app_metadata' ->> 'org_id', '')::uuid;
$$;

-- Reads app_metadata.role from JWT token claims (manager, tenant, vendor, owner)
CREATE OR REPLACE FUNCTION auth_role()
RETURNS text LANGUAGE sql STABLE AS $$
  SELECT NULLIF(current_setting('request.jwt.claims', true)::jsonb -> 'app_metadata' ->> 'role', '');
$$;

-- 3. TABLES

-- Organizations (Tenants)
CREATE TABLE IF NOT EXISTS public.organizations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  feature_flags jsonb DEFAULT '{
    "ai_triage": true,
    "ai_vendor_suggestion": true,
    "ai_draft_message": true,
    "ai_monthly_report": true,
    "ai_duplicate_detect": true,
    "sdk_enabled": true,
    "api_enabled": true
  }'::jsonb,
  api_key text UNIQUE,
  created_at timestamptz DEFAULT now()
);

-- Properties
CREATE TABLE IF NOT EXISTS public.properties (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  name text NOT NULL,
  address text NOT NULL,
  owner_name text,
  owner_email text,
  units integer DEFAULT 1,
  created_at timestamptz DEFAULT now()
);

-- User Profiles (Linked to Supabase Auth)
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  org_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  role text NOT NULL CHECK (role IN ('manager', 'tenant', 'vendor', 'owner')),
  property_id uuid REFERENCES public.properties(id) ON DELETE SET NULL,
  unit_number text,
  full_name text NOT NULL,
  phone text,
  email text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Vendors
CREATE TABLE IF NOT EXISTS public.vendors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  name text NOT NULL,
  trade text NOT NULL, -- plumbing | electrical | hvac | appliance | roofing | carpentry | pest_control | general_handyman
  phone text,
  email text NOT NULL,
  rate_notes text,
  insurance_expiry date,
  created_at timestamptz DEFAULT now()
);

-- Work Orders (Core Object)
CREATE TABLE IF NOT EXISTS public.work_orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  property_id uuid NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  unit_number text,
  tenant_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  vendor_id uuid REFERENCES public.vendors(id) ON DELETE SET NULL,
  title text NOT NULL,
  description text NOT NULL,
  priority text NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  status text NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
  photo_keys text[] DEFAULT '{}',
  source text DEFAULT 'portal' CHECK (source IN ('portal', 'sdk', 'api')),
  submitter_email text,
  ai_summary text,
  ai_category text,
  ai_suggested_vendor_id uuid REFERENCES public.vendors(id) ON DELETE SET NULL,
  ai_suggested_reason text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Activity Log
CREATE TABLE IF NOT EXISTS public.activity_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  work_order_id uuid NOT NULL REFERENCES public.work_orders(id) ON DELETE CASCADE,
  actor_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  action text NOT NULL,
  meta jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- Monthly AI Reports
CREATE TABLE IF NOT EXISTS public.reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  month text NOT NULL, -- YYYY-MM
  markdown text NOT NULL,
  metrics jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  UNIQUE(org_id, month)
);

-- 4. TRIGGERS
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS set_work_orders_updated_at ON public.work_orders;
CREATE TRIGGER set_work_orders_updated_at
  BEFORE UPDATE ON public.work_orders
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- 5. PERFORMANCE & SEARCH INDEXES
CREATE INDEX IF NOT EXISTS idx_profiles_org_id ON public.profiles(org_id);
CREATE INDEX IF NOT EXISTS idx_properties_org_id ON public.properties(org_id);
CREATE INDEX IF NOT EXISTS idx_vendors_org_id ON public.vendors(org_id);
CREATE INDEX IF NOT EXISTS idx_work_orders_org_id ON public.work_orders(org_id);
CREATE INDEX IF NOT EXISTS idx_work_orders_property_unit ON public.work_orders(property_id, unit_number);
CREATE INDEX IF NOT EXISTS idx_work_orders_status ON public.work_orders(status);
CREATE INDEX IF NOT EXISTS idx_activity_log_work_order ON public.activity_log(work_order_id);
CREATE INDEX IF NOT EXISTS idx_org_api_key ON public.organizations(api_key);

-- Trigram index for fast fuzzy search & duplicate check without immediate LLM cost
CREATE INDEX IF NOT EXISTS idx_work_orders_title_desc_trgm 
  ON public.work_orders USING gin ((title || ' ' || description) gin_trgm_ops);

-- 6. ROW LEVEL SECURITY (RLS)

ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.work_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

-- Organizations policy (managers can view/update own org)
CREATE POLICY "org_access_policy" ON public.organizations
  FOR ALL TO authenticated
  USING (id = auth_org_id())
  WITH CHECK (id = auth_org_id());

-- Profiles policy
CREATE POLICY "profiles_org_policy" ON public.profiles
  FOR ALL TO authenticated
  USING (org_id = auth_org_id())
  WITH CHECK (org_id = auth_org_id());

-- Properties policy
CREATE POLICY "properties_org_policy" ON public.properties
  FOR ALL TO authenticated
  USING (org_id = auth_org_id())
  WITH CHECK (org_id = auth_org_id());

-- Vendors policy
CREATE POLICY "vendors_org_policy" ON public.vendors
  FOR ALL TO authenticated
  USING (org_id = auth_org_id())
  WITH CHECK (org_id = auth_org_id());

-- Work Orders policies:
-- Managers have full access across the organization
CREATE POLICY "work_orders_manager_policy" ON public.work_orders
  FOR ALL TO authenticated
  USING (
    org_id = auth_org_id() AND
    (auth_role() = 'manager' OR auth_role() IS NULL)
  )
  WITH CHECK (
    org_id = auth_org_id() AND
    (auth_role() = 'manager' OR auth_role() IS NULL)
  );

-- Tenants can view only their own work orders in their organization
CREATE POLICY "work_orders_tenant_select" ON public.work_orders
  FOR SELECT TO authenticated
  USING (
    org_id = auth_org_id() AND
    auth_role() = 'tenant' AND
    tenant_id = auth.uid()
  );

-- Tenants can insert work orders for themselves
CREATE POLICY "work_orders_tenant_insert" ON public.work_orders
  FOR INSERT TO authenticated
  WITH CHECK (
    org_id = auth_org_id() AND
    auth_role() = 'tenant' AND
    tenant_id = auth.uid()
  );

-- Activity Log policy
CREATE POLICY "activity_log_org_policy" ON public.activity_log
  FOR ALL TO authenticated
  USING (org_id = auth_org_id())
  WITH CHECK (org_id = auth_org_id());

-- Reports policy
CREATE POLICY "reports_org_policy" ON public.reports
  FOR ALL TO authenticated
  USING (org_id = auth_org_id())
  WITH CHECK (org_id = auth_org_id());

-- 7. STORAGE BUCKET CONFIGURATION
INSERT INTO storage.buckets (id, name, public)
VALUES ('work-order-photos', 'work-order-photos', false)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS: allow authenticated users to access their own org's folders
CREATE POLICY "storage_org_read" ON storage.objects
  FOR SELECT TO authenticated
  USING (
    bucket_id = 'work-order-photos' AND
    (storage.foldername(name))[1] = auth_org_id()::text
  );

CREATE POLICY "storage_org_insert" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'work-order-photos' AND
    (storage.foldername(name))[1] = auth_org_id()::text
  );

CREATE POLICY "storage_org_delete" ON storage.objects
  FOR DELETE TO authenticated
  USING (
    bucket_id = 'work-order-photos' AND
    (storage.foldername(name))[1] = auth_org_id()::text
  );

-- 8. CUSTOM ACCESS TOKEN HOOK (Supabase Auth Hook)
-- Automatically injects org_id and role into the JWT claims
CREATE OR REPLACE FUNCTION public.custom_access_token_hook(event jsonb)
RETURNS jsonb LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public AS $$
DECLARE
  claims jsonb;
  user_org_id uuid;
  user_role text;
BEGIN
  -- Check user profile for org_id and role
  SELECT org_id, role INTO user_org_id, user_role
  FROM public.profiles
  WHERE id = (event->>'user_id')::uuid;

  claims := event->'claims';

  IF user_org_id IS NOT NULL THEN
    claims := jsonb_set(claims, '{app_metadata,org_id}', to_jsonb(user_org_id::text));
  END IF;

  IF user_role IS NOT NULL THEN
    claims := jsonb_set(claims, '{app_metadata,role}', to_jsonb(user_role));
  END IF;

  event := jsonb_set(event, '{claims}', claims);
  RETURN event;
END;
$$;

-- Grant permissions for Supabase auth admin to execute the hook and read profiles
GRANT USAGE ON SCHEMA public TO supabase_auth_admin;
GRANT EXECUTE ON FUNCTION public.custom_access_token_hook TO supabase_auth_admin;
GRANT SELECT ON TABLE public.profiles TO supabase_auth_admin;
REVOKE EXECUTE ON FUNCTION public.custom_access_token_hook FROM authenticated, anon, public;
