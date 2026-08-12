import { loadEnvConfig } from "@next/env";
import { createClient } from "@supabase/supabase-js";
import { services } from "../data/services";
import { getNailSourceCatalogProjection } from "../lib/nail-source/client";
import { reconcileServices, type LegacyService } from "../lib/nail-source/reconciliation";

loadEnvConfig(process.cwd());

async function main() {
  const catalog = await getNailSourceCatalogProjection();
  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!supabaseUrl || !supabaseKey) throw new Error("Missing read-only Supabase configuration.");
  const { data, error } = await createClient(supabaseUrl, supabaseKey, { auth: { persistSession: false } }).from("salon_services")
    .select("id,category,name,description,base_price_cents,duration_minutes,active").order("sort_order");
  const legacyDatabaseError = error?.message;
  const databaseLegacy = (data ?? []).map((item) => ({ ...item, source: "salon_services" as const }));
  const staticLegacy: LegacyService[] = services.flatMap((category) => category.items.map((item, index) => ({
    id: `${category.category}:${index}`, source: "data/services.ts", category: category.category, name: item.name,
    description: item.description, duration_minutes: Number.parseInt(item.duration, 10),
    base_price_cents: Math.round(Number(item.price.replace(/[^0-9.]/g, "")) * 100), active: true,
  })));
  const reports = catalog.state === "CONNECTED"
    ? [...(error ? [] : [reconcileServices(catalog.services, databaseLegacy)]), reconcileServices(catalog.services, staticLegacy)]
    : [];
  console.log(JSON.stringify({
    catalog: { state: catalog.state, servicesState: catalog.servicesState, pricingState: catalog.pricingState, message: catalog.message,
      services: catalog.services.map((service) => ({ ref: service.service_ref, name: service.name, duration: service.duration_minutes, price: service.effective_price_cents, currency: service.effective_currency, location: service.location_ref })) },
    legacyDatabaseCount: error ? null : databaseLegacy.length, legacyDatabaseError, staticCount: staticLegacy.length,
    reports: reports.map((report) => ({ counts: report.counts, findings: report.rows.filter((row) => !row.statuses.includes("MATCHED")).map((row) => ({ authoritative: row.authoritative?.name, legacy: row.legacy.map((item) => item.name), statuses: row.statuses, differences: row.differences })) })),
  }, null, 2));
}

void main().catch((error) => {
  console.error(JSON.stringify({ message: "Read-only verification failed", error }, null, 2));
  process.exitCode = 1;
});
