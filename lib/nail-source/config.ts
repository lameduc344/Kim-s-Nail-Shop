import "server-only";

export type NailSourceConfig = {
  serviceUrl: string;
  assertionPrivateKey: string;
  assertionKeyId: string;
  assertionIssuer: string;
  assertionAudience: string;
  assertionSubject: string;
  businessRef: string;
  locationRef: string;
  timeoutMs: number;
};

export class NailSourceConfigurationError extends Error {
  constructor(public readonly missing: string[]) {
    super(`Missing Nail Source configuration: ${missing.join(", ")}`);
  }
}

export function getNailSourceConfig(): NailSourceConfig {
  const values = {
    functionsUrl: process.env.NAIL_SOURCE_FUNCTIONS_URL?.trim(),
    serviceFunction: process.env.NAIL_SOURCE_SERVICE_FUNCTION?.trim() || "kims-booking-api",
    assertionPrivateKey: process.env.NAIL_SOURCE_ASSERTION_PRIVATE_KEY?.trim().replaceAll("\\n", "\n"),
    assertionKeyId: process.env.NAIL_SOURCE_ASSERTION_KEY_ID?.trim(),
    assertionIssuer: process.env.NAIL_SOURCE_ASSERTION_ISSUER?.trim(),
    assertionAudience: process.env.NAIL_SOURCE_ASSERTION_AUDIENCE?.trim(),
    assertionSubject: process.env.NAIL_SOURCE_ASSERTION_SUBJECT?.trim(),
    businessRef: process.env.NAIL_SOURCE_BUSINESS_REF?.trim(),
    locationRef: process.env.NAIL_SOURCE_LOCATION_REF?.trim(),
  };
  const missing = Object.entries(values).filter(([, value]) => !value).map(([key]) => key);
  if (missing.length) throw new NailSourceConfigurationError(missing);

  let functionsUrl: URL;
  try {
    functionsUrl = new URL(values.functionsUrl!);
  } catch {
    throw new NailSourceConfigurationError(["functionsUrl (valid URL required)"]);
  }
  if (functionsUrl.protocol !== "https:" && functionsUrl.hostname !== "127.0.0.1" && functionsUrl.hostname !== "localhost") {
    throw new NailSourceConfigurationError(["functionsUrl (HTTPS required)"]);
  }

  const configuredTimeout = Number(process.env.NAIL_SOURCE_TIMEOUT_MS ?? "8000");
  const timeoutMs = Number.isFinite(configuredTimeout)
    ? Math.min(15_000, Math.max(1_000, configuredTimeout))
    : 8_000;

  return {
    serviceUrl: `${functionsUrl.toString().replace(/\/$/, "")}/${values.serviceFunction}`,
    assertionPrivateKey: values.assertionPrivateKey!,
    assertionKeyId: values.assertionKeyId!,
    assertionIssuer: values.assertionIssuer!,
    assertionAudience: values.assertionAudience!,
    assertionSubject: values.assertionSubject!,
    businessRef: values.businessRef!,
    locationRef: values.locationRef!,
    timeoutMs,
  };
}
