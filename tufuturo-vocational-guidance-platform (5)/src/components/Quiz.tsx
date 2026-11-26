"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Check, RotateCcw, Sparkles } from "lucide-react";
import { QUIZ, QUIZ_VERSION } from "@/data/quiz";

export const QUIZ_STORAGE_KEY = "tufuturo:quiz";

interface Saved { v: number; answers: Record<string, string[]>; step: number }

export function loadSaved(): Saved | null {
  try {
    const raw = localStorage.getItem(QUIZ_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Saved;
    return parsed.v === QUIZ_VERSION && parsed.answers ? parsed : null;
  } catch {
    return null;
  }
}

export function Quiz() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [started, setStarted] = useState(false);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string[]>>({});

  useEffect(() => {
    const saved = loadSaved();
    if (saved) {
      setAnswers(saved.answers);
      setStep(Math.min(saved.step, QUIZ.length - 1));
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(QUIZ_STORAGE_KEY, JSON.stringify({ v: QUIZ_VERSION, answers, step } satisfies Saved));
    } catch {
      /* almacenamiento no disponible: el test sigue funcionando sin guardar */
    }
  }, [answers, step, ready]);

  const q = QUIZ[step];
  const selected = useMemo(() => answers[q.id] ?? [], [answers, q.id]);
  const hasProgress = Object.keys(answers).length > 0;
  const progress = Math.round((step / QUIZ.length) * 100);
  const answeredCount = Object.values(answers).filter((a) => a.length).length;

  function toggle(id: string) {
    setAnswers((prev) => {
      const current = prev[q.id] ?? [];
      if (q.type === "single") return { ...prev, [q.id]: [id] };
      if (current.includes(id)) return { ...prev, [q.id]: current.filter((x) => x !== id) };
      if (q.max && current.length >= q.max) return prev;
      return { ...prev, [q.id]: [...current, id] };
    });
  }

  function next() {
    if (step < QUIZ.length - 1) setStep(step + 1);
    else router.push("/test/resultados");
  }

  function reset() {
    setAnswers({});
    setStep(0);
    setStarted(true);
  }

  if (!ready) return <div className="mx-auto max-w-3xl px-4 py-24 text-center text-ink/60">Cargando…</div>;

  if (!started) {
    return (
      <section className="bg-hero">
        <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:py-24">
          <span className="mx-auto grid size-16 place-items-center rounded-3xl bg-brand text-white shadow-xl shadow-brand/30"><Sparkles className="size-8" aria-hidden="true" /></span>
          <h1 className="mt-6 text-4xl font-extrabold tracking-tight sm:text-5xl">Test de orientación vocacional</h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-ink/70">
            {QUIZ.length} preguntas, unos 5 minutos. Sin cuenta y sin respuestas correctas. Al final verás carreras que coinciden con tus intereses y por qué.
          </p>
          <ul className="mx-auto mt-6 grid max-w-xl gap-2 text-left text-sm text-ink/70 sm:grid-cols-2">
            <li className="rounded-2xl bg-white p-3 ring-1 ring-ink/5">💾 Tu avance se guarda en tu navegador.</li>
            <li className="rounded-2xl bg-white p-3 ring-1 ring-ink/5">🔒 No pedimos datos personales.</li>
            <li className="rounded-2xl bg-white p-3 ring-1 ring-ink/5">↩️ Puedes regresar y cambiar respuestas.</li>
            <li className="rounded-2xl bg-white p-3 ring-1 ring-ink/5">🧭 Es una guía, no una decisión por ti.</li>
          </ul>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {hasProgress && (
              <button type="button" onClick={() => setStarted(true)} className="rounded-full bg-coral px-8 py-3.5 font-bold text-white shadow-xl shadow-coral/30">
                Continuar donde me quedé ({answeredCount}/{QUIZ.length})
              </button>
            )}
            <button type="button" onClick={hasProgress ? reset : () => setStarted(true)} className={`rounded-full px-8 py-3.5 font-bold ${hasProgress ? "bg-white text-ink ring-1 ring-ink/10" : "bg-coral text-white shadow-xl shadow-coral/30"}`}>
              {hasProgress ? "Empezar de nuevo" : "Comenzar el test"}
            </button>
          </div>
        </div>
      </section>
    );
  }

  const canNext = q.id === "areas" || q.id === "prioridades" ? true : selected.length > 0;

  return (
    <section className="bg-hero min-h-[75vh]">
      <div className="mx-auto max-w-3xl px-4 py-10 sm:py-14">
        <div className="mb-6">
          <div className="flex items-center justify-between text-sm font-bold text-ink/70">
            <span>{q.section}</span>
            <span>Pregunta {step + 1} de {QUIZ.length}</span>
          </div>
          <div className="mt-2 h-3 overflow-hidden rounded-full bg-ink/10" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress} aria-label="Progreso del test">
            <div className="h-full rounded-full bg-gradient-to-r from-brand to-coral transition-all duration-500" style={{ width: `${Math.max(progress, 4)}%` }} />
          </div>
        </div>

        <div key={q.id} className="animate-pop rounded-[2rem] bg-white p-6 shadow-xl ring-1 ring-ink/5 sm:p-10">
          <h1 className="text-2xl font-extrabold leading-tight sm:text-3xl">{q.title}</h1>
          <p className="mt-2 text-ink/60" id="ayuda">
            {q.help}
            {q.type === "multi" && q.max ? ` (${selected.length}/${q.max})` : ""}
          </p>
          <div role={q.type === "single" ? "radiogroup" : "group"} aria-describedby="ayuda" className="mt-6 grid gap-3 sm:grid-cols-2">
            {q.options.map((op) => {
              const on = selected.includes(op.id);
              const blocked = q.type === "multi" && !!q.max && !on && selected.length >= q.max;
              return (
                <button
                  key={op.id}
                  type="button"
                  role={q.type === "single" ? "radio" : "checkbox"}
                  aria-checked={on}
                  disabled={blocked}
                  onClick={() => toggle(op.id)}
                  className={`flex items-center gap-3 rounded-2xl border-2 p-4 text-left font-semibold transition ${on ? "border-brand bg-brand-soft text-brand-dark" : "border-ink/10 bg-white hover:border-brand/50"} ${blocked ? "cursor-not-allowed opacity-40" : ""}`}
                >
                  <span className="text-2xl" aria-hidden="true">{op.emoji}</span>
                  <span className="flex-1">{op.label}</span>
                  {on && <Check className="size-5 text-brand" aria-hidden="true" />}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between">
          <button type="button" onClick={() => (step === 0 ? setStarted(false) : setStep(step - 1))} className="inline-flex items-center gap-2 rounded-full px-5 py-3 font-bold text-ink/70 hover:bg-ink/5">
            <ArrowLeft className="size-4" aria-hidden="true" /> {step === 0 ? "Inicio" : "Anterior"}
          </button>
          <div className="flex items-center gap-2">
            <button type="button" onClick={reset} className="hidden items-center gap-1 rounded-full px-4 py-3 text-sm font-semibold text-ink/50 hover:text-ink sm:inline-flex"><RotateCcw className="size-4" aria-hidden="true" /> Reiniciar</button>
            <button type="button" disabled={!canNext} onClick={next} className="inline-flex items-center gap-2 rounded-full bg-coral px-7 py-3 font-bold text-white shadow-lg shadow-coral/30 transition enabled:hover:-translate-y-0.5 disabled:opacity-40">
              {step === QUIZ.length - 1 ? "Ver mis resultados" : "Siguiente"} <ArrowRight className="size-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
