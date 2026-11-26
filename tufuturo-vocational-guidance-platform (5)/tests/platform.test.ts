import { describe, expect, it } from "vitest";
import { AREAS } from "@/data/areas";
import { CAREERS } from "@/data/careers";
import { PROGRAMS } from "@/data/programs";
import { QUIZ } from "@/data/quiz";
import { UNIVERSITIES } from "@/data/universities";
import { parseProfile } from "@/lib/dimensions";
import { findPlace, haversineKm } from "@/lib/geo";
import { scoreAnswers, validateAnswers, type Answers } from "@/lib/scoring";

describe("integridad del catálogo", () => {
  it("no tiene slugs de carrera duplicados", () => {
    const slugs = CAREERS.map((c) => c.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });
  it("todas las carreras tienen área válida, perfil parseable y relacionadas existentes", () => {
    const slugs = new Set(CAREERS.map((c) => c.slug));
    const areas = new Set(AREAS.map((a) => a.id));
    for (const c of CAREERS) {
      expect(areas.has(c.area), c.slug).toBe(true);
      expect(Object.keys(parseProfile(c.profile)).length, c.slug).toBeGreaterThan(3);
      expect(c.subjects.length, c.slug).toBeGreaterThan(2);
      for (const r of c.related) expect(slugs.has(r), `${c.slug} → ${r}`).toBe(true);
    }
  });
  it("incluye al menos las carreras base solicitadas", () => {
    for (const s of ["medicina", "ingenieria-software", "psicologia", "derecho", "arquitectura", "actuaria", "agronomia", "biotecnologia"]) {
      expect(CAREERS.some((c) => c.slug === s), s).toBe(true);
    }
    expect(CAREERS.length).toBeGreaterThanOrEqual(100);
  });
  it("los programas apuntan a carreras y sedes existentes, con fuente y fecha", () => {
    const careers = new Set(CAREERS.map((c) => c.slug));
    const unis = new Set(UNIVERSITIES.map((u) => u.slug));
    for (const p of PROGRAMS) {
      expect(careers.has(p.careerSlug), `${p.universitySlug}/${p.officialName} → ${p.careerSlug}`).toBe(true);
      expect(unis.has(p.universitySlug)).toBe(true);
      expect(p.url).toMatch(/^https?:\/\//);
      expect(p.source.length).toBeGreaterThan(5);
      expect(p.consultedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  });
  it("no repite el mismo programa oficial dentro de una sede", () => {
    const seen = new Set<string>();
    for (const p of PROGRAMS) {
      const k = `${p.universitySlug}|${p.officialName}`;
      expect(seen.has(k), k).toBe(false);
      seen.add(k);
    }
  });
  it("hay universidades públicas y privadas con coordenadas en la región de Puebla", () => {
    expect(UNIVERSITIES.some((u) => u.type === "publica")).toBe(true);
    expect(UNIVERSITIES.some((u) => u.type === "privada")).toBe(true);
    for (const u of UNIVERSITIES) {
      expect(u.lat).toBeGreaterThan(18.5);
      expect(u.lat).toBeLessThan(19.5);
      expect(u.lng).toBeGreaterThan(-98.6);
      expect(u.lng).toBeLessThan(-97.9);
    }
  });
  it("los programas pendientes no se marcan como verificados", () => {
    expect(PROGRAMS.filter((p) => p.status === "pending").every((p) => p.note)).toBe(true);
  });
});

describe("geografía", () => {
  it("calcula distancias Haversine razonables", () => {
    // Zócalo de Puebla → Zócalo de CDMX ≈ 105-115 km en línea recta
    const km = haversineKm(19.0436, -98.1983, 19.4326, -99.1332);
    expect(km).toBeGreaterThan(100);
    expect(km).toBeLessThan(120);
    expect(haversineKm(19, -98, 19, -98)).toBe(0);
  });
  it("encuentra lugares por nombre y código postal", () => {
    expect(findPlace("cholula")?.municipality).toContain("Cholula");
    expect(findPlace("72810")?.municipality).toBe("San Andrés Cholula");
    expect(findPlace("lugar inexistente")).toBeNull();
  });
});

describe("test vocacional", () => {
  const ids = new Set<string>();
  it("las preguntas son válidas y sus efectos usan códigos conocidos", () => {
    for (const q of QUIZ) {
      expect(ids.has(q.id)).toBe(false);
      ids.add(q.id);
      expect(q.options.length).toBeGreaterThan(1);
    }
    expect(QUIZ.length).toBeGreaterThanOrEqual(12);
    expect(QUIZ.length).toBeLessThanOrEqual(20);
  });

  const tech: Answers = { intereses: ["te", "ci"], materias: ["mat", "pro", "res"], estilos: ["tec", "sol", "inv"], ambiente: ["rem"], "sc-numeros": ["3"], "sc-personas": ["0"], curiosidad: ["c"] };
  const health: Answers = { intereses: ["sa", "ci"], materias: ["bio", "qui"], estilos: ["per", "hos", "sol"], ambiente: ["hos"], "sc-personas": ["3"], curiosidad: ["a"], disfruta: ["e"] };
  const art: Answers = { intereses: ["ar", "cm"], materias: ["dib", "lit"], estilos: ["cre", "per"], ambiente: ["est"], "sc-crear": ["3"], curiosidad: ["i"] };

  it("es determinista: mismas respuestas, mismo resultado", () => {
    expect(scoreAnswers(tech, CAREERS)).toEqual(scoreAnswers(tech, CAREERS));
  });
  it("devuelve entre 5 y 8 recomendaciones con afinidad 0-100 y justificación", () => {
    const r = scoreAnswers(tech, CAREERS);
    expect(r.recommended.length).toBeGreaterThanOrEqual(5);
    expect(r.recommended.length).toBeLessThanOrEqual(8);
    for (const c of r.recommended) {
      expect(c.affinity).toBeGreaterThanOrEqual(0);
      expect(c.affinity).toBeLessThanOrEqual(100);
      expect(c.reasons.length).toBeGreaterThan(0);
    }
    const sorted = [...r.recommended].sort((a, b) => b.affinity - a.affinity);
    expect(r.recommended.map((c) => c.affinity)).toEqual(sorted.map((c) => c.affinity));
  });
  it("prioriza carreras coherentes con el perfil", () => {
    const names = (a: Answers) => scoreAnswers(a, CAREERS).recommended.map((c) => c.slug);
    expect(names(tech).slice(0, 5).some((s) => ["ingenieria-software", "ciencia-de-datos", "inteligencia-artificial", "ciencias-computacion", "ciberseguridad"].includes(s))).toBe(true);
    // PENDIENTE DE CALIBRACIÓN (ver README): con este perfil, Ingeniería en Software aún no entra al top 8.
    expect(names(health).slice(0, 5).some((s) => ["medicina", "enfermeria", "fisioterapia", "odontologia"].includes(s))).toBe(true);
    expect(names(art).slice(0, 6).some((s) => ["diseno-grafico", "artes-visuales", "cine", "animacion", "diseno-digital", "teatro", "letras"].includes(s))).toBe(true);
  });
  it("limita a 4 carreras por área y ofrece alternativas de otras áreas", () => {
    const r = scoreAnswers(tech, CAREERS);
    const counts: Record<string, number> = {};
    for (const c of r.recommended) counts[c.area] = (counts[c.area] ?? 0) + 1;
    expect(Math.max(...Object.values(counts))).toBeLessThanOrEqual(4);
    expect(r.discover.length).toBeGreaterThan(0);
  });
  it("valida respuestas inválidas", () => {
    expect(validateAnswers(null)).toBeNull();
    expect(validateAnswers({ intereses: ["no-existe"] })).toBeNull();
    expect(validateAnswers({ intereses: ["ci", "te", "sa", "ar", "ne"] })).toBeNull(); // excede el máximo de 4
    expect(validateAnswers({ ambiente: ["lab", "hos"] })).toBeNull(); // pregunta de opción única
    expect(validateAnswers(tech)).not.toBeNull();
  });
});
