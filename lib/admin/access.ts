import "server-only";

import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient as createUserClient } from "@/lib/supabase/server";
import { isStaffRole, roleHasPermission, type StaffPermission, type StaffRole } from "@/lib/admin/permissions";

export type { StaffPermission, StaffRole } from "@/lib/admin/permissions";

export type StaffAccess = {
  user: { id: string; email?: string };
  role: StaffRole;
};

export function hasPermission(access: StaffAccess, permission: StaffPermission) {
  return roleHasPermission(access.role, permission);
}

export async function getStaffAccess(): Promise<StaffAccess | null> {
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
  if (!staff || !isStaffRole(staff.role)) return null;

  return { user: { id: user.id, email: user.email }, role: staff.role };
}

export async function requireStaffAccess(): Promise<StaffAccess> {
  const access = await getStaffAccess();
  if (!access) redirect("/staff-login?error=access_denied");
  return access;
}

export async function requirePermission(permission: StaffPermission): Promise<StaffAccess> {
  const access = await requireStaffAccess();
  if (!hasPermission(access, permission)) redirect("/admin/access-denied");
  return access;
}

/** @deprecated Prefer a named permission check for new routes. */
export const requireAdminAccess = requireStaffAccess;
