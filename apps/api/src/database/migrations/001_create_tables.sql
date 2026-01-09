begin;

create extension if not exists pgcrypto;

-- TENANT-SPECIFIC TABLES (with RLS)

create table if not exists public.tenants (
  id uuid primary key default gen_random_uuid(),
  name varchar(255) not null,
  registration_number varchar(100) unique,
  tin varchar(10) unique not null,
  email varchar(255) unique not null,
  subscription_status varchar(50) default 'trial',
  subscription_plan varchar(50) default 'basic',
  stripe_customer_id varchar(255),
  created_at timestamp default now(),
  updated_at timestamp default now()
);

create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  email varchar(255) unique not null,
  password_hash varchar(255) not null,
  full_name varchar(255),
  role varchar(50) default 'viewer',
  is_team_member boolean default true,
  two_fa_enabled boolean default false,
  two_fa_method varchar(20),
  two_fa_secret varchar(255),
  last_login timestamp,
  created_at timestamp default now(),
  updated_at timestamp default now(),
  unique(tenant_id, email)
);

create table if not exists public.clients (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  company_name varchar(255) not null,
  tin varchar(10) not null,
  registration_number varchar(100),
  taxable_period varchar(20) default 'quarterly',
  status varchar(50) default 'active',
  industry varchar(100),
  annual_turnover varchar(100),
  created_at timestamp default now(),
  updated_at timestamp default now(),
  unique(tenant_id, tin)
);

create table if not exists public.branding (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null unique references public.tenants(id) on delete cascade,
  company_name varchar(255),
  company_website varchar(255),
  support_email varchar(255),
  support_phone varchar(20),
  logo_url text,
  favicon_url text,
  colors jsonb default '{"primary": "#0066CC", "secondary": "#00CC66", "accent": "#FF6600", "background": "#FFFFFF", "text_color": "#333333"}',
  footer_text text,
  custom_assets jsonb,
  enabled boolean default true,
  created_at timestamp default now(),
  updated_at timestamp default now()
);

create table if not exists public.uploads (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  client_id uuid references public.clients(id) on delete cascade,
  file_name varchar(255) not null,
  file_url text not null,
  file_size integer,
  file_type varchar(50),
  upload_type varchar(50) default 'csv',
  status varchar(50) default 'uploaded',
  created_at timestamp default now(),
  updated_at timestamp default now()
);

create table if not exists public.mapping_templates (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  name varchar(255) not null,
  system_type varchar(50) not null,
  mapping_config jsonb not null,
  is_default boolean default false,
  created_at timestamp default now(),
  updated_at timestamp default now()
);

create table if not exists public.submissions (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  client_id uuid not null references public.clients(id) on delete cascade,
  period varchar(7) not null,
  stage integer default 1,
  status varchar(50) default 'draft',
  ird_reference varchar(255),
  created_at timestamp default now(),
  updated_at timestamp default now(),
  unique(tenant_id, client_id, period)
);

create table if not exists public.documents (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  client_id uuid references public.clients(id),
  submission_id uuid references public.submissions(id),
  file_name varchar(255) not null,
  file_url text not null,
  document_type varchar(50),
  created_at timestamp default now()
);

create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  entity_type varchar(100) not null,
  entity_id uuid not null,
  action varchar(50) not null,
  user_id uuid references public.users(id),
  changes jsonb,
  ip_address varchar(50),
  timestamp timestamp default now()
);

-- SHARED TABLES (No tenant_id, accessible to all tenants)

create table if not exists public.vat_rules (
  id uuid primary key default gen_random_uuid(),
  rule_name varchar(255) not null,
  rule_type varchar(50) not null,
  rule_value varchar(50),
  description text,
  effective_date date not null,
  end_date date,
  version integer default 1,
  created_at timestamp default now()
);

create table if not exists public.knowledge_base_articles (
  id uuid primary key default gen_random_uuid(),
  title varchar(255) not null,
  content text not null,
  category varchar(100),
  slug varchar(255) unique,
  author varchar(255),
  is_published boolean default false,
  view_count integer default 0,
  created_at timestamp default now(),
  updated_at timestamp default now()
);

commit;
