"use client";

import { useRef, useState, type ChangeEvent } from "react";
import { Btn } from "@/components/ui/btn";

type UploadResult = {
  url: string;
  pathname: string;
  filename: string;
};

const MAX_SIZE_BYTES = 2 * 1024 * 1024;

export function BlobUploadPanel() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<UploadResult | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const next = e.target.files?.[0] ?? null;
    setFile(next);
    setError(null);
    setResult(null);
  };

  const onUpload = async () => {
    if (!file) {
      setError("Selecciona un archivo primero.");
      return;
    }
    if (file.size > MAX_SIZE_BYTES) {
      setError("El archivo supera el límite de 2 MB.");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/blob-upload", {
        method: "POST",
        body: formData,
      });
      const json = await res.json();

      if (!res.ok) {
        setError(json?.error ?? "No se pudo subir el archivo.");
        return;
      }

      setResult(json as UploadResult);
      setFile(null);
      if (inputRef.current) inputRef.current.value = "";
    } catch (e) {
      console.error("[blob-upload-panel] fetch failed", e);
      setError("Error de red al subir el archivo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      aria-label="Subir archivo de apoyo"
      style={{
        marginBottom: 20,
        padding: 16,
        border: "1px solid var(--border-2)",
        borderRadius: "var(--r-md)",
        background: "var(--bg-2)",
      }}
    >
      <div style={{ marginBottom: 14 }}>
        <h3 style={{ fontSize: 15, fontWeight: 600, margin: 0 }}>
          Archivo de apoyo
        </h3>
        <p
          style={{
            fontSize: 12,
            color: "var(--text-3)",
            marginTop: 2,
          }}
        >
          Sube un archivo (máx. 2 MB) a Vercel Blob.
        </p>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          flexWrap: "wrap",
        }}
      >
        <input
          ref={inputRef}
          type="file"
          onChange={onFileChange}
          disabled={loading}
          style={{
            fontSize: 13,
            color: "var(--text-2)",
            fontFamily: "var(--sans)",
          }}
        />
        <Btn
          variant="primary"
          size="sm"
          onClick={onUpload}
          disabled={loading || !file}
        >
          {loading ? "Subiendo…" : "Subir archivo"}
        </Btn>
      </div>

      {error && (
        <p
          role="alert"
          style={{
            fontSize: 13,
            color: "oklch(40% 0.18 25)",
            margin: "12px 0 0",
          }}
        >
          {error}
        </p>
      )}

      {result && (
        <div
          style={{
            marginTop: 14,
            padding: "12px 14px",
            borderRadius: "var(--r-sm)",
            background: "var(--bg-1)",
            border: "1px solid var(--border-2)",
          }}
        >
          <p
            style={{
              fontSize: 12,
              color: "var(--text-3)",
              margin: 0,
            }}
          >
            Archivo subido
          </p>
          <p
            style={{
              fontSize: 14,
              fontWeight: 500,
              margin: "4px 0 8px",
              color: "var(--text-1)",
              wordBreak: "break-all",
            }}
          >
            {result.filename}
          </p>
          <a
            href={result.url}
            target="_blank"
            rel="noreferrer noopener"
            style={{
              fontSize: 13,
              color: "var(--accent)",
              textDecoration: "underline",
            }}
          >
            Abrir archivo subido
          </a>
        </div>
      )}
    </section>
  );
}
