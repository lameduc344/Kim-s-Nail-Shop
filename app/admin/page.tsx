import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Admin | Kim's Nails", robots: { index: false, follow: false } };

const dashboardLinks = [
  { href: "/admin/services", title: "Services & Pricing", copy: "Review the salon menu and reconcile services with Nail Source." },
  { href: "/admin/bookings", title: "Bookings", copy: "See the current booking status and rollout plan." },
  { href: "/admin/check-ins", title: "Check-In Queue", copy: "See customers who checked in from the salon link or QR and move them through the waiting queue." },
  { href: "/admin/document-vault", title: "Document Vault", copy: "Store licenses, insurance, staff, vendor, tax, policy and other private salon records." },
  { href: "/admin/integrations", title: "Integrations", copy: "Check the systems connected to studio operations." },
] as const;

export default function AdminPage() {
  return <main className="admin-dashboard shell"><p className="eyebrow">Studio dashboard</p><h1>Welcome back,<br /><em>Kim.</em></h1><p className="admin-intro">Manage the live service catalog, front-desk queue, private records and the systems that support the salon.</p><div className="admin-card-grid">{dashboardLinks.map((item) => <Link href={item.href} className="admin-card" key={item.href}><h2>{item.title}</h2><p>{item.copy}</p><span>Open <span aria-hidden="true">↗</span></span></Link>)}</div><Link href="/" className="text-link">View public website <span aria-hidden="true">↗</span></Link></main>;
}
