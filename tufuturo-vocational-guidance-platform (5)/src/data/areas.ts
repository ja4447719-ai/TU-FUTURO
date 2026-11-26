import type { Area } from "@/lib/types";

export const AREAS: Area[] = [
  { id: "salud", name: "Ciencias de la Salud", icon: "HeartPulse", color: "#ef476f", description: "Cuida la salud física y mental de las personas, de los animales y de las comunidades." },
  { id: "ingenierias", name: "Ingenierías y Tecnología", icon: "Cpu", color: "#4f46e5", description: "Diseña, construye y optimiza sistemas, máquinas, software e infraestructura." },
  { id: "naturales", name: "Ciencias Naturales y Exactas", icon: "FlaskConical", color: "#0ea5a4", description: "Investiga las leyes de la naturaleza, la vida, la materia y los números." },
  { id: "negocios", name: "Negocios y Administración", icon: "Briefcase", color: "#f59e0b", description: "Dirige organizaciones, finanzas, mercados, logística y proyectos emprendedores." },
  { id: "sociales", name: "Ciencias Sociales y Derecho", icon: "Scale", color: "#8b5cf6", description: "Comprende a las personas y a la sociedad: leyes, política, medios y cultura." },
  { id: "humanidades", name: "Educación y Humanidades", icon: "BookOpen", color: "#ec4899", description: "Enseña, piensa y comunica a través de la educación, las letras y los idiomas." },
  { id: "arte", name: "Arte, Arquitectura y Diseño", icon: "Palette", color: "#f97316", description: "Crea espacios, imágenes, sonidos y experiencias con sentido estético y funcional." },
  { id: "agro", name: "Agro y Alimentos", icon: "Sprout", color: "#16a34a", description: "Produce, transforma y cuida los alimentos y los recursos del campo." },
];

export const AREA_BY_ID = Object.fromEntries(AREAS.map((a) => [a.id, a])) as Record<Area["id"], Area>;
