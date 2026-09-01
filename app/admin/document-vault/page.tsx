import { revalidatePath } from "next/cache";
import { requireAdminAccess } from "@/lib/admin/access";
import { createAdminClient } from "@/lib/supabase/admin";

const categories = ["licenses", "insurance", "leases", "staff", "vendors", "tax", "policies", "other"] as const;
const allowedTypes = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "image/jpeg",
  "image/png",
]);

async function uploadDocument(formData: FormData) {
  "use server";
  const access = await requireAdminAccess();
  const file = formData.get("file");
  const title = String(formData.get("title") || "").trim().slice(0, 140);
  const description = String(formData.get("description") || "").trim().slice(0, 1000);
  const category = String(formData.get("category") || "other");

  if (!(file instanceof File) || !title || !categories.includes(category as (typeof categories)[number])) return;
  if (!allowedTypes.has(file.type) || file.size <= 0 || file.size > 10 * 1024 * 1024) return;

  const admin = createAdminClient();
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]+/g, "-").slice(-120) || "document";
  const path = `${category}/${crypto.randomUUID()}-${safeName}`;
  const bytes = new Uint8Array(await file.arrayBuffer());

  const { error: uploadError } = await admin.storage.from("document-vault").upload(path, bytes, {
    contentType: file.type,
    upsert: false,
  });
  if (uploadError) return;

  const { error: insertError } = await admin.from("document_vault").insert({
    category,
    title,
    description: description || null,
    file_path: path,
    filename: file.name,
    mime_type: file.type,
    file_size: file.size,
    uploaded_by: access.user.id,
  });

  if (insertError) await admin.storage.from("document-vault").remove([path]);
  revalidatePath("/admin/document-vault");
}

async function deleteDocument(formData: FormData) {
  "use server";
  await requireAdminAccess();
  const id = String(formData.get("id") || "");
  if (!id) return;
  const admin = createAdminClient();
  const { data } = await admin.from("document_vault").select("file_path").eq("id", id).maybeSingle();
  if (!data?.file_path) return;
  await admin.storage.from("document-vault").remove([data.file_path]);
  await admin.from("document_vault").delete().eq("id", id);
  revalidatePath("/admin/document-vault");
}

export default async function DocumentVaultPage() {
  await requireAdminAccess();
  const admin = createAdminClient();
  const { data: documents, error } = await admin
    .from("document_vault")
    .select("id,category,title,description,file_path,filename,mime_type,file_size,created_at")
    .order("created_at", { ascending: false });

  const withLinks = await Promise.all((documents || []).map(async (document) => {
    const { data } = await admin.storage.from("document-vault").createSignedUrl(document.file_path, 600);
    return { ...document, signedUrl: data?.signedUrl || null };
  }));

  return (
    <main className="shell" style={{ paddingTop: 36, paddingBottom: 72 }}>
      <p className="eyebrow">Private Records</p>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 16, alignItems: "flex-start", flexWrap: "wrap" }}>
        <div>
          <h1>Document Vault</h1>
          <p>Store salon records in a private bucket. Download links expire after 10 minutes.</p>
        </div>
        <a className="button" href="/api/admin/document-vault/export?category=all">Export All as ZIP</a>
      </div>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 16 }}>
        {categories.map((category) => (
          <a key={category} href={`/api/admin/document-vault/export?category=${category}`} className="text-link">Export {category} ZIP</a>
        ))}
      </div>
      <p style={{ marginTop: 12 }}>ZIP exports include the original files plus a manifest.csv. Large archives over 75 MB must be exported by category.</p>

      <form action={uploadDocument} className="card" style={{ display: "grid", gap: 14, marginTop: 24 }}>
        <h2>Add document</h2>
        <label>Title<input name="title" required maxLength={140} /></label>
        <label>Category<select name="category" defaultValue="other">{categories.map((category) => <option key={category} value={category}>{category}</option>)}</select></label>
        <label>Description<textarea name="description" maxLength={1000} rows={3} /></label>
        <label>File<input name="file" type="file" required accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png" /></label>
        <p>Maximum 10 MB. PDF, Word, Excel, JPG, or PNG.</p>
        <button type="submit" className="button">Upload to Vault</button>
      </form>

      {error ? <p role="alert" style={{ marginTop: 24 }}>The Vault is unavailable until its database migration is deployed.</p> : null}
      <div style={{ display: "grid", gap: 14, marginTop: 24 }}>
        {withLinks.map((document) => (
          <article className="card" key={document.id}>
            <p className="eyebrow">{document.category}</p>
            <h2>{document.title}</h2>
            {document.description ? <p>{document.description}</p> : null}
            <p>{document.filename} · {(document.file_size / 1024 / 1024).toFixed(2)} MB</p>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              {document.signedUrl ? <a className="button" href={document.signedUrl} target="_blank" rel="noreferrer">Open</a> : null}
              <form action={deleteDocument}>
                <input type="hidden" name="id" value={document.id} />
                <button type="submit">Delete</button>
              </form>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
