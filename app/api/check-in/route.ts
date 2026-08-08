import { createHmac } from "node:crypto";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";
const clean = (v: unknown, n: number) => typeof v === "string" ? v.trim().slice(0, n) : "";

async function limited(request: Request, endpoint: string, limit: number) {
  const supabase = createAdminClient(), secret = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown";
  const hash = createHmac("sha256", secret).update(ip).digest("hex");
  const { data, error } = await supabase.rpc("check_submission_rate_limit", { p_endpoint: endpoint, p_identifier_hash: hash, p_limit: limit, p_window_seconds: 3600 });
  return !error && Boolean(data);
}

export async function POST(request: Request) {
  try {
    if (!(await limited(request, "check-in", 20))) return Response.json({ message: "Too many check-in attempts. Please ask the front desk for help." }, { status: 429 });
    const body = await request.json(), action = clean(body.action, 20), phone = clean(body.phone, 40), code = clean(body.code, 12).toUpperCase();
    const supabase = createAdminClient();
    if (action === "lookup") {
      if (!phone) return Response.json({ message: "Enter the phone number used for your appointment." }, { status: 400 });
      const { data, error } = await supabase.rpc("find_today_appointment", { p_phone: phone, p_code: code || null });
      if (error) throw error;
      const appointment = Array.isArray(data) ? data[0] : data;
      return appointment ? Response.json({ appointment }) : Response.json({ message: "We could not find today's appointment. You can join as a walk-in or ask the front desk." }, { status: 404 });
    }
    if (action === "confirm") {
      const appointmentId = clean(body.appointmentId, 50);
      const { data, error } = await supabase.rpc("check_in_appointment", { p_appointment_id: appointmentId, p_phone: phone, p_code: code || null });
      if (error || !data) return Response.json({ message: "We could not verify that appointment." }, { status: 400 });
      return Response.json({ message: "You're checked in. Please have a seat." });
    }
    if (action === "walk-in") {
      const name = clean(body.name, 120), serviceId = clean(body.serviceId, 50);
      if (!name || !phone || !serviceId) return Response.json({ message: "Please enter your name, phone number, and service." }, { status: 400 });
      const { data, error } = await supabase.rpc("create_walk_in", { p_customer_name: name, p_phone: phone, p_service_id: serviceId });
      if (error) throw error;
      return Response.json({ message: "You're on the walk-in list. Please have a seat.", appointment: Array.isArray(data) ? data[0] : data }, { status: 201 });
    }
    return Response.json({ message: "Invalid check-in request." }, { status: 400 });
  } catch (error) {
    console.error("Check-in failed", error);
    return Response.json({ message: "Check-in is temporarily unavailable. Please see the front desk." }, { status: 500 });
  }
}
