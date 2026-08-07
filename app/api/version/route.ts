import { getDeploymentVersion } from "@/lib/deployment-version";

export const dynamic = "force-dynamic";

export function GET() {
  return Response.json(
    { version: getDeploymentVersion() },
    {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
        Pragma: "no-cache",
        Expires: "0",
      },
    },
  );
}
