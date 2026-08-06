create table public.vip_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  marketing_consent boolean not null default false,
  source text not null default 'website',
  subscribed_at timestamptz not null default now(),
  unsubscribed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint vip_subscribers_email_format check (email ~* '^[^\s@]+@[^\s@]+\.[^\s@]+$')
);

create table public.promotions (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  code text,
  terms text,
  starts_on date not null,
  ends_on date not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint promotions_date_range check (ends_on >= starts_on)
);

create index promotions_active_window on public.promotions (starts_on, ends_on);

alter table public.vip_subscribers enable row level security;
alter table public.promotions enable row level security;

revoke all on table public.vip_subscribers from anon, authenticated;
revoke all on table public.promotions from anon, authenticated;
