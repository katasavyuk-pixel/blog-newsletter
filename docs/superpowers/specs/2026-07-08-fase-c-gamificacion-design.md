# Fase C — Gamificación: Logros, Rachas y Progreso

> Blog + Newsletter de marca personal (IA) — Kata Ivanovych
> Estado: **Spec aprobado** | Fecha: 2026-07-08

## 1. Resumen

Sistema de gamificación en cliente con localStorage como almacenamiento. Trackea
rachas de lectura, consumo de contenido, uso de widgets interactivos y logros
sociales. Sin backend — toda la lógica es CSR, persistencia en localStorage,
evaluación en cada carga de página y tras interacciones.

## 2. Modelo de datos

```ts
type AchievementId =
  | "streak_3" | "streak_7" | "streak_14" | "streak_30"
  | "reader_1" | "reader_5" | "reader_all"
  | "explorer_1" | "explorer_5"
  | "challenger"
  | "subscriber"
  | "ambassador";

type AchievementCategory = "streak" | "reading" | "interactive" | "social";

type AchievementDef = {
  id: AchievementId;
  title: string;
  description: string;
  icon: string;          // emoji
  category: AchievementCategory;
  criteria: (state: UserState) => boolean;
};

type UserState = {
  currentStreak: number;
  longestStreak: number;
  lastVisitDate: string;            // "YYYY-MM-DD"
  readPostSlugs: string[];          // slugs de posts leídos (>80% scroll)
  usedWidgetIds: string[];          // widgets con los que se ha interactuado
  completedQuizIds: string[];       // quizzes respondidos
  subscribed: boolean;
  shared: boolean;
};

type AchievementUnlock = {
  id: AchievementId;
  unlockedAt: string;               // ISO timestamp
};
```

Almacenamiento en localStorage:

| Clave | Valor |
|-------|-------|
| `streak:state` | `{ current, longest, lastVisit }` |
| `streak:history` | `string[]` de fechas `YYYY-MM-DD` |
| `read:<slug>` | `true` cuando scroll > 80% |
| `widget:<widgetId>` | `true` al interactuar |
| `quiz:<id>` | índice de la respuesta (ya existe) |
| `achievement:<id>` | `{ unlockedAt }` |
| `subscribed` | `true` |
| `shared` | `true` |

## 3. Catálogo de logros

### Racha

| ID | Título | Descripción | Condición |
|----|--------|-------------|-----------|
| `streak_3` | 🔥 Principiante | 3 días seguidos leyendo | `currentStreak >= 3` |
| `streak_7` | 🔥 Fiel | 7 días seguidos | `currentStreak >= 7` |
| `streak_14` | 🔥 Veterano | 14 días seguidos | `currentStreak >= 14` |
| `streak_30` | 🔥 Imparable | 30 días seguidos | `currentStreak >= 30` |

### Lectura

| ID | Título | Descripción | Condición |
|----|--------|-------------|-----------|
| `reader_1` | 📖 Curioso | Leer 1 post | `readPostSlugs.length >= 1` |
| `reader_5` | 📖 Aprendiz | Leer 5 posts | `readPostSlugs.length >= 5` |
| `reader_all` | 📖 Erudito | Leer todos los posts publicados | cubre todos los slugs de posts |

### Interactivo

| ID | Título | Descripción | Condición |
|----|--------|-------------|-----------|
| `explorer_1` | 🧪 Explorador | Usar 1 widget interactivo | `usedWidgetIds.length >= 1` |
| `explorer_5` | 🧪 Científico | Usar 5 widgets distintos | `usedWidgetIds.length >= 5` |
| `challenger` | ✅ Desafiante | Completar 3 quizzes | `completedQuizIds.length >= 3` |

### Social

| ID | Título | Descripción | Condición |
|----|--------|-------------|-----------|
| `subscriber` | ✉️ Suscriptor | Suscribirse a la newsletter | `subscribed === true` |
| `ambassador` | 🤝 Embajador | Compartir un post | `shared === true` |

## 4. Arquitectura

### Flujo de evaluación

```
[page load / interaction]
        │
        ▼
use-achievements()
        │
        ├─ streak.ts → calcula racha actual desde localStorage
        ├─ lectura → lee read:<slug> del post actual
        ├─ widgets → lee widget:<id> + quiz:<id>
        ├─ social → lee `subscribed`, `shared`
        │
        ▼
    compila UserState
        │
        ▼
    evalúa cada AchievementDef.criteria(state)
        │
        ▼
    compara con achievement:<id> en localStorage
        │
        ▼
    si hay nuevos → guarda unlock + muestra toast
        │
        ▼
    expone: { achievements, unlocked, latest, streak, progress }
```

### Componentes

| Archivo | Propósito |
|---------|-----------|
| `src/lib/streak.ts` | Lógica de racha: `getStreak()`, `recordVisit()`, purga de days off |
| `src/lib/achievements.ts` | Catálogo declarativo: lista de `AchievementDef` |
| `src/lib/achievement-state.ts` | `computeUserState()` a partir de localStorage |
| `src/hooks/use-achievements.ts` | Hook que integra todo; detecta nuevos unlocks; expone estado reactivo |
| `src/hooks/use-reading-progress.ts` | IntersectionObserver sobre el artículo; marca como leído al 80% |
| `src/components/home/achievements-badge.tsx` | Badge en home con últimos 3 logros y racha actual |
| `src/components/logros/achievement-card.tsx` | Tarjeta individual de logro (icono, título, descripción, estado, fecha) |
| `src/app/logros/page.tsx` | Página `/logros` con grid completo |
| `src/components/mdx/post-progress.tsx` | Sección "Tu progreso" al final de cada post |

### Páginas nuevas

| Ruta | Descripción |
|------|-------------|
| `/logros` | Grid completo de todos los logros con estados bloqueado/desbloqueado/progreso |

### Modificaciones a archivos existentes

| Archivo | Cambio |
|---------|--------|
| `src/app/page.tsx` | Añadir `<AchievementsBadge />` en la home |
| `src/components/mdx/widgets/index.ts` | No tocar — los widgets existentes ya persisten en localStorage |
| `src/app/blog/[slug]/page.tsx` | Añadir `<PostProgress />` al final del post |
| `src/components/newsletter/subscribe-form.tsx` | Marcar `subscribed=true` en localStorage al confirmar suscripción exitosa |

## 5. UI / UX

- **Badge en home:** Widget compacto que muestra 🔥 racha actual + últimos 2-3 logros desbloqueados. Al desbloquear uno nuevo, aparece toast animado (motion, fade-in + slide-up).
- **Página /logros:** Grid responsive (3 columnas desktop, 2 tablet, 1 móvil). Cada tarjeta: icono grande, título, descripción. Desbloqueado = color coral + fecha; bloqueado = gris opaco; progreso parcial = barra de progreso sutil (ej: "3/5 posts").
- **Post progress:** Al final del artículo, sección pequeña: "🔥 Llevas X días seguidos. Próximo logro: ...". Si es el primer post leído, mostrar toast de logro.
- **Toast de logro:** Componente `AchievementToast` — overlay temporal en esquina inferior derecha, auto-dismiss a los 4s, con icono + título. Usa `motion` (animación fade/slide).

## 6. Dependencias

Ninguna nueva. Usa:
- `use-local-state.ts` (ya existe)
- `motion` (ya existe)
- `use-reduced-motion.ts` (ya existe)
- Emojis para iconos (0 coste, sin dependencia de Lucide)

## 7. Aspectos técnicos

- **SSR-safe**: Toda la lectura de localStorage ocurre en hooks cliente (efecto post-hydration). `use-achievements` devuelve estado vacío/default en servidor.
- **Cross-tab sync**: `use-local-state` ya emite eventos `storage`/`nbi:local-state`. Los logros se re-evalúan al recibirlos.
- **Racha**: El día se cuenta por fecha UTC (medianoche UTC). Una visita por día calendario basta. Se permite saltarse 1 día sin perder racha (opcional, debatible).
- **No migraciones**: El estado de localStorage no tiene versionado. Si se añaden logros nuevos, se evalúan contra el estado existente y se desbloquean retroactivamente si aplica.
- **Coste 0 API**: Sin llamadas de red. Sin backend.

## 8. Fuera de scope (para siguiente iteración)

- Newsletter loop (emails automatizados basados en logros/rachas)
- Sincronización server-side (cuentas Supabase Auth — Fase D)
- Leaderboards o competición social
- Logros con recompensas reales (acceso anticipado, descuentos)
