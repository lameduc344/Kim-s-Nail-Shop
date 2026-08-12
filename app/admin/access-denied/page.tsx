import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Access Denied | Kim's Nails", robots: { index: false, follow: false } };

export default function AccessDeniedPage() {
  return <main className="admin-dashboard shell"><p className="eyebrow">Studio dashboard</p><h1>Access<br /><em>limited.</em></h1><section className="admin-status-panel"><h2>Your account is signed in.</h2><p>Your staff role does not include access to this area. Ask the salon owner if your responsibilities have changed.</p><Link href="/admin" className="button button-dark">Return to dashboard</Link></section></main>;
}
