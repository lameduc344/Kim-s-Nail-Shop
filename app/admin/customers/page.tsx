import { revalidatePath } from "next/cache";
import { requireAdminAccess } from "@/lib/admin/access";
import { createAdminClient } from "@/lib/supabase/admin";

function clean(value: FormDataEntryValue | null, max: number) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

async function saveCustomer(formData: FormData) {
  "use server";
  await requireAdminAccess();
  const id = clean(formData.get("id"), 80);
  const fullName = clean(formData.get("full_name"), 100);
  const phone = clean(formData.get("phone"), 40);
  const email = clean(formData.get("email"), 160);
  const preferredTechnician = clean(formData.get("preferred_technician"), 100);
  const notes = clean(formData.get("notes"), 2000);
  const tags = clean(formData.get("tags"), 300).split(",").map((tag) => tag.trim()).filter(Boolean).slice(0, 20);
  if (!id || !fullName) return;

  const admin = createAdminClient();
  await admin.from("salon_customers").update({
    full_name: fullName,
    phone: phone || null,
    email: email || null,
    preferred_technician: preferredTechnician || null,
    notes: notes || null,
    tags,
    updated_at: new Date().toISOString(),
  }).eq("id", id);
  revalidatePath("/admin/customers");
}

export default async function CustomersPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  await requireAdminAccess();
  const params = await searchParams;
  const q = typeof params.q === "string" ? params.q.trim().slice(0, 100) : "";
  const admin = createAdminClient();

  let query = admin.from("salon_customers")
    .select("id,full_name,phone,email,preferred_technician,notes,tags,visit_count,last_visit_at,updated_at")
    .order("updated_at", { ascending: false })
    .limit(100);

  if (q) {
    const escaped = q.replace(/[%,]/g, "");
    query = query.or(`full_name.ilike.%${escaped}%,phone.ilike.%${escaped}%,email.ilike.%${escaped}%,notes.ilike.%${escaped}%`);
  }

  const { data: customers, error } = await query;

  return (
    <main className="shell" style={{ paddingTop: 36, paddingBottom: 72 }}>
      <p className="eyebrow">Customer Desk</p>
      <h1>Customers</h1>
      <p>Search by name, phone, email, or notes, then update the customer directly.</p>

      <form method="get" style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 20 }}>
        <input name="q" defaultValue={q} placeholder="Search customers…" aria-label="Search customers" style={{ minWidth: 280 }} />
        <button type="submit" className="button">Search</button>
        <a className="button" href="/api/admin/customers/export">Export CSV</a>
      </form>

      {error ? <p role="alert" style={{ marginTop: 24 }}>Customer records are unavailable until the CRM migration is deployed.</p> : null}
      {!error && !customers?.length ? <p style={{ marginTop: 24 }}>No matching customers.</p> : null}

      <div style={{ display: "grid", gap: 14, marginTop: 24 }}>
        {customers?.map((customer) => (
          <form action={saveCustomer} className="card" key={customer.id} style={{ display: "grid", gap: 12 }}>
            <input type="hidden" name="id" value={customer.id} />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 12 }}>
              <label>Name<input name="full_name" required defaultValue={customer.full_name} /></label>
              <label>Phone<input name="phone" defaultValue={customer.phone || ""} /></label>
              <label>Email<input name="email" type="email" defaultValue={customer.email || ""} /></label>
              <label>Preferred technician<input name="preferred_technician" defaultValue={customer.preferred_technician || ""} /></label>
            </div>
            <label>Tags<input name="tags" defaultValue={(customer.tags || []).join(", ")} placeholder="VIP, acrylic, pedicure" /></label>
            <label>Notes<textarea name="notes" rows={3} defaultValue={customer.notes || ""} /></label>
            <p style={{ margin: 0 }}>Visits: {customer.visit_count} · Last visit: {customer.last_visit_at ? new Date(customer.last_visit_at).toLocaleString() : "Not recorded yet"}</p>
            <button type="submit" className="button">Save Customer</button>
          </form>
        ))}
      </div>
    </main>
  );
}
