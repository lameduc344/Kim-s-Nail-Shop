import Link from "next/link";
export default function AdminLayout({children}:{children:React.ReactNode}){return <><nav className="shell" style={{display:"flex",gap:"1rem",paddingTop:"1rem",paddingBottom:"1rem"}}><Link href="/admin">Today Board</Link><Link href="/admin/service-editor">Edit services</Link><Link href="/check-in">Check-in page</Link></nav>{children}</>}
