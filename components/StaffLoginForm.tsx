"use client";
import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function StaffLoginForm({ error }: { error?: string }) {
  const initialMessage = error === "access_denied"
    ? "Your account is not authorized for the staff dashboard. Ask the salon owner to check your active staff role."
    : error === "recovery_failed" ? "That password-reset link is invalid or expired. Request a new one." : "";
  const [message, setMessage] = useState(initialMessage);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage("");
    const form = new FormData(event.currentTarget);
    const { error } = await createClient().auth.signInWithPassword({ email: String(form.get("email") || ""), password: String(form.get("password") || "") });
    if (error) {
      setMessage("Sign-in failed. Check your staff credentials.");
      setIsSubmitting(false);
      return;
    }
    router.replace("/admin");
    router.refresh();
  }

  return <form className="booking-unavailable" onSubmit={submit}><h2>Staff sign in</h2><label>Email<input name="email" type="email" autoComplete="email" required /></label><label>Password<input name="password" type="password" autoComplete="current-password" required /></label><button className="button button-dark" disabled={isSubmitting}>{isSubmitting ? "Signing in…" : "Sign in"}</button><Link href="/staff-login/forgot-password" className="text-link">Forgot password?</Link>{message ? <p role="status">{message}</p> : null}</form>;
}
