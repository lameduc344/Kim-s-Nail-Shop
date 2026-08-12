import "server-only";

import {
  getNailSourceConfig,
  NailSourceConfigurationError,
  type NailSourceConfig,
} from "@/lib/nail-source/config";
import { createNailSourceAssertion } from "@/lib/nail-source/assertion";
import type {
  NailSourceBusiness,
  NailSourceCatalogProjection,
  NailSourceEnvelope,
  NailSourceIntegrationProjection,
  NailSourceLocation,
  NailSourceReadCapability,
  NailSourceService,
  NailSourceServicePricing,
} from "@/lib/nail-source/types";
import { isNailSourceServiceList, isNailSourceServicePricing } from "@/lib/nail-source/validation";

class NailSourceRequestError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string,
    public readonly retryable: boolean,
    public readonly correlationId?: string,
  ) {
    super(code);
  }
}

async function invoke<T>(
  config: NailSourceConfig,
  body: Record<string, unknown>,
  capability: NailSourceReadCapability,
): Promise<NailSourceEnvelope<T> & { ok: true }> {
  const correlationId = crypto.randomUUID();
  const assertion = createNailSourceAssertion(config, [capability]);
  const response = await fetch(config.serviceUrl, {
    method: "POST",
    headers: {
      authorization: `Bearer ${assertion}`,
      "content-type": "application/json",
      "x-correlation-id": correlationId,
    },
    body: JSON.stringify(body),
    cache: "no-store",
    signal: AbortSignal.timeout(config.timeoutMs),
  });
  const envelope = (await response.json().catch(() => null)) as NailSourceEnvelope<T> | null;
  if (!response.ok || !envelope?.ok) {
    const error = envelope && !envelope.ok ? envelope.error : undefined;
    throw new NailSourceRequestError(
      response.status,
      error?.code ?? "invalid_response",
      error?.retryable ?? response.status >= 500,
      envelope?.correlationId ?? response.headers.get("x-correlation-id") ?? correlationId,
    );
  }
  return envelope;
}

function failureProjection(error: unknown, checkedAt: string): Pick<NailSourceCatalogProjection, "state" | "servicesState" | "pricingState" | "message"> {
  if (error instanceof NailSourceConfigurationError) return { state: "MISCONFIGURED", servicesState: "MISCONFIGURED", pricingState: "MISCONFIGURED", message: "Nail Source service-read configuration is incomplete." };
  if (error instanceof NailSourceRequestError) {
    const state = error.status === 401 || error.status === 403 ? "UNAUTHORIZED" : "DEGRADED";
    return { state, servicesState: state, pricingState: state, message: state === "UNAUTHORIZED" ? "Nail Source rejected the service-read identity or tenant scope." : "Nail Source returned an invalid or degraded service response." };
  }
  const timeout = error instanceof Error && (error.name === "TimeoutError" || error.name === "AbortError");
  const state = timeout || error instanceof TypeError ? "UNREACHABLE" : "DEGRADED";
  return { state, servicesState: state, pricingState: state, message: state === "UNREACHABLE" ? `Nail Source service reads were unreachable at ${checkedAt}.` : "Nail Source service reads failed closed." };
}

export async function getNailSourceCatalogProjection(): Promise<NailSourceCatalogProjection> {
  const checkedAt = new Date().toISOString();
  try {
    const config = getNailSourceConfig();
    const servicesResponse = await invoke<NailSourceService[]>(config, {
      version: "v1", operation: "listServices", businessRef: config.businessRef,
    }, "services:read");
    if (!isNailSourceServiceList(servicesResponse.data)) throw new NailSourceRequestError(502, "malformed_response", false, servicesResponse.correlationId);
    const priced = await Promise.all(servicesResponse.data.map(async (service) => {
      const response = await invoke<NailSourceServicePricing>(config, {
        version: "v1", operation: "getServicePricing", businessRef: config.businessRef,
        locationRef: config.locationRef, serviceRef: service.service_ref,
      }, "services:read");
      if (!isNailSourceServicePricing(response.data)) throw new NailSourceRequestError(502, "malformed_response", false, response.correlationId);
      return { service, pricing: response.data, correlationId: response.correlationId };
    }));
    return {
      state: "CONNECTED", servicesState: "CONNECTED", pricingState: "CONNECTED", checkedAt,
      lastSuccessfulReadAt: checkedAt,
      correlationIds: [servicesResponse.correlationId, ...priced.map((item) => item.correlationId)],
      services: priced.map(({ service, pricing }) => ({
        ...service, effective_price_cents: pricing.price_cents, effective_currency: pricing.currency,
        location_ref: config.locationRef, location_name: "Stonecrest", active: true,
      })),
      message: "Live from Nail Source. Nothing is persisted or synchronized into Kim’s legacy catalog.",
    };
  } catch (error) {
    return { ...failureProjection(error, checkedAt), checkedAt, correlationIds: error instanceof NailSourceRequestError && error.correlationId ? [error.correlationId] : [], services: [] };
  }
}

export async function getNailSourceIntegrationProjection(): Promise<NailSourceIntegrationProjection> {
  const checkedAt = new Date().toISOString();
  try {
    const config = getNailSourceConfig();
    const [businessResponse, locationsResponse] = await Promise.all([
      invoke<NailSourceBusiness>(config, {
        version: "v1",
        operation: "getBusiness",
        businessRef: config.businessRef,
      }, "businesses:read"),
      invoke<NailSourceLocation[]>(config, {
        version: "v1",
        operation: "listLocations",
        businessRef: config.businessRef,
      }, "businesses:read"),
    ]);
    const location = locationsResponse.data.find((item) => item.location_ref === config.locationRef);
    if (businessResponse.data?.public_ref !== config.businessRef || !location) {
      return {
        state: "DEGRADED",
        checkedAt,
        correlationId: locationsResponse.correlationId,
        identity: serviceIdentity(config),
        business: businessResponse.data,
        message: "Nail Source is reachable, but the configured Kim’s Nails tenant projection is incomplete.",
      };
    }
    return {
      state: "CONNECTED",
      checkedAt,
      correlationId: locationsResponse.correlationId,
      service: { name: "nail-source-service-api", version: "v1", status: "ok" },
      identity: serviceIdentity(config),
      business: businessResponse.data,
      location,
      message: "Kim’s Nails is connected to its authoritative Nail Source business and location.",
    };
  } catch (error) {
    if (error instanceof NailSourceConfigurationError) {
      return {
        state: "MISCONFIGURED",
        checkedAt,
        message: "Nail Source tenant credentials and public references have not been provisioned.",
      };
    }
    if (error instanceof NailSourceRequestError) {
      const unauthorized = error.status === 401 || error.status === 403;
      return {
        state: unauthorized ? "UNAUTHORIZED" : "DEGRADED",
        checkedAt,
        correlationId: error.correlationId,
        message: unauthorized
          ? "Nail Source rejected the integration identity or tenant membership."
          : "Nail Source responded, but the read-only integration is degraded.",
      };
    }
    const unreachable = error instanceof TypeError || (error instanceof Error && error.name === "TimeoutError");
    return {
      state: unreachable ? "UNREACHABLE" : "DEGRADED",
      checkedAt,
      message: unreachable
        ? "Nail Source could not be reached before the request deadline."
        : "The Nail Source integration returned an unexpected response.",
    };
  }
}

function serviceIdentity(config: NailSourceConfig) {
  return {
    algorithm: "ES256" as const,
    keyId: config.assertionKeyId,
    subject: config.assertionSubject,
    businessRef: config.businessRef,
    capabilities: ["businesses:read"] as const,
  };
}
