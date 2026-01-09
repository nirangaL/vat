begin;

-- VAT rules (shared)
insert into public.vat_rules (rule_name, rule_type, rule_value, description, effective_date, version)
values
  ('Standard VAT Rate', 'rate', '18', 'Standard VAT rate in Sri Lanka', '2022-01-01', 1),
  ('Zero Rated', 'rate', '0', 'Zero-rated VAT transactions', '2022-01-01', 1),
  ('Exempt', 'rate', '0', 'Exempt VAT transactions', '2022-01-01', 1)
on conflict do nothing;

-- Demo tenants + branding + clients (tenant-specific)
-- NOTE: This seed does not create Supabase Auth users; create those via Supabase Auth Admin API.

insert into public.tenants (id, name, registration_number, tin, email, subscription_status, subscription_plan)
values
  ('11111111-1111-1111-1111-111111111111', 'ABC VAT Consultants', 'PV-ABC-001', '123456789V', 'support@abcvat.com', 'trial', 'basic'),
  ('22222222-2222-2222-2222-222222222222', 'XYZ Tax Solutions', 'PV-XYZ-001', '987654321V', 'support@xyztax.com', 'trial', 'basic')
on conflict do nothing;

insert into public.branding (tenant_id, company_name, support_email, enabled)
values
  ('11111111-1111-1111-1111-111111111111', 'ABC VAT Consultants', 'support@abcvat.com', true),
  ('22222222-2222-2222-2222-222222222222', 'XYZ Tax Solutions', 'support@xyztax.com', true)
on conflict do nothing;

insert into public.clients (tenant_id, company_name, tin, registration_number, taxable_period, status)
values
  ('11111111-1111-1111-1111-111111111111', 'ABC Client 01', '100000001V', 'PV-ABC-C01', 'quarterly', 'active'),
  ('11111111-1111-1111-1111-111111111111', 'ABC Client 02', '100000002V', 'PV-ABC-C02', 'quarterly', 'active'),
  ('11111111-1111-1111-1111-111111111111', 'ABC Client 03', '100000003V', 'PV-ABC-C03', 'quarterly', 'active'),
  ('11111111-1111-1111-1111-111111111111', 'ABC Client 04', '100000004V', 'PV-ABC-C04', 'quarterly', 'active'),
  ('11111111-1111-1111-1111-111111111111', 'ABC Client 05', '100000005V', 'PV-ABC-C05', 'quarterly', 'active'),
  ('22222222-2222-2222-2222-222222222222', 'XYZ Client 01', '200000001V', 'PV-XYZ-C01', 'quarterly', 'active'),
  ('22222222-2222-2222-2222-222222222222', 'XYZ Client 02', '200000002V', 'PV-XYZ-C02', 'quarterly', 'active'),
  ('22222222-2222-2222-2222-222222222222', 'XYZ Client 03', '200000003V', 'PV-XYZ-C03', 'quarterly', 'active')
on conflict do nothing;

commit;
