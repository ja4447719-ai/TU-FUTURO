import Link from "next/link";
import { ArrowUpRight, Building2 } from "lucide-react";
import { AREA_BY_ID } from "@/data/areas";
import type { AreaId } from "@/lib/types";
import { AreaIcon } from "./AreaIcon";

export interface CareerCardData {
  slug: string;
  name: string;
  area: AreaId;
  description: string;
  duration: string;
  programs: number;
}

export function CareerCard({ career }: { career: CareerCardData }) {
  const area = AREA_BY_ID[career.area];
  return (
    <Link href={`/carreras/${career.slug}`} className="card-lift group flex h-full flex-col rounded-3xl bg-white p-5 ring-1 ring-ink/5">
      <div className="flex items-center justify-between">
        <span className="inline-flex size-11 items-center justify-center rounded-2xl text-white" style={{ background: area.color }}>
          <AreaIcon name={area.icon} className="size-5" />
        </span>
        <ArrowUpRight className="size-5 text-ink/30 transition group-hover:text-coral" aria-hidden="true" />
      </div>
      <p className="mt-4 text-xs font-bold uppercase tracking-wider" style={{ color: area.color }}>{area.name}</p>
      <h3 className="mt-1 text-lg font-extrabold leading-snug text-ink">{career.name}</h3>
      <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-ink/70">{career.description}</p>
      <div className="mt-4 flex items-center justify-between text-xs font-semibold text-ink/60">
        <span>{career.duration.split(" (")[0]}</span>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-soft px-2.5 py-1 text-brand-dark">
          <Building2 className="size-3.5" aria-hidden="true" />
          {career.programs} {career.programs === 1 ? "programa" : "programas"}
        </span>
      </div>
    </Link>
  );
}
