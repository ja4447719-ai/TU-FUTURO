"use client";

import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import { ArrowUpDown, CalendarCheck, ExternalLink, Locate, Map as MapIcon, MapPin, Scale, Search, ShieldCheck, X } from "lucide-react";
import { MODALITY_LABEL, StatusBadge, TypeBadge, formatDate } from "./Badges";
import type { MapMarker } from "./FinderMap";
import { DEFAULT_PLACE, PLACES, findPlace, formatKm, haversineKm, type Place } from "@/lib/geo";
import type { AreaId, Program, University } from "@/lib/types";

const FinderMap = dynamic(() => import("./FinderMap"), { ssr: false, loading: () => <div className="grid h-[28rem] place-items-center rounded-3xl bg-white text-ink/50 ring-1 ring-ink/10">Cargando mapa…</div> });

interface CareerOpt { slug: string; name: string; area: AreaId }
interface Origin extends Place { source: "default" | "gps" | "manual"; approximate: boolean }
interface Initial { carrera: string; tipo: string; modalidad: string }

const DEFAULT_ORIGIN: Origin = { ...DEFAULT_PLACE, source: "default", approximate: false };
const monogram = (name: string) => name.split(/\s+/).filter((w) => /^[A-ZÁÉÍÓÚ]/.test(w)).slice(0, 2).map((w) => w[0]).join("") || name.slice(0, 2).toUpperCase();

export function Finder({ universities, programs, careers, areas, initial }: { universities: University[]; programs: Program[]; careers: CareerOpt[]; areas: { id: AreaId; name: string }[]; initial: Initial }) {
  const [career, setCareer] = useState(careers.some((c) => c.slug === initial.carrera) ? initial.carrera : "");
  const [type, setType] = useState<"todas" | "publica" | "privada">(initial.tipo === "publica" || initial.tipo === "privada" ? initial.tipo : "todas");
  const [modality, setModality] = useState<"todas" | "presencial" | "online" | "mixta">(["presencial", "online", "mixta"].includes(initial.modalidad) ? (initial.modalidad as "presencial") : "todas");
  const [municipality, setMunicipality] = useState("");
  const [maxKm, setMaxKm] = useState(0);
  const [sort, setSort] = useState<"distancia" | "nombre">("distancia");
  const [view, setView] = useState<"lista" | "mapa">("lista");
  const [origin, setOrigin] = useState<Origin>(DEFAULT_ORIGIN);
  const [placeQuery, setPlaceQuery] = useState("");
  const [placeError, setPlaceError] = useState("");
  const [consent, setConsent] = useState(false);
  const [askGeo, setAskGeo] = useState(false);
  const [geoStatus, setGeoStatus] = useState("");
  const [compare, setCompare] = useState<string[]>([]);

  const uniBySlug = useMemo(() => Object.fromEntries(universities.map((u) => [u.slug, u])), [universities]);
  const municipalities = useMemo(() => Array.from(new Set(universities.map((u) => u.municipality))).sort((a, b) => a.localeCompare(b, "es")), [universities]);
  const distance = (u: University) => haversineKm(origin.lat, origin.lng, u.lat, u.lng);

  const matchesUni = (u: University) =>
    (type === "todas" || u.type === type) && (!municipality || u.municipality === municipality) && (!maxKm || distance(u) <= maxKm);
  const matchesProgram = (p: Program) => p.status !== "outdated" && (modality === "todas" || p.modalities.includes(modality));

  const rows = useMemo(() => {
    const list = programs
      .filter((p) => (career ? p.careerSlug === career : false))
      .filter((p) => matchesProgram(p) && matchesUni(uniBySlug[p.universitySlug]))
      .map((p) => ({ p, u: uniBySlug[p.universitySlug], km: distance(uniBySlug[p.universitySlug]) }));
    return list.sort((a, b) => (sort === "distancia" ? a.km - b.km : a.u.shortName.localeCompare(b.u.shortName, "es")) || a.p.officialName.localeCompare(b.p.officialName, "es"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [programs, career, type, modality, municipality, maxKm, sort, origin, uniBySlug]);

  const uniRows = useMemo(() => {
    if (career) return [];
    return universities
      .filter(matchesUni)
      .map((u) => ({ u, km: distance(u), count: programs.filter((p) => p.universitySlug === u.slug && matchesProgram(p)).length }))
      .filter((r) => r.count > 0)
      .sort((a, b) => (sort === "distancia" ? a.km - b.km : a.u.institution.localeCompare(b.u.institution, "es")));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [universities, programs, career, type, modality, municipality, maxKm, sort, origin]);

  const markers: MapMarker[] = useMemo(() => {
    const src = career ? rows.map((r) => ({ u: r.u, label: r.p.officialName })) : uniRows.map((r) => ({ u: r.u, label: `${r.count} programas` }));
    const seen = new Map<string, MapMarker>();
    for (const { u, label } of src) {
      if (!seen.has(u.slug)) seen.set(u.slug, { id: u.slug, lat: u.lat, lng: u.lng, title: `${u.shortName} · ${u.campus}`, subtitle: label, color: u.type === "publica" ? "#0284c7" : "#7c3aed", approx: u.coordPrecision === "approx" });
    }
    return Array.from(seen.values());
  }, [career, rows, uniRows]);

  function searchPlace(e: React.FormEvent) {
    e.preventDefault();
    const found = findPlace(placeQuery);
    if (!found) {
      setPlaceError("No reconocemos ese lugar. Prueba con un municipio de la lista o un código postal de Puebla (72xxx).");
      return;
    }
    setPlaceError("");
    setOrigin({ ...found, source: "manual" });
  }

  function useGps() {
    if (!navigator.geolocation) {
      setGeoStatus("Tu navegador no admite geolocalización. Usa la búsqueda manual.");
      return;
    }
    setGeoStatus("Obteniendo tu ubicación…");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setOrigin({ name: "Tu ubicación actual", lat: pos.coords.latitude, lng: pos.coords.longitude, municipality: "", source: "gps", approximate: false });
        setGeoStatus("Ubicación obtenida. No se envió a ningún servidor.");
        setAskGeo(false);
      },
      (err) => setGeoStatus(err.code === err.PERMISSION_DENIED ? "No diste permiso de ubicación. Puedes buscar por municipio o código postal." : "No se pudo obtener tu ubicación. Intenta de nuevo o busca manualmente."),
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 },
    );
  }

  const key = (p: Program) => `${p.universitySlug}|${p.officialName}`;
  const toggleCompare = (p: Program) => setCompare((c) => (c.includes(key(p)) ? c.filter((x) => x !== key(p)) : c.length >= 3 ? c : [...c, key(p)]));
  const compareRows = compare.map((k) => rows.find((r) => key(r.p) === k) ?? programs.map((p) => ({ p, u: uniBySlug[p.universitySlug], km: distance(uniBySlug[p.universitySlug]) })).find((r) => key(r.p) === k)).filter((r) => !!r);
  const selectCls = "w-full rounded-xl border-2 border-ink/10 bg-white px-3 py-2.5 text-sm font-semibold outline-none focus:border-brand";
  const careerName = careers.find((c) => c.slug === career)?.name;

  return (
    <div className="grid gap-8 lg:grid-cols-[22rem_1fr]">
      <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
        <section className="rounded-3xl bg-white p-5 ring-1 ring-ink/5" aria-labelledby="f-carrera">
          <h2 id="f-carrera" className="font-extrabold">1. ¿Qué quieres estudiar?</h2>
          <select aria-label="Carrera" className={`${selectCls} mt-3`} value={career} onChange={(e) => setCareer(e.target.value)}>
            <option value="">Todas las carreras (ver universidades)</option>
            {areas.map((a) => (
              <optgroup key={a.id} label={a.name}>
                {careers.filter((c) => c.area === a.id).sort((x, y) => x.name.localeCompare(y.name, "es")).map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
              </optgroup>
            ))}
          </select>
        </section>

        <section className="rounded-3xl bg-white p-5 ring-1 ring-ink/5" aria-labelledby="f-ubic">
          <h2 id="f-ubic" className="font-extrabold">2. ¿Desde dónde buscas?</h2>
          <p className="mt-2 flex items-start gap-2 rounded-xl bg-brand-soft p-3 text-sm"><MapPin className="mt-0.5 size-4 shrink-0 text-brand" aria-hidden="true" /><span><strong>{origin.name}</strong>{origin.source === "default" ? " (punto de partida por defecto)" : ""}{origin.approximate ? " · ubicación aproximada" : ""}</span></p>
          <form onSubmit={searchPlace} className="mt-3 flex gap-2">
            <label htmlFor="lugar" className="sr-only">Ciudad, municipio o código postal</label>
            <input id="lugar" value={placeQuery} onChange={(e) => setPlaceQuery(e.target.value)} placeholder="Municipio o código postal" className="min-w-0 flex-1 rounded-xl border-2 border-ink/10 px-3 py-2.5 text-sm outline-none focus:border-brand" />
            <button className="rounded-xl bg-ink px-4 text-white" aria-label="Buscar ubicación"><Search className="size-4" /></button>
          </form>
          {placeError && <p className="mt-2 text-sm text-rose-700" role="alert">{placeError}</p>}
          <select aria-label="Elegir municipio de referencia" className={`${selectCls} mt-2`} value="" onChange={(e) => { const p = PLACES.find((x) => x.name === e.target.value); if (p) setOrigin({ ...p, source: "manual", approximate: false }); }}>
            <option value="">O elige una ciudad…</option>
            {PLACES.map((p) => <option key={p.name}>{p.name}</option>)}
          </select>
          {!askGeo ? (
            <button type="button" onClick={() => setAskGeo(true)} className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl border-2 border-brand px-4 py-2.5 text-sm font-bold text-brand hover:bg-brand-soft"><Locate className="size-4" aria-hidden="true" /> Usar mi ubicación actual</button>
          ) : (
            <div className="mt-3 rounded-2xl border-2 border-coral/40 bg-coral-soft p-4 text-sm animate-pop">
              <p className="flex gap-2 font-bold"><ShieldCheck className="size-5 shrink-0 text-coral" aria-hidden="true" /> Consentimiento de ubicación</p>
              <p className="mt-2 text-ink/75">Usaremos la ubicación de tu dispositivo solo para calcular distancias en esta página. No se envía ni se guarda en nuestros servidores. Tu navegador te pedirá confirmación.</p>
              <label className="mt-3 flex items-start gap-2 font-semibold"><input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-1 size-4 accent-coral" /> Acepto compartir mi ubicación con esta página.</label>
              <div className="mt-3 flex gap-2">
                <button type="button" disabled={!consent} onClick={useGps} className="flex-1 rounded-xl bg-coral px-3 py-2 font-bold text-white disabled:opacity-40">Permitir</button>
                <button type="button" onClick={() => { setAskGeo(false); setConsent(false); }} className="rounded-xl bg-white px-3 py-2 font-bold ring-1 ring-ink/10">Cancelar</button>
              </div>
            </div>
          )}
          {geoStatus && <p className="mt-2 text-sm text-ink/70" role="status" aria-live="polite">{geoStatus}</p>}
          {origin.source !== "default" && <button type="button" onClick={() => setOrigin(DEFAULT_ORIGIN)} className="mt-2 text-sm font-bold text-ink/60 underline">Restablecer ubicación</button>}
        </section>

        <section className="rounded-3xl bg-white p-5 ring-1 ring-ink/5" aria-labelledby="f-filtros">
          <h2 id="f-filtros" className="font-extrabold">3. Filtros</h2>
          <fieldset className="mt-3"><legend className="text-xs font-bold uppercase tracking-wider text-ink/50">Tipo de institución</legend>
            <div className="mt-2 grid grid-cols-3 gap-1 rounded-xl bg-ink/5 p-1">
              {([["todas", "Todas"], ["publica", "Públicas"], ["privada", "Privadas"]] as const).map(([v, l]) => (
                <button key={v} type="button" aria-pressed={type === v} onClick={() => setType(v)} className={`rounded-lg py-2 text-sm font-bold ${type === v ? "bg-white shadow text-brand-dark" : "text-ink/60"}`}>{l}</button>
              ))}
            </div>
          </fieldset>
          <label className="mt-3 block text-xs font-bold uppercase tracking-wider text-ink/50">Modalidad
            <select className={`${selectCls} mt-1 normal-case tracking-normal`} value={modality} onChange={(e) => setModality(e.target.value as typeof modality)}>
              <option value="todas">Todas</option><option value="presencial">Presencial</option><option value="online">En línea</option><option value="mixta">Mixta</option>
            </select>
          </label>
          <label className="mt-3 block text-xs font-bold uppercase tracking-wider text-ink/50">Municipio
            <select className={`${selectCls} mt-1 normal-case tracking-normal`} value={municipality} onChange={(e) => setMunicipality(e.target.value)}>
              <option value="">Todos</option>{municipalities.map((m) => <option key={m}>{m}</option>)}
            </select>
          </label>
          <label className="mt-3 block text-xs font-bold uppercase tracking-wider text-ink/50">Distancia máxima
            <select className={`${selectCls} mt-1 normal-case tracking-normal`} value={maxKm} onChange={(e) => setMaxKm(Number(e.target.value))}>
              <option value={0}>Sin límite</option><option value={5}>5 km</option><option value={10}>10 km</option><option value={20}>20 km</option><option value={50}>50 km</option>
            </select>
          </label>
        </section>
      </aside>

      <section aria-live="polite">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl font-extrabold">{career ? careerName : "Universidades en Puebla y alrededores"}</h2>
            <p className="text-sm text-ink/60">{career ? `${rows.length} programa${rows.length === 1 ? "" : "s"} encontrado${rows.length === 1 ? "" : "s"}` : `${uniRows.length} sede${uniRows.length === 1 ? "" : "s"} · elige una carrera para ver programas específicos`}</p>
          </div>
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => setSort(sort === "distancia" ? "nombre" : "distancia")} className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-bold ring-1 ring-ink/10"><ArrowUpDown className="size-4" aria-hidden="true" /> {sort === "distancia" ? "Más cercanas primero" : "Orden alfabético"}</button>
            <div className="flex rounded-full bg-ink/5 p-1">
              <button type="button" aria-pressed={view === "lista"} onClick={() => setView("lista")} className={`rounded-full px-4 py-1.5 text-sm font-bold ${view === "lista" ? "bg-white shadow" : "text-ink/60"}`}>Lista</button>
              <button type="button" aria-pressed={view === "mapa"} onClick={() => setView("mapa")} className={`inline-flex items-center gap-1 rounded-full px-4 py-1.5 text-sm font-bold ${view === "mapa" ? "bg-white shadow" : "text-ink/60"}`}><MapIcon className="size-4" aria-hidden="true" /> Mapa</button>
            </div>
          </div>
        </div>
        <p className="mt-3 rounded-xl bg-white p-3 text-xs text-ink/60 ring-1 ring-ink/5">Las distancias son aproximadas, en línea recta desde «{origin.name}» hasta el campus; no consideran rutas ni tráfico. Las sedes marcadas con «~» tienen ubicación estimada.</p>

        {view === "mapa" && <div className="mt-4"><FinderMap markers={markers} origin={{ lat: origin.lat, lng: origin.lng, name: origin.name }} /></div>}

        {compareRows.length > 0 && (
          <div className="mt-6 overflow-x-auto rounded-3xl bg-white p-5 ring-2 ring-brand/30">
            <div className="flex items-center justify-between"><h3 className="flex items-center gap-2 font-extrabold"><Scale className="size-5 text-brand" aria-hidden="true" /> Comparador ({compareRows.length}/3)</h3><button type="button" onClick={() => setCompare([])} className="text-sm font-bold text-ink/60 underline">Limpiar</button></div>
            <table className="mt-3 w-full min-w-[34rem] text-left text-sm">
              <thead><tr className="text-xs uppercase text-ink/50"><th className="py-2 pr-3">Dato</th>{compareRows.map((r) => <th key={key(r!.p)} className="py-2 pr-3">{r!.u.shortName}</th>)}</tr></thead>
              <tbody className="align-top">
                {[
                  ["Programa", (r: NonNullable<(typeof compareRows)[number]>) => r.p.officialName],
                  ["Tipo", (r: NonNullable<(typeof compareRows)[number]>) => (r.u.type === "publica" ? "Pública" : "Privada")],
                  ["Sede", (r: NonNullable<(typeof compareRows)[number]>) => `${r.u.campus}, ${r.u.municipality}`],
                  ["Distancia", (r: NonNullable<(typeof compareRows)[number]>) => `≈ ${formatKm(r.km)}`],
                  ["Modalidad", (r: NonNullable<(typeof compareRows)[number]>) => r.p.modalities.map((m) => MODALITY_LABEL[m]).join(", ")],
                  ["Duración", (r: NonNullable<(typeof compareRows)[number]>) => r.p.duration ?? "Por confirmar"],
                  ["Verificación", (r: NonNullable<(typeof compareRows)[number]>) => `${r.p.status === "verified" ? "Verificado" : r.p.status === "pending" ? "Pendiente" : "Desactualizado"} (${formatDate(r.p.consultedAt)})`],
                ].map(([label, fn]) => (
                  <tr key={label as string} className="border-t border-ink/10"><th scope="row" className="py-2 pr-3 font-bold">{label as string}</th>{compareRows.map((r) => <td key={key(r!.p)} className="py-2 pr-3">{(fn as (r: NonNullable<(typeof compareRows)[number]>) => string)(r!)}</td>)}</tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {view === "lista" && (
          <div className="mt-6 space-y-4">
            {career && rows.length === 0 && (
              <div className="rounded-3xl bg-white p-8 text-center ring-1 ring-ink/5">
                <p className="text-lg font-bold">No encontramos programas verificados con esos filtros.</p>
                <p className="mt-1 text-ink/60">Prueba quitar el límite de distancia o cambiar tipo/modalidad. Que no aparezca un programa no significa que no exista: consulta el sitio de la universidad.</p>
                <button type="button" onClick={() => { setType("todas"); setModality("todas"); setMunicipality(""); setMaxKm(0); }} className="mt-4 inline-flex items-center gap-2 rounded-full bg-brand px-5 py-2.5 font-bold text-white"><X className="size-4" aria-hidden="true" /> Quitar filtros</button>
              </div>
            )}
            {rows.map(({ p, u, km }) => {
              const inCompare = compare.includes(key(p));
              return (
                <article key={key(p)} className="card-lift rounded-3xl bg-white p-5 ring-1 ring-ink/5 sm:p-6">
                  <div className="flex flex-wrap items-start gap-4">
                    <span className="grid size-14 shrink-0 place-items-center rounded-2xl text-lg font-extrabold text-white" style={{ background: u.color }} aria-hidden="true">{monogram(u.shortName)}</span>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2"><TypeBadge type={u.type} /><StatusBadge status={p.status} /></div>
                      <h3 className="mt-2 text-xl font-extrabold leading-snug">{u.institution}</h3>
                      <p className="text-sm font-semibold text-brand-dark">{u.campus}</p>
                    </div>
                    <div className="text-right"><p className="text-2xl font-extrabold text-coral">≈ {u.coordPrecision === "approx" ? "~" : ""}{formatKm(km)}</p><p className="text-xs text-ink/50">en línea recta</p></div>
                  </div>
                  <dl className="mt-4 grid gap-x-6 gap-y-2 text-sm sm:grid-cols-2">
                    <div><dt className="font-bold text-ink/50">Programa oficial</dt><dd className="font-semibold">{p.officialName}</dd></div>
                    <div><dt className="font-bold text-ink/50">Modalidad</dt><dd>{p.modalities.map((m) => MODALITY_LABEL[m]).join(", ")}</dd></div>
                    <div><dt className="font-bold text-ink/50">Duración</dt><dd>{p.duration ?? "Por confirmar en el plan de estudios"}</dd></div>
                    <div><dt className="font-bold text-ink/50">Dirección</dt><dd>{u.address}{u.postalCode ? `, C.P. ${u.postalCode}` : ""}. {u.city}, {u.state}</dd></div>
                  </dl>
                  {p.note && <p className="mt-3 rounded-xl bg-amber-50 p-3 text-sm text-amber-900">{p.note}</p>}
                  <p className="mt-3 flex items-center gap-2 text-xs text-ink/60"><CalendarCheck className="size-4" aria-hidden="true" /> Consultado el {formatDate(p.consultedAt)} · Fuente: {p.source}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <a href={p.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-full bg-ink px-4 py-2 text-sm font-bold text-white">Programa académico <ExternalLink className="size-3.5" aria-hidden="true" /></a>
                    <a href={u.website} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-full bg-brand-soft px-4 py-2 text-sm font-bold text-brand-dark">Sitio oficial <ExternalLink className="size-3.5" aria-hidden="true" /></a>
                    <a href={u.admissionsUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-full bg-brand-soft px-4 py-2 text-sm font-bold text-brand-dark">Admisiones <ExternalLink className="size-3.5" aria-hidden="true" /></a>
                    <button type="button" aria-pressed={inCompare} onClick={() => toggleCompare(p)} disabled={!inCompare && compare.length >= 3} className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-bold ring-1 disabled:opacity-40 ${inCompare ? "bg-coral text-white ring-coral" : "bg-white ring-ink/15"}`}><Scale className="size-3.5" aria-hidden="true" /> {inCompare ? "En comparador" : "Comparar"}</button>
                  </div>
                </article>
              );
            })}

            {!career && uniRows.map(({ u, km, count }) => (
              <article key={u.slug} className="card-lift flex flex-wrap items-center gap-4 rounded-3xl bg-white p-5 ring-1 ring-ink/5">
                <span className="grid size-14 shrink-0 place-items-center rounded-2xl text-lg font-extrabold text-white" style={{ background: u.color }} aria-hidden="true">{monogram(u.shortName)}</span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2"><TypeBadge type={u.type} /><span className="text-xs font-semibold text-ink/50">{u.municipality}</span></div>
                  <h3 className="mt-1 font-extrabold">{u.institution}</h3>
                  <p className="text-sm text-ink/60">{u.campus} · {count} programas registrados</p>
                </div>
                <div className="text-right"><p className="text-xl font-extrabold text-coral">≈ {u.coordPrecision === "approx" ? "~" : ""}{formatKm(km)}</p>
                  <a href={u.website} target="_blank" rel="noopener noreferrer" className="text-sm font-bold text-brand hover:underline">Sitio oficial</a></div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
