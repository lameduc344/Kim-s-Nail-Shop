import type { NailSourceConfig } from "./config";
import type { NailSourceCatalogProjection, NailSourceEnvelope, NailSourceService, NailSourceServicePricing } from "./types";
import { isNailSourceServiceList, isNailSourceServicePricing } from "./validation";

export class NailSourceRequestError extends Error {
  constructor(public readonly status: number, public readonly code: string, public readonly retryable: boolean, public readonly correlationId?: string) { super(code); }
}

export type NailSourceCatalogInvoker = <T>(body: Record<string, unknown>) => Promise<NailSourceEnvelope<T> & { ok: true }>;

export function catalogFailure(error: unknown, checkedAt: string): Pick<NailSourceCatalogProjection, "state" | "servicesState" | "pricingState" | "message"> {
  if (error instanceof NailSourceRequestError) {
    const state = error.status === 401 || error.status === 403 ? "UNAUTHORIZED" : "DEGRADED";
    return { state, servicesState: state, pricingState: state, message: state === "UNAUTHORIZED" ? "Nail Source rejected the service-read identity or tenant scope." : "Nail Source returned an invalid or degraded service response." };
  }
  const timeout = error instanceof Error && (error.name === "TimeoutError" || error.name === "AbortError");
  const state = timeout || error instanceof TypeError ? "UNREACHABLE" : "DEGRADED";
  return { state, servicesState: state, pricingState: state, message: state === "UNREACHABLE" ? `Nail Source service reads were unreachable at ${checkedAt}.` : "Nail Source service reads failed closed." };
}

export async function buildNailSourceCatalogProjection(config: NailSourceConfig, invoke: NailSourceCatalogInvoker): Promise<NailSourceCatalogProjection> {
  const checkedAt = new Date().toISOString();
  try {
    const listed = await invoke<NailSourceService[]>({ version: "v1", operation: "listServices", businessRef: config.businessRef });
    if (!isNailSourceServiceList(listed.data)) throw new NailSourceRequestError(502, "malformed_response", false, listed.correlationId);
    const priced = await Promise.all(listed.data.map(async (service) => {
      const response = await invoke<NailSourceServicePricing>({ version: "v1", operation: "getServicePricing", businessRef: config.businessRef, locationRef: config.locationRef, serviceRef: service.service_ref });
      if (!isNailSourceServicePricing(response.data)) throw new NailSourceRequestError(502, "malformed_response", false, response.correlationId);
      return { service, pricing: response.data, correlationId: response.correlationId };
    }));
    return { state: "CONNECTED", servicesState: "CONNECTED", pricingState: "CONNECTED", checkedAt, lastSuccessfulReadAt: checkedAt, correlationIds: [listed.correlationId, ...priced.map((item) => item.correlationId)], services: priced.map(({ service, pricing }) => ({ ...service, effective_price_cents: pricing.price_cents, effective_currency: pricing.currency, location_ref: config.locationRef, location_name: "Stonecrest", active: true })), message: "Live from Nail Source. Nothing is persisted or synchronized into Kim’s legacy catalog." };
  } catch (error) {
    return { ...catalogFailure(error, checkedAt), checkedAt, correlationIds: error instanceof NailSourceRequestError && error.correlationId ? [error.correlationId] : [], services: [] };
  }
}
