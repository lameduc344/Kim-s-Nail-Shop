import type { NailSourceService, NailSourceServicePricing } from "./types";

function object(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function cents(value: unknown): value is number {
  return Number.isInteger(value) && Number(value) >= 0;
}

export function isNailSourceService(value: unknown): value is NailSourceService {
  return object(value) && typeof value.service_ref === "string" && value.service_ref.length > 0 &&
    typeof value.name === "string" && value.name.length > 0 &&
    (value.description === null || typeof value.description === "string") &&
    Number.isInteger(value.duration_minutes) && Number(value.duration_minutes) > 0 &&
    cents(value.price_cents) && typeof value.currency === "string" && value.currency.length === 3;
}

export function isNailSourceServiceList(value: unknown): value is NailSourceService[] {
  return Array.isArray(value) && value.every(isNailSourceService);
}

export function isNailSourceServicePricing(value: unknown): value is NailSourceServicePricing {
  return object(value) && cents(value.price_cents) && typeof value.currency === "string" && value.currency.length === 3;
}
