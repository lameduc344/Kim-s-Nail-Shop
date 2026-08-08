import type { Metadata } from "next";
import { BookingForm } from "@/components/BookingForm";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

export const metadata: Metadata = { title: "Book an Appointment | Kim's Nails", description: "Request your Kim's Nails appointment online.", alternates: { canonical: "/booking" } };
export default function BookingPage(){return <main><SiteHeader/><section className="booking-page shell"><div><p className="eyebrow">Online booking</p><h1>Your next set<br/><em>starts here.</em></h1><p>Choose your service and preferred time. The salon can confirm or adjust the request from the studio dashboard.</p></div><BookingForm/></section><SiteFooter/></main>}
