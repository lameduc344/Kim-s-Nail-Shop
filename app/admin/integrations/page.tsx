import type { Metadata } from "next";
import { NailSourceIntegrationStatus } from "@/components/NailSourceIntegrationStatus";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Integrations | Kim's Nails",
  robots: { index: false, follow: false, nocache: true },
};

export default function IntegrationsPage() {
  return (
    <main className="shell admin-services-page">
      <div className="section-heading">
        <p className="eyebrow">Studio operations</p>
        <h1>Integrations</h1>
        <p>Read-only connection status for the authoritative Nail Source booking platform.</p>
      </div>
      <NailSourceIntegrationStatus />
    </main>
  );
}
