"use client";

import { FormEvent, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function ForgotPasswordForm() {
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") || "");
    await createClient().auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/auth/callback?next=/staff-login/update-password` });
    setMessage("If that email belongs to a staff account, password-reset instructions are on the way.");
    setIsSubmitting(false);
  }

  return <form className="booking-unavailable" onSubmit={submit}><h2>Reset password</h2><p>Enter the email used for your staff account.</p><label>Email<input name="email" type="email" autoComplete="email" required /></label><button className="button button-dark" disabled={isSubmitting}>{isSubmitting ? "Sending…" : "Send reset link"}</button>{message ? <p role="status">{message}</p> : null}</form>;
}
