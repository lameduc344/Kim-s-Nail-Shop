import "server-only";

import { createPrivateKey, sign } from "node:crypto";
import type { NailSourceConfig } from "@/lib/nail-source/config";
import type { NailSourceReadCapability } from "@/lib/nail-source/types";

const ASSERTION_LIFETIME_SECONDS = 120;

function base64Url(value: string | Buffer): string {
  return Buffer.from(value).toString("base64url");
}

export function createNailSourceAssertion(
  config: NailSourceConfig,
  capabilities: readonly NailSourceReadCapability[],
  now = Math.floor(Date.now() / 1000),
): string {
  const key = createPrivateKey(config.assertionPrivateKey);
  if (key.asymmetricKeyType !== "ec" || key.asymmetricKeyDetails?.namedCurve !== "prime256v1") {
    throw new Error("Nail Source assertion key must be a P-256 EC private key");
  }

  const header = base64Url(JSON.stringify({ alg: "ES256", kid: config.assertionKeyId, typ: "JWT" }));
  const payload = base64Url(JSON.stringify({
    iss: config.assertionIssuer,
    aud: config.assertionAudience,
    sub: config.assertionSubject,
    jti: crypto.randomUUID(),
    iat: now,
    nbf: now - 2,
    exp: now + ASSERTION_LIFETIME_SECONDS,
    capabilities,
    business_refs: [config.businessRef],
  }));
  const signingInput = `${header}.${payload}`;
  const signature = sign("sha256", Buffer.from(signingInput), {
    key,
    dsaEncoding: "ieee-p1363",
  });
  return `${signingInput}.${base64Url(signature)}`;
}
