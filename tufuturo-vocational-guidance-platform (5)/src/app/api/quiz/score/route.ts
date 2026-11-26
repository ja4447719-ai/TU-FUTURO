import { getCatalog, programCountByCareer } from "@/lib/catalog";
import { scoreAnswers, validateAnswers } from "@/lib/scoring";

export const dynamic = "force-dynamic";

/**
 * Calcula resultados del test. Las respuestas NO se almacenan ni se registran: solo se calculan y se devuelven.
 */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "JSON inválido" }, { status: 400 });
  }
  const answers = validateAnswers((body as { answers?: unknown })?.answers);
  if (!answers) return Response.json({ error: "Respuestas inválidas" }, { status: 400 });
  if (Object.keys(answers).length < 5) return Response.json({ error: "Responde al menos 5 preguntas" }, { status: 422 });

  try {
    const catalog = await getCatalog();
    const result = scoreAnswers(answers, catalog.careers);
    const counts = programCountByCareer(catalog.programs.filter((p) => p.status !== "outdated"));
    const withCounts = <T extends { slug: string }>(items: T[]) => items.map((i) => ({ ...i, programs: counts[i.slug] ?? 0 }));
    const related = Object.fromEntries(
      result.recommended.map((r) => {
        const c = catalog.careers.find((x) => x.slug === r.slug)!;
        return [
          r.slug,
          {
            description: c.description,
            subjects: c.subjects,
            skills: c.skills,
            activities: c.activities,
            related: c.related
              .map((s) => catalog.careers.find((x) => x.slug === s))
              .filter((x): x is NonNullable<typeof x> => Boolean(x))
              .map((x) => ({ slug: x.slug, name: x.name })),
          },
        ];
      }),
    );
    return Response.json({ ...result, recommended: withCounts(result.recommended), discover: withCounts(result.discover), details: related });
  } catch (error) {
    console.error("[quiz] error al calcular resultados", error instanceof Error ? error.message : error);
    return Response.json({ error: "No se pudieron calcular los resultados" }, { status: 500 });
  }
}
