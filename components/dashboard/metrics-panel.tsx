"use client";

import { useState } from "react";
import { Btn } from "@/components/ui/btn";
import type { DashboardMetrics } from "@/app/api/dashboard-metrics/route";

type MetricCard = {
  label: string;
  value: number;
  hint: string;
};

function buildCards(m: DashboardMetrics): MetricCard[] {
  return [
    { label: "Total de prompts", value: m.totalPrompts, hint: "En tu cuenta" },
    { label: "Favoritos", value: m.favoritePrompts, hint: "Marcados ★" },
    { label: "Públicos", value: m.publicPrompts, hint: "Compartidos" },
    {
      label: "Usos de IA (24 h)",
      value: m.aiUsageLast24h,
      hint: "Llamadas recientes",
    },
  ];
}

export function DashboardMetricsPanel() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadMetrics = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/dashboard-metrics", {
        cache: "no-store",
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json?.error ?? "No se pudieron cargar las métricas.");
        return;
      }
      setMetrics(json as DashboardMetrics);
    } catch (e) {
      console.error("[metrics-panel] fetch failed", e);
      setError("Error de red al cargar las métricas.");
    } finally {
      setLoading(false);
    }
  };

  const cards = metrics ? buildCards(metrics) : null;

  return (
    <section
      aria-label="Métricas del dashboard"
      style={{
        marginBottom: 20,
        padding: 16,
        border: "1px solid var(--border-2)",
        borderRadius: "var(--r-md)",
        background: "var(--bg-2)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          marginBottom: cards || error ? 14 : 0,
          flexWrap: "wrap",
        }}
      >
        <div>
          <h3 style={{ fontSize: 15, fontWeight: 600, margin: 0 }}>
            Métricas
          </h3>
          <p
            style={{
              fontSize: 12,
              color: "var(--text-3)",
              marginTop: 2,
            }}
          >
            Resumen rápido de tu actividad.
          </p>
        </div>
        <Btn
          variant="secondary"
          size="sm"
          onClick={loadMetrics}
          disabled={loading}
        >
          {loading
            ? "Cargando…"
            : metrics
              ? "Actualizar"
              : "Cargar métricas"}
        </Btn>
      </div>

      {error && (
        <p
          role="alert"
          style={{
            fontSize: 13,
            color: "oklch(40% 0.18 25)",
            margin: 0,
          }}
        >
          {error}
        </p>
      )}

      {cards && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
            gap: 10,
          }}
        >
          {cards.map((c) => (
            <div
              key={c.label}
              style={{
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
                {c.label}
              </p>
              <p
                style={{
                  fontSize: 22,
                  fontWeight: 600,
                  margin: "4px 0 2px",
                  color: "var(--text-1)",
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {c.value}
              </p>
              <p
                style={{
                  fontSize: 11,
                  color: "var(--text-3)",
                  margin: 0,
                }}
              >
                {c.hint}
              </p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
