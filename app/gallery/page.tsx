import type { Metadata } from "next";
import Image from "next/image";
import { GalleryGrid } from "@/components/GalleryGrid";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

export const metadata: Metadata = { title: "Nail Art Gallery | Kim's Nails", description: "Explore a selection of fresh sets, gel nails, acrylics, and custom nail art from Kim's Nails.", alternates: { canonical: "/gallery" } };

export default function GalleryPage() { return <main><SiteHeader /><section className="page-hero shell"><p className="eyebrow">Fresh from our chairs</p><h1>Little works<br />of <em>art.</em></h1><p>Need a little inspiration? Explore the sets that have left our studio lately.</p></section><section className="shell gallery-page section-space"><GalleryGrid /></section><section className="before-after shell section-space"><div><p className="eyebrow">A fresh perspective</p><h2>Same hands.<br /><em>New energy.</em></h2><p>A great set is more than colour. It&apos;s a tiny reset, a new point of view, and the confidence to put your hands in the frame.</p></div><div className="before-after-image"><Image src="/images/black-hands-finished-nails.png" alt="Black hands with a freshly finished manicure" width={1200} height={900} /></div></section><SiteFooter /></main>; }
