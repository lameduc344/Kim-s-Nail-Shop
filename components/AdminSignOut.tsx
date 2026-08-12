"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function AdminSignOut() {
  const [isSigningOut, setIsSigningOut] = useState(false);
  const router = useRouter();

  async function signOut() {
    setIsSigningOut(true);
    await createClient().auth.signOut();
    router.replace("/staff-login");
    router.refresh();
  }

  return <button className="admin-sign-out" type="button" onClick={signOut} disabled={isSigningOut}>{isSigningOut ? "Signing out…" : "Sign out"}</button>;
}
