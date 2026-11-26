"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AlertTriangle, ArrowRight, Building2, Compass, Info, Lightbulb, RotateCcw } from "lucide-react";
import { AREA_BY_ID } from "@/data/areas";
import { loadSaved } from "./Quiz";
import type { AreaId } from "@/lib/types";

interface Rec { slug: string; name: string; area: AreaId; areaName: string; affinity: number; reasons: string[]; watchOut: string[]; programs: number }
interface Detail { description: string; subjects: string[]; skills: string[]; activities: string[]; related: { slug: string; name: string }[] }
interface Data {
  answered: number;
  interestProfile: { code: string; label: string; value: number }[];
  topSkills: { code: string; label: string; value: number }[];
  topStyles: { code: string; label: string; value: number }[];
  areas: { id: AreaId; name: string; score: number }[];
  recommended: Rec[];
  discover: Rec[];
  details: Record<string, Detail>;
  preferences: string[];
}

const PREF_TEXT: Record<string, string> = {
  publica: "Costo accesible: filtra universidades públicas", cercania: "Cercanía: ordena por distancia", becas: "Becas: consulta admisiones de cada universidad",
  online: "Modalidad en línea o mixta", practica: "Enfoque práctico", internacional: "Intercambios internacionales", privada: "Universidades privadas", vida: "Vida estudiantil",
};

function finderLink(slug: string, prefs: string[]) {
  const p = new URLSearchParams({ carrera: slug });
  if (prefs.includes("publica") && !prefs.includes("privada")) p.set("tipo", "publica");
  else if (prefs.includes("privada") && !prefs.includes("publica")) p.set("tipo", "privada");
  if (prefs.includes("online")) p.set("modalidad", "online");
  return `/universidades?${p.toString()}`;
}

function Ring({ value, color }: { value: number; color: string }) {
  const r = 28;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative size-20 shrink-0" role="img" aria-label={`Afinidad orientativa: ${value}%`}>
      <svg viewBox="0 0 72 72" className="size-full -rotate-90">
        <circle cx="36" cy="36" r={r} fill="none" stroke="#16133d12" strokeWidth="8" />
        <circle cx="36" cy="36" r={r} fill="none" stroke={color} strokeWidth="8" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - value / 100)} style={{ transition: "stroke-dashoffset 1s ease" }} />
      </svg>
      <span className="absolute inset-0 grid place-items-center text-lg font-extrabold">{value}%</span>
    </div>
  );
}

export function Results() {
  const [state, setState] = useState<"loading" | "empty" | "error" | "ready">("loading");
  const [data, setData] = useState<Data | null>(null);

  useEffect(() => {
    const saved = loadSaved();
    if (!saved || Object.keys(saved.answers).length < 5) {
      setState("empty");
      return;
    }
    fetch("/api/quiz/score", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ answers: saved.answers }) })
      .then(async (res) => {
        if (!res.ok) throw new Error(String(res.status));
        setData((await res.json()) as Data);
        setState("ready");
      })
      .catch(() => setState("error"));
  }, []);

  if (state === "loading") return <div className="mx-auto max-w-3xl px-4 py-32 text-center text-ink/60" role="status">Calculando tus resultados…</div>;
  if (state !== "ready" || !data) {
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center">
        <h1 className="text-3xl font-extrabold">{state === "empty" ? "Aún no hay resultados" : "No pudimos calcular tus resultados"}</h1>
        <p className="mt-3 text-ink/70">{state === "empty" ? "Responde el test (al menos 5 preguntas) para ver tus recomendaciones." : "Intenta de nuevo en unos momentos. Tus respuestas siguen guardadas en tu navegador."}</p>
        <Link href="/test" className="mt-6 inline-flex rounded-full bg-coral px-7 py-3 font-bold text-white">Ir al test</Link>
      </div>
    );
  }

  const topAreas = data.areas.slice(0, 3);
  return (
    <div>
      <section className="bg-hero">
        <div className="mx-auto max-w-5xl px-4 py-12 text-center sm:py-16">
          <p className="text-sm font-bold uppercase tracking-widest text-coral">Tus resultados</p>
          <h1 className="mt-2 text-4xl font-extrabold tracking-tight sm:text-5xl">Tu mapa vocacional</h1>
          <p className="mx-auto mt-3 max-w-2xl text-ink/70">
            Estas carreras coinciden con lo que respondiste. Úsalas como punto de partida para explorar: <strong>no son una decisión ni una predicción de éxito</strong>.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-5xl space-y-14 px-4 pb-10">
        <section aria-labelledby="perfil" className="grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl bg-white p-6 ring-1 ring-ink/5">
            <h2 id="perfil" className="text-xl font-extrabold">Tu perfil de intereses</h2>
            <ul className="mt-4 space-y-3">
              {data.interestProfile.map((i) => (
                <li key={i.code}>
                  <div className="flex justify-between text-sm font-semibold"><span>{i.label}</span><span className="text-ink/50">{i.value}%</span></div>
                  <div className="mt-1 h-2.5 rounded-full bg-ink/10"><div className="h-full rounded-full bg-gradient-to-r from-brand to-coral" style={{ width: `${i.value}%` }} /></div>
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-6">
            <div className="rounded-3xl bg-white p-6 ring-1 ring-ink/5">
              <h2 className="text-xl font-extrabold">Áreas profesionales compatibles</h2>
              <ul className="mt-4 space-y-3">
                {topAreas.map((a) => (
                  <li key={a.id}>
                    <Link href={`/carreras?area=${a.id}`} className="flex items-center justify-between rounded-2xl p-3 text-white" style={{ background: AREA_BY_ID[a.id].color }}>
                      <span className="font-bold">{a.name}</span><span className="rounded-full bg-white/25 px-3 py-1 text-sm font-bold">{a.score}%</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-3xl bg-white p-6 ring-1 ring-ink/5">
              <h2 className="text-lg font-extrabold">Lo que más destacó en ti</h2>
              <p className="mt-2 text-sm text-ink/70"><strong>Materias y habilidades:</strong> {data.topSkills.map((s) => s.label).join(", ") || "—"}</p>
              <p className="mt-2 text-sm text-ink/70"><strong>Forma de trabajar:</strong> {data.topStyles.map((s) => s.label).join(", ") || "—"}</p>
            </div>
          </div>
        </section>

        <section aria-labelledby="carreras">
          <h2 id="carreras" className="text-3xl font-extrabold">Carreras recomendadas para explorar</h2>
          <p className="mt-1 flex items-start gap-2 text-sm text-ink/60"><Info className="mt-0.5 size-4 shrink-0" aria-hidden="true" /> El porcentaje indica qué tanto coincide la carrera con tus respuestas. No es una probabilidad de éxito.</p>
          <ol className="mt-6 space-y-6">
            {data.recommended.map((r, idx) => {
              const d = data.details[r.slug];
              const color = AREA_BY_ID[r.area].color;
              return (
                <li key={r.slug} className="card-lift rounded-3xl bg-white p-6 ring-1 ring-ink/5 sm:p-8">
                  <div className="flex flex-wrap items-center gap-5">
                    <Ring value={r.affinity} color={color} />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold uppercase tracking-wider" style={{ color }}>#{idx + 1} · {r.areaName}</p>
                      <h3 className="text-2xl font-extrabold">{r.name}</h3>
                      {d && <p className="mt-1 text-ink/70">{d.description}</p>}
                    </div>
                  </div>
                  <div className="mt-6 grid gap-6 md:grid-cols-2">
                    <div>
                      <h4 className="flex items-center gap-2 font-extrabold"><Lightbulb className="size-4 text-sun" aria-hidden="true" /> Por qué te la recomendamos</h4>
                      <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-ink/75">{r.reasons.map((x) => <li key={x}>{x}</li>)}</ul>
                      <h4 className="mt-4 flex items-center gap-2 font-extrabold"><AlertTriangle className="size-4 text-coral" aria-hidden="true" /> Retos a considerar</h4>
                      <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-ink/75">{r.watchOut.map((x) => <li key={x}>{x}</li>)}</ul>
                    </div>
                    {d && (
                      <div className="space-y-4 text-sm">
                        <div><h4 className="font-extrabold">Materias y habilidades</h4><p className="mt-1 text-ink/75">{d.subjects.slice(0, 4).join(" · ")}</p><p className="text-ink/60">{d.skills.slice(0, 3).join(" · ")}</p></div>
                        <div><h4 className="font-extrabold">Actividades habituales</h4><p className="mt-1 text-ink/75">{d.activities.join(" · ")}</p></div>
                        <div>
                          <h4 className="font-extrabold">Carreras alternativas o relacionadas</h4>
                          <p className="mt-1 flex flex-wrap gap-2">{d.related.map((x) => <Link key={x.slug} href={`/carreras/${x.slug}`} className="rounded-full bg-brand-soft px-3 py-1 font-semibold text-brand-dark hover:bg-brand hover:text-white">{x.name}</Link>)}</p>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="mt-6 flex flex-wrap gap-3">
                    <Link href={`/carreras/${r.slug}`} className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-bold text-white"><Compass className="size-4" aria-hidden="true" /> Ver ficha completa</Link>
                    <Link href={finderLink(r.slug, data.preferences)} className="inline-flex items-center gap-2 rounded-full bg-coral px-5 py-2.5 text-sm font-bold text-white"><Building2 className="size-4" aria-hidden="true" /> Encontrar universidades ({r.programs}) <ArrowRight className="size-4" aria-hidden="true" /></Link>
                  </div>
                </li>
              );
            })}
          </ol>
        </section>

        {data.discover.length > 0 && (
          <section aria-labelledby="descubre" className="rounded-3xl bg-brand-soft p-6 sm:p-8">
            <h2 id="descubre" className="text-2xl font-extrabold">Quizá no sabías que existían</h2>
            <p className="mt-1 text-ink/70">Carreras de otras áreas que también coinciden con parte de tu perfil.</p>
            <div className="mt-5 grid gap-4 md:grid-cols-3">
              {data.discover.map((r) => (
                <Link key={r.slug} href={`/carreras/${r.slug}`} className="card-lift rounded-2xl bg-white p-5">
                  <p className="text-xs font-bold uppercase" style={{ color: AREA_BY_ID[r.area].color }}>{r.areaName}</p>
                  <h3 className="mt-1 font-extrabold">{r.name}</h3>
                  <p className="mt-1 text-sm text-ink/60">Coincidencia {r.affinity}% · {r.programs} programas</p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {data.preferences.length > 0 && (
          <section className="rounded-3xl bg-white p-6 ring-1 ring-ink/5">
            <h2 className="text-lg font-extrabold">Tus prioridades al elegir universidad</h2>
            <p className="mt-2 flex flex-wrap gap-2">{data.preferences.map((p) => <span key={p} className="rounded-full bg-coral-soft px-3 py-1 text-sm font-semibold text-coral">{PREF_TEXT[p] ?? p}</span>)}</p>
          </section>
        )}

        <div className="flex flex-wrap justify-center gap-3">
          <Link href="/test" className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 font-bold ring-1 ring-ink/10"><RotateCcw className="size-4" aria-hidden="true" /> Revisar o repetir el test</Link>
          <Link href="/carreras" className="rounded-full bg-ink px-6 py-3 font-bold text-white">Explorar todas las carreras</Link>
        </div>
      </div>
    </div>
  );
}
