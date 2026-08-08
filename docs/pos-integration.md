# POS integration contract

The POS is an optional downstream integration, not a dependency for customer booking or check-in. When the salon identifies its POS, implement `PosProvider` in `lib/pos/provider.ts`, map website service IDs to POS catalog IDs, store external appointment/payment references in the appointment record, and synchronize idempotently. POS failures should surface to staff as `needs_attention` without blocking the website queue.
