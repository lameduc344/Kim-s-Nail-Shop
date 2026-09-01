import Link from "next/link";
import type { ReactNode } from "react";
import { AdminSignOut } from "@/components/AdminSignOut";
import { requireAdminAccess } from "@/lib/admin/access";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  await requireAdminAccess();

  return <><header className="admin-header"><nav className="shell admin-nav" aria-label="Studio dashboard"><Link className="brand" href="/admin">KIM&apos;S <i>NAILS</i></Link><div className="admin-nav-links"><Link href="/admin">Dashboard</Link><Link href="/admin/customers">Customers</Link><Link href="/admin/services">Services &amp; Pricing</Link><Link href="/admin/bookings">Bookings</Link><Link href="/admin/check-ins">Check-Ins</Link><Link href="/admin/document-vault">Document Vault</Link><Link href="/admin/integrations">Integrations</Link><AdminSignOut /></div></nav></header>{children}</>;
}
