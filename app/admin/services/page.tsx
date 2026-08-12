import type { Metadata } from "next";
import { services as staticServices } from "@/data/services";
import { requirePermission } from "@/lib/admin/access";
import { getNailSourceCatalogProjection } from "@/lib/nail-source/client";
import { reconcileServices, type LegacyService, type ReconciliationReport } from "@/lib/nail-source/reconciliation";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Services & Pricing | Kim's Nails", robots: { index: false, follow: false, nocache: true } };

function cents(value: string): number {
  const amount = Number(value.replace(/[^0-9.]/g, ""));
  return Number.isFinite(amount) ? Math.round(amount * 100) : 0;
}

function minutes(value: string): number {
  return Number.parseInt(value, 10) || 0;
}

function money(value: number, currency = "USD") {
  return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(value / 100);
}

function Summary({ reports, authoritativeCount }: { reports: ReconciliationReport[]; authoritativeCount: number }) {
  const total = (key: keyof ReconciliationReport["counts"]) => reports.reduce((sum, report) => sum + report.counts[key], 0);
  const values = [
    ["Authoritative", authoritativeCount], ["Legacy", total("legacy")], ["Matched", total("matched")],
    ["Mismatches", total("mismatched")], ["Legacy-only", total("legacyOnly")],
    ["Nail Source-only", total("nailSourceOnly")], ["Ambiguous", total("ambiguous")],
  ];
  return <div className="admin-board">{values.map(([label, value]) => <article className="checkin-card" key={label}><p className="eyebrow">{label}</p><h2>{value}</h2></article>)}</div>;
}

export default async function ServicesAdminPage() {
  const access = await requirePermission("services:view");
  const db = createAdminClient();
  const [{ data: rows, error }, catalog] = await Promise.all([
    db.from("salon_services").select("id,category,name,description,base_price_cents,duration_minutes,active").order("sort_order"),
    getNailSourceCatalogProjection(),
  ]);
  const databaseLegacy: LegacyService[] = (rows ?? []).map((item) => ({ ...item, source: "salon_services" as const }));
  const staticLegacy: LegacyService[] = staticServices.flatMap((category) => category.items.map((item, index) => ({
    id: `${category.category}:${index}`, source: "data/services.ts" as const, category: category.category,
    name: item.name, description: item.description, duration_minutes: minutes(item.duration),
    base_price_cents: cents(item.price), active: true,
  })));
  const reports = catalog.state === "CONNECTED"
    ? [reconcileServices(catalog.services, databaseLegacy), reconcileServices(catalog.services, staticLegacy)]
    : [];

  return <main className="shell admin-services-page">
    <div className="section-heading">
      <p className="eyebrow">Studio operations · {access.role}</p>
      <h1>Services &amp; Pricing</h1>
      <p>Nail Source is the operational source of truth. Editing will be enabled after authoritative catalog reconciliation.</p>
    </div>

    <section className="admin-service-card" aria-live="polite">
      <div className="admin-service-card-heading"><div><p className="eyebrow">Nail Source — Authoritative</p><h2>{catalog.state}</h2></div><span className={catalog.state === "CONNECTED" ? "active" : "hidden"}>{catalog.state}</span></div>
      <p>{catalog.message}</p>
      {catalog.state !== "CONNECTED" ? <p><strong>Authoritative prices are unavailable.</strong> No local price has been substituted.</p> : null}
      <p className="form-note">Stonecrest · {catalog.checkedAt} · Live from Nail Source</p>
    </section>

    {catalog.state === "CONNECTED" ? <>
      <Summary reports={reports} authoritativeCount={catalog.services.length} />
      <div className="admin-board">{catalog.services.map((service) => <article className="checkin-card" key={service.service_ref}>
        <p className="eyebrow">Nail Source — Authoritative</p><h2>{service.name}</h2>
        {service.description ? <p>{service.description}</p> : null}
        <p><strong>{money(service.effective_price_cents, service.effective_currency)}</strong> · {service.duration_minutes} min</p>
        <p>Ref: <code>{service.service_ref}</code></p><p>Location: Stonecrest · <code>{service.location_ref}</code></p>
      </article>)}</div>
      {reports.map((report, reportIndex) => <section className="admin-service-card" key={reportIndex}>
        <p className="eyebrow">Legacy comparison</p><h2>{reportIndex === 0 ? "public.salon_services" : "data/services.ts"}</h2>
        <div className="admin-board">{report.rows.map((row) => <article className="checkin-card" key={row.key}>
          <p className="eyebrow">{row.statuses.join(" · ")}</p>
          {row.legacy.map((legacy) => <div key={`${legacy.source}:${legacy.id}`}><h3>Legacy: {legacy.name}</h3><p>{money(legacy.base_price_cents)} · {legacy.duration_minutes} min · {legacy.active ? "Active" : "Inactive"}</p></div>)}
          {row.authoritative ? <div><h3>Nail Source: {row.authoritative.name}</h3><p>{money(row.authoritative.effective_price_cents, row.authoritative.effective_currency)} · {row.authoritative.duration_minutes} min</p></div> : null}
          {row.differences.map((difference) => <p key={difference}>{difference}</p>)}
        </article>)}</div>
      </section>)}
    </> : <section className="admin-service-card"><p className="eyebrow">Legacy comparison</p><h2>Comparison unavailable</h2><p>Legacy records remain labeled as legacy and cannot be presented as authoritative while Nail Source is unavailable.</p></section>}

    {error ? <p>Legacy database comparison is unavailable: {error.message}</p> : null}
    <p className="form-note">Legacy records are comparison-only here. No service or price write path is enabled.</p>
  </main>;
}
