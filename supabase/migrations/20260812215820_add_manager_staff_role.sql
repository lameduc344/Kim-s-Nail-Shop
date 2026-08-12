create table if not exists public.salon_staff (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  role text not null,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.salon_staff
  drop constraint if exists salon_staff_role_check;

alter table public.salon_staff
  add constraint salon_staff_role_check
  check (role in ('owner', 'admin', 'manager', 'front_desk', 'technician'));

alter table public.salon_staff enable row level security;
revoke all on table public.salon_staff from anon, authenticated;
grant select, insert, update, delete on table public.salon_staff to service_role;
