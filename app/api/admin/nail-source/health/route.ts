import { getAdminAccess } from "@/lib/admin/access";
import { getNailSourceCatalogProjection, getNailSourceIntegrationProjection } from "@/lib/nail-source/client";

export const dynamic = "force-dynamic";

export async function GET() {
  const access = await getAdminAccess();
  if (!access) {
    return Response.json(
      { state: "UNAUTHORIZED", message: "Administrative access required." },
      { status: 403, headers: { "Cache-Control": "no-store" } },
    );
  }
  const [tenant, catalog] = await Promise.all([getNailSourceIntegrationProjection(), getNailSourceCatalogProjection()]);
  return Response.json({ tenant, catalog }, { headers: { "Cache-Control": "no-store" } });
}
