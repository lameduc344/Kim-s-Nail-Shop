import Link from "next/link";
import { requireAdminAccess } from "@/lib/admin/access";
import { SITE_URL } from "@/lib/site";

export default async function CheckInSignPage() {
  await requireAdminAccess();
  const checkInUrl = `${SITE_URL}/check-in`;

  return (
    <main className="shell" style={{ paddingTop: 36, paddingBottom: 72 }}>
      <p className="eyebrow">Front Desk</p>
      <h1>Check-In QR Sign</h1>
      <p>Use the vector master for signs and large-format printing. SVG stays sharp at any size.</p>

      <section className="card" style={{ maxWidth: 760, marginTop: 24, textAlign: "center" }}>
        <p className="eyebrow">Kim&apos;s Nails</p>
        <h2 style={{ fontSize: "clamp(2rem, 5vw, 4rem)", marginBottom: 12 }}>Scan to Check In</h2>
        <img src="/check-in-qr.svg" alt="QR code for Kim's Nails customer check-in" width={420} height={420} style={{ width: "min(100%, 420px)", height: "auto", background: "white", padding: 16 }} />
        <p style={{ marginTop: 16 }}>Open your camera and scan the code to let the front desk know you&apos;ve arrived.</p>
        <p style={{ fontSize: 14, wordBreak: "break-all" }}>{checkInUrl}</p>
      </section>

      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 24 }}>
        <a className="button" href="/check-in-qr.svg" download="kims-nails-check-in-qr.svg">Download SVG Master</a>
        <Link className="button" href="/admin/check-ins">Back to Check-Ins</Link>
      </div>

      <p style={{ marginTop: 20 }}>Print-shop note: keep the white quiet-zone around the code intact and avoid placing the QR over patterns, photos, foil, or reflective backgrounds.</p>
    </main>
  );
}
