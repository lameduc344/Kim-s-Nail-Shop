import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

const MAX_NAME = 100;
const MAX_PHONE = 40;
const MAX_REFERENCE = 100;

function clean(value: FormDataEntryValue | null, max: number) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function normalizePhone(value: string) {
  return value.replace(/\D+/g, "");
}

export async function POST(request: Request) {
  const form = await request.formData();
  const customerName = clean(form.get("customer_name"), MAX_NAME);
  const phone = clean(form.get("phone"), MAX_PHONE);
  const appointmentReference = clean(form.get("appointment_reference"), MAX_REFERENCE);
  const partySizeRaw = clean(form.get("party_size"), 2);
  const partySize = Math.min(12, Math.max(1, Number.parseInt(partySizeRaw || "1", 10) || 1));

  if (customerName.length < 2) {
    return NextResponse.redirect(new URL("/check-in?error=name", request.url), 303);
  }

  try {
    const admin = createAdminClient();
    const now = new Date().toISOString();
    const normalizedPhone = normalizePhone(phone);

    if (normalizedPhone.length >= 7) {
      const { data: existing } = await admin.from("salon_customers")
        .select("id,visit_count")
        .eq("phone_normalized", normalizedPhone)
        .maybeSingle();

      if (existing) {
        await admin.from("salon_customers").update({
          full_name: customerName,
          phone,
          visit_count: Number(existing.visit_count || 0) + 1,
          last_visit_at: now,
          updated_at: now,
        }).eq("id", existing.id);
      } else {
        await admin.from("salon_customers").insert({
          full_name: customerName,
          phone,
          visit_count: 1,
          last_visit_at: now,
          source: "qr",
        });
      }
    }

    const { error } = await admin.from("salon_checkins").insert({
      customer_name: customerName,
      phone: phone || null,
      appointment_reference: appointmentReference || null,
      party_size: partySize,
      source: "qr",
    });

    if (error) throw error;
    return NextResponse.redirect(new URL("/check-in?success=1", request.url), 303);
  } catch {
    return NextResponse.redirect(new URL("/check-in?error=server", request.url), 303);
  }
}
