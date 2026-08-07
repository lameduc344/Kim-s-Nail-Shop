export async function POST() {
  return Response.json({ message: "VIP signups are temporarily paused while consent and opt-out controls are completed." }, { status: 503 });
}
