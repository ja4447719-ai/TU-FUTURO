import { groupOf } from "@/lib/dimensions";
import type { AreaId } from "@/lib/types";

export type QuizSection = "Intereses personales" | "Materias y habilidades" | "Preferencias profesionales" | "Preferencias personales";
export type Effects = Record<string, number>;

export interface QuizOption {
  id: string;
  label: string;
  emoji: string;
  effects: Effects;
  area?: AreaId;
  pref?: string;
}

export interface QuizQuestion {
  id: string;
  section: QuizSection;
  title: string;
  help: string;
  type: "single" | "multi";
  max?: number;
  options: QuizOption[];
}

/** "ci2 sa-1" → { ci: 2, sa: -1 } */
export function fx(spec: string): Effects {
  const out: Effects = {};
  for (const t of spec.split(/\s+/).filter(Boolean)) {
    const m = t.match(/^([a-z]+)(-?\d)$/);
    if (!m || !groupOf(m[1])) throw new Error(`Efecto inválido: ${t}`);
    out[m[1]] = Number(m[2]);
  }
  return out;
}

const o = (id: string, label: string, emoji: string, spec: string, extra: Partial<QuizOption> = {}): QuizOption => ({ id, label, emoji, effects: fx(spec), ...extra });

function scale(id: string, section: QuizSection, title: string, help: string, base: string): QuizQuestion {
  const b = fx(base);
  const mul = (m: number) => Object.fromEntries(Object.entries(b).map(([k, v]) => [k, v * m]));
  return {
    id, section, title, help, type: "single",
    options: [
      { id: "0", label: "Nada", emoji: "🙅", effects: mul(-1) },
      { id: "1", label: "Poco", emoji: "🤏", effects: mul(0) },
      { id: "2", label: "Bastante", emoji: "👍", effects: mul(1) },
      { id: "3", label: "Muchísimo", emoji: "🤩", effects: mul(2) },
    ],
  };
}

export const QUIZ: QuizQuestion[] = [
  {
    id: "intereses", section: "Intereses personales", title: "¿Qué temas te llaman más la atención?", help: "Elige hasta 4. No hay respuestas correctas.", type: "multi", max: 4,
    options: [
      o("ci", "Ciencias y experimentos", "🔬", "ci2"), o("te", "Tecnología e informática", "💻", "te2"), o("sa", "Salud y bienestar", "🩺", "sa2"),
      o("ar", "Arte y creatividad", "🎨", "ar2"), o("ne", "Negocios y emprendimiento", "💼", "ne2"), o("ed", "Educación y enseñanza", "🍎", "ed2"),
      o("so", "Sociedad y comportamiento humano", "🧠", "so2"), o("na", "Naturaleza y medio ambiente", "🌿", "na2"),
      o("co", "Construcción y diseño", "🏗️", "co2"), o("cm", "Comunicación e investigación", "🎙️", "cm2"),
    ],
  },
  {
    id: "finde", section: "Intereses personales", title: "Tienes un fin de semana libre. ¿Qué plan te emociona más?", help: "Elige el que más se parezca a ti.", type: "single",
    options: [
      o("a", "Armar, programar o arreglar algo", "🛠️", "te1 tec1 sol1 cre1"), o("b", "Hacer deporte o salir a la naturaleza", "🥾", "na1 air1 sa1"),
      o("c", "Dibujar, escribir, grabar o hacer música", "🎧", "ar1 cre1 lit1 dib1"), o("d", "Ayudar o acompañar a alguien", "🤝", "so1 per1 sa1"),
      o("e", "Organizar un evento o vender algo", "🛍️", "ne1 org1 emp1"), o("f", "Leer, investigar o ver documentales", "📚", "cm1 inv1 his1 lit1"),
    ],
  },
  {
    id: "materias", section: "Materias y habilidades", title: "¿Qué materias disfrutas más?", help: "Elige hasta 4.", type: "multi", max: 4,
    options: [
      o("mat", "Matemáticas", "➗", "mat2"), o("fis", "Física", "⚡", "fis2"), o("qui", "Química", "⚗️", "qui2"), o("bio", "Biología", "🧬", "bio2"),
      o("his", "Historia", "🏛️", "his2"), o("lit", "Literatura", "📖", "lit2"), o("idi", "Inglés y otros idiomas", "🌎", "idi2"), o("pro", "Programación", "👨‍💻", "pro2"),
      o("dib", "Dibujo", "✏️", "dib2"), o("com", "Comunicación y expresión oral", "🗣️", "com2"), o("res", "Resolver problemas y acertijos", "🧩", "res2"),
    ],
  },
  {
    id: "fortalezas", section: "Materias y habilidades", title: "¿En qué dirían tus amigos y maestros que eres bueno?", help: "Elige hasta 3.", type: "multi", max: 3,
    options: [
      o("a", "Explicar cosas a otros", "🎓", "ens1 com1 ed1"), o("b", "Encontrar soluciones lógicas", "💡", "res2 sol1"), o("c", "Ser creativo e imaginar cosas nuevas", "🌈", "cre2 ar1"),
      o("d", "Organizar y liderar", "📋", "org2 ne1"), o("e", "Entender a las personas", "💬", "per2 so1"), o("f", "Trabajar con las manos o con aparatos", "🔧", "tec1 te1 fis1"),
      o("g", "Escribir o hablar con claridad", "✍️", "com2 lit1 cm1"), o("h", "Observar detalles y analizar datos", "🔎", "inv2 mat1"),
    ],
  },
  {
    id: "estilos", section: "Preferencias profesionales", title: "¿Cómo te imaginas trabajando?", help: "Elige hasta 4 actividades que te gustaría hacer en tu vida profesional.", type: "multi", max: 4,
    options: [
      o("per", "Trabajar con personas", "👥", "per2"), o("tec", "Trabajar con tecnología", "🖥️", "tec2"), o("inv", "Investigar", "🔭", "inv2"), o("cre", "Crear cosas", "✨", "cre2"),
      o("org", "Organizar proyectos", "🗂️", "org2"), o("sol", "Resolver problemas", "🧯", "sol2"), o("air", "Trabajar al aire libre", "⛰️", "air2"), o("lab", "Trabajar en laboratorios", "🧪", "lab2"),
      o("hos", "Trabajar en hospitales", "🏥", "hos2"), o("ofi", "Trabajar en oficinas", "🏢", "ofi2"), o("ens", "Enseñar", "👩‍🏫", "ens2"), o("emp", "Emprender mi propio negocio", "🚀", "emp2"),
    ],
  },
  {
    id: "ambiente", section: "Preferencias profesionales", title: "¿Cuál sería tu ambiente de trabajo ideal?", help: "Elige uno.", type: "single",
    options: [
      o("lab", "Un laboratorio o centro de investigación", "🔬", "lab2 inv1 ci1"), o("hos", "Un hospital o clínica", "🏥", "hos2 sa1 per1"), o("ofi", "Una oficina con equipo y metas claras", "🏢", "ofi2 org1 ne1"),
      o("air", "El campo, la obra o la naturaleza", "🌄", "air2 na1 co1"), o("est", "Un estudio creativo o taller", "🎬", "cre2 ar1"), o("aula", "Un aula o espacio de formación", "🏫", "ens2 ed1 per1"),
      o("rem", "Una computadora, desde donde sea", "🌐", "tec2 te1 pro1"),
    ],
  },
  {
    id: "disfruta", section: "Preferencias personales", title: "¿Qué actividades disfrutas hacer?", help: "Elige hasta 3.", type: "multi", max: 3,
    options: [
      o("a", "Explicar o enseñar a otros", "🧑‍🏫", "ens1 ed1 per1"), o("b", "Debatir y defender ideas", "⚖️", "com1 so1 cm1"), o("c", "Experimentar y descubrir cómo funcionan las cosas", "🔍", "ci1 inv1 lab1"),
      o("d", "Diseñar y construir cosas", "📐", "co1 cre1 dib1"), o("e", "Cuidar de otros", "💗", "sa1 per1 hos1"), o("f", "Vender, negociar o convencer", "🤑", "ne1 emp1 com1"),
      o("g", "Contar historias o hacer contenido", "📹", "cm1 ar1 cre1"), o("h", "Programar o automatizar", "⌨️", "te1 pro1 tec1"),
    ],
  },
  {
    id: "nogusta", section: "Preferencias personales", title: "¿Qué actividades preferirías evitar?", help: "Elige hasta 3. Nos ayuda a descartar opciones que no encajan contigo.", type: "multi", max: 3,
    options: [
      o("a", "Muchas horas con números y fórmulas", "🧮", "mat-1 fis-1 mat-1"), o("b", "Ver sangre o convivir con enfermedad", "🩸", "sa-1 hos-2"),
      o("c", "Hablar frente a grupos", "🎤", "com-1 ens-1"), o("d", "Trabajar al aire libre con sol o lluvia", "🌧️", "air-2"),
      o("e", "Estar sentado frente a una computadora", "🪑", "tec-1 pro-1 ofi-1"), o("f", "Leer y escribir textos largos", "📄", "lit-1 his-1"),
      o("g", "Trabajo repetitivo de laboratorio", "🧫", "lab-2 qui-1"), o("h", "Tratar con muchas personas todo el día", "😮‍💨", "per-2"),
    ],
  },
  {
    id: "curiosidad", section: "Preferencias personales", title: "¿Qué temas te generan más curiosidad?", help: "Elige hasta 3.", type: "multi", max: 3,
    options: [
      o("a", "Cómo funciona el cerebro y la mente", "🧠", "so1 sa1 bio1 ci1"), o("b", "El universo y las leyes de la física", "🪐", "fis2 ci1 mat1"), o("c", "La inteligencia artificial y los robots", "🤖", "te2 pro1 mat1"),
      o("d", "El cambio climático y los ecosistemas", "🌍", "na2 bio1 ci1"), o("e", "La justicia, el poder y los derechos", "⚖️", "so2 com1 his1"), o("f", "Cómo nacen y crecen los negocios", "📈", "ne2 emp1"),
      o("g", "Culturas, idiomas e historia", "🗺️", "his2 idi1 so1"), o("h", "Cómo se construyen ciudades y edificios", "🏙️", "co2 dib1 fis1"),
      o("i", "El cine, la música y el arte", "🎭", "ar2 cre1 cm1"), o("j", "Qué comemos y cómo se produce", "🍽️", "qui1 bio1 na1 ne1"),
    ],
  },
  scale("sc-personas", "Preferencias profesionales", "¿Cuánto te gustaría ayudar a personas con problemas de salud o emocionales?", "Piensa en una vida profesional cuidando a otros.", "sa2 per2 so1"),
  scale("sc-crear", "Preferencias profesionales", "¿Cuánto te gusta crear algo desde cero (diseños, historias, productos)?", "Imagina tu trabajo como un proceso creativo.", "cre2 ar1 dib1"),
  scale("sc-liderar", "Preferencias profesionales", "¿Cuánto disfrutas liderar equipos y organizar proyectos?", "Coordinar, decidir y hacer que las cosas sucedan.", "org2 ne1 emp1"),
  scale("sc-numeros", "Materias y habilidades", "¿Cuánto disfrutas trabajar con números, datos y lógica?", "Resolver ejercicios, analizar información, buscar patrones.", "mat2 res1 sol1"),
  scale("sc-naturaleza", "Preferencias profesionales", "¿Cuánto te atrae pasar tiempo en la naturaleza, el campo o la obra?", "Trabajo de campo, aire libre y movimiento.", "air2 na1"),
  {
    id: "areas", section: "Preferencias personales", title: "¿Alguna de estas áreas ya te llama la atención?", help: "Elige hasta 2, o ninguna si aún no lo sabes. Solo influye ligeramente.", type: "multi", max: 2,
    options: [
      o("salud", "Salud", "❤️", "", { area: "salud" }), o("ingenierias", "Ingenierías y tecnología", "⚙️", "", { area: "ingenierias" }), o("naturales", "Ciencias naturales y exactas", "🔬", "", { area: "naturales" }),
      o("negocios", "Negocios", "💼", "", { area: "negocios" }), o("sociales", "Ciencias sociales y derecho", "⚖️", "", { area: "sociales" }), o("humanidades", "Educación y humanidades", "📚", "", { area: "humanidades" }),
      o("arte", "Arte, arquitectura y diseño", "🎨", "", { area: "arte" }), o("agro", "Agro y alimentos", "🌱", "", { area: "agro" }),
    ],
  },
  {
    id: "prioridades", section: "Preferencias personales", title: "¿Qué es lo más importante al elegir universidad?", help: "Elige hasta 3. Usaremos esto para sugerirte filtros, no cambia tus carreras.", type: "multi", max: 3,
    options: [
      o("publica", "Costo accesible (universidad pública)", "💸", "", { pref: "publica" }), o("cercania", "Estar cerca de casa", "📍", "", { pref: "cercania" }),
      o("becas", "Becas y apoyos", "🎓", "", { pref: "becas" }), o("online", "Poder estudiar en línea o mixto", "💻", "", { pref: "online" }),
      o("practica", "Enfoque práctico y vinculación con empresas", "🏭", "", { pref: "practica" }), o("internacional", "Intercambios y experiencia internacional", "✈️", "", { pref: "internacional" }),
      o("privada", "Instalaciones y grupos pequeños (universidad privada)", "🏫", "", { pref: "privada" }), o("vida", "Vida estudiantil, deportes y cultura", "⚽", "", { pref: "vida" }),
    ],
  },
];

export const QUIZ_VERSION = 1;
