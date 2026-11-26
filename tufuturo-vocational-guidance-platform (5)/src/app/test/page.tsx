import type { Metadata } from "next";
import { Quiz } from "@/components/Quiz";

export const metadata: Metadata = { title: "Test vocacional", description: "Test de orientación vocacional gratuito: descubre carreras afines a tus intereses, materias y forma de trabajar." };

export default function TestPage() {
  return <Quiz />;
}
