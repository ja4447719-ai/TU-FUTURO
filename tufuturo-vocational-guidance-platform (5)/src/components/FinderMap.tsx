"use client";

import L from "leaflet";
import { useEffect, useRef } from "react";

export interface MapMarker { id: string; lat: number; lng: number; title: string; subtitle: string; color: string; approx: boolean }

export default function FinderMap({ markers, origin }: { markers: MapMarker[]; origin: { lat: number; lng: number; name: string } }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const map = L.map(ref.current, { scrollWheelZoom: false }).setView([origin.lat, origin.lng], 11);
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 18,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a>',
    }).addTo(map);

    const bounds = L.latLngBounds([[origin.lat, origin.lng]]);
    L.marker([origin.lat, origin.lng], {
      icon: L.divIcon({ className: "", html: '<div style="width:18px;height:18px;border-radius:50%;background:#16133d;border:3px solid #fff;box-shadow:0 0 0 4px rgba(22,19,61,.25)"></div>', iconSize: [18, 18], iconAnchor: [9, 9] }),
      title: origin.name,
    }).addTo(map).bindPopup(`<strong>Punto de búsqueda</strong><br/>${origin.name}`);

    for (const m of markers) {
      const el = document.createElement("div");
      el.textContent = m.title;
      const safeTitle = el.innerHTML;
      L.marker([m.lat, m.lng], {
        icon: L.divIcon({ className: "", html: `<div style="width:26px;height:26px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);background:${m.color};border:3px solid #fff;box-shadow:0 4px 10px rgba(0,0,0,.35);${m.approx ? "opacity:.75" : ""}"></div>`, iconSize: [26, 26], iconAnchor: [13, 26] }),
        title: m.title,
      }).addTo(map).bindPopup(`<strong>${safeTitle}</strong><br/>${m.subtitle.replace(/</g, "&lt;")}${m.approx ? "<br/><em>Ubicación aproximada</em>" : ""}`);
      bounds.extend([m.lat, m.lng]);
    }
    if (markers.length) map.fitBounds(bounds, { padding: [40, 40], maxZoom: 14 });

    return () => {
      map.remove();
    };
  }, [markers, origin]);

  return <div ref={ref} className="h-[28rem] w-full overflow-hidden rounded-3xl ring-1 ring-ink/10" role="region" aria-label="Mapa de universidades" />;
}
