import type {Metadata} from "next";
import {redirect} from "next/navigation";
import {AdminTodayBoard} from "@/components/AdminTodayBoard";
import {createClient} from "@/lib/supabase/server";
export const metadata:Metadata={title:"Studio Admin | Kim's Nails",robots:{index:false,follow:false}};
export default async function AdminPage(){const supabase=await createClient();const {data:{user}}=await supabase.auth.getUser();if(!user)redirect("/staff-login");return <main><AdminTodayBoard/></main>}
