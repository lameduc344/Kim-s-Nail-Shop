import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "@/components/ArrowUpRight";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { PRIVACY_POLICY_VERSION } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy & Applicant Data | Kim's Nails",
  description: "How Kim's Nails handles website and job-application information.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return <main><SiteHeader /><section className="page-hero shell"><p className="eyebrow">Privacy & applicant data</p><h1>Clear care for<br /><em>your information.</em></h1><p>This interim notice explains what the website collects while the owner confirms the salon&apos;s official contact and operating policies.</p></section><section className="privacy-policy shell section-space"><p className="policy-version">Effective version: {PRIVACY_POLICY_VERSION}</p><article><h2>What is currently collected</h2><p>The careers application collects the information you enter, including your name, phone, email, desired role, experience, licensing status, availability, portfolio link, message, and uploaded résumé. Basic technical request information may be processed to prevent spam and abuse.</p></article><article><h2>How applicant information is used</h2><p>Application information is used only to evaluate employment interest, communicate about hiring, protect the form from abuse, and meet applicable operational or legal requirements. It is not added to the marketing list or sold.</p></article><article><h2>Storage and access</h2><p>Applicant records and résumé files are stored in private Supabase services. Public reads and downloads are blocked. Access is limited to authorized salon operations and service providers needed to run the application system.</p></article><article><h2>Retention and deletion</h2><p>Applicant information will be kept only as long as reasonably necessary for hiring, security, and applicable legal needs. A specific retention schedule and verified deletion-request contact will be published after owner review. If you require a guaranteed deletion channel before then, please wait to submit an application.</p></article><article><h2>Booking and marketing</h2><p>Online appointment requests and VIP marketing signups are currently paused. The website will not collect those details until secure confirmation, consent, privacy, and opt-out controls are in place.</p></article><article><h2>Policy updates</h2><p>This notice will be replaced or expanded after the owner confirms the business contact, retention period, marketing practices, and service providers. The version date above is stored with new careers acknowledgements.</p></article><Link href="/employment" className="button button-dark">Careers <ArrowUpRight /></Link></section><SiteFooter /></main>;
}
