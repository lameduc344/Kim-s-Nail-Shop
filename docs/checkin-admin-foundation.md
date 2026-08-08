# Booking, check-in, and studio operations

The website is the system of record. Public appointment requests flow through `/api/appointments`; the permanent entrance QR lands on `/check-in`; lookup/check-in/walk-in actions flow through the rate-limited `/api/check-in` route. Direct public database access is denied by RLS and function grants.

The Today Board at `/admin` supports appointment lifecycle states: requested, confirmed, checked in, in service, completed, cancelled, no show, and needs attention. Payment state is stored separately. Service catalog changes are available at `/admin/service-editor`.

`lib/pos/provider.ts` is the integration seam for a future local POS. Until a provider is known, `NoopPosProvider` means booking and check-in continue to work without POS availability.

Before production activation, create the owner's Supabase Auth account and insert its user UUID into `salon_staff` with the `owner` role. Confirm salon contact information and real operating/availability rules before treating appointment requests as automatically confirmed.
