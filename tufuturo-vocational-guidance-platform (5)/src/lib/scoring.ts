import { QUIZ } from "@/data/quiz";
import { AREA_BY_ID } from "@/data/areas";
import { INTERESTS, LABELS, SKILLS, STYLES, groupOf, parseProfile, type DimGroup } from "@/lib/dimensions";
import type { AreaId, Career } from "@/lib/types";

/**
 * ALGORITMO DE AFINIDAD (reproducible, sin IA externa) — ver docs/METODOLOGIA.md
 *
 * 1. Cada opción elegida suma puntos a dimensiones (intereses, habilidades, preferencias de trabajo).
 *    Las opciones "no me gusta" restan puntos.
 * 2. Por familia (g) se normaliza: u_d = puntos_d / máx(puntos positivos de g), acotado a [-1, 1].
 * 3. Cada carrera tiene un perfil c_d ∈ {1,2,3}. Para cada familia:  S_g = Σ c_d·u_d / Σ c_d
 *    (en el denominador se omiten las dimensiones con c_d = 1 sobre las que el estudiante no dio señal)
 * 4. Afinidad = Σ W_g·S_g / Σ W_g con W = intereses 0.45, preferencias de trabajo 0.30, habilidades 0.25
 *    (más un bono de +0.06 si el área coincide con las áreas que el estudiante marcó).
 * 5. El porcentaje es la coincidencia con las respuestas (0-100). NO es una probabilidad de éxito.
 */
export const WEIGHTS: Record<DimGroup, number> = { interests: 0.45, styles: 0.3, skills: 0.25 };
export const AREA_BONUS = 0.06;
export const MAX_PER_AREA_IN_TOP = 4;

export type Answers = Record<string, string[]>;

export interface CareerResult {
  slug: string;
  name: string;
  area: AreaId;
  areaName: string;
  affinity: number;
  reasons: string[];
  watchOut: string[];
}

export interface QuizResult {
  answered: number;
  interestProfile: { code: string; label: string; value: number }[];
  topSkills: { code: string; label: string; value: number }[];
  topStyles: { code: string; label: string; value: number }[];
  areas: { id: AreaId; name: string; score: number }[];
  recommended: CareerResult[];
  discover: CareerResult[];
  preferences: string[];
}

export function validateAnswers(input: unknown): Answers | null {
  if (!input || typeof input !== "object" || Array.isArray(input)) return null;
  const out: Answers = {};
  for (const q of QUIZ) {
    const raw = (input as Record<string, unknown>)[q.id];
    if (raw === undefined) continue;
    if (!Array.isArray(raw) || raw.some((x) => typeof x !== "string")) return null;
    const ids = Array.from(new Set(raw as string[]));
    if (ids.some((id) => !q.options.some((op) => op.id === id))) return null;
    if (q.type === "single" && ids.length > 1) return null;
    if (q.max && ids.length > q.max) return null;
    out[q.id] = ids;
  }
  return out;
}

function rawPoints(answers: Answers) {
  const raw: Record<string, number> = {};
  const areas = new Set<AreaId>();
  const preferences: string[] = [];
  for (const q of QUIZ) {
    for (const id of answers[q.id] ?? []) {
      const op = q.options.find((x) => x.id === id);
      if (!op) continue;
      for (const [code, v] of Object.entries(op.effects)) raw[code] = (raw[code] ?? 0) + v;
      if (op.area) areas.add(op.area);
      if (op.pref) preferences.push(op.pref);
    }
  }
  return { raw, areas, preferences };
}

export function normalizeUser(raw: Record<string, number>): Record<string, number> {
  const maxByGroup: Record<DimGroup, number> = { interests: 0, skills: 0, styles: 0 };
  for (const [code, v] of Object.entries(raw)) {
    const g = groupOf(code);
    if (g && v > maxByGroup[g]) maxByGroup[g] = v;
  }
  const u: Record<string, number> = {};
  for (const [code, v] of Object.entries(raw)) {
    const g = groupOf(code);
    if (!g || maxByGroup[g] <= 0) continue;
    u[code] = Math.max(-1, Math.min(1, v / maxByGroup[g]));
  }
  return u;
}

export function affinityFor(career: Career, u: Record<string, number>, areas: Set<AreaId>): { value: number; vector: Record<string, number> } {
  const vec = parseProfile(career.profile) as Record<string, number>;
  const sums: Record<DimGroup, { num: number; den: number }> = { interests: { num: 0, den: 0 }, skills: { num: 0, den: 0 }, styles: { num: 0, den: 0 } };
  for (const [code, c] of Object.entries(vec)) {
    const g = groupOf(code)!;
    sums[g].num += c * (u[code] ?? 0);
    // Las dimensiones de peso menor (c=1) que el estudiante no mencionó no penalizan la afinidad.
    if (c >= 2 || (u[code] ?? 0) !== 0) sums[g].den += c;
  }
  let acc = 0;
  let w = 0;
  for (const g of Object.keys(sums) as DimGroup[]) {
    if (sums[g].den === 0) continue;
    acc += WEIGHTS[g] * (sums[g].num / sums[g].den);
    w += WEIGHTS[g];
  }
  let value = w > 0 ? acc / w : 0;
  if (areas.has(career.area)) value += AREA_BONUS;
  return { value: Math.max(0, Math.min(1, value)), vector: vec };
}

const list = (labels: string[]) => (labels.length <= 1 ? labels.join("") : `${labels.slice(0, -1).join(", ")} y ${labels[labels.length - 1]}`);

function explain(career: Career, vec: Record<string, number>, u: Record<string, number>) {
  const pick = (g: DimGroup, sign: 1 | -1) =>
    Object.entries(vec)
      .filter(([code, c]) => groupOf(code) === g && (sign === 1 ? (u[code] ?? 0) >= 0.5 : (u[code] ?? 0) <= -0.5 && c >= 2))
      .sort((a, b) => b[1] * Math.abs(u[b[0]] ?? 0) - a[1] * Math.abs(u[a[0]] ?? 0) || a[0].localeCompare(b[0]))
      .slice(0, 3)
      .map(([code]) => LABELS[code].toLowerCase());
  const reasons: string[] = [];
  const i = pick("interests", 1);
  const s = pick("skills", 1);
  const st = pick("styles", 1);
  if (i.length) reasons.push(`Conecta con tus intereses en ${list(i)}.`);
  if (s.length) reasons.push(`Se apoya en materias y habilidades que dijiste disfrutar: ${list(s)}.`);
  if (st.length) reasons.push(`Encaja con cómo te imaginas trabajando: ${list(st)}.`);
  if (!reasons.length) reasons.push("Coincide de forma parcial con varias de tus respuestas; explórala para conocerla mejor.");
  const watchOut: string[] = [];
  const avoid = [...pick("skills", -1), ...pick("styles", -1)];
  if (avoid.length) watchOut.push(`Marcaste que preferirías evitar actividades como ${list(avoid)}, y esta carrera suele incluirlas.`);
  watchOut.push(career.challenges);
  return { reasons, watchOut };
}

export function scoreAnswers(answers: Answers, careers: Career[]): QuizResult {
  const { raw, areas, preferences } = rawPoints(answers);
  const u = normalizeUser(raw);

  const ranked = careers
    .map((career) => {
      const { value, vector } = affinityFor(career, u, areas);
      return { career, value, vector };
    })
    .sort((a, b) => b.value - a.value || a.career.slug.localeCompare(b.career.slug));

  const toResult = (r: (typeof ranked)[number]): CareerResult => {
    const { reasons, watchOut } = explain(r.career, r.vector, u);
    return {
      slug: r.career.slug,
      name: r.career.name,
      area: r.career.area,
      areaName: AREA_BY_ID[r.career.area].name,
      affinity: Math.round(r.value * 100),
      reasons,
      watchOut,
    };
  };

  const perArea: Record<string, number> = {};
  const top: typeof ranked = [];
  for (const r of ranked) {
    if (top.length >= 8) break;
    if ((perArea[r.career.area] ?? 0) >= MAX_PER_AREA_IN_TOP) continue;
    perArea[r.career.area] = (perArea[r.career.area] ?? 0) + 1;
    top.push(r);
  }
  const topAreas = new Set(top.map((r) => r.career.area));
  const discover = ranked.filter((r) => !topAreas.has(r.career.area) && !top.includes(r)).slice(0, 3);
  const fallbackDiscover = discover.length ? discover : ranked.filter((r) => !top.includes(r)).slice(0, 3);

  const areaScores = Object.keys(AREA_BY_ID).map((id) => {
    const best = ranked.filter((r) => r.career.area === id).slice(0, 3);
    const score = best.length ? best.reduce((s, r) => s + r.value, 0) / best.length : 0;
    return { id: id as AreaId, name: AREA_BY_ID[id as AreaId].name, score: Math.round(score * 100) };
  }).sort((a, b) => b.score - a.score || a.id.localeCompare(b.id));

  const profile = (dict: Record<string, string>) =>
    Object.keys(dict).map((code) => ({ code, label: dict[code], value: Math.round(Math.max(0, u[code] ?? 0) * 100) }));
  const sortDesc = <T extends { value: number }>(arr: T[]) => [...arr].sort((a, b) => b.value - a.value);

  return {
    answered: Object.values(answers).filter((a) => a.length > 0).length,
    interestProfile: sortDesc(profile(INTERESTS)),
    topSkills: sortDesc(profile(SKILLS)).filter((x) => x.value > 0).slice(0, 5),
    topStyles: sortDesc(profile(STYLES)).filter((x) => x.value > 0).slice(0, 5),
    areas: areaScores,
    recommended: top.map(toResult),
    discover: fallbackDiscover.map(toResult),
    preferences: Array.from(new Set(preferences)),
  };
}
