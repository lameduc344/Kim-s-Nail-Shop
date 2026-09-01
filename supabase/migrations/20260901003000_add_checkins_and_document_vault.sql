create table if not exists public.salon_checkins (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null,
  phone text,
  appointment_reference text,
  party_size integer not null default 1 check (party_size between 1 and 12),
  status text not null default 'waiting' check (status in ('waiting','called','seated','completed','cancelled')),
  source text not null default 'qr',
  notes text,
  checked_in_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.salon_checkins enable row level security;
revoke all on table public.salon_checkins from anon, authenticated;
grant insert, select, update, delete on table public.salon_checkins to service_role;

create table if not exists public.document_vault (
  id uuid primary key default gen_random_uuid(),
  category text not null check (category in ('licenses','insurance','leases','staff','vendors','tax','policies','other')),
  title text not null,
  description text,
  file_path text not null unique,
  filename text not null,
  mime_type text not null,
  file_size bigint not null check (file_size > 0 and file_size <= 10485760),
  uploaded_by uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.document_vault enable row level security;
revoke all on table public.document_vault from anon, authenticated;
grant insert, select, update, delete on table public.document_vault to service_role;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'document-vault',
  'document-vault',
  false,
  10485760,
  array[
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'image/jpeg',
    'image/png'
  ]
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;
