"use client";

import { useEffect, useState } from "react";
import type { NailSourceCatalogProjection, NailSourceIntegrationProjection } from "@/lib/nail-source/types";

type Health = { tenant: NailSourceIntegrationProjection; catalog: NailSourceCatalogProjection };

export function NailSourceIntegrationStatus() {
  const [health, setHealth] = useState<Health | null>(null);
  useEffect(() => {
    let active = true;
    void fetch("/api/admin/nail-source/health", { cache: "no-store" }).then(async (response) => {
      if (!response.ok) throw new Error("health request failed");
      const data = await response.json() as Health;
      if (active) setHealth(data);
    }).catch(() => {
      if (active) setHealth({
        tenant: { state: "UNREACHABLE", checkedAt: new Date().toISOString(), message: "The Kim’s Nails integration boundary could not be reached." },
        catalog: { state: "UNREACHABLE", servicesState: "UNREACHABLE", pricingState: "UNREACHABLE", checkedAt: new Date().toISOString(), correlationIds: [], services: [], message: "Authoritative services and pricing are unreachable." },
      });
    });
    return () => { active = false; };
  }, []);

  if (!health) return <section className="admin-service-card"><p>Checking Nail Source…</p></section>;
  const rows = [["Tenant", health.tenant.state], ["Services", health.catalog.servicesState], ["Pricing", health.catalog.pricingState]] as const;
  return <section className="admin-service-card" aria-live="polite">
    <div className="admin-service-card-heading"><div><p className="eyebrow">Nail Source USA</p><h2>Live from Nail Source</h2></div></div>
    <div className="admin-board">{rows.map(([label, state]) => <article className="checkin-card" key={label}><p className="eyebrow">{label}</p><h3>{state}</h3></article>)}</div>
    <p>{health.tenant.message}</p><p>{health.catalog.message}</p>
    {health.tenant.business ? <p><strong>Business:</strong> {health.tenant.business.name} · <code>{health.tenant.business.public_ref}</code></p> : null}
    {health.tenant.location ? <p><strong>Location:</strong> {health.tenant.location.name} · {health.tenant.location.city}, {health.tenant.location.region} · <code>{health.tenant.location.location_ref}</code></p> : null}
    {health.tenant.identity ? <p><strong>Identity:</strong> {health.tenant.identity.subject} · {health.tenant.identity.algorithm} · tenant-scoped</p> : null}
    <p className="form-note">Last checked {new Date(health.catalog.checkedAt).toLocaleString()}</p>
    {health.catalog.correlationIds.length ? <p className="form-note">Service correlations: {health.catalog.correlationIds.join(", ")}</p> : null}
  </section>;
}
