import { NextResponse } from "next/server";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  const body = await request.json().catch(() => null) as { email?: unknown; consent?: unknown } | null;
  const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";

  if (!emailPattern.test(email) || body?.consent !== true) {
    return NextResponse.json({ message: "Enter a valid email and confirm newsletter consent." }, { status: 400 });
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    return NextResponse.json({ message: "VIP signups are being set up. Please call the studio to join for now." }, { status: 503 });
  }

  const response = await fetch(`${supabaseUrl}/rest/v1/vip_subscribers?on_conflict=email`, {
    method: "POST",
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      "Content-Type": "application/json",
      Prefer: "resolution=merge-duplicates,return=minimal",
    },
    body: JSON.stringify({ email, marketing_consent: true, source: "website", subscribed_at: new Date().toISOString(), unsubscribed_at: null }),
  });

  if (!response.ok) {
    return NextResponse.json({ message: "We couldn’t save your email right now. Please try again shortly." }, { status: 500 });
  }

  return NextResponse.json({ message: "You’re on the list—welcome to the inner circle." });
}
