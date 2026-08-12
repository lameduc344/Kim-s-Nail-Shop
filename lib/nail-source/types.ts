export const nailSourceIntegrationStates = [
  "CONNECTED",
  "DEGRADED",
  "MISCONFIGURED",
  "UNAUTHORIZED",
  "UNREACHABLE",
] as const;

export type NailSourceIntegrationState = (typeof nailSourceIntegrationStates)[number];
export type NailSourceReadCapability = "businesses:read" | "services:read";

export type NailSourceBusiness = {
  booking_ref: string;
  name: string;
  public_ref: string;
  timezone: string;
};

export type NailSourceLocation = {
  location_ref: string;
  name: string;
  timezone: string;
  city: string;
  region: string;
  country_code: string;
};

export type NailSourceService = {
  service_ref: string;
  name: string;
  description: string | null;
  duration_minutes: number;
  price_cents: number;
  currency: string;
};

export type NailSourceServicePricing = {
  price_cents: number;
  currency: string;
};

export type NailSourceServiceProjection = NailSourceService & {
  effective_price_cents: number;
  effective_currency: string;
  location_ref: string;
  location_name: string;
  active: true;
};

export type NailSourceCatalogProjection = {
  state: NailSourceIntegrationState;
  checkedAt: string;
  lastSuccessfulReadAt?: string;
  correlationIds: string[];
  services: NailSourceServiceProjection[];
  servicesState: NailSourceIntegrationState;
  pricingState: NailSourceIntegrationState;
  message: string;
};

export type NailSourceEnvelope<T> =
  | { ok: true; data: T; correlationId: string }
  | {
      ok: false;
      error: { code: string; message: string; retryable: boolean };
      correlationId: string;
    };

export type NailSourceIntegrationProjection = {
  state: NailSourceIntegrationState;
  checkedAt: string;
  correlationId?: string;
  service?: { name: string; version: string; status: string };
  identity?: {
    algorithm: "ES256";
    keyId: string;
    subject: string;
    businessRef: string;
    capabilities: readonly NailSourceReadCapability[];
  };
  business?: NailSourceBusiness;
  location?: NailSourceLocation;
  message: string;
};
