import Link from "next/link";
import { ArrowUpRight } from "@/components/ArrowUpRight";

export function SiteHeader({ inverse = false }: { inverse?: boolean }) {
  return (
    <header className={inverse ? "site-header inverse" : "site-header"}>
      <nav className="nav shell" aria-label="Main navigation">
        <Link href="/" className="brand" aria-label="Kim's Nails home">KIM&apos;S <i>NAILS</i></Link>
        <div className="nav-links"><Link href="/services">Services</Link><Link href="/about">Our story</Link><Link href="/gallery">Gallery</Link><Link href="/contact">Contact</Link></div>
        <Link className="book-link" href="/booking">Book now <ArrowUpRight /></Link>
      </nav>
    </header>
  );
}
