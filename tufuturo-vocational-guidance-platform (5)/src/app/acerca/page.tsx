import type { Metadata } from "next";
import Link from "next/link";
import { getCatalog } from "@/lib/catalog";
import { WEIGHTS } from "@/lib/scoring";

export const metadata: Metadata = { title: "Acerca de TuFuturo", description: "Qué es TuFuturo, cómo se calculan los resultados del test y cómo verificamos la información de universidades." };
export const dynamic = "force-dynamic";

export default async function AboutPage() {
  const catalog = await getCatalog();
  const institutions = Array.from(new Map(catalog.universities.map((u) => [u.institution, u.website])).entries());
  return (
    <div className="mx-auto max-w-3xl space-y-10 px-4 py-14 sm:px-6">
      <header>
        <p className="text-sm font-bold uppercase tracking-widest text-coral">Acerca de</p>
        <h1 className="mt-2 text-4xl font-extrabold tracking-tight">Orientación vocacional clara y honesta</h1>
        <p className="mt-4 text-lg leading-relaxed text-ink/75">TuFuturo ayuda a estudiantes de preparatoria a descubrir carreras, entender qué implican y encontrar dónde estudiarlas en Puebla y alrededores. Es gratuita, no requiere cuenta y no depende de servicios de inteligencia artificial de pago.</p>
      </header>

      <section className="rounded-3xl bg-white p-7 ring-1 ring-ink/5">
        <h2 className="text-2xl font-extrabold">Cómo se calculan los resultados</h2>
        <ol className="mt-4 list-decimal space-y-2 pl-5 leading-relaxed text-ink/80">
          <li>Cada respuesta suma puntos a tres familias de dimensiones: <strong>intereses</strong> (10), <strong>materias y habilidades</strong> (11) y <strong>preferencias de trabajo</strong> (12). Las actividades que prefieres evitar restan puntos.</li>
          <li>Dentro de cada familia, tus puntos se normalizan para que tu dimensión más fuerte valga 1.</li>
          <li>Cada carrera tiene un perfil con esas mismas dimensiones (valores de 1 a 3). La coincidencia de cada familia es el promedio ponderado de tu puntaje en las dimensiones que la carrera valora.</li>
          <li>La afinidad final combina las familias con pesos fijos: intereses {WEIGHTS.interests * 100}%, preferencias de trabajo {WEIGHTS.styles * 100}% y habilidades {WEIGHTS.skills * 100}%. Si marcaste un área de interés, suma un pequeño bono de 6 puntos.</li>
          <li>Se muestran de 5 a 8 carreras (máximo 4 por área para ampliar tus opciones) y 3 carreras de otras áreas que quizá no conocías.</li>
        </ol>
        <p className="mt-4 rounded-2xl bg-amber-50 p-4 text-sm text-amber-900"><strong>Importante:</strong> el porcentaje indica coincidencia con tus respuestas. No es una probabilidad de éxito ni una predicción. Es un punto de partida para explorar. El algoritmo es determinista: las mismas respuestas siempre dan el mismo resultado. Documentación completa en <code>docs/METODOLOGIA.md</code>.</p>
      </section>

      <section className="rounded-3xl bg-white p-7 ring-1 ring-ink/5">
        <h2 className="text-2xl font-extrabold">Cómo verificamos las universidades</h2>
        <p className="mt-3 leading-relaxed text-ink/80">Cada programa se registra individualmente a partir de la oferta publicada por la propia institución. No asumimos que una universidad ofrece una carrera por tener un área relacionada. Cada registro incluye nombre oficial del programa, enlace y fuente, y fecha de consulta, con uno de tres estados:</p>
        <ul className="mt-3 space-y-1 text-ink/80">
          <li><strong>Verificado:</strong> el programa aparece en el sitio oficial de la institución.</li>
          <li><strong>Pendiente de verificación:</strong> hay indicios, pero aún no está confirmado; no se presenta como oferta segura.</li>
          <li><strong>Información desactualizada:</strong> la fuente cambió o ya no lista el programa; se oculta de los resultados.</li>
        </ul>
        <p className="mt-3 text-sm text-ink/70">Las duraciones, costos y requisitos se muestran como «por confirmar» mientras no se verifiquen en el plan de estudios. Algunas sedes tienen ubicación estimada (marcadas con «~»). Si detectas un error, consulta siempre el sitio oficial de la universidad.</p>
        <h3 className="mt-5 font-extrabold">Instituciones registradas</h3>
        <ul className="mt-2 grid gap-1 text-sm sm:grid-cols-2">
          {institutions.map(([name, url]) => <li key={name}><a href={url} target="_blank" rel="noopener noreferrer" className="font-semibold text-brand hover:underline">{name}</a></li>)}
        </ul>
      </section>

      <section className="rounded-3xl bg-white p-7 ring-1 ring-ink/5">
        <h2 className="text-2xl font-extrabold">Próximamente: Asistente TuFuturo</h2>
        <p className="mt-3 leading-relaxed text-ink/80">Estamos preparando un asistente conversacional que responderá dudas usando únicamente la información verificada de esta plataforma, citando sus fuentes y sin inventar datos.</p>
      </section>
      <div className="flex gap-3"><Link href="/test" className="rounded-full bg-coral px-6 py-3 font-bold text-white">Hacer el test</Link><Link href="/preguntas-frecuentes" className="rounded-full bg-white px-6 py-3 font-bold ring-1 ring-ink/10">Preguntas frecuentes</Link></div>
    </div>
  );
}
