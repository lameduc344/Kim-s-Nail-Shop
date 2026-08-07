import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "@/components/ArrowUpRight";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

export const metadata: Metadata = { title: "Booking Update | Kim's Nails", description: "Online appointment requests are temporarily paused while Kim's Nails completes a secure confirmation system.", alternates: { canonical: "/booking" } };

export default function BookingPage() { return <main><SiteHeader /><section className="booking-page shell booking-paused"><div><p className="eyebrow">Online booking</p><h1>Booking is being<br /><em>made better.</em></h1><p>Online appointment requests are temporarily paused while we connect a secure confirmation system and verify the salon&apos;s contact details with the owner.</p></div><div className="booking-unavailable"><span aria-hidden="true">✦</span><h2>Please check back soon.</h2><p>We do not want your appointment request going to an unverified email address. The new form will confirm on screen when your request is safely received.</p><Link href="/services" className="button button-dark">Explore services <ArrowUpRight /></Link></div></section><SiteFooter /></main>; }
