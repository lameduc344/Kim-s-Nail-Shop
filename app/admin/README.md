# Studio admin activation

Admin pages require a Supabase Auth user plus a matching active row in `public.salon_staff`. Roles supported by the schema are `owner`, `admin`, `front_desk`, and `technician`. Do not enable public signup for staff access. Create/verify the owner's Auth account, then add its UUID to `salon_staff` with role `owner` before production launch.
