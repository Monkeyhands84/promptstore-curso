import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { requireUser, AuthError } from "@/lib/auth";

const MAX_SIZE_BYTES = 2 * 1024 * 1024;

function sanitizeFilename(name: string): string {
  const base = name.replace(/[^\w.\-]+/g, "-").replace(/-+/g, "-");
  return base.replace(/^-+|-+$/g, "") || "archivo";
}

export async function POST(req: Request) {
  let user;
  try {
    ({ user } = await requireUser());
  } catch (e) {
    if (e instanceof AuthError) {
      return NextResponse.json({ error: e.message }, { status: 401 });
    }
    console.error("[api:blob-upload:auth]", e);
    return NextResponse.json(
      { error: "No se pudo procesar la subida." },
      { status: 500 },
    );
  }

  let formData: FormData;
  try {
    formData = await req.formData();
  } catch (e) {
    console.error("[api:blob-upload:formdata]", e);
    return NextResponse.json(
      { error: "No se pudo leer el formulario." },
      { status: 400 },
    );
  }

  const fileEntry = formData.get("file");
  if (!fileEntry || !(fileEntry instanceof File)) {
    return NextResponse.json(
      { error: "Debes adjuntar un archivo en el campo 'file'." },
      { status: 400 },
    );
  }

  if (fileEntry.size === 0) {
    return NextResponse.json(
      { error: "El archivo está vacío." },
      { status: 400 },
    );
  }

  if (fileEntry.size > MAX_SIZE_BYTES) {
    return NextResponse.json(
      { error: "El archivo supera el límite de 2 MB." },
      { status: 413 },
    );
  }

  const originalName = fileEntry.name || "archivo";
  const safeName = sanitizeFilename(originalName);
  const pathname = `promptstore-uploads/${user.id}/${Date.now()}-${safeName}`;

  try {
    const blob = await put(pathname, fileEntry, {
      access: "public",
      contentType: fileEntry.type || undefined,
    });

    return NextResponse.json({
      url: blob.url,
      pathname: blob.pathname,
      filename: originalName,
    });
  } catch (e) {
    console.error("[api:blob-upload:put]", e);
    return NextResponse.json(
      { error: "No se pudo subir el archivo a Vercel Blob." },
      { status: 500 },
    );
  }
}
