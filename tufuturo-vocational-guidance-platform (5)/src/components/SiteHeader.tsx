"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Logo } from "./Logo";

const LINKS = [
  { href: "/", label: "Inicio" },
  { href: "/test", label: "Test vocacional" },
  { href: "/carreras", label: "Explorar carreras" },
  { href: "/universidades", label: "Universidades" },
  { href: "/acerca", label: "Acerca de" },
  { href: "/preguntas-frecuentes", label: "Preguntas frecuentes" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const active = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <header className="sticky top-0 z-40 border-b border-ink/5 bg-cream/85 backdrop-blur-md">
      <a href="#contenido" className="sr-only focus:not-sr-only focus:absolute focus:left-3 focus:top-3 focus:rounded-lg focus:bg-white focus:px-3 focus:py-2">Saltar al contenido</a>
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/" aria-label="TuFuturo, inicio"><Logo /></Link>
        <nav aria-label="Principal" className="hidden items-center gap-1 lg:flex">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} aria-current={active(l.href) ? "page" : undefined}
              className={`rounded-full px-3.5 py-2 text-sm font-semibold transition-colors ${active(l.href) ? "bg-brand-soft text-brand-dark" : "text-ink/70 hover:bg-ink/5 hover:text-ink"}`}>
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Link href="/test" className="hidden rounded-full bg-coral px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-coral/30 transition hover:-translate-y-0.5 hover:brightness-105 sm:inline-block">
            Comenzar test
          </Link>
          <button type="button" className="rounded-full p-2 text-ink lg:hidden" aria-expanded={open} aria-controls="menu-movil" aria-label={open ? "Cerrar menú" : "Abrir menú"} onClick={() => setOpen((v) => !v)}>
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>
      {open && (
        <nav id="menu-movil" aria-label="Menú móvil" className="animate-pop border-t border-ink/5 bg-cream px-4 pb-4 lg:hidden">
          <ul className="grid gap-1 pt-2">
            {LINKS.map((l) => (
              <li key={l.href}>
                <Link href={l.href} onClick={() => setOpen(false)} className={`block rounded-xl px-4 py-3 font-semibold ${active(l.href) ? "bg-brand-soft text-brand-dark" : "text-ink/80"}`}>{l.label}</Link>
              </li>
            ))}
            <li><Link href="/test" onClick={() => setOpen(false)} className="mt-2 block rounded-xl bg-coral px-4 py-3 text-center font-bold text-white">Comenzar test</Link></li>
          </ul>
        </nav>
      )}
    </header>
  );
}
