import type { Metadata } from "next";
import Link from "next/link";
import { hasPermission, requireStaffAccess, type StaffPermission } from "@/lib/admin/access";

export const metadata: Metadata = { title: "Admin | Kim's Nails", robots: { index: false, follow: false } };

const dashboardLinks: { href: string; title: string; copy: string; permission: StaffPermission }[] = [
  { href: "/admin/services", title: "Services & Pricing", copy: "Review the salon menu and reconcile services with Nail Source.", permission: "services:view" },
  { href: "/admin/bookings", title: "Bookings", copy: "See the current booking status and rollout plan.", permission: "bookings:view" },
  { href: "/admin/integrations", title: "Integrations", copy: "Check the systems connected to studio operations.", permission: "integrations:view" },
];

export default async function AdminPage() {
  const access = await requireStaffAccess();
  const links = dashboardLinks.filter((item) => hasPermission(access, item.permission));
  return <main className="admin-dashboard shell"><p className="eyebrow">Studio dashboard · {access.role.replace("_", " ")}</p><h1>Welcome<br /><em>back.</em></h1><p className="admin-intro">Manage the areas of studio operations assigned to your staff role.</p><div className="admin-card-grid">{links.map((item) => <Link href={item.href} className="admin-card" key={item.href}><h2>{item.title}</h2><p>{item.copy}</p><span>Open <span aria-hidden="true">↗</span></span></Link>)}</div><Link href="/" className="text-link">View public website <span aria-hidden="true">↗</span></Link></main>;
}
