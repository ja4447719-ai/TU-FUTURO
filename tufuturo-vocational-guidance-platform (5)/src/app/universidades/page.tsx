import type { Metadata } from "next";
import { Finder } from "@/components/Finder";
import { getCatalog } from "@/lib/catalog";

export const metadata: Metadata = { title: "Encuentra dónde estudiar", description: "Busca universidades públicas y privadas en Puebla que imparten tu carrera, con distancia aproximada, modalidad, fuente oficial y fecha de verificación." };
export const dynamic = "force-dynamic";

type SP = { carrera?: string; tipo?: string; modalidad?: string };

export default async function UniversitiesPage({ searchParams }: { searchParams: Promise<SP> }) {
  const sp = await searchParams;
  const catalog = await getCatalog();
  return (
    <div>
      <section className="bg-hero">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
          <p className="text-sm font-bold uppercase tracking-widest text-coral">Buscador de universidades</p>
          <h1 className="mt-2 text-4xl font-extrabold tracking-tight sm:text-5xl">Encuentra dónde estudiar</h1>
          <p className="mt-3 max-w-2xl text-lg text-ink/70">Cada programa fue registrado desde el sitio oficial de la universidad, con su fuente y fecha de consulta. Tu ubicación es opcional.</p>
        </div>
      </section>
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <Finder
          universities={catalog.universities}
          programs={catalog.programs}
          careers={catalog.careers.map((c) => ({ slug: c.slug, name: c.name, area: c.area }))}
          areas={catalog.areas.map((a) => ({ id: a.id, name: a.name }))}
          initial={{ carrera: sp.carrera ?? "", tipo: sp.tipo ?? "", modalidad: sp.modalidad ?? "" }}
        />
      </div>
    </div>
  );
}
