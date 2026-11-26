export interface Place {
  name: string;
  lat: number;
  lng: number;
  municipality: string;
}

/** Distancia en línea recta (fórmula de Haversine) en kilómetros. No es distancia de ruta. */
export function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371.0088;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(a)));
}

export function formatKm(km: number): string {
  if (km < 1) return `${Math.round(km * 1000 / 50) * 50 || 50} m`;
  return `${km < 10 ? km.toFixed(1) : Math.round(km)} km`;
}

export const DEFAULT_PLACE: Place = { name: "Centro de Puebla", lat: 19.0436, lng: -98.1983, municipality: "Puebla" };

/** Referencias aproximadas (centro de cabecera municipal) para búsqueda manual sin servicios externos. */
export const PLACES: Place[] = [
  DEFAULT_PLACE,
  { name: "San Andrés Cholula", lat: 19.0507, lng: -98.2949, municipality: "San Andrés Cholula" },
  { name: "San Pedro Cholula", lat: 19.0636, lng: -98.3064, municipality: "San Pedro Cholula" },
  { name: "Cuautlancingo", lat: 19.0955, lng: -98.2684, municipality: "Cuautlancingo" },
  { name: "Amozoc", lat: 19.0319, lng: -98.0497, municipality: "Amozoc" },
  { name: "Atlixco", lat: 18.9078, lng: -98.4325, municipality: "Atlixco" },
  { name: "Huejotzingo", lat: 19.1608, lng: -98.405, municipality: "Huejotzingo" },
  { name: "San Martín Texmelucan", lat: 19.2842, lng: -98.4358, municipality: "San Martín Texmelucan" },
  { name: "Tepeaca", lat: 18.9667, lng: -97.8997, municipality: "Tepeaca" },
  { name: "Tecamachalco", lat: 18.8814, lng: -97.7292, municipality: "Tecamachalco" },
  { name: "Cd. Serdán", lat: 18.9833, lng: -97.4333, municipality: "Chalchicomula de Sesma" },
  { name: "Tehuacán", lat: 18.4617, lng: -97.3928, municipality: "Tehuacán" },
  { name: "Izúcar de Matamoros", lat: 18.6014, lng: -98.4653, municipality: "Izúcar de Matamoros" },
  { name: "Teziutlán", lat: 19.8167, lng: -97.3586, municipality: "Teziutlán" },
  { name: "Zacatlán", lat: 19.9333, lng: -97.9589, municipality: "Zacatlán" },
  { name: "Tlaxcala (Tlax.)", lat: 19.3139, lng: -98.2404, municipality: "Tlaxcala" },
  { name: "Apizaco (Tlax.)", lat: 19.4167, lng: -98.1444, municipality: "Apizaco" },
];

/** Prefijos de código postal → referencia aproximada. */
const POSTAL_REFERENCES: Array<[number, number, Place]> = [
  [72000, 72199, { name: "CP en el centro/norte de Puebla", lat: 19.0500, lng: -98.2000, municipality: "Puebla" }],
  [72200, 72399, { name: "CP en el oriente de Puebla", lat: 19.0650, lng: -98.1600, municipality: "Puebla" }],
  [72400, 72599, { name: "CP en el sur/poniente de Puebla", lat: 19.0200, lng: -98.2200, municipality: "Puebla" }],
  [72600, 72699, { name: "CP en el poniente de la zona metropolitana", lat: 19.0900, lng: -98.2700, municipality: "Cuautlancingo" }],
  [72700, 72799, { name: "CP en San Pedro Cholula", lat: 19.0636, lng: -98.3064, municipality: "San Pedro Cholula" }],
  [72800, 72899, { name: "CP en San Andrés Cholula", lat: 19.0507, lng: -98.2949, municipality: "San Andrés Cholula" }],
];

export function normalize(text: string): string {
  return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
}

/** Busca un lugar por nombre o por código postal. Devuelve ubicación aproximada o null. */
export function findPlace(query: string): (Place & { approximate: boolean }) | null {
  const q = normalize(query);
  if (!q) return null;
  if (/^\d{5}$/.test(q)) {
    const cp = Number(q);
    const ref = POSTAL_REFERENCES.find(([a, b]) => cp >= a && cp <= b);
    if (ref) return { ...ref[2], name: `${ref[2].name} (${q})`, approximate: true };
    return null;
  }
  const exact = PLACES.find((p) => normalize(p.name) === q || normalize(p.municipality) === q);
  const partial = exact ?? PLACES.find((p) => normalize(p.name).includes(q) || normalize(p.municipality).includes(q));
  return partial ? { ...partial, approximate: false } : null;
}
