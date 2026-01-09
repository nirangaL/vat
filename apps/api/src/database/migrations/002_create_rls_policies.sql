begin;

-- Helper: extract current tenant_id from Supabase JWT (stored in app_metadata)
create or replace function public.current_tenant_id()
returns uuid
language sql
stable
as $$
  select nullif(auth.jwt() -> 'app_metadata' ->> 'tenant_id', '')::uuid;
$$;

-- Enable RLS on tenant-specific tables
alter table public.tenants enable row level security;
alter table public.users enable row level security;
alter table public.clients enable row level security;
alter table public.branding enable row level security;
alter table public.uploads enable row level security;
alter table public.mapping_templates enable row level security;
alter table public.submissions enable row level security;
alter table public.documents enable row level security;
alter table public.audit_logs enable row level security;

-- Disable RLS on shared tables
alter table public.vat_rules disable row level security;
alter table public.knowledge_base_articles disable row level security;

-- TENANTS
create policy "Tenants: select own tenant"
  on public.tenants
  for select
  using (id = public.current_tenant_id());

create policy "Tenants: update own tenant"
  on public.tenants
  for update
  using (id = public.current_tenant_id());

-- USERS
create policy "Users: select within tenant"
  on public.users
  for select
  using (tenant_id = public.current_tenant_id());

create policy "Users: insert within tenant"
  on public.users
  for insert
  with check (tenant_id = public.current_tenant_id());

create policy "Users: update within tenant"
  on public.users
  for update
  using (tenant_id = public.current_tenant_id())
  with check (tenant_id = public.current_tenant_id());

-- CLIENTS
create policy "Clients: select within tenant"
  on public.clients
  for select
  using (tenant_id = public.current_tenant_id());

create policy "Clients: insert within tenant"
  on public.clients
  for insert
  with check (tenant_id = public.current_tenant_id());

create policy "Clients: update within tenant"
  on public.clients
  for update
  using (tenant_id = public.current_tenant_id())
  with check (tenant_id = public.current_tenant_id());

create policy "Clients: delete within tenant"
  on public.clients
  for delete
  using (tenant_id = public.current_tenant_id());

-- BRANDING
create policy "Branding: select own"
  on public.branding
  for select
  using (tenant_id = public.current_tenant_id());

create policy "Branding: update own"
  on public.branding
  for update
  using (tenant_id = public.current_tenant_id())
  with check (tenant_id = public.current_tenant_id());

create policy "Branding: insert own"
  on public.branding
  for insert
  with check (tenant_id = public.current_tenant_id());

-- UPLOADS
create policy "Uploads: select within tenant"
  on public.uploads
  for select
  using (tenant_id = public.current_tenant_id());

create policy "Uploads: insert within tenant"
  on public.uploads
  for insert
  with check (tenant_id = public.current_tenant_id());

create policy "Uploads: update within tenant"
  on public.uploads
  for update
  using (tenant_id = public.current_tenant_id())
  with check (tenant_id = public.current_tenant_id());

create policy "Uploads: delete within tenant"
  on public.uploads
  for delete
  using (tenant_id = public.current_tenant_id());

-- MAPPING TEMPLATES
create policy "Mapping templates: select within tenant"
  on public.mapping_templates
  for select
  using (tenant_id = public.current_tenant_id());

create policy "Mapping templates: insert within tenant"
  on public.mapping_templates
  for insert
  with check (tenant_id = public.current_tenant_id());

create policy "Mapping templates: update within tenant"
  on public.mapping_templates
  for update
  using (tenant_id = public.current_tenant_id())
  with check (tenant_id = public.current_tenant_id());

create policy "Mapping templates: delete within tenant"
  on public.mapping_templates
  for delete
  using (tenant_id = public.current_tenant_id());

-- SUBMISSIONS
create policy "Submissions: select within tenant"
  on public.submissions
  for select
  using (tenant_id = public.current_tenant_id());

create policy "Submissions: insert within tenant"
  on public.submissions
  for insert
  with check (tenant_id = public.current_tenant_id());

create policy "Submissions: update within tenant"
  on public.submissions
  for update
  using (tenant_id = public.current_tenant_id())
  with check (tenant_id = public.current_tenant_id());

create policy "Submissions: delete within tenant"
  on public.submissions
  for delete
  using (tenant_id = public.current_tenant_id());

-- DOCUMENTS
create policy "Documents: select within tenant"
  on public.documents
  for select
  using (tenant_id = public.current_tenant_id());

create policy "Documents: insert within tenant"
  on public.documents
  for insert
  with check (tenant_id = public.current_tenant_id());

create policy "Documents: delete within tenant"
  on public.documents
  for delete
  using (tenant_id = public.current_tenant_id());

-- AUDIT LOGS
create policy "Audit logs: select within tenant"
  on public.audit_logs
  for select
  using (tenant_id = public.current_tenant_id());

create policy "Audit logs: insert within tenant"
  on public.audit_logs
  for insert
  with check (tenant_id = public.current_tenant_id());

commit;
