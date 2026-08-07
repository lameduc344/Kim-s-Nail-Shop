alter table public.job_applications
  add column if not exists privacy_policy_version text,
  add column if not exists privacy_acknowledged_at timestamptz;

create table if not exists public.submission_rate_limits (
  endpoint text not null,
  identifier_hash text not null,
  window_start timestamptz not null,
  request_count integer not null default 1 check (request_count > 0),
  updated_at timestamptz not null default now(),
  primary key (endpoint, identifier_hash, window_start)
);

alter table public.submission_rate_limits enable row level security;
revoke all on table public.submission_rate_limits from public, anon, authenticated;
grant select, insert, update, delete on table public.submission_rate_limits to service_role;

create or replace function public.check_submission_rate_limit(
  p_endpoint text,
  p_identifier_hash text,
  p_limit integer,
  p_window_seconds integer
) returns boolean
language plpgsql
security invoker
set search_path = ''
as $$
declare
  bucket_start timestamptz;
  current_count integer;
begin
  if p_limit < 1 or p_window_seconds < 1 then
    raise exception 'Rate-limit configuration must be positive';
  end if;

  bucket_start := to_timestamp(floor(extract(epoch from now()) / p_window_seconds) * p_window_seconds);
  insert into public.submission_rate_limits (endpoint, identifier_hash, window_start)
  values (p_endpoint, p_identifier_hash, bucket_start)
  on conflict (endpoint, identifier_hash, window_start)
  do update set request_count = public.submission_rate_limits.request_count + 1, updated_at = now()
  returning request_count into current_count;

  delete from public.submission_rate_limits where window_start < now() - interval '2 days';
  return current_count <= p_limit;
end;
$$;

revoke all on function public.check_submission_rate_limit(text, text, integer, integer) from public, anon, authenticated;
grant execute on function public.check_submission_rate_limit(text, text, integer, integer) to service_role;
