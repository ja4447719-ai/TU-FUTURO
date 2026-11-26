# TuFuturo

Plataforma web de orientación vocacional y búsqueda de universidades en Puebla, México.
Test vocacional → recomendaciones justificadas → ficha de carrera → universidades que la imparten (con mapa, filtros y fuentes oficiales).

## Arquitectura y decisiones

| Decisión | Elección | Por qué |
|---|---|---|
| Framework | Next.js (App Router) + React + TypeScript | SSR/ISR, rutas API, un solo despliegue, tipado fuerte |
| Estilos | Tailwind CSS 4 + identidad propia (índigo/coral/menta, Plus Jakarta Sans) | Rapidez, consistencia, accesibilidad |
| Datos | PostgreSQL + Drizzle ORM (`src/db/schema.ts`) | Datos persistentes y estructurados; catálogo versionado en código (`src/data`) y sembrado automáticamente |
| Resiliencia | `src/lib/catalog.ts` lee de la BD y, si no está disponible, usa el catálogo estático | El sitio sigue funcionando aunque la BD gratuita esté pausada |
| Test vocacional | Algoritmo propio determinista (`src/lib/scoring.ts`), sin IA externa | Reproducible, documentado, sin costos (ver `docs/METODOLOGIA.md`) |
| Mapa | Leaflet + OpenStreetMap | Gratuito, sin API key |
| Geolocalización | API del navegador con consentimiento explícito; el cálculo se hace en el dispositivo | Privacidad |
| Pruebas | Vitest (`tests/`) | Integridad del catálogo, geografía y algoritmo |

Estructura: `src/data` (áreas, carreras, universidades, programas, quiz) · `src/lib` (scoring, geo, catálogo, asistente) · `src/components` · `src/app` (páginas y API) · `docs/`.

## Datos de universidades: cómo se verificaron

Fecha de consulta: **2026-11-26**. Cada programa en `src/data/programs.ts` procede de la oferta publicada en el sitio oficial de la institución:

- **BUAP**: `serviciosdes.buap.mx/new-oferta-educativa` (oferta 2026 por sede) — verificado programa por programa.
- **UDLAP**, **Ibero Puebla**, **Anáhuac Puebla**, **UVP**, **Universidad Madero**, **ITP (TecNM)**, **UTP**: catálogos oficiales de sus sitios.
- **UPAEP** y **Tec de Monterrey (Campus Puebla)**: listados oficiales (web.upaep.mx/licenciaturas, tec.mx/en/puebla-campus), extraídos de los extractos de los sitios oficiales; el Tec marca los programas de los que solo se cursa una parte en el campus Puebla.
- Estados: `verified`, `pending`, `outdated`. «Ingeniería en IA y Ciencia de Datos» del Tec está `pending` (anunciada para 2027).

**Limitaciones conocidas (no se inventó nada):**
- Duraciones: no confirmadas → se muestran «por confirmar».
- Modalidad: se asume presencial si el listado es de campus; UPAEP y BUAP-Derecho tienen modalidades confirmadas. Confirmar con cada institución.
- Coordenadas «approx» (BUAP Salud, BUAP Atlixcáyotl, UMAD, Tec) son estimaciones por zona y se muestran con «~».
- Pendientes: universidades públicas del estado fuera de la zona metropolitana, UVM, TecMilenio, UNID, UPN, Universidad Politécnica de Puebla, UATx (Tlaxcala) y programas de BUAP regionales (se verificó su existencia en el listado pero no se cargaron).
- Las descripciones de carreras son de elaboración propia a partir de planes de estudio habituales.

## Desarrollo

```bash
npm install
npx drizzle-kit push        # crea las tablas
npm run dev                 # el catálogo se siembra solo en la primera petición
npx vitest run              # pruebas
npx next typegen && npx tsc --noEmit && npm run build
```

`DATABASE_URL` en `.env`. Sembrado manual: se ejecuta automáticamente desde `getCatalog()` cuando la BD está vacía o difiere del catálogo versionado.

## Publicación gratuita (estrategia)

Condiciones consultadas el 2026-11-26 (verificar antes de publicar, pueden cambiar):
- **Vercel Hobby**: gratis, ~100 GB/mes de transferencia, 1 M invocaciones de funciones, subdominio `*.vercel.app`; **solo uso no comercial** (no poner anuncios/afiliados).
- **Supabase Free**: 500 MB de BD, 5 GB de egreso, el proyecto se **pausa tras 7 días sin actividad** (por eso el sitio tiene respaldo estático).
- Pasos: subir a GitHub → importar en Vercel → definir `DATABASE_URL` (cadena de conexión *pooler* de Supabase) → `npx drizzle-kit push` contra esa BD → desplegar.
- **No se ha publicado ni contratado ningún servicio**: requiere tu autorización y tus credenciales (cuenta de GitHub/Vercel/Supabase).

## Estado y bitácora

**Hecho y comprobado**: catálogo de 113 carreras en 8 áreas · 13 sedes de 10 instituciones y 351 programas con fuente (1 pendiente de verificación) · test de 16 preguntas con guardado local · resultados con justificación · fichas · buscador con consentimiento de ubicación, filtros, mapa, comparador · páginas Acerca/FAQ/Privacidad · 15 pruebas automatizadas · typecheck y build.
**Pendiente**: publicación (requiere autorización), pruebas E2E con Playwright, ampliar instituciones (ver arriba), confirmar duraciones, Asistente TuFuturo (ver `docs/ASISTENTE.md`), revisión de contenido por orientadores.
**Decisiones**: sin cuentas, sin analítica de terceros, ubicación solo en cliente, respuestas del test no se almacenan en servidor.
