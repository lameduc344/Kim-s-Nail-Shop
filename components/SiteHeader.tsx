import Link from "next/link";
import { ArrowUpRight } from "@/components/ArrowUpRight";
import { VietnameseTranslateButton } from "@/components/VietnameseTranslateButton";

export function SiteHeader({ inverse = false }: { inverse?: boolean }) {
  return (
    <header className={inverse ? "site-header inverse" : "site-header"}>
      <nav className="nav shell" aria-label="Main navigation">
        <Link href="/" className="brand" aria-label="Kim's Nails home">
          <span className="brand-diamond" aria-hidden="true">◆</span>
          <span>KIM&apos;S <i>NAILS</i></span>
          <span className="brand-diamond brand-diamond-outline" aria-hidden="true">◇</span>
        </Link>
        <div className="nav-links"><Link href="/services">Services</Link><Link href="/about">Our story</Link><Link href="/gallery">Gallery</Link><Link href="/employment">Careers</Link><Link href="/contact">Contact</Link></div>
        <div className="nav-actions"><VietnameseTranslateButton /><Link className="book-link" href="/booking"><span className="book-diamond" aria-hidden="true">◆</span> Book now <ArrowUpRight /></Link></div>
      </nav>
    </header>
  );
}
