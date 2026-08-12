import assert from "node:assert/strict";
import test from "node:test";
import { buildNailSourceCatalogProjection, NailSourceRequestError, type NailSourceCatalogInvoker } from "../../lib/nail-source/catalog";
import type { NailSourceConfig } from "../../lib/nail-source/config";

const config = { businessRef: "kim-nails-stonecrest", locationRef: "kim-nails-stonecrest-mall-pkwy" } as NailSourceConfig;
const success: NailSourceCatalogInvoker = async <T>(body: Record<string, unknown>) => ({ ok: true, correlationId: String(body.operation), data: (body.operation === "listServices" ? [{ service_ref: "gel", name: "Gel Manicure", description: null, duration_minutes: 60, price_cents: 4500, currency: "USD" }] : { price_cents: 4500, currency: "USD" }) as T });

test("successful listing and pricing resolution", async () => {
  const result = await buildNailSourceCatalogProjection(config, success);
  assert.equal(result.state, "CONNECTED"); assert.equal(result.services.length, 1); assert.equal(result.services[0].effective_price_cents, 4500);
});
test("timeout fails closed", async () => {
  const error = new Error("timeout"); error.name = "TimeoutError";
  const result = await buildNailSourceCatalogProjection(config, async () => { throw error; });
  assert.equal(result.state, "UNREACHABLE"); assert.deepEqual(result.services, []);
});
test("malformed service response fails closed", async () => {
  const result = await buildNailSourceCatalogProjection(config, async () => ({ ok: true, correlationId: "bad-shape", data: [{ name: "missing fields" }] } as never));
  assert.equal(result.state, "DEGRADED"); assert.deepEqual(result.services, []);
});
test("unauthorized response fails closed", async () => {
  const result = await buildNailSourceCatalogProjection(config, async () => { throw new NailSourceRequestError(403, "invalid_capability", false, "unauthorized"); });
  assert.equal(result.state, "UNAUTHORIZED"); assert.deepEqual(result.services, []);
});
