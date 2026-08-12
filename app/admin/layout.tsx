import Link from "next/link";
import { requireAdminAccess } from "@/lib/admin/access";
export default async function AdminLayout({children}:{children:React.ReactNode}){await requireAdminAccess();return <><nav className="shell" style={{display:"flex",gap:"1rem",paddingTop:"1rem",paddingBottom:"1rem",flexWrap:"wrap"}}><Link href="/admin">Admin home</Link><Link href="/admin/services">Services &amp; pricing</Link><Link href="/admin/integrations">Integrations</Link></nav>{children}</>}
