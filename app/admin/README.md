# Studio admin activation

Admin pages require a Supabase Auth user plus a matching active row in `public.salon_staff`. Roles supported by the schema are `owner`, `admin`, `front_desk`, and `technician`. Do not enable public signup for staff access. Create/verify the owner's Auth account, then add its UUID to `salon_staff` with role `owner` before production launch.

The shared `/admin` layout now restricts the operating console to active `owner` and `admin` rows. This local role check is a transitional Kim's application authorization boundary; Nail Source independently authorizes its own tenant and capabilities.

## Nail Source Phase 1

`/admin/integrations` projects read-only business and location identity from Nail Source through a server-side BFF. Kim's BFF mints a fresh, two-minute ES256 service assertion for every Nail Source operation. Its PKCS8 private key and tenant references are server-only; Nail Source stores only the public JWKS and resolves the assertion subject to an active, business-scoped integration account. The assertion grants only `businesses:read` and exactly one `business_refs` entry. Kim's local Supabase session and legacy service data are never presented to Nail Source and are never used as a fallback for this projection.

The existing `salon_services` data is legacy operational authority pending an explicitly reviewed cutover. Phase 1 does not remove, migrate, redirect, or silently fall back to it.

## Nail Source Phase 2

`/admin/services` reads `listServices` and location-effective `getServicePricing` data using operation-scoped `services:read` assertions, then compares it independently with `public.salon_services` and `data/services.ts`. The page fails closed: if either authoritative operation fails, it renders no local value as an authoritative price. No Nail Source or local service mutation is implemented by this admin slice.
