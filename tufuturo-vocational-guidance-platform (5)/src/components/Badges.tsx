import { AlertCircle, BadgeCheck, Clock } from "lucide-react";
import type { InstitutionType, Modality, VerificationStatus } from "@/lib/types";

export const STATUS_LABEL: Record<VerificationStatus, string> = { verified: "Verificado", pending: "Pendiente de verificación", outdated: "Información desactualizada" };
export const MODALITY_LABEL: Record<Modality, string> = { presencial: "Presencial", online: "En línea", mixta: "Mixta" };

export function StatusBadge({ status }: { status: VerificationStatus }) {
  const cfg = {
    verified: { cls: "bg-emerald-50 text-emerald-700 ring-emerald-200", Icon: BadgeCheck },
    pending: { cls: "bg-amber-50 text-amber-800 ring-amber-200", Icon: Clock },
    outdated: { cls: "bg-rose-50 text-rose-700 ring-rose-200", Icon: AlertCircle },
  }[status];
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold ring-1 ${cfg.cls}`}>
      <cfg.Icon className="size-3.5" aria-hidden="true" /> {STATUS_LABEL[status]}
    </span>
  );
}

export function TypeBadge({ type }: { type: InstitutionType }) {
  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${type === "publica" ? "bg-sky-100 text-sky-800" : "bg-violet-100 text-violet-800"}`}>
      {type === "publica" ? "Pública" : "Privada"}
    </span>
  );
}

export function formatDate(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString("es-MX", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
}
