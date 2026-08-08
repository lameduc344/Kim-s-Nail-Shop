import {createAdminClient} from "@/lib/supabase/admin";
export async function GET(){try{const db=createAdminClient();const {error}=await db.from("salon_services").select("id",{head:true,count:"exact"}).limit(1);if(error)throw error;return Response.json({ok:true,booking:true,checkIn:true,pos:"optional"});}catch{return Response.json({ok:false},{status:503});}}
