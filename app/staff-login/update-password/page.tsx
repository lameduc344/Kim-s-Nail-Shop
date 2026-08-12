import type { Metadata } from "next";
import { UpdatePasswordForm } from "@/components/UpdatePasswordForm";

export const metadata: Metadata = { title: "Choose New Password | Kim's Nails", robots: { index: false, follow: false } };

export default function UpdatePasswordPage() {
  return <main className="booking-page shell"><div><p className="eyebrow">Kim&apos;s Nails</p><h1>Secure your<br /><em>account.</em></h1><p>Choose a strong, unique password for your staff account.</p></div><UpdatePasswordForm /></main>;
}
