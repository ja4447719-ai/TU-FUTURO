import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Briefcase, Clock, ExternalLink, GraduationCap, Lightbulb, MapPin, Sparkles, Wrench } from "lucide-react";
import { AreaIcon } from "@/components/AreaIcon";
import { MODALITY_LABEL, StatusBadge, TypeBadge, formatDate } from "@/components/Badges";
import { AREA_BY_ID } from "@/data/areas";
import { LABELS, parseProfile } from "@/lib/dimensions";
import { getCatalog } from "@/lib/catalog";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const career = (await getCatalog()).careers.find((c) => c.slug === slug);
  return career ? { title: career.name, description: career.description } : { title: "Carrera no encontrada" };
}

function List({ items }: { items: string[] }) {
  return <ul className="mt-3 grid gap-2 sm:grid-cols-2">{items.map((i) => <li key={i} className="rounded-xl bg-cream px-3 py-2 text-sm font-medium">{i}</li>)}</ul>;
}

export default async function CareerPage({ params }: Props) {
  const { slug } = await params;
  const catalog = await getCatalog();
  const career = catalog.careers.find((c) => c.slug === slug);
  if (!career) notFound();

  const area = AREA_BY_ID[career.area];
  const programs = catalog.programs.filter((p) => p.careerSlug === slug);
  const unis = Object.fromEntries(catalog.universities.map((u) => [u.slug, u]));
  const related = career.related.map((s) => catalog.careers.find((c) => c.slug === s)).filter((c) => !!c);
  const profile = Object.entries(parseProfile(career.profile))
    .filter(([code, v]) => (v ?? 0) >= 2 && ["ci", "te", "sa", "ar", "ne", "ed", "so", "na", "co", "cm"].includes(code))
    .map(([code]) => LABELS[code]);
  const sources = Array.from(new Map(programs.map((p) => [p.url, p.source])).entries()).slice(0, 8);

  return (
    <article>
      <header className="text-white" style={{ background: `linear-gradient(135deg, ${area.color}, #16133d)` }}>
        <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
          <Link href={`/carreras?area=${area.id}`} className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-sm font-bold"><AreaIcon name={area.icon} className="size-4" /> {area.name}</Link>
          <h1 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl">{career.name}</h1>
          <p className="mt-3 max-w-2xl text-lg text-white/85">{career.description}</p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-semibold"><Clock className="size-4" aria-hidden="true" /> Duración orientativa: {career.duration}</span>
            <Link href={`/universidades?carrera=${career.slug}`} className="inline-flex items-center gap-2 rounded-full bg-coral px-6 py-3 font-bold text-white shadow-xl">
              <MapPin className="size-5" aria-hidden="true" /> Encontrar universidades ({programs.length}) <ArrowRight className="size-5" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-5xl space-y-6 px-4 py-10 sm:px-6">
        <section className="rounded-3xl bg-white p-6 ring-1 ring-ink/5 sm:p-8">
          <h2 className="flex items-center gap-2 text-2xl font-extrabold"><GraduationCap className="text-brand" aria-hidden="true" /> Qué se estudia</h2>
          <p className="mt-3 leading-relaxed text-ink/80">{career.studies}</p>
          <h3 className="mt-6 font-extrabold">Materias habituales</h3>
          <List items={career.subjects} />
          {career.aliases.length > 0 && (<><h3 className="mt-6 font-extrabold">Denominaciones oficiales que puedes encontrar</h3><p className="mt-2 text-sm text-ink/70">{career.aliases.join(" · ")}</p></>)}
        </section>

        <div className="grid gap-6 md:grid-cols-2">
          <section className="rounded-3xl bg-white p-6 ring-1 ring-ink/5">
            <h2 className="flex items-center gap-2 text-xl font-extrabold"><Sparkles className="text-coral" aria-hidden="true" /> Habilidades relacionadas</h2>
            <List items={career.skills} />
            {profile.length > 0 && <><h3 className="mt-5 font-extrabold">Perfil de intereses</h3><p className="mt-2 flex flex-wrap gap-2">{profile.map((p) => <span key={p} className="rounded-full bg-brand-soft px-3 py-1 text-sm font-semibold text-brand-dark">{p}</span>)}</p></>}
          </section>
          <section className="rounded-3xl bg-white p-6 ring-1 ring-ink/5">
            <h2 className="flex items-center gap-2 text-xl font-extrabold"><Wrench className="text-mint" aria-hidden="true" /> Qué hace el profesional</h2>
            <List items={career.activities} />
          </section>
          <section className="rounded-3xl bg-white p-6 ring-1 ring-ink/5">
            <h2 className="flex items-center gap-2 text-xl font-extrabold"><Briefcase className="text-brand" aria-hidden="true" /> Campos de trabajo</h2>
            <List items={career.fields} />
          </section>
          <section className="rounded-3xl bg-white p-6 ring-1 ring-ink/5">
            <h2 className="text-xl font-extrabold">Especializaciones posibles</h2>
            <List items={career.specializations} />
          </section>
        </div>

        <section className="rounded-3xl bg-coral-soft p-6 ring-1 ring-coral/20">
          <h2 className="flex items-center gap-2 text-xl font-extrabold"><Lightbulb className="text-coral" aria-hidden="true" /> Retos a considerar</h2>
          <p className="mt-2 text-ink/80">{career.challenges}</p>
        </section>

        {related.length > 0 && (
          <section>
            <h2 className="text-2xl font-extrabold">Carreras relacionadas</h2>
            <div className="mt-4 flex flex-wrap gap-3">
              {related.map((r) => <Link key={r!.slug} href={`/carreras/${r!.slug}`} className="card-lift rounded-2xl bg-white px-5 py-3 font-bold ring-1 ring-ink/5">{r!.name}</Link>)}
            </div>
          </section>
        )}

        <section aria-labelledby="donde" className="rounded-3xl bg-white p-6 ring-1 ring-ink/5 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 id="donde" className="text-2xl font-extrabold">Universidades donde puede estudiarse</h2>
            <Link href={`/universidades?carrera=${career.slug}`} className="font-bold text-brand hover:underline">Abrir buscador con mapa y filtros →</Link>
          </div>
          {programs.length === 0 ? (
            <p className="mt-4 rounded-2xl bg-amber-50 p-4 text-sm text-amber-900">Aún no hemos confirmado programas de esta carrera en las universidades registradas de Puebla. No la presentamos como oferta disponible hasta verificarla en una fuente oficial.</p>
          ) : (
            <ul className="mt-5 divide-y divide-ink/10">
              {programs.map((p) => {
                const u = unis[p.universitySlug];
                return (
                  <li key={`${p.universitySlug}-${p.officialName}`} className="flex flex-wrap items-start justify-between gap-3 py-4">
                    <div>
                      <p className="font-extrabold">{u.shortName} · {u.campus}</p>
                      <p className="text-sm text-ink/70">{p.officialName} · {p.modalities.map((m) => MODALITY_LABEL[m]).join(", ")}</p>
                      <p className="mt-1 flex flex-wrap items-center gap-2"><TypeBadge type={u.type} /><StatusBadge status={p.status} /><span className="text-xs text-ink/50">Consultado el {formatDate(p.consultedAt)}</span></p>
                    </div>
                    <a href={p.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm font-bold text-brand hover:underline">Fuente oficial <ExternalLink className="size-4" aria-hidden="true" /></a>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        <section className="rounded-3xl bg-white p-6 text-sm text-ink/70 ring-1 ring-ink/5">
          <h2 className="text-lg font-extrabold text-ink">Fuentes de información</h2>
          <ul className="mt-3 list-disc space-y-1 pl-5">
            <li>Descripción, materias, habilidades y retos: elaboración propia de TuFuturo a partir de planes de estudio habituales de las universidades listadas; la duración es orientativa y varía por institución.</li>
            {sources.map(([url, label]) => <li key={url}><a className="font-semibold text-brand hover:underline" href={url} target="_blank" rel="noopener noreferrer">{label}</a></li>)}
            <li><a className="font-semibold text-brand hover:underline" href="https://www.observatoriolaboral.gob.mx" target="_blank" rel="noopener noreferrer">Observatorio Laboral de México (Gobierno de México)</a> – información de ocupación e ingresos por carrera.</li>
            <li><a className="font-semibold text-brand hover:underline" href="https://www.anuies.mx" target="_blank" rel="noopener noreferrer">ANUIES</a> – Asociación Nacional de Universidades e Instituciones de Educación Superior.</li>
          </ul>
        </section>
      </div>
    </article>
  );
}
