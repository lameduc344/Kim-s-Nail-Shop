import type {Metadata} from "next";
import {redirect} from "next/navigation";
import {createClient} from "@/lib/supabase/server";
import {createAdminClient} from "@/lib/supabase/admin";
export const metadata:Metadata={title:"Service Manager | Kim's Nails",robots:{index:false,follow:false}};
export default async function ServiceAdmin(){const userClient=await createClient();const {data:{user}}=await userClient.auth.getUser();if(!user)redirect("/staff-login");const db=createAdminClient();const {data}=await db.from("salon_services").select("id,category,name,price_label,duration_minutes,active").order("sort_order");return <main className="shell"><div className="section-heading"><p className="eyebrow">Studio operations</p><h1>Service Manager</h1><p>The database catalog is now the integration point for booking, check-in, admin, and a future POS connection.</p></div><div className="admin-board">{data?.map(s=><article className="checkin-card" key={s.id}><p className="eyebrow">{s.category}</p><h3>{s.name}</h3><p>{s.price_label} · {s.duration_minutes} min · {s.active?"Active":"Hidden"}</p></article>)}</div></main>}
