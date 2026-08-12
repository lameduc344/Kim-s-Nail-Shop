import type { NailSourceServiceProjection } from "./types";

export const reconciliationStatuses = [
  "MATCHED", "NAIL SOURCE ONLY", "LEGACY ONLY", "PRICE MISMATCH", "DURATION MISMATCH",
  "NAME MISMATCH", "STATUS MISMATCH", "AMBIGUOUS",
] as const;
export type ReconciliationStatus = (typeof reconciliationStatuses)[number];

export type LegacyService = {
  id: string;
  source: "salon_services" | "data/services.ts";
  name: string;
  category?: string | null;
  description?: string | null;
  duration_minutes: number;
  base_price_cents: number;
  active: boolean;
  service_ref?: string | null;
};

export type ReconciliationRow = {
  key: string;
  authoritative?: NailSourceServiceProjection;
  legacy: LegacyService[];
  statuses: ReconciliationStatus[];
  differences: string[];
};

export type ReconciliationReport = {
  rows: ReconciliationRow[];
  counts: { authoritative: number; legacy: number; matched: number; mismatched: number; legacyOnly: number; nailSourceOnly: number; ambiguous: number };
};

export function normalizedServiceName(value: string): string {
  return value.normalize("NFKD").toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, " ").trim();
}

export function reconcileServices(authoritative: NailSourceServiceProjection[], legacy: LegacyService[]): ReconciliationReport {
  const rows: ReconciliationRow[] = [];
  const used = new Set<number>();
  const refs = new Map<string, number[]>();
  const names = new Map<string, number[]>();
  legacy.forEach((item, index) => {
    if (item.service_ref) refs.set(item.service_ref, [...(refs.get(item.service_ref) ?? []), index]);
    const name = normalizedServiceName(item.name);
    names.set(name, [...(names.get(name) ?? []), index]);
  });

  for (const service of authoritative) {
    const refMatches = (refs.get(service.service_ref) ?? []).filter((index) => !used.has(index));
    const candidates = refMatches.length
      ? refMatches
      : (names.get(normalizedServiceName(service.name)) ?? []).filter((index) => !used.has(index));
    if (candidates.length > 1) {
      candidates.forEach((index) => used.add(index));
      rows.push({ key: service.service_ref, authoritative: service, legacy: candidates.map((index) => legacy[index]), statuses: ["AMBIGUOUS"], differences: ["Multiple legacy records share the same deterministic match key."] });
      continue;
    }
    if (!candidates.length) {
      rows.push({ key: service.service_ref, authoritative: service, legacy: [], statuses: ["NAIL SOURCE ONLY"], differences: ["No deterministic legacy match."] });
      continue;
    }
    const index = candidates[0];
    used.add(index);
    const item = legacy[index];
    const statuses: ReconciliationStatus[] = [];
    const differences: string[] = [];
    if (item.name !== service.name) { statuses.push("NAME MISMATCH"); differences.push(`Name: legacy “${item.name}”; Nail Source “${service.name}”.`); }
    if (item.base_price_cents !== service.effective_price_cents) { statuses.push("PRICE MISMATCH"); differences.push(`Price: legacy ${item.base_price_cents} cents; Nail Source ${service.effective_price_cents} cents.`); }
    if (item.duration_minutes !== service.duration_minutes) { statuses.push("DURATION MISMATCH"); differences.push(`Duration: legacy ${item.duration_minutes} min; Nail Source ${service.duration_minutes} min.`); }
    if (item.active !== service.active) { statuses.push("STATUS MISMATCH"); differences.push(`Status: legacy ${item.active ? "active" : "inactive"}; Nail Source active.`); }
    rows.push({ key: service.service_ref, authoritative: service, legacy: [item], statuses: statuses.length ? statuses : ["MATCHED"], differences });
  }
  legacy.forEach((item, index) => { if (!used.has(index)) rows.push({ key: `legacy:${item.source}:${item.id}`, legacy: [item], statuses: ["LEGACY ONLY"], differences: ["No deterministic Nail Source match."] }); });
  return {
    rows,
    counts: {
      authoritative: authoritative.length,
      legacy: legacy.length,
      matched: rows.filter((row) => row.statuses.length === 1 && row.statuses[0] === "MATCHED").length,
      mismatched: rows.filter((row) => row.statuses.some((status) => status.includes("MISMATCH") || status === "AMBIGUOUS")).length,
      legacyOnly: rows.filter((row) => row.statuses.includes("LEGACY ONLY")).length,
      nailSourceOnly: rows.filter((row) => row.statuses.includes("NAIL SOURCE ONLY")).length,
      ambiguous: rows.filter((row) => row.statuses.includes("AMBIGUOUS")).length,
    },
  };
}
