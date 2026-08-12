import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "@/components/ArrowUpRight";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { services } from "@/data/services";

export const metadata: Metadata = { title: "Nail Services & Pricing | Kim's Nails", description: "Explore manicures, pedicures, extensions, and custom nail art at Kim's Nails in Stonecrest, Georgia.", alternates: { canonical: "/services" } };

export default function ServicesPage() {
  return <main><SiteHeader /><section className="page-hero shell"><p className="eyebrow">The complete menu</p><h1>Made to be<br /><em>noticed.</em></h1><p>Every service begins with careful prep and ends with an effortless, polished finish.</p></section><section className="menu shell section-space">{services.map((category) => <div className="menu-category" key={category.category}><div className="menu-image"><Image src={category.image} alt={category.category} width={900} height={1000} /></div><div><p className="eyebrow">{category.category}</p><h2>{category.category} <em>rituals.</em></h2><div className="menu-items">{category.items.map((service) => <article key={service.name}><div><h3>{service.name}</h3><p>{service.description}</p></div><p className="service-details">{service.duration}<b>{service.price}</b></p></article>)}</div></div></div>)}</section><section className="page-cta"><p className="eyebrow light">Ready when you are</p><h2>Let&apos;s make a<br /><em>little magic.</em></h2><Link href="/booking" className="button button-light">Book an appointment <ArrowUpRight /></Link></section><SiteFooter /></main>;
}
