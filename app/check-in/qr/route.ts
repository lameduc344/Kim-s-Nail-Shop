import {NextResponse} from "next/server";
export function GET(request:Request){return NextResponse.redirect(new URL("/check-in",request.url),307);}
