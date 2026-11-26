import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Compass, GraduationCap, MapPin, Rocket, Search, ShieldCheck, Sparkles, Target, Users } from "lucide-react";
import { AreaIcon } from "@/components/AreaIcon";
import { CareerCard } from "@/components/CareerCard";
import { FaqList } from "@/components/FaqList";
import { FAQ } from "@/data/faq";
import { getCatalog, programCountByCareer } from "@/lib/catalog";

export const revalidate = 3600;

const FEATURED = ["medicina", "ingenieria-software", "psicologia", "derecho", "arquitectura", "ciencia-de-datos"];

export default async function HomePage() {
  const catalog = await getCatalog();
  const counts = programCountByCareer(catalog.programs);
  const featured = FEATURED.map((s) => catalog.careers.find((c) => c.slug === s)).filter((c) => !!c);
  const institutions = new Set(catalog.universities.map((u) => u.institution)).size;

  return (
    <>
      <section className="bg-hero overflow-hidden">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-14 sm:px-6 lg:grid-cols-2 lg:py-24">
          <div className="animate-rise">
            <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-1.5 text-sm font-bold text-brand-dark shadow-sm ring-1 ring-ink/5">
              <Sparkles className="size-4 text-coral" aria-hidden="true" /> Orientación vocacional gratuita · Sin cuenta
            </span>
            <h1 className="mt-6 text-4xl font-extrabold leading-[1.05] tracking-tight text-ink sm:text-5xl lg:text-6xl">
              Descubre tu camino. <span className="bg-gradient-to-r from-brand to-coral bg-clip-text text-transparent">Construye tu futuro.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink/70">
              Descubre las carreras que conectan con tus intereses, conoce nuevas posibilidades y encuentra dónde comenzar tu futuro profesional.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/test" className="inline-flex items-center gap-2 rounded-full bg-coral px-7 py-3.5 font-bold text-white shadow-xl shadow-coral/30 transition hover:-translate-y-0.5">
                Descubrir mi carrera <ArrowRight className="size-5" aria-hidden="true" />
              </Link>
              <Link href="/carreras" className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 font-bold text-ink ring-1 ring-ink/10 transition hover:-translate-y-0.5 hover:ring-brand">
                Explorar carreras
              </Link>
            </div>
            <dl className="mt-10 grid max-w-md grid-cols-3 gap-4">
              {[[catalog.careers.length, "carreras"], [institutions, "universidades"], [catalog.programs.length, "programas"]].map(([n, l]) => (
                <div key={String(l)}>
                  <dt className="sr-only">{l}</dt>
                  <dd className="text-3xl font-extrabold text-brand">{n}</dd>
                  <dd className="text-sm font-semibold text-ink/60">{l}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="relative mx-auto w-full max-w-xl animate-rise" style={{ animationDelay: "0.15s" }}>
            <div className="absolute -inset-4 -z-10 rotate-3 rounded-[2.5rem] bg-gradient-to-br from-brand to-coral opacity-20" />
            <Image src="/images/hero.jpg" alt="Estudiantes mirando hacia su futuro en un campus de Puebla" width={900} height={900} priority className="aspect-[4/4.2] w-full rounded-[2rem] object-cover shadow-2xl" />
            <div className="animate-floaty absolute -left-3 top-8 flex items-center gap-3 rounded-2xl bg-white p-3 pr-5 shadow-xl sm:-left-8">
              <span className="grid size-10 place-items-center rounded-xl bg-mint text-white"><Target className="size-5" aria-hidden="true" /></span>
              <div><p className="text-xs text-ink/60">Así se verá tu resultado</p><p className="font-extrabold">Carrera + afinidad orientativa</p></div>
            </div>
            <div className="animate-floaty absolute -right-2 bottom-10 flex items-center gap-3 rounded-2xl bg-white p-3 pr-5 shadow-xl sm:-right-8" style={{ animationDelay: "1.5s" }}>
              <span className="grid size-10 place-items-center rounded-xl bg-coral text-white"><MapPin className="size-5" aria-hidden="true" /></span>
              <div><p className="text-xs text-ink/60">Universidades cercanas</p><p className="font-extrabold">Puebla y alrededores</p></div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6" aria-labelledby="como">
        <div className="text-center">
          <p className="text-sm font-bold uppercase tracking-widest text-coral">Cómo funciona</p>
          <h2 id="como" className="mt-2 text-3xl font-extrabold sm:text-4xl">De la duda a tu universidad en 3 pasos</h2>
        </div>
        <ol className="mt-12 grid gap-6 md:grid-cols-3">
          {[
            { i: Compass, t: "1. Cuéntanos de ti", d: "Responde un test breve sobre tus intereses, materias favoritas y cómo te imaginas trabajando. Dura unos 5 minutos.", c: "bg-brand" },
            { i: Sparkles, t: "2. Descubre carreras", d: "Recibe de 5 a 8 recomendaciones con su justificación, retos reales y carreras relacionadas que quizá no conocías.", c: "bg-coral" },
            { i: GraduationCap, t: "3. Encuentra dónde estudiar", d: "Abre el buscador con tu carrera ya seleccionada, filtra por tipo, modalidad y distancia, y visita las fuentes oficiales.", c: "bg-mint" },
          ].map((s) => (
            <li key={s.t} className="card-lift rounded-3xl bg-white p-7 ring-1 ring-ink/5">
              <span className={`grid size-12 place-items-center rounded-2xl text-white ${s.c}`}><s.i className="size-6" aria-hidden="true" /></span>
              <h3 className="mt-5 text-xl font-extrabold">{s.t}</h3>
              <p className="mt-2 leading-relaxed text-ink/70">{s.d}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="bg-white py-20" aria-labelledby="areas">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm font-bold uppercase tracking-widest text-coral">Áreas profesionales</p>
              <h2 id="areas" className="mt-2 text-3xl font-extrabold sm:text-4xl">Descubre las áreas profesionales</h2>
            </div>
            <Link href="/carreras" className="font-bold text-brand hover:underline">Ver todas las carreras →</Link>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {catalog.areas.map((a) => (
              <Link key={a.id} href={`/carreras?area=${a.id}`} className="card-lift group rounded-3xl p-6 text-white" style={{ background: `linear-gradient(135deg, ${a.color}, ${a.color}cc)` }}>
                <AreaIcon name={a.icon} className="size-8" />
                <h3 className="mt-6 text-lg font-extrabold leading-tight">{a.name}</h3>
                <p className="mt-2 line-clamp-3 text-sm text-white/85">{a.description}</p>
                <p className="mt-4 text-sm font-bold">{catalog.careers.filter((c) => c.area === a.id).length} carreras →</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6" aria-labelledby="explora">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-coral">Catálogo</p>
            <h2 id="explora" className="mt-2 text-3xl font-extrabold sm:text-4xl">Explora diferentes carreras</h2>
            <p className="mt-2 max-w-2xl text-ink/70">Cada ficha explica qué se estudia, qué hace el profesional, dónde trabaja y qué universidades la ofrecen.</p>
          </div>
          <Link href="/carreras" className="inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 font-bold text-white"><Search className="size-4" aria-hidden="true" /> Explorar todas</Link>
        </div>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((c) => <CareerCard key={c!.slug} career={{ ...c!, programs: counts[c!.slug] ?? 0 }} />)}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6" aria-labelledby="unis">
        <div className="grid items-center gap-10 overflow-hidden rounded-[2.5rem] bg-ink text-white lg:grid-cols-2">
          <div className="p-8 sm:p-12">
            <p className="text-sm font-bold uppercase tracking-widest text-sun">Universidades</p>
            <h2 id="unis" className="mt-2 text-3xl font-extrabold sm:text-4xl">Encuentra dónde estudiar</h2>
            <p className="mt-4 text-white/75">Elige una carrera y descubre qué instituciones de Puebla y alrededores la imparten, con su programa oficial y la fuente donde lo verificamos.</p>
            <ul className="mt-6 space-y-3 text-white/90">
              {["Públicas y privadas, con filtros claros", "Distancia aproximada desde tu ubicación o municipio", "Modalidad presencial, en línea o mixta", "Mapa interactivo y comparador de programas"].map((t) => (
                <li key={t} className="flex gap-3"><ShieldCheck className="mt-0.5 size-5 shrink-0 text-mint" aria-hidden="true" />{t}</li>
              ))}
            </ul>
            <Link href="/universidades" className="mt-8 inline-flex items-center gap-2 rounded-full bg-coral px-7 py-3.5 font-bold text-white">Buscar universidades <ArrowRight className="size-5" aria-hidden="true" /></Link>
          </div>
          <Image src="/images/campus.jpg" alt="Estudiantes en un campus universitario" width={900} height={700} className="h-full min-h-72 w-full object-cover" />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6" aria-labelledby="beneficios">
        <div className="text-center">
          <p className="text-sm font-bold uppercase tracking-widest text-coral">Beneficios</p>
          <h2 id="beneficios" className="mt-2 text-3xl font-extrabold sm:text-4xl">¿Por qué orientarte antes de elegir?</h2>
        </div>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { i: Target, t: "Elige con más claridad", d: "Conoce tus intereses y fortalezas antes de decidir." },
            { i: Rocket, t: "Descubre opciones nuevas", d: "Hay muchas más carreras que Medicina, Derecho o Ingeniería." },
            { i: Users, t: "Reduce el riesgo de cambiar", d: "Entender qué se estudia y a qué te dedicarás evita sorpresas." },
            { i: ShieldCheck, t: "Información confiable", d: "Cada programa cita su fuente oficial y su fecha de consulta." },
          ].map((b) => (
            <div key={b.t} className="rounded-3xl bg-brand-soft p-6">
              <b.i className="size-8 text-brand" aria-hidden="true" />
              <h3 className="mt-4 text-lg font-extrabold">{b.t}</h3>
              <p className="mt-1 text-sm leading-relaxed text-ink/70">{b.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6" aria-labelledby="faq">
        <div className="mb-8 text-center">
          <p className="text-sm font-bold uppercase tracking-widest text-coral">Preguntas frecuentes</p>
          <h2 id="faq" className="mt-2 text-3xl font-extrabold sm:text-4xl">Resolvemos tus dudas</h2>
        </div>
        <FaqList items={FAQ.slice(0, 5)} />
        <div className="mt-10 rounded-[2rem] bg-gradient-to-r from-brand to-brand-dark p-10 text-center text-white">
          <h2 className="text-3xl font-extrabold">¿Listo para descubrir tu camino?</h2>
          <p className="mx-auto mt-2 max-w-xl text-white/80">El test es gratuito, no pide datos personales y toma solo unos minutos.</p>
          <Link href="/test" className="mt-6 inline-flex rounded-full bg-coral px-8 py-3.5 font-bold text-white shadow-xl">Comenzar el test</Link>
        </div>
      </section>
    </>
  );
}
