import { createHmac } from "node:crypto";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";
const clean = (v: unknown, n: number) => typeof v === "string" ? v.trim().slice(0, n) : "";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const name = clean(body.name, 120), phone = clean(body.phone, 40), email = clean(body.email, 180).toLowerCase();
    const date = clean(body.date, 10), time = clean(body.time, 8), serviceId = clean(body.serviceId, 50), notes = clean(body.notes, 1000);
    if (!name || !phone || !date || !time || !serviceId || (email && !/^\S+@\S+\.\S+$/.test(email))) return Response.json({ message: "Please complete the required appointment details." }, { status: 400 });
    const supabase = createAdminClient();
    const secret = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown";
    const hash = createHmac("sha256", secret).update(ip).digest("hex");
    const { data: allowed, error: limitError } = await supabase.rpc("check_submission_rate_limit", { p_endpoint: "appointments", p_identifier_hash: hash, p_limit: 8, p_window_seconds: 3600 });
    if (limitError || !allowed) return Response.json({ message: limitError ? "Booking is temporarily unavailable." : "Too many booking attempts. Please try again later." }, { status: limitError ? 503 : 429 });
    const { data, error } = await supabase.rpc("create_public_appointment", { p_customer_name: name, p_phone: phone, p_email: email || null, p_appointment_date: date, p_appointment_time: time, p_service_id: serviceId, p_notes: notes || null });
    if (error) throw error;
    const appointment = Array.isArray(data) ? data[0] : data;
    return Response.json({ message: "Your appointment request was received.", appointment }, { status: 201 });
  } catch (error) {
    console.error("Appointment submission failed", error);
    return Response.json({ message: "We could not submit your appointment. Please try again." }, { status: 500 });
  }
}
