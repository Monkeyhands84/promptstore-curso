import { NextResponse } from "next/server";
import { requireUser, AuthError } from "@/lib/auth";

export type DashboardMetrics = {
  totalPrompts: number;
  favoritePrompts: number;
  publicPrompts: number;
  aiUsageLast24h: number;
};

export async function GET() {
  let user, supabase;
  try {
    ({ user, supabase } = await requireUser());
  } catch (e) {
    if (e instanceof AuthError) {
      return NextResponse.json({ error: e.message }, { status: 401 });
    }
    console.error("[api:dashboard-metrics:auth]", e);
    return NextResponse.json(
      { error: "No se pudieron cargar las métricas." },
      { status: 500 },
    );
  }

  const since24h = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

  console.error("[demo-logs] Fallo controlado en dashboard-metrics para la clase 5");

  return NextResponse.json(
    { error: "No se pudieron cargar las métricas." },
    { status: 500 },
  );


  const [totalRes, favoriteRes, publicRes, aiUsageRes] = await Promise.all([
    supabase
      .from("prompts")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id),
    supabase
      .from("prompts")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id)
      .eq("favorite", true),
    supabase
      .from("prompts")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id)
      .eq("public", true),
    supabase
      .from("ai_usage_error_demo")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id)
      .gte("created_at", since24h),
  ]);

  const firstError =
    totalRes.error || favoriteRes.error || publicRes.error || aiUsageRes.error;
  if (firstError) {
    console.error("[api:dashboard-metrics:query]", firstError);
    return NextResponse.json(
      { error: "No se pudieron cargar las métricas." },
      { status: 500 },
    );
  }

  const metrics: DashboardMetrics = {
    totalPrompts: totalRes.count ?? 0,
    favoritePrompts: favoriteRes.count ?? 0,
    publicPrompts: publicRes.count ?? 0,
    aiUsageLast24h: aiUsageRes.count ?? 0,
  };

  return NextResponse.json(metrics);
}
