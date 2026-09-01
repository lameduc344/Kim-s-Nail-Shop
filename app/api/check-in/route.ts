import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

const MAX_NAME = 100;
const MAX_PHONE = 40;
const MAX_REFERENCE = 100;

function clean(value: FormDataEntryValue | null, max: number) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
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
