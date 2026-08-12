import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "@/components/ArrowUpRight";
import { JobApplicationForm } from "@/components/JobApplicationForm";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { openPositions } from "@/data/careers";

export const metadata: Metadata = { title: "Careers | Kim's Nails", description: "Explore career opportunities at Kim's Nails, a luxury nail studio in Stonecrest, Georgia.", alternates: { canonical: "/employment" } };

export default function EmploymentPage() {
  const hasOpenPositions = openPositions.length > 0;

  return <main><SiteHeader /><section className="page-hero shell"><p className="eyebrow">Careers at Kim&apos;s</p><h1>Do beautiful work<br />with <em>good people.</em></h1><p>We believe a thoughtful studio starts with a supported, talented team.</p></section><section className="employment-shell shell section-space">{hasOpenPositions ? <div className="open-positions"><p className="eyebrow">Open positions</p>{openPositions.map((position) => <article className="position-card" key={position.title}><div><span>{position.type}</span><h2>{position.title}</h2><p>{position.summary}</p></div><a className="button button-dark" href="#application">Apply now <ArrowUpRight /></a></article>)}</div> : <div className="positions-filled"><span className="filled-mark" aria-hidden="true">✦</span><p className="eyebrow">Join our team</p><h2>We&apos;re always glad<br />to meet <em>talent.</em></h2><p>Even when a specific role is not listed, thoughtful professionals are welcome to apply.</p><a className="text-link" href="#application">Start your application <ArrowUpRight /></a></div>}<div id="application" className="application-wrap"><JobApplicationForm /></div></section><section className="page-cta"><p className="eyebrow light">The studio standard</p><h2>Care, skill, and<br /><em>beautiful energy.</em></h2><Link href="/about" className="button button-light">Meet the studio <ArrowUpRight /></Link></section><SiteFooter /></main>;
}
