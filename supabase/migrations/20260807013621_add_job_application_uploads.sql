create table if not exists public.job_applications (
  id uuid primary key default gen_random_uuid(), full_name text not null, phone text not null, email text not null,
  desired_role text not null, experience text not null, license_status text not null, availability text not null,
  portfolio_url text, message text not null, status text not null default 'new', source text not null default 'website',
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
alter table public.job_applications add column if not exists resume_path text, add column if not exists resume_filename text,
  add column if not exists resume_mime_type text, add column if not exists resume_size bigint;
alter table public.job_applications enable row level security;
revoke all on table public.job_applications from anon, authenticated;
grant insert, select, update, delete on table public.job_applications to service_role;
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('job-application-files', 'job-application-files', false, 4194304, array['application/pdf','application/msword','application/vnd.openxmlformats-officedocument.wordprocessingml.document'])
on conflict (id) do update set public=excluded.public, file_size_limit=excluded.file_size_limit, allowed_mime_types=excluded.allowed_mime_types;
