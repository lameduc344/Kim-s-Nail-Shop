import Link from "next/link";
import { ArrowUpRight } from "@/components/ArrowUpRight";
import { business } from "@/data/business";

export function SiteFooter() {
  return <footer className="footer"><div className="shell footer-vip"><div><p className="eyebrow">Stay in the glow</p><h2>VIP updates are<br /><em>coming soon.</em></h2></div><div className="vip-paused"><p>Signups are paused while we add clear email and text consent choices, privacy disclosures, and simple opt-out controls.</p></div></div><div className="shell footer-top"><Link href="/" className="brand">KIM&apos;S <i>NAILS</i></Link><p>Beauty, on your own terms.</p><a href={business.phoneHref} className="text-link">Call the salon <ArrowUpRight /></a></div><div className="shell footer-bottom"><span>{business.addressLine1}, {business.addressLine2}</span><span>{business.hoursShort}</span><span><Link href="/privacy">Privacy &amp; applicant data</Link> · <Link href="/staff-login">Staff Login</Link> · © 2026 Kim&apos;s Nails</span></div></footer>;
}
