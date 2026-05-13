# Handoff Curso Vercel (Clases 1 a 3)

Fecha de cierre: 2026-05-12

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

## Punto exacto para retomar mañana (Clase 4)
Siguiente tema del temario:
- Clase 4 — Functions y Server Actions en Vercel.

Objetivo recomendado de arranque:
- Enseñar una Server Action o endpoint sencillo con efecto visible en UI.
- Mantener 1 flujo principal, corto, verificable.
- Evitar ramificaciones (preview/prod avanzado se deja para bloques concretos si aplica).

## Checklist previo antes de grabar Clase 4 (5 min)
1. Confirmar que estás en repo `promptstore-curso`.
2. Confirmar proyecto Vercel correcto (`promptstore-curso`).
3. Ver que la app carga en local y en URL de Vercel.
4. Confirmar objetivo único de la clase (sin mezclar subtemas).
5. Hacer una prueba en seco (sin grabar) del flujo completo.

