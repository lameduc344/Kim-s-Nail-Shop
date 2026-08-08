# Studio check-in QR

Print the entrance QR against the permanent production URL `/check-in` (or `/check-in/qr`). The QR must point to the site's stable production domain, never a Vercel preview URL, Supabase URL, or POS vendor URL. The website remains the system-of-record boundary and can later synchronize with a POS provider through `lib/pos/provider.ts`.
