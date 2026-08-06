import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Admin | Kim's Nails", robots: { index: false, follow: false } };

export default function AdminPage() { return <main className="admin-placeholder"><p className="eyebrow">Kim&apos;s Nails</p><h1>Studio admin<br /><em>is on its way.</em></h1><p>Services, gallery imagery, promotions, and appointment requests will live here once the studio&apos;s Supabase project is connected.</p><Link href="/" className="button button-dark">Return to site</Link></main>; }
