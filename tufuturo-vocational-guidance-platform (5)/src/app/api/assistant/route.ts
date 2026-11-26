/** Punto de integración reservado para el Asistente TuFuturo (aún no disponible). Ver docs/ASISTENTE.md. */
export const dynamic = "force-dynamic";

export async function POST() {
  return Response.json({ error: "El Asistente TuFuturo estará disponible en una versión posterior." }, { status: 501 });
}
