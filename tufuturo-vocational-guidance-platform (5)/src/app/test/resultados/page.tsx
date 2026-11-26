import type { Metadata } from "next";
import { Results } from "@/components/Results";

export const metadata: Metadata = { title: "Tus resultados", robots: { index: false } };

export default function ResultsPage() {
  return <Results />;
}
