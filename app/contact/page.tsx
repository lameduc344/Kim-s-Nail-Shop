import type { Metadata } from "next";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { business } from "@/data/business";

export const metadata: Metadata = { title: "Contact & Hours | Kim's Nails", description: "Find Kim's Nails on Mall Parkway in Stonecrest, Georgia. Get directions, salon hours, and contact details.", alternates: { canonical: "/contact" } };

export default function ContactPage() { return <main><SiteHeader /><section className="page-hero shell"><p className="eyebrow">Come see us</p><h1>Find your<br /><em>new ritual.</em></h1><p>Visit us in Stonecrest, with a seat waiting whenever you need a little reset.</p></section><section className="contact-grid shell section-space"><div className="contact-map"><iframe title="Map to Kim's Nails" src={business.mapEmbedHref} loading="lazy" referrerPolicy="no-referrer-when-downgrade" /></div><div className="contact-details"><div><p className="eyebrow">Visit</p><h2>{business.addressLine1}<br />{business.addressLine2}</h2><a className="text-link" href={business.directionsHref} target="_blank" rel="noreferrer">Get directions <span className="arrow">↗</span></a></div><div><p className="eyebrow">Hours</p><p>Monday — Saturday<br />10:00am — 7:00pm</p><p>Sunday<br />12:00pm — 6:00pm</p></div><div><p className="eyebrow">Call</p><a href={business.phoneHref}>{business.phoneDisplay}</a></div></div></section><SiteFooter /></main>; }
