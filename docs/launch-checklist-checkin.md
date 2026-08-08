# Check-in launch checklist

- Verify owner contact details and operating hours.
- Create the owner's Supabase Auth account and `salon_staff` owner row.
- Test request -> confirm -> QR check-in -> in service -> completed.
- Test no-match -> walk-in flow.
- Test service price/duration/availability edits.
- Print and scan the permanent `/check-in` QR on iPhone and Android.
- Confirm rate limiting and RLS remain enabled.
- Add the POS provider only after the salon identifies the vendor and integration credentials.
