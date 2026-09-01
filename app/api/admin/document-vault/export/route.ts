import { NextResponse } from "next/server";
import { getAdminAccess } from "@/lib/admin/access";
import { createAdminClient } from "@/lib/supabase/admin";
import { createZip } from "@/lib/archive/zip";

const MAX_EXPORT_BYTES = 75 * 1024 * 1024;

export async function GET(request: Request) {
  const access = await getAdminAccess();
  if (!access) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const url = new URL(request.url);
  const category = url.searchParams.get("category")?.trim() || "";
  const admin = createAdminClient();
  let query = admin.from("document_vault")
    .select("category,title,file_path,filename,file_size,created_at")
    .order("created_at", { ascending: true });
  if (category && category !== "all") query = query.eq("category", category);

  const { data: documents, error } = await query;
  if (error) return NextResponse.json({ error: "Vault export unavailable" }, { status: 500 });
  if (!documents?.length) return NextResponse.json({ error: "No documents to export" }, { status: 404 });

  const total = documents.reduce((sum, doc) => sum + Number(doc.file_size || 0), 0);
  if (total > MAX_EXPORT_BYTES) {
    return NextResponse.json({ error: "Export exceeds 75 MB. Export by category or reduce the selection." }, { status: 413 });
  }

  const files: Array<{ name: string; data: Uint8Array }> = [];
  const manifestRows = ["category,title,filename,created_at"];

  for (const document of documents) {
    const { data, error: downloadError } = await admin.storage.from("document-vault").download(document.file_path);
    if (downloadError || !data) continue;
    const bytes = new Uint8Array(await data.arrayBuffer());
    const safeCategory = String(document.category).replace(/[^a-zA-Z0-9_-]+/g, "-");
    const safeName = String(document.filename).replace(/[\\/]+/g, "-");
    files.push({ name: `${safeCategory}/${safeName}`, data: bytes });
    const csv = [document.category, document.title, document.filename, document.created_at]
      .map((value) => `"${String(value ?? "").replace(/"/g, '""')}"`).join(",");
    manifestRows.push(csv);
  }

  files.push({ name: "manifest.csv", data: new TextEncoder().encode(manifestRows.join("\n")) });
  const zip = createZip(files);
  const suffix = category && category !== "all" ? `-${category}` : "-all";

  return new Response(zip, {
    headers: {
      "content-type": "application/zip",
      "content-disposition": `attachment; filename="kims-nails-business-docs${suffix}-${new Date().toISOString().slice(0, 10)}.zip"`,
      "cache-control": "no-store",
    },
  });
}
