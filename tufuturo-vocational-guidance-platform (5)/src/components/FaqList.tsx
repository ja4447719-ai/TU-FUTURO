import { ChevronDown } from "lucide-react";

export function FaqList({ items }: { items: { q: string; a: string }[] }) {
  return (
    <div className="mx-auto max-w-3xl divide-y divide-ink/10 rounded-3xl bg-white p-2 shadow-sm ring-1 ring-ink/5">
      {items.map((item) => (
        <details key={item.q} className="group px-5 py-4">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-bold text-ink">
            {item.q}
            <ChevronDown className="size-5 shrink-0 text-brand transition-transform group-open:rotate-180" aria-hidden="true" />
          </summary>
          <p className="mt-3 leading-relaxed text-ink/75">{item.a}</p>
        </details>
      ))}
    </div>
  );
}
