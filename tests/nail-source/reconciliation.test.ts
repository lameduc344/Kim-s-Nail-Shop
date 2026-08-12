import assert from "node:assert/strict";
import test from "node:test";
import { reconcileServices, type LegacyService } from "../../lib/nail-source/reconciliation";
import type { NailSourceServiceProjection } from "../../lib/nail-source/types";

const authoritative = (overrides: Partial<NailSourceServiceProjection> = {}): NailSourceServiceProjection => ({
  service_ref: "gel", name: "Gel Manicure", description: null, duration_minutes: 60,
  price_cents: 4500, currency: "USD", effective_price_cents: 4500, effective_currency: "USD",
  location_ref: "stonecrest", location_name: "Stonecrest", active: true, ...overrides,
});
const legacy = (overrides: Partial<LegacyService> = {}): LegacyService => ({
  id: "one", source: "salon_services", service_ref: "gel", name: "Gel Manicure",
  duration_minutes: 60, base_price_cents: 4500, active: true, ...overrides,
});

test("exact reconciliation match", () => assert.deepEqual(reconcileServices([authoritative()], [legacy()]).rows[0].statuses, ["MATCHED"]));
test("price mismatch", () => assert.deepEqual(reconcileServices([authoritative()], [legacy({ base_price_cents: 4600 })]).rows[0].statuses, ["PRICE_MISMATCH"]));
test("duration mismatch", () => assert.deepEqual(reconcileServices([authoritative()], [legacy({ duration_minutes: 45 })]).rows[0].statuses, ["DURATION_MISMATCH"]));
test("name mismatch through exact ref", () => assert.deepEqual(reconcileServices([authoritative()], [legacy({ name: "Gel Polish" })]).rows[0].statuses, ["NAME_MISMATCH"]));
test("status mismatch", () => assert.deepEqual(reconcileServices([authoritative()], [legacy({ active: false })]).rows[0].statuses, ["STATUS_MISMATCH"]));
test("legacy-only and Nail Source-only", () => {
  const report = reconcileServices([authoritative()], [legacy({ service_ref: null, name: "Classic Manicure" })]);
  assert.equal(report.counts.legacyOnly, 1); assert.equal(report.counts.nailSourceOnly, 1);
});
test("duplicate deterministic candidates are ambiguous", () => {
  const report = reconcileServices([authoritative()], [legacy(), legacy({ id: "two" })]);
  assert.equal(report.counts.ambiguous, 1); assert.deepEqual(report.rows[0].statuses, ["AMBIGUOUS"]);
});
