"use client";

import { FormEvent, useState } from "react";

export function VipSignup() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage("");

    try {
      const response = await fetch("/api/vip", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, consent: true }),
      });
      const result = (await response.json()) as { message?: string };

      if (!response.ok) {
        throw new Error(result.message || "We couldn’t save your email right now.");
      }

      setMessage(result.message || "You’re on the list—welcome to the inner circle.");
      setEmail("");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "We couldn’t save your email right now.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return <form className="vip-form" onSubmit={handleSubmit}>
    <label htmlFor="vip-email">Email address</label>
    <div className="vip-input-row"><input id="vip-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="your@email.com" autoComplete="email" required /><button type="submit" disabled={isSubmitting}>{isSubmitting ? "Joining…" : "Join the list"}</button></div>
    <p className="vip-disclaimer">By joining, you agree to receive Kim&apos;s Nails news and promotions. Unsubscribe anytime.</p>
    {message && <p className="vip-message" aria-live="polite">{message}</p>}
  </form>;
}
