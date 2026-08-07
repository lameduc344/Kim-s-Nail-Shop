import Link from "next/link";
import { ArrowUpRight } from "@/components/ArrowUpRight";

export function SiteFooter() {
  return <footer className="footer"><div className="shell footer-vip"><div><p className="eyebrow">Stay in the glow</p><h2>VIP updates are<br /><em>coming soon.</em></h2></div><div className="vip-paused"><p>Signups are paused while we add clear email and text consent choices, privacy disclosures, and simple opt-out controls.</p></div></div><div className="shell footer-top"><Link href="/" className="brand">KIM&apos;S <i>NAILS</i></Link><p>Beauty, on your own terms.</p><a href="https://instagram.com" target="_blank" rel="noreferrer" className="text-link">Instagram <ArrowUpRight /></a></div><div className="shell footer-bottom"><span>128 Mott Street, New York, NY</span><span>Tue–Sun · 10am–7pm</span><span><Link href="/privacy">Privacy & applicant data</Link> · © 2026 Kim&apos;s Nails</span></div></footer>;
}
