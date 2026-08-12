import type { Metadata } from "next";
import Link from "next/link";
import { requirePermission } from "@/lib/admin/access";

export const metadata: Metadata = { title: "Bookings | Kim's Nails", robots: { index: false, follow: false } };

export default async function AdminBookingsPage() {
  await requirePermission("bookings:view");
  return <main className="admin-dashboard shell"><p className="eyebrow">Studio dashboard</p><h1>Bookings</h1><section className="admin-status-panel"><p className="eyebrow">Not yet connected</p><h2>Online booking remains paused.</h2><p>No customer appointment requests are being collected while the secure confirmation workflow is completed. Existing salon bookings should continue through the current booking process.</p><Link href="/booking" className="button button-dark">View customer update</Link></section></main>;
}
