"use client";

import { FormEvent, useRef, useState } from "react";

type SubmissionState = { kind: "idle" | "submitting" | "success" | "error"; message: string };
const initialState: SubmissionState = { kind: "idle", message: "" };

export function JobApplicationForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, setState] = useState<SubmissionState>(initialState);

  async function submitApplication(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState({ kind: "submitting", message: "Sending your application…" });
    try {
      const response = await fetch("/api/job-applications", { method: "POST", body: new FormData(event.currentTarget) });
      const result = (await response.json()) as { message?: string };
      if (!response.ok) throw new Error(result.message || "We could not send your application.");
      formRef.current?.reset();
      setState({ kind: "success", message: result.message || "Your application was received." });
    } catch (error) {
      setState({ kind: "error", message: error instanceof Error ? error.message : "We could not send your application. Please try again." });
    }
  }

  return (
    <form ref={formRef} className="job-application-form" onSubmit={submitApplication} encType="multipart/form-data">
      <div className="application-heading"><p className="eyebrow">Application</p><h2>Tell us about<br /><em>your craft.</em></h2><p>Complete the form and attach your résumé as a PDF or Word document.</p></div>
      <div className="form-row"><label>Full name<input name="fullName" autoComplete="name" required maxLength={120} /></label><label>Phone<input name="phone" type="tel" autoComplete="tel" required maxLength={40} /></label></div>
      <label>Email<input name="email" type="email" autoComplete="email" required maxLength={180} /></label>
      <div className="form-row"><label>Role you want<input name="desiredRole" required maxLength={120} placeholder="Nail technician, front desk…" /></label><label>License status<select name="licenseStatus" required defaultValue=""><option value="" disabled>Select one</option><option>Currently licensed</option><option>License in progress</option><option>Not currently licensed</option><option>Not required for this role</option></select></label></div>
      <label>Professional experience<textarea name="experience" required maxLength={2500} rows={5} placeholder="Tell us about your experience, specialties, and training." /></label>
      <label>Availability<textarea name="availability" required maxLength={1000} rows={3} placeholder="Which days and hours are you available?" /></label>
      <label>Portfolio or social link <span className="optional">Optional</span><input name="portfolioUrl" type="url" inputMode="url" maxLength={500} placeholder="https://" /></label>
      <label>Why would you like to join Kim&apos;s Nails?<textarea name="message" required maxLength={2500} rows={5} /></label>
      <label className="file-field">Résumé — PDF, DOC, or DOCX<input name="resume" type="file" accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" required /><small>Maximum file size: 4 MB. Please do not include sensitive identification numbers.</small></label>
      <label className="application-honeypot" aria-hidden="true">Website<input name="website" tabIndex={-1} autoComplete="off" /></label>
      <button className="button button-dark" type="submit" disabled={state.kind === "submitting"}>{state.kind === "submitting" ? "Sending…" : "Submit application"}</button>
      <p className={`application-status ${state.kind}`} aria-live="polite">{state.message}</p>
      <p className="form-note">Your application and résumé are stored privately and reviewed only for hiring.</p>
    </form>
  );
}
