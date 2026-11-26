/**
 * Dimensiones del modelo de orientación de TuFuturo.
 * Cada carrera y cada respuesta del test se expresan con códigos de estas tres familias:
 *  - Intereses (10), Habilidades/materias (11) y Preferencias de trabajo (12).
 */
export const INTERESTS = {
  ci: "Ciencias y experimentos",
  te: "Tecnología e informática",
  sa: "Salud y bienestar",
  ar: "Arte y creatividad",
  ne: "Negocios y emprendimiento",
  ed: "Educación y enseñanza",
  so: "Sociedad y comportamiento humano",
  na: "Naturaleza y medio ambiente",
  co: "Construcción y diseño",
  cm: "Comunicación e investigación",
} as const;

export const SKILLS = {
  mat: "Matemáticas",
  fis: "Física",
  qui: "Química",
  bio: "Biología",
  his: "Historia",
  lit: "Literatura",
  idi: "Inglés y otros idiomas",
  pro: "Programación",
  dib: "Dibujo",
  com: "Comunicación",
  res: "Resolución de problemas",
} as const;

export const STYLES = {
  per: "Trabajar con personas",
  tec: "Trabajar con tecnología",
  inv: "Investigar",
  cre: "Crear cosas",
  org: "Organizar proyectos",
  sol: "Resolver problemas",
  air: "Trabajar al aire libre",
  lab: "Trabajar en laboratorios",
  hos: "Trabajar en hospitales",
  ofi: "Trabajar en oficinas",
  ens: "Enseñar",
  emp: "Emprender",
} as const;

export type InterestCode = keyof typeof INTERESTS;
export type SkillCode = keyof typeof SKILLS;
export type StyleCode = keyof typeof STYLES;
export type DimCode = InterestCode | SkillCode | StyleCode;
export type DimGroup = "interests" | "skills" | "styles";

export const LABELS: Record<string, string> = { ...INTERESTS, ...SKILLS, ...STYLES };

export function groupOf(code: string): DimGroup | null {
  if (code in INTERESTS) return "interests";
  if (code in SKILLS) return "skills";
  if (code in STYLES) return "styles";
  return null;
}

export type Vector = Partial<Record<DimCode, number>>;

/** Convierte "sa3 ci2 bio3" en { sa: 3, ci: 2, bio: 3 } */
export function parseProfile(profile: string): Vector {
  const out: Vector = {};
  for (const token of profile.split(/\s+/).filter(Boolean)) {
    const m = token.match(/^([a-z]+)([0-3])$/);
    if (!m || !groupOf(m[1])) throw new Error(`Código de perfil inválido: ${token}`);
    out[m[1] as DimCode] = Number(m[2]);
  }
  return out;
}
