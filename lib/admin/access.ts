import "server-only";

import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient as createUserClient } from "@/lib/supabase/server";

export type AdminAccess = {
  user: { id: string; email?: string };
  role: "owner" | "admin";
};

export async function getAdminAccess(): Promise<AdminAccess | null> {
  const userClient = await createUserClient();
  const { data: { user } } = await userClient.auth.getUser();
  if (!user) return null;

  const admin = createAdminClient();
  const { data: staff } = await admin
    .from("salon_staff")
    .select("role")
    .eq("user_id", user.id)
    .eq("active", true)
    .maybeSingle();
  if (!staff || !["owner", "admin"].includes(staff.role)) return null;

  return { user: { id: user.id, email: user.email }, role: staff.role as AdminAccess["role"] };
}

export async function requireAdminAccess(): Promise<AdminAccess> {
  const access = await getAdminAccess();
  if (!access) redirect("/staff-login");
  return access;
}
