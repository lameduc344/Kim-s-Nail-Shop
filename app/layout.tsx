import type { Metadata } from "next";
import "./globals.css";
import "./mobile.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://kimsnails.com"),
  title: "Kim's Nails | Luxury nail care celebrating Black beauty",
  description: "Thoughtful, artful nail care in New York, celebrating Black and African American beauty.",
  openGraph: { title: "Kim's Nails | Luxury nail care celebrating Black beauty", description: "Thoughtful, artful nail care in New York, celebrating Black and African American beauty.", type: "website", locale: "en_US" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className="h-full antialiased"
    >
      <body className="min-h-full flex flex-col">{children}<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "NailSalon", name: "Kim's Nails", priceRange: "$$", telephone: "+1-212-555-0184", email: "hello@kimsnails.com", address: { "@type": "PostalAddress", streetAddress: "128 Mott Street", addressLocality: "New York", addressRegion: "NY", postalCode: "10013", addressCountry: "US" }, openingHoursSpecification: [{ "@type": "OpeningHoursSpecification", dayOfWeek: ["Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"], opens: "10:00", closes: "19:00" }] }) }} /></body>
    </html>
  );
}
