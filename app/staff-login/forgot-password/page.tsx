import type { Metadata } from "next";
import Link from "next/link";
import { ForgotPasswordForm } from "@/components/ForgotPasswordForm";

export const metadata: Metadata = { title: "Reset Staff Password | Kim's Nails", robots: { index: false, follow: false } };

export default function ForgotPasswordPage() {
  return <main className="booking-page shell"><div><p className="eyebrow">Kim&apos;s Nails</p><h1>Password<br /><em>help.</em></h1><p>We&apos;ll send a secure recovery link if the address belongs to a staff account.</p><Link href="/staff-login" className="text-link">Back to staff login</Link></div><ForgotPasswordForm /></main>;
}
