export const staffRoles = ["owner", "admin", "manager", "front_desk", "technician"] as const;
export type StaffRole = (typeof staffRoles)[number];
export type StaffPermission = "dashboard:view" | "services:view" | "bookings:view" | "integrations:view" | "site:manage" | "staff:manage";

const rolePermissions: Record<StaffRole, readonly StaffPermission[]> = {
  owner: ["dashboard:view", "services:view", "bookings:view", "integrations:view", "site:manage", "staff:manage"],
  admin: ["dashboard:view", "services:view", "bookings:view", "integrations:view", "site:manage", "staff:manage"],
  manager: ["dashboard:view", "services:view", "bookings:view", "integrations:view", "site:manage"],
  front_desk: ["dashboard:view", "bookings:view"],
  technician: ["dashboard:view", "services:view", "bookings:view"],
};

export function isStaffRole(value: string): value is StaffRole {
  return staffRoles.includes(value as StaffRole);
}

export function roleHasPermission(role: StaffRole, permission: StaffPermission) {
  return rolePermissions[role].includes(permission);
}
