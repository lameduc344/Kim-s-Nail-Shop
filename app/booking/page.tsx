import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "@/components/ArrowUpRight";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { business } from "@/data/business";

export const metadata: Metadata = {
  title: "Book an Appointment | Kim's Nails",
  description: "Reserve your nail care appointment online with live scheduling powered securely by Nail Source.",
  alternates: { canonical: "/booking" },
};

export default function BookingPage() {
  return (
    <main>
      <SiteHeader />
      <section className="booking-page shell">
        <div>
          <p className="eyebrow">Online booking</p>
          <h1>
            Reserve your
            <br />
            <em>moment.</em>
          </h1>
          <p>
            Book your next ritual with live appointment scheduling powered by Nail Source.
            Select your preferred date, time, and service with instant real-time confirmation.
          </p>
          <div className="booking-contact">
            <span>Prefer to call or have questions?</span>
            <a href={business.phoneHref}>{business.phoneDisplay}</a>
            <Link href="/contact">View studio hours &amp; location</Link>
          </div>
        </div>
        <div className="booking-unavailable">
          <span aria-hidden="true">✦</span>
          <h2>Live online scheduling.</h2>
          <p>
            Appointment availability, service selection, and reservations are securely handled
            by our authoritative booking partner, Nail Source.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginTop: "28px" }}>
            <a
              href="https://nail-source-usa.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="button button-dark"
            >
              Book on Nail Source <ArrowUpRight />
            </a>
            <Link href="/services" className="button button-light">
              Explore services menu <ArrowUpRight />
            </Link>
          </div>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
