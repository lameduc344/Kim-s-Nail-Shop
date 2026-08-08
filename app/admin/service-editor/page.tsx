import type {Metadata} from "next";
import {redirect} from "next/navigation";
import {ServiceManager} from "@/components/ServiceManager";
import {createClient} from "@/lib/supabase/server";
import {createAdminClient} from "@/lib/supabase/admin";
export const metadata:Metadata={title:"Service Editor | Kim's Nails",robots:{index:false,follow:false}};
export default async function ServiceEditor(){const c=await createClient();const {data:{user}}=await c.auth.getUser();if(!user)redirect("/staff-login");const db=createAdminClient();const {data}=await db.from("salon_services").select("id,category,name,base_price_cents,price_label,duration_minutes,active").order("sort_order");return <main className="shell"><div className="section-heading"><p className="eyebrow">Studio operations</p><h1>Service Editor</h1><p>Changes here feed the booking and check-in system and remain POS-ready.</p></div><ServiceManager initial={data||[]}/></main>}
