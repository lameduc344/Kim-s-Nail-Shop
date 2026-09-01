import Link from "next/link";
import { revalidatePath } from "next/cache";
import { requireAdminAccess } from "@/lib/admin/access";
import { createAdminClient } from "@/lib/supabase/admin";

const statuses = ["waiting", "called", "seated", "completed", "cancelled"] as const;

async function updateStatus(formData: FormData) {
  "use server";
  await requireAdminAccess();
  const id = String(formData.get("id") || "");
  const status = String(formData.get("status") || "");
  if (!id || !statuses.includes(status as (typeof statuses)[number])) return;

  const admin = createAdminClient();
  await admin.from("salon_checkins").update({ status, updated_at: new Date().toISOString() }).eq("id", id);
  revalidatePath("/admin/check-ins");
}

export default async function CheckInsAdminPage() {
  await requireAdminAccess();
  const admin = createAdminClient();
  const { data: checkins, error } = await admin
    .from("salon_checkins")
    .select("id,customer_name,phone,appointment_reference,party_size,status,checked_in_at")
    .order("checked_in_at", { ascending: false })
    .limit(100);

  return (
    <main className="shell" style={{ paddingTop: 36, paddingBottom: 72 }}>
      <p className="eyebrow">Front Desk</p>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 16, alignItems: "flex-start", flexWrap: "wrap" }}>
        <div>
          <h1>Check-In Queue</h1>
          <p>Customer check-ins from the salon QR/link appear here newest first.</p>
        </div>
        <Link className="button" href="/admin/check-ins/sign">QR Sign / Export</Link>
      </div>

      {error ? <p role="alert">The queue is unavailable until the check-in migration is deployed.</p> : null}
      {!error && !checkins?.length ? <p>No check-ins yet.</p> : null}

      <div style={{ display: "grid", gap: 14, marginTop: 24 }}>
        {checkins?.map((item) => (
          <article className="card" key={item.id}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
              <div>
                <h2 style={{ marginBottom: 6 }}>{item.customer_name}</h2>
                <p style={{ margin: 0 }}>Party: {item.party_size} · {new Date(item.checked_in_at).toLocaleString()}</p>
                {item.phone ? <p style={{ margin: "6px 0 0" }}>Phone: {item.phone}</p> : null}
                {item.appointment_reference ? <p style={{ margin: "6px 0 0" }}>Appointment: {item.appointment_reference}</p> : null}
              </div>
              <form action={updateStatus} style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <input type="hidden" name="id" value={item.id} />
                <select name="status" defaultValue={item.status}>
                  {statuses.map((status) => <option key={status} value={status}>{status}</option>)}
                </select>
                <button type="submit" className="button">Update</button>
              </form>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
