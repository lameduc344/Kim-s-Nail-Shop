# Security controls

Customer appointment tables have RLS enabled. Public clients receive no direct appointment-table policy. Security-definer booking/check-in functions are restricted to the service role and are reached through server API routes with input limits and IP-HMAC rate limiting. Staff mutation APIs verify both the Supabase Auth session and an active `salon_staff` record. The security advisor was rerun after privilege hardening; only pre-existing informational notices for job applications and submission rate limits remained.
