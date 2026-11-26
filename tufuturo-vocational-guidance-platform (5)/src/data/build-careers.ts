import type { AreaId, Career } from "@/lib/types";

/**
 * Fila compacta de una carrera. Las listas se separan con "; " y las carreras
 * relacionadas con espacios (slugs).
 * [slug, nombre, área, duración, perfil, descripción, qué se estudia, materias,
 *  habilidades, actividades, campos de trabajo, especializaciones, retos, relacionadas, alias]
 */
export type CareerRow = [
  string, string, AreaId, string, string, string, string,
  string, string, string, string, string, string, string, string,
];

const list = (s: string) => s.split(";").map((x) => x.trim()).filter(Boolean);

export function buildCareers(rows: CareerRow[]): Career[] {
  return rows.map((r) => ({
    slug: r[0],
    name: r[1],
    area: r[2],
    duration: r[3],
    profile: r[4],
    description: r[5],
    studies: r[6],
    subjects: list(r[7]),
    skills: list(r[8]),
    activities: list(r[9]),
    fields: list(r[10]),
    specializations: list(r[11]),
    challenges: r[12],
    related: r[13].split(/\s+/).filter(Boolean),
    aliases: list(r[14]),
  }));
}
