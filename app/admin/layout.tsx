import Link from "next/link";
import type { ReactNode } from "react";
import { AdminSignOut } from "@/components/AdminSignOut";
import { hasPermission, requireStaffAccess } from "@/lib/admin/access";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const access = await requireStaffAccess();

  return <><header className="admin-header"><nav className="shell admin-nav" aria-label="Studio dashboard"><Link className="brand" href="/admin">KIM&apos;S <i>NAILS</i></Link><div className="admin-nav-links"><Link href="/admin">Dashboard</Link>{hasPermission(access, "services:view") ? <Link href="/admin/services">Services &amp; Pricing</Link> : null}{hasPermission(access, "bookings:view") ? <Link href="/admin/bookings">Bookings</Link> : null}{hasPermission(access, "integrations:view") ? <Link href="/admin/integrations">Integrations</Link> : null}<AdminSignOut /></div></nav></header>{children}</>;
}
