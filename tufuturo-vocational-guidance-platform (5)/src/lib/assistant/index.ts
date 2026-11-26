/**
 * Arquitectura preparada para el «Asistente TuFuturo» (versión posterior). Ver docs/ASISTENTE.md.
 *
 * Principios:
 *  - Solo responde con datos estructurados y verificados del catálogo (carreras, universidades, programas).
 *  - Cada respuesta debe citar fuentes (URL + fecha de consulta). Si no hay evidencia, responde que no lo sabe.
 *  - El proveedor de lenguaje es intercambiable (interfaz AssistantProvider) y no es necesario para el resto de la plataforma.
 */
import { getCatalog } from "@/lib/catalog";
import { normalize } from "@/lib/geo";

export interface AssistantSource { title: string; url: string; consultedAt?: string }
export interface AssistantContext { facts: string[]; sources: AssistantSource[] }
export interface AssistantRequest { message: string; history?: { role: "user" | "assistant"; content: string }[] }
export interface AssistantResponse { answer: string; sources: AssistantSource[]; grounded: boolean }

export interface AssistantProvider {
  /** Genera una respuesta SOLO a partir del contexto recuperado. */
  answer(request: AssistantRequest, context: AssistantContext): Promise<AssistantResponse>;
}

/** Recuperación determinista (sin IA): busca carreras/universidades mencionadas y arma hechos citables. */
export async function retrieveContext(message: string): Promise<AssistantContext> {
  const catalog = await getCatalog();
  const q = normalize(message);
  const facts: string[] = [];
  const sources: AssistantSource[] = [];
  for (const career of catalog.careers) {
    const names = [career.name, ...career.aliases].map(normalize);
    if (!names.some((n) => n.length > 3 && q.includes(n))) continue;
    facts.push(`${career.name}: ${career.description} Se estudia: ${career.studies}`);
    for (const p of catalog.programs.filter((x) => x.careerSlug === career.slug && x.status === "verified").slice(0, 10)) {
      const u = catalog.universities.find((x) => x.slug === p.universitySlug);
      if (!u) continue;
      facts.push(`${u.shortName} (${u.campus}) ofrece «${p.officialName}» según ${p.source}.`);
      sources.push({ title: p.source, url: p.url, consultedAt: p.consultedAt });
    }
  }
  return { facts, sources };
}
