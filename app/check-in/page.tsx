import type { Metadata } from "next";
import { CheckInForm } from "@/components/CheckInForm";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
export const metadata:Metadata={title:"Check In | Kim's Nails",description:"Check in for today's Kim's Nails appointment.",robots:{index:false,follow:false}};
export default function CheckInPage(){return <main><SiteHeader/><section className="booking-page shell"><div><p className="eyebrow">Studio check-in</p><h1>You&apos;re here.<br/><em>We&apos;ve got you.</em></h1><p>Use the phone number from your booking. Your confirmation code makes matching even faster. Walk-ins can join the studio queue here too.</p></div><CheckInForm/></section><SiteFooter/></main>}
