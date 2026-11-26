import type { Metadata } from "next";
import { CatalogExplorer } from "@/components/CatalogExplorer";
import { getCatalog, programCountByCareer } from "@/lib/catalog";
import type { AreaId } from "@/lib/types";

export const metadata: Metadata = { title: "Explora todas las carreras", description: "Catálogo de carreras universitarias de México por área profesional, con qué se estudia, campos de trabajo y universidades en Puebla." };
export const dynamic = "force-dynamic";

export default async function CareersPage({ searchParams }: { searchParams: Promise<{ area?: string }> }) {
  const { area } = await searchParams;
  const catalog = await getCatalog();
  const counts = programCountByCareer(catalog.programs.filter((p) => p.status !== "outdated"));
  const items = catalog.careers.map((c) => ({ slug: c.slug, name: c.name, area: c.area, description: c.description, duration: c.duration, aliases: c.aliases, programs: counts[c.slug] ?? 0 }));
  const initialArea = catalog.areas.some((a) => a.id === area) ? (area as AreaId) : "";

  return (
    <div>
      <section className="bg-hero">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
          <p className="text-sm font-bold uppercase tracking-widest text-coral">Catálogo</p>
          <h1 className="mt-2 text-4xl font-extrabold tracking-tight sm:text-5xl">Explora todas las carreras</h1>
          <p className="mt-3 max-w-2xl text-lg text-ink/70">{catalog.careers.length} carreras en {catalog.areas.length} áreas. Registramos también las distintas denominaciones oficiales que reciben en cada universidad.</p>
        </div>
      </section>
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <CatalogExplorer areas={catalog.areas} careers={items} initialArea={initialArea} />
      </div>
    </div>
  );
}
