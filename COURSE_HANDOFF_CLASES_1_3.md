# Handoff Curso Vercel (Clases 1 a 5)

Fecha de cierre actualizado: 2026-05-13

## Estado general
- Proyecto del curso: `promptstore-curso`
- Equipo Vercel: `Brunx's projects`
- Proyecto Vercel: `promptstore-curso`
- Repositorio GitHub conectado y funcionando con despliegue automático.

## Clase 1 (grabada)
Tema: primer deploy en Vercel.

Se cubrió:
- Qué es Vercel (intro en landing).
- App en local.
- Subida a GitHub.
- Conexión GitHub -> Vercel.
- Primer deploy real.

Notas:
- Hubo problemas iniciales con remoto Git (`origin` duplicado / URL mal escrita), ya resueltos.

## Clase 2 (grabada)
Tema: GitHub y deploys automáticos.

Se cubrió:
- Flujo commit/push/deploy automático.
- Cambio desde VS Code y cambio desde GitHub web.
- Concepto de rollback.

Notas:
- Se decidió priorizar flujo práctico y menos terminal para no complicar a alumnos.

## Clase 3 (grabada)
Tema: variables de entorno y seguridad.

Se cubrió:
- Diferencia entre variables públicas (`NEXT_PUBLIC_*`) y privadas.
- Demo de exposición en frontend al usar prefijo público.
- Corrección para ocultar clave sensible.
- Gestión de variables en Vercel + redeploy.
- Banner de mantenimiento activable por variable.

Problemas que aparecieron y solución final:
- Había una variable mal escrita en Vercel: `EXT_PUBLIC_MAINTENANCE_MODE` (incorrecta).
- Se corrigió a `NEXT_PUBLIC_MAINTENANCE_MODE`.
- También hubo variables con valor vacío en Production; se sobreescribieron correctamente.
- Se forzó deploy de producción después de corregir variables.

## Estado de código relevante
Archivo:
- `components/marketing/hero.tsx`

Incluye lógica de banner con:
- `process.env.NEXT_PUBLIC_MAINTENANCE_MODE === "true"`
- `process.env.NEXT_PUBLIC_MAINTENANCE_MESSAGE`

Banner se muestra si modo mantenimiento = `true`.

## Variables importantes (conceptuales)
- `NEXT_PUBLIC_MAINTENANCE_MODE` (pública, control visual)
- `NEXT_PUBLIC_MAINTENANCE_MESSAGE` (pública, texto visual)
- Variables sensibles (ej. `OPENAI_API_KEY`) deben ir sin `NEXT_PUBLIC_` y usarse solo en servidor.

## Decisiones didácticas cerradas
- Mantener clases muy prácticas y visuales.
- Minimizar terminal (solo imprescindible).
- No adelantar contenido de logs/debugging profundo antes de la clase 5.
- Si una parte se enreda, se corta y se pasa limpia a la siguiente clase.

## Clase 4 (grabada)
Tema: Functions y Server Actions en Vercel.

Se cubrió:
- Diferencia práctica entre API Route y Server Action.
- Creación de una API Route real: `/api/dashboard-metrics`.
- Consulta de métricas reales desde Supabase:
  - total de prompts,
  - favoritos,
  - públicos,
  - usos de IA en últimas 24h.
- Creación de un panel visual de métricas en el dashboard.
- Despliegue y visualización en Vercel > Deployment > Resources.
- Explicación de cómo `/api/dashboard-metrics` aparece como Function.
- Explicación de Server Actions ya existentes en:
  - `lib/actions/prompts.ts`
  - `lib/actions/ai.ts`

Archivos creados/modificados:
- `app/api/dashboard-metrics/route.ts`
- `components/dashboard/metrics-panel.tsx`
- `components/dashboard-list.tsx`

Notas didácticas:
- El ejemplo funcionó bien porque usó datos reales de Supabase.
- Reforzar en futuras clases: decir "API Route" o "ruta de API", no "API root".
- La explicación de Resources fue clara y visual.

## Clase 5 (grabada)
Tema: Logs y debugging real.

Se cubrió:
- Dónde ver logs en Vercel.
- Qué significan estados como `200`, `303`, `401`, `500`.
- Logs normales de una app funcionando.
- Provocar un fallo controlado en la Function `/api/dashboard-metrics`.
- Ver el error en la app.
- Ver el error en Vercel Logs.
- Usar `Live` en Vercel Logs para ver eventos recientes.
- Interpretar:
  - ruta afectada,
  - status `500`,
  - mensaje de `console.error`,
  - detalle lateral del log,
  - Firewall,
  - Middleware,
  - Function Invocation.
- Corregir el fallo con ayuda de IA.
- Redeploy y ver que las métricas vuelven a funcionar.

Errores/control de la demo:
- Primer intento: cambiar `.from("ai_usage")` por `.from("ai_usage_error_demo")`.
- No generó el fallo visible esperado en la UI.
- Solución didáctica: añadir fallo controlado explícito:
  - `console.error("[demo-logs] Fallo controlado en dashboard-metrics para la clase 5");`
  - respuesta `500` con `{ error: "Fallo controlado para probar logs en Vercel." }`
- Luego se corrigió y se hizo commit final.

Últimos commits relevantes:
- `e1dcf78 añadir métricas desde función de servidor`
- `07b9509 provocar error controlado en métricas`
- `e0af458 provocar error 500 controlado en métricas`
- `d517e25 Cambio ai_usage por ai_usage_error_demo`
- `76d598f Dbuging`

Estado actual:
- Repo limpio tras clase 5.
- El error controlado fue corregido.
- Las métricas vuelven a cargar correctamente.
- Proyecto Vercel sigue conectado a GitHub y deploy automático.

## Decisiones para próximas clases
- Seguir con clases prácticas y visuales.
- Si Vercel Logs no muestra algo en histórico, activar botón `Live` y reproducir el fallo en directo.
- Evitar depender de errores inciertos; provocar fallos controlados y reversibles.
- Mantener el patrón: reproducir -> observar en Vercel -> interpretar -> corregir -> redeploy -> verificar.

## Punto exacto para retomar (Clase 6)
Siguiente tema del temario:
- Clase 6 — Storage e integraciones.

Objetivo recomendado:
- Hacer una práctica con una integración o storage que sea visual y aplicable a PromptStore.
- Evitar complejidad enterprise.
- Elegir un caso sencillo y realista antes de grabar.

Ideas posibles:
- Vercel Blob para subir/guardar un archivo asociado a un prompt.
- Integración de Storage desde Marketplace si encaja.
- Explicar Storage como "el lugar donde guardamos archivos que no son simplemente filas de base de datos".

## Checklist previo antes de grabar siguiente clase (5 min)
1. Confirmar que estás en repo `promptstore-curso`.
2. Confirmar proyecto Vercel correcto (`promptstore-curso`).
3. Ver que la app carga en local y en URL de Vercel.
4. Confirmar objetivo único de la clase (sin mezclar subtemas).
5. Hacer una prueba en seco (sin grabar) del flujo completo.
