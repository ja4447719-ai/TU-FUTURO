import type { Metadata } from "next";
import { FaqList } from "@/components/FaqList";
import { FAQ } from "@/data/faq";

export const metadata: Metadata = { title: "Preguntas frecuentes", description: "Respuestas sobre el test vocacional, el catálogo de carreras, el buscador de universidades y tu privacidad." };

export default function FaqPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6">
      <header className="mb-10 text-center">
        <p className="text-sm font-bold uppercase tracking-widest text-coral">Ayuda</p>
        <h1 className="mt-2 text-4xl font-extrabold tracking-tight">Preguntas frecuentes</h1>
      </header>
      <FaqList items={FAQ} />
    </div>
  );
}
