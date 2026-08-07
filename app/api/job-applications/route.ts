import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";
const BUCKET = "job-application-files";
const MAX_FILE_SIZE = 4 * 1024 * 1024;
const fileTypes = { pdf: "application/pdf", doc: "application/msword", docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" } as const;

function value(formData: FormData, key: string, maxLength: number) {
  const raw = formData.get(key);
  return typeof raw === "string" ? raw.trim().slice(0, maxLength) : "";
}
function hasValidSignature(bytes: Uint8Array, extension: keyof typeof fileTypes) {
  if (extension === "pdf") return bytes[0] === 0x25 && bytes[1] === 0x50 && bytes[2] === 0x44 && bytes[3] === 0x46;
  if (extension === "docx") return bytes[0] === 0x50 && bytes[1] === 0x4b;
  return bytes[0] === 0xd0 && bytes[1] === 0xcf && bytes[2] === 0x11 && bytes[3] === 0xe0;
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    if (value(formData, "website", 200)) return Response.json({ message: "Application received." });
    const fullName = value(formData, "fullName", 120), phone = value(formData, "phone", 40), email = value(formData, "email", 180).toLowerCase();
    const desiredRole = value(formData, "desiredRole", 120), experience = value(formData, "experience", 2500), licenseStatus = value(formData, "licenseStatus", 120);
    const availability = value(formData, "availability", 1000), portfolioUrl = value(formData, "portfolioUrl", 500), message = value(formData, "message", 2500);
    const resume = formData.get("resume");
    if (!fullName || !phone || !/^\S+@\S+\.\S+$/.test(email) || !desiredRole || !experience || !licenseStatus || !availability || !message) return Response.json({ message: "Please complete every required field." }, { status: 400 });
    if (portfolioUrl) { try { new URL(portfolioUrl); } catch { return Response.json({ message: "Please enter a complete portfolio URL." }, { status: 400 }); } }
    if (!(resume instanceof File) || resume.size === 0) return Response.json({ message: "Please attach your résumé." }, { status: 400 });
    if (resume.size > MAX_FILE_SIZE) return Response.json({ message: "Your résumé must be 4 MB or smaller." }, { status: 413 });
    const extension = resume.name.split(".").pop()?.toLowerCase() as keyof typeof fileTypes | undefined;
    if (!extension || !(extension in fileTypes) || resume.type !== fileTypes[extension]) return Response.json({ message: "Please upload a PDF, DOC, or DOCX file." }, { status: 400 });
    const bytes = new Uint8Array(await resume.arrayBuffer());
    if (!hasValidSignature(bytes, extension)) return Response.json({ message: "That file does not appear to be a valid PDF or Word document." }, { status: 400 });

    const supabaseUrl = process.env.SUPABASE_URL, serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!supabaseUrl || !serviceRoleKey) { console.error("Careers submission is missing server-side Supabase configuration."); return Response.json({ message: "Applications are temporarily unavailable. Please try again later." }, { status: 503 }); }
    const supabase = createClient(supabaseUrl, serviceRoleKey, { auth: { persistSession: false, autoRefreshToken: false } });
    const applicationId = crypto.randomUUID(), storagePath = `${applicationId}/resume.${extension}`;
    const { error: uploadError } = await supabase.storage.from(BUCKET).upload(storagePath, bytes, { contentType: fileTypes[extension], upsert: false });
    if (uploadError) throw uploadError;
    const { error: insertError } = await supabase.from("job_applications").insert({ id: applicationId, full_name: fullName, phone, email, desired_role: desiredRole, experience, license_status: licenseStatus, availability, portfolio_url: portfolioUrl || null, message, resume_path: storagePath, resume_filename: resume.name.slice(0, 255), resume_mime_type: fileTypes[extension], resume_size: resume.size, status: "new", source: "website" });
    if (insertError) { await supabase.storage.from(BUCKET).remove([storagePath]); throw insertError; }
    return Response.json({ message: "Thank you. Your application has been received." }, { status: 201 });
  } catch (error) {
    console.error("Job application submission failed", error);
    return Response.json({ message: "We could not send your application. Please try again." }, { status: 500 });
  }
}
