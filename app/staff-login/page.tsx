import type {Metadata} from "next";
import {StaffLoginForm} from "@/components/StaffLoginForm";
export const metadata:Metadata={title:"Staff Sign In | Kim's Nails",robots:{index:false,follow:false}};
export default async function StaffLoginPage({ searchParams }: PageProps<"/staff-login">){const params=await searchParams;return <main className="booking-page shell"><div><p className="eyebrow">Kim&apos;s Nails</p><h1>Studio<br/><em>operations.</em></h1><p>This area is for authorized salon staff.</p></div><StaffLoginForm error={typeof params.error === "string" ? params.error : undefined}/></main>}
