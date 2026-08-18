import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "@/components/ArrowUpRight";

export const metadata: Metadata = { title: "Bookings | Kim's Nails", robots: { index: false, follow: false } };

export default function AdminBookingsPage() {
  return (
    <main className="admin-dashboard shell">
      <p className="eyebrow">Studio dashboard</p>
      <h1>Bookings</h1>
      <section className="admin-status-panel">
        <p className="eyebrow">Live Booking Active</p>
        <h2>Customer booking handoff is live.</h2>
        <p>
          Customer appointments are securely managed through authoritative Nail Source scheduling.
          View the public booking flow or monitor connection health in Integrations.
        </p>
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginTop: "20px" }}>
          <Link href="/booking" className="button button-dark">View customer booking</Link>
          <Link href="/admin/integrations" className="button button-light">Check integrations <ArrowUpRight /></Link>
        </div>
      </section>
    </main>
  );
}
