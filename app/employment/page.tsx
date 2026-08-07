import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "@/components/ArrowUpRight";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { openPositions } from "@/data/careers";

export const metadata: Metadata = { title: "Careers | Kim's Nails", description: "Explore career opportunities at Kim's Nails, a luxury nail studio in New York." };

export default function EmploymentPage() {
  const hasOpenPositions = openPositions.length > 0;

  return <main><SiteHeader /><section className="page-hero shell"><p className="eyebrow">Careers at Kim&apos;s</p><h1>Do beautiful work<br />with <em>good people.</em></h1><p>We believe a thoughtful studio starts with a supported, talented team.</p></section><section className="employment-shell shell section-space">{hasOpenPositions ? <div className="open-positions"><p className="eyebrow">Open positions</p>{openPositions.map((position) => <article className="position-card" key={position.title}><div><span>{position.type}</span><h2>{position.title}</h2><p>{position.summary}</p></div><a className="button button-dark" href={`mailto:hello@kimsnails.com?subject=${encodeURIComponent(position.emailSubject)}`}>Apply now <ArrowUpRight /></a></article>)}</div> : <div className="positions-filled"><span className="filled-mark" aria-hidden="true">✦</span><p className="eyebrow">Our team is complete</p><h2>All positions are<br /><em>currently filled.</em></h2><p>We&apos;re not hiring at the moment, but we&apos;re always happy to meet thoughtful, talented people who love their craft.</p><a className="text-link" href="mailto:hello@kimsnails.com?subject=Future%20opportunities%20at%20Kim%27s%20Nails">Introduce yourself <ArrowUpRight /></a></div>}</section><section className="page-cta"><p className="eyebrow light">The studio standard</p><h2>Care, skill, and<br /><em>beautiful energy.</em></h2><Link href="/about" className="button button-light">Meet the studio <ArrowUpRight /></Link></section><SiteFooter /></main>;
}
