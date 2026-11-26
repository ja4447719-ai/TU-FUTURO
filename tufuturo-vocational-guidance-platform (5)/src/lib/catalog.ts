import { AREAS } from "@/data/areas";
import { CAREERS } from "@/data/careers";
import { PROGRAMS } from "@/data/programs";
import { UNIVERSITIES } from "@/data/universities";
import { db } from "@/db";
import { areasTable, careersTable, programsTable, universitiesTable } from "@/db/schema";
import type { Area, AreaId, Career, Modality, Program, University } from "@/lib/types";

export interface Catalog {
  areas: Area[];
  careers: Career[];
  universities: University[];
  programs: Program[];
  source: "database" | "static";
}

const STATIC_CATALOG: Catalog = { areas: AREAS, careers: CAREERS, universities: UNIVERSITIES, programs: PROGRAMS, source: "static" };

/** Inserta (o reemplaza) el catálogo versionado en el código dentro de PostgreSQL. Idempotente. */
export async function seedDatabase() {
  await db.transaction(async (tx) => {
    await tx.delete(programsTable);
    await tx.delete(careersTable);
    await tx.delete(universitiesTable);
    await tx.delete(areasTable);
    await tx.insert(areasTable).values(AREAS);
    await tx.insert(careersTable).values(CAREERS);
    await tx.insert(universitiesTable).values(
      UNIVERSITIES.map((u) => ({ ...u, coordApprox: u.coordPrecision === "approx" })),
    );
    await tx.insert(programsTable).values(PROGRAMS.map((p) => ({ ...p })));
  });
}

let cache: { at: number; data: Catalog } | null = null;
const TTL_MS = 5 * 60 * 1000;

async function readDatabase(): Promise<Catalog> {
  const [a, c, u, p] = await Promise.all([
    db.select().from(areasTable),
    db.select().from(careersTable),
    db.select().from(universitiesTable),
    db.select().from(programsTable),
  ]);
  return {
    source: "database",
    areas: a.map((x) => ({ ...x, id: x.id as AreaId })),
    careers: c.map((x) => ({ ...x, area: x.area as AreaId })),
    universities: u.map(({ coordApprox, ...x }) => ({ ...x, coordPrecision: coordApprox ? ("approx" as const) : ("exact" as const) })),
    programs: p.map((x) => ({
      universitySlug: x.universitySlug,
      careerSlug: x.careerSlug,
      officialName: x.officialName,
      modalities: x.modalities as Modality[],
      duration: x.duration,
      url: x.url,
      source: x.source,
      note: x.note,
      consultedAt: x.consultedAt,
      status: x.status,
    })),
  };
}

/**
 * Devuelve el catálogo desde PostgreSQL (con autoinicialización si está vacío).
 * Si la base de datos no está disponible, usa el catálogo estático versionado para que el sitio siga funcionando.
 */
export async function getCatalog(): Promise<Catalog> {
  if (cache && Date.now() - cache.at < TTL_MS) return cache.data;
  let data: Catalog;
  try {
    let current = await readDatabase();
    if (current.careers.length !== CAREERS.length || current.programs.length !== PROGRAMS.length) {
      await seedDatabase();
      current = await readDatabase();
    }
    data = current;
  } catch (error) {
    console.error("[catalog] Base de datos no disponible; se usa el catálogo estático.", error instanceof Error ? error.message : error);
    data = STATIC_CATALOG;
  }
  cache = { at: Date.now(), data };
  return data;
}

export function programCountByCareer(programs: Program[]): Record<string, number> {
  const out: Record<string, number> = {};
  for (const p of programs) out[p.careerSlug] = (out[p.careerSlug] ?? 0) + 1;
  return out;
}
