import { NextResponse } from "next/server";
import { getAdminAccess } from "@/lib/admin/access";
import { createAdminClient } from "@/lib/supabase/admin";

function csvCell(value: unknown) {
  const text = value == null ? "" : String(value);
  return `"${text.replace(/"/g, '""')}"`;
}

export async function GET() {
  const access = await getAdminAccess();
  if (!access) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const admin = createAdminClient();
  const { data, error } = await admin.from("salon_customers")
    .select("full_name,phone,email,preferred_technician,tags,visit_count,last_visit_at,notes,updated_at")
    .order("full_name");
  if (error) return NextResponse.json({ error: "Customer export unavailable" }, { status: 500 });

  const rows = [
    ["Name", "Phone", "Email", "Preferred Technician", "Tags", "Visit Count", "Last Visit", "Notes", "Updated"],
    ...(data || []).map((row) => [row.full_name, row.phone, row.email, row.preferred_technician, (row.tags || []).join(" | "), row.visit_count, row.last_visit_at, row.notes, row.updated_at]),
  ];
  const csv = rows.map((row) => row.map(csvCell).join(",")).join("\n");
  return new Response(csv, {
    headers: {
      "content-type": "text/csv; charset=utf-8",
      "content-disposition": `attachment; filename="kims-nails-customers-${new Date().toISOString().slice(0, 10)}.csv"`,
      "cache-control": "no-store",
    },
  });
}
