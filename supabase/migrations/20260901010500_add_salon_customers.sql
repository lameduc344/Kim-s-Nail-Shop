create table if not exists public.salon_customers (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  phone text,
  phone_normalized text generated always as (regexp_replace(coalesce(phone, ''), '[^0-9]+', '', 'g')) stored,
  email text,
  preferred_technician text,
  notes text,
  tags text[] not null default '{}',
  visit_count integer not null default 0,
  last_visit_at timestamptz,
  source text not null default 'admin',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists salon_customers_phone_unique
  on public.salon_customers (phone_normalized)
  where length(phone_normalized) >= 7;

create index if not exists salon_customers_name_idx on public.salon_customers (lower(full_name));
create index if not exists salon_customers_email_idx on public.salon_customers (lower(email));
create index if not exists salon_customers_phone_idx on public.salon_customers (phone_normalized);

alter table public.salon_customers enable row level security;
revoke all on table public.salon_customers from anon, authenticated;
grant insert, select, update, delete on table public.salon_customers to service_role;
