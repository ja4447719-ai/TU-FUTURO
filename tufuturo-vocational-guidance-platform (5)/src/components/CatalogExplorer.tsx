"use client";

import { useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import { AreaIcon } from "./AreaIcon";
import { CareerCard } from "./CareerCard";
import { normalize } from "@/lib/geo";
import type { Area, AreaId } from "@/lib/types";

interface Item { slug: string; name: string; area: AreaId; description: string; duration: string; programs: number; aliases: string[] }

export function CatalogExplorer({ areas, careers, initialArea }: { areas: Area[]; careers: Item[]; initialArea: AreaId | "" }) {
  const [query, setQuery] = useState("");
  const [area, setArea] = useState<AreaId | "">(initialArea);
  const [onlyWithPrograms, setOnly] = useState(false);

  const results = useMemo(() => {
    const q = normalize(query);
    return careers
      .filter((c) => (area ? c.area === area : true))
      .filter((c) => (onlyWithPrograms ? c.programs > 0 : true))
      .filter((c) => !q || normalize([c.name, c.description, ...c.aliases].join(" ")).includes(q))
      .sort((a, b) => a.name.localeCompare(b.name, "es"));
  }, [careers, query, area, onlyWithPrograms]);

  return (
    <div>
      <div className="rounded-3xl bg-white p-4 shadow-sm ring-1 ring-ink/5 sm:p-6">
        <label htmlFor="buscar" className="sr-only">Buscar carrera</label>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-ink/40" aria-hidden="true" />
          <input id="buscar" type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Busca por nombre, tema o denominación oficial (p. ej. “Sistemas”, “Médico Cirujano”)"
            className="w-full rounded-2xl border-2 border-ink/10 bg-cream py-3.5 pl-12 pr-4 font-medium outline-none focus:border-brand" />
        </div>
        <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label="Filtrar por área">
          <button type="button" onClick={() => setArea("")} aria-pressed={area === ""} className={`rounded-full px-4 py-2 text-sm font-bold ${area === "" ? "bg-ink text-white" : "bg-ink/5 text-ink/70 hover:bg-ink/10"}`}>Todas</button>
          {areas.map((a) => (
            <button key={a.id} type="button" aria-pressed={area === a.id} onClick={() => setArea(area === a.id ? "" : a.id)}
              className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-bold transition ${area === a.id ? "text-white" : "bg-ink/5 text-ink/70 hover:bg-ink/10"}`} style={area === a.id ? { background: a.color } : undefined}>
              <AreaIcon name={a.icon} className="size-4" /> {a.name}
            </button>
          ))}
        </div>
        <label className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-ink/70">
          <input type="checkbox" checked={onlyWithPrograms} onChange={(e) => setOnly(e.target.checked)} className="size-4 accent-brand" /> Solo carreras con programas registrados en Puebla
        </label>
      </div>

      <p className="mt-6 text-sm font-semibold text-ink/60" role="status" aria-live="polite">{results.length} {results.length === 1 ? "carrera" : "carreras"}</p>
      {results.length === 0 ? (
        <div className="mt-6 rounded-3xl bg-white p-10 text-center ring-1 ring-ink/5">
          <p className="text-lg font-bold">No encontramos carreras con esos criterios.</p>
          <button type="button" onClick={() => { setQuery(""); setArea(""); setOnly(false); }} className="mt-4 inline-flex items-center gap-2 rounded-full bg-brand px-5 py-2.5 font-bold text-white"><X className="size-4" aria-hidden="true" /> Limpiar filtros</button>
        </div>
      ) : (
        <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((c) => <CareerCard key={c.slug} career={c} />)}
        </div>
      )}
    </div>
  );
}
