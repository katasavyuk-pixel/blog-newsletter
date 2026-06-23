# Supabase — esquema declarativo

El modelo de datos **completo** está diseñado desde el día 1 (ver `CLAUDE.md` →
"Modelo de datos"), pero las tablas se **crean por fases**, no todas ahora:

| Tabla | Fase | Notas |
|---|---|---|
| `post_views` | Fase 1 (opcional) | Contador de vistas por slug. |
| `subscribers` | Fase 2 | Lista de newsletter + estado de consentimiento (doble opt-in). |
| `resources` | Fase 2 | Lead magnets / recursos gratuitos. |
| `profiles` | Fase 3 | 1:1 con `auth.users` (premium). |
| `subscriptions` | Fase 3 | Suscripción Stripe (premium). |

## Workflow (cuando se empiece a crear tablas)

1. Definir el esquema declarativo en `supabase/schemas/*.sql` (fuente de verdad).
2. `supabase db diff -f <nombre>` genera la migración en `supabase/migrations/`.
3. `supabase db push` la aplica al proyecto remoto (región `eu-central-1`).
4. Commitear schema + migración.

`RLS ON` en las 5 tablas. Default-deny; escrituras vía servidor (`service_role`)
o RPC `SECURITY DEFINER` (`SET search_path=''`, `REVOKE EXECUTE FROM PUBLIC` +
`GRANT` explícito, verificado con `has_function_privilege`). Detalle por tabla
en `CLAUDE.md`.
