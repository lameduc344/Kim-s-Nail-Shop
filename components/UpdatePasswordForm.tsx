"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function UpdatePasswordForm() {
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage("");
    const form = new FormData(event.currentTarget);
    const password = String(form.get("password") || "");
    const confirmation = String(form.get("confirmation") || "");
    if (password.length < 12 || password !== confirmation) {
      setMessage(password.length < 12 ? "Use at least 12 characters." : "The passwords do not match.");
      setIsSubmitting(false);
      return;
    }
    const { error } = await createClient().auth.updateUser({ password });
    if (error) {
      setMessage("This reset link is invalid or expired. Request a new one.");
      setIsSubmitting(false);
      return;
    }
    router.replace("/admin");
    router.refresh();
  }

  return <form className="booking-unavailable" onSubmit={submit}><h2>Choose a new password</h2><label>New password<input name="password" type="password" minLength={12} autoComplete="new-password" required /></label><label>Confirm password<input name="confirmation" type="password" minLength={12} autoComplete="new-password" required /></label><button className="button button-dark" disabled={isSubmitting}>{isSubmitting ? "Updating…" : "Update password"}</button>{message ? <p role="status">{message}</p> : null}</form>;
}
