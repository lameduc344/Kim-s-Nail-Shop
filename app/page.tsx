import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { ArrowUpRight } from "@/components/ArrowUpRight";
import { GalleryGrid } from "@/components/GalleryGrid";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { WeeklyPromotion } from "@/components/WeeklyPromotion";

export const metadata: Metadata = { alternates: { canonical: "/" } };
import { featuredServices } from "@/data/services";
import { testimonials } from "@/data/testimonials";

export default function Home() {
  return <main><section className="hero"><SiteHeader inverse /><div className="hero-content shell"><p className="eyebrow light">Luxury nail care celebrating Black beauty · Stonecrest</p><h1>Making strong<br />Black women <em>beautiful</em><br />since 2003.</h1><div className="hero-bottom"><p>Thoughtful nail care, artfully done.<br />A little ritual of beauty, just for you.</p><Link className="button button-light" href="/booking">Reserve your moment <ArrowUpRight /></Link></div></div><Link className="scroll-note" href="/services">Scroll to discover <span>↓</span></Link></section><section className="intro shell section-space"><p className="eyebrow">The Kim&apos;s Nails experience</p><div className="intro-grid"><h2>Elevated details.<br /><em>Unhurried care.</em></h2><div className="intro-copy"><p>Kim&apos;s is a space that celebrates Black and African American beauty through precise technique, rich colour, and a deeply personal kind of luxury. We take the time to understand your style, then make the smallest details feel extraordinary.</p><Link className="text-link" href="/about">Meet the studio <ArrowUpRight /></Link></div></div><div className="value-strip"><span>01 <b>Impeccably clean</b></span><span>02 <b>Shades for every skin tone</b></span><span>03 <b>Made to last</b></span></div></section><section className="services"><div className="shell section-header"><div><p className="eyebrow">Our signature services</p><h2>Consider this your<br /><em>beauty menu.</em></h2></div><Link className="text-link" href="/services">View all services <ArrowUpRight /></Link></div><div className="service-grid shell">{featuredServices.map((service, index) => <article className="service-card" key={service.name}><div className="service-image"><Image src={service.image} alt={service.name} width={900} height={1100} /><span>0{index + 1}</span></div><div className="service-name"><h3>{service.name}</h3><p>{service.time}</p></div><div className="service-price"><span>From</span><b>{service.price}</b></div></article>)}</div></section><section className="feature shell section-space"><div className="feature-photo"><Image src="/images/black-beauty-signature-manicure.png" alt="Black hands with nude and gold finished nails on espresso satin" width={1200} height={1400} /><div className="feature-photo-copy"><p>Kim&apos;s Nails</p><strong>Celebrating Black beauty,<br /><em>one set at a time.</em></strong></div></div><div className="feature-copy"><p className="eyebrow">The difference is in the details</p><h2>Come in as you are.<br /><em>Leave feeling like art.</em></h2><p>From our meticulous prep to the last drop of cuticle oil, every part of your appointment is designed to feel calm, considered, and completely yours.</p><Link className="button button-dark" href="/booking">Find your ritual <ArrowUpRight /></Link></div></section><section className="gallery-section"><div className="shell section-header"><div><p className="eyebrow">Fresh from the studio</p><h2>Your next set is<br /><em>waiting.</em></h2></div><Link className="text-link" href="/gallery">See the gallery <ArrowUpRight /></Link></div><div className="shell"><GalleryGrid limit={4} /></div></section><section className="weekly-promotion-wrap shell"><WeeklyPromotion /></section><section className="testimonials section-space"><div className="shell"><div className="testimonials-header"><p className="eyebrow">Client love</p><h2>Kind words from<br /><em>our guests.</em></h2><p>Every visit is personal. Here&apos;s what guests are saying after their time in Kim&apos;s chair.</p></div><div className="testimonial-grid">{testimonials.map((testimonial) => <article className="testimonial-card" key={testimonial.name}><span aria-hidden="true">“</span><blockquote>{testimonial.quote}</blockquote><footer><strong>{testimonial.name}</strong><small>{testimonial.service}</small></footer></article>)}</div></div></section>      <section className="booking">
        <div className="booking-image">
          <Image src="/images/black-hands-finished-nails.png" alt="Black hands with a finished manicure" width={1200} height={1200} />
        </div>
        <div className="booking-content">
          <p className="eyebrow">Online booking</p>
          <h2>Reserve your<br /><em>moment in the chair.</em></h2>
          <p>Book your next nail care ritual online with live availability and instant confirmation powered by Nail Source.</p>
          <Link className="button button-dark" href="/booking">Book an appointment <ArrowUpRight /></Link>
        </div>
      </section>
      <SiteFooter />
    </main>;
}
