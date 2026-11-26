import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import type { ReactNode } from "react";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-jakarta", display: "swap" });

export const metadata: Metadata = {
  title: { default: "TuFuturo · Orientación vocacional y universidades en Puebla", template: "%s · TuFuturo" },
  description:
    "Descubre las carreras que conectan con tus intereses, conoce nuevas posibilidades y encuentra dónde estudiar en Puebla. Test vocacional gratuito, catálogo de carreras y buscador de universidades.",
  applicationName: "TuFuturo",
  openGraph: { title: "TuFuturo", description: "Descubre tu camino. Construye tu futuro.", locale: "es_MX", type: "website" },
};

export const viewport: Viewport = { themeColor: "#4f46e5", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es-MX" className={jakarta.variable}>
      <body className="antialiased">
        <SiteHeader />
        <main id="contenido">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
