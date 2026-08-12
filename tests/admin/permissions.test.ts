import assert from "node:assert/strict";
import test from "node:test";
import { roleHasPermission } from "../../lib/admin/permissions";

test("manager can operate content without staff administration", () => {
  assert.equal(roleHasPermission("manager", "site:manage"), true);
  assert.equal(roleHasPermission("manager", "services:view"), true);
  assert.equal(roleHasPermission("manager", "staff:manage"), false);
});

test("front desk is limited to booking intake", () => {
  assert.equal(roleHasPermission("front_desk", "bookings:view"), true);
  assert.equal(roleHasPermission("front_desk", "services:view"), false);
  assert.equal(roleHasPermission("front_desk", "integrations:view"), false);
});

test("technician cannot manage site or integrations", () => {
  assert.equal(roleHasPermission("technician", "services:view"), true);
  assert.equal(roleHasPermission("technician", "bookings:view"), true);
  assert.equal(roleHasPermission("technician", "site:manage"), false);
});
