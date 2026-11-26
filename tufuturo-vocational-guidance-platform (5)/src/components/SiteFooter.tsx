import Link from "next/link";
import { Logo } from "./Logo";

export function SiteFooter() {
  return (
    <footer className="mt-24 bg-ink text-white/80">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-4">
        <div className="md:col-span-2">
          <Logo light />
          <p className="mt-4 max-w-md text-sm leading-relaxed">
            Plataforma gratuita de orientación vocacional para estudiantes de preparatoria. Descubre carreras, conoce universidades de Puebla y
            consulta siempre las fuentes oficiales.
          </p>
          <p className="mt-4 max-w-md text-xs text-white/60">
            TuFuturo es un proyecto independiente y no está afiliado a ninguna universidad. La información se verifica en sitios oficiales y puede cambiar: confirma siempre con la institución.
          </p>
        </div>
        <nav aria-label="Explorar">
          <h3 className="text-sm font-bold uppercase tracking-wider text-white">Explorar</h3>
          <ul className="mt-4 space-y-2 text-sm">
            <li><Link className="hover:text-white" href="/test">Test vocacional</Link></li>
            <li><Link className="hover:text-white" href="/carreras">Explorar carreras</Link></li>
            <li><Link className="hover:text-white" href="/universidades">Encontrar universidades</Link></li>
          </ul>
        </nav>
        <nav aria-label="Información">
          <h3 className="text-sm font-bold uppercase tracking-wider text-white">Información</h3>
          <ul className="mt-4 space-y-2 text-sm">
            <li><Link className="hover:text-white" href="/acerca">Acerca de y metodología</Link></li>
            <li><Link className="hover:text-white" href="/preguntas-frecuentes">Preguntas frecuentes</Link></li>
            <li><Link className="hover:text-white" href="/privacidad">Privacidad y ubicación</Link></li>
          </ul>
        </nav>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-xs text-white/50">
        © {new Date().getFullYear()} TuFuturo · Hecho en Puebla, México · Sin cuentas, sin rastreo publicitario.
      </div>
    </footer>
  );
}
