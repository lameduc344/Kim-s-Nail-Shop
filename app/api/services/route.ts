import { createAdminClient } from "@/lib/supabase/admin";

export async function GET() {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase.from("salon_services").select("id,category,name,description,duration_minutes,price_label,base_price_cents").eq("active", true).order("sort_order");
    if (error) throw error;
    return Response.json({ services: data }, { headers: { "Cache-Control": "public, max-age=300" } });
  } catch (error) {
    console.error("Service catalog failed", error);
    return Response.json({ message: "Services are temporarily unavailable." }, { status: 503 });
  }
}
