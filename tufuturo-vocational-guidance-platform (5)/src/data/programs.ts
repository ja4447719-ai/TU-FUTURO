import type { Modality, Program, VerificationStatus } from "@/lib/types";

/**
 * Programas académicos registrados. Cada fila procede de la oferta publicada en el sitio oficial de la institución
 * (fuente y URL en cada registro). Fecha de consulta: 2026-11-26.
 * No se confirmó la duración de ningún programa: se muestra "por confirmar" hasta verificarla en el plan de estudios.
 * La modalidad "presencial" corresponde a programas listados como oferta de campus; confirma con la institución.
 */
const CONSULTED = "2026-11-26";

type Row = [officialName: string, careerSlug: string, url?: string, modes?: string, note?: string, status?: VerificationStatus];

const MODE: Record<string, Modality> = { p: "presencial", o: "online", m: "mixta" };

function make(universitySlug: string, source: string, baseUrl: string, rows: Row[], urlFor?: (path: string) => string): Program[] {
  return rows.map(([officialName, careerSlug, url, modes, note, status]) => ({
    universitySlug,
    careerSlug,
    officialName,
    modalities: (modes ?? "p").split("").map((m) => MODE[m]),
    duration: null,
    url: url ? (urlFor ? urlFor(url) : url) : baseUrl,
    source,
    note: note ?? null,
    consultedAt: CONSULTED,
    status: status ?? "verified",
  }));
}

// --- BUAP (oferta educativa 2026 publicada por la Dirección de Administración Escolar) ---
const BUAP_SRC = "BUAP – Oferta educativa (serviciosdes.buap.mx/new-oferta-educativa)";
const BUAP_URL = "https://serviciosdes.buap.mx/new-oferta-educativa/";
type BRow = [string, string, string];
const buapCU: BRow[] = [
  ["Licenciatura en Actuaría", "actuaria", ""], ["Licenciatura en Administración Pública y Gestión para el Desarrollo", "administracion-publica", ""],
  ["Licenciatura en Administración Turística", "turismo", ""], ["Licenciatura en Administración de Empresas", "administracion", ""],
  ["Licenciatura en Administración y Dirección de Pequeñas y Medianas Empresas", "administracion", ""], ["Licenciatura en Arquitectura", "arquitectura", ""],
  ["Licenciatura en Biología", "biologia", ""], ["Licenciatura en Biotecnología", "biotecnologia", ""], ["Licenciatura en Ciencias Políticas", "ciencias-politicas", ""],
  ["Licenciatura en Ciencias de la Computación", "ciencias-computacion", ""], ["Licenciatura en Comercio Internacional", "negocios-internacionales", ""],
  ["Licenciatura en Consultoría Jurídica", "derecho", ""], ["Licenciatura en Contaduría Pública", "contaduria", ""], ["Licenciatura en Contaduría y Finanzas Públicas", "contaduria", ""],
  ["Licenciatura en Criminología", "criminologia", ""], ["Licenciatura en Cultura Física", "ciencias-del-deporte", ""], ["Licenciatura en Dirección Financiera", "finanzas", ""],
  ["Licenciatura en Diseño Gráfico", "diseno-grafico", ""], ["Licenciatura en Economía", "economia", ""], ["Licenciatura en Farmacia", "farmacia", ""],
  ["Licenciatura en Finanzas", "finanzas", ""], ["Licenciatura en Física", "fisica", ""], ["Licenciatura en Física Aplicada", "fisica", ""], ["Licenciatura en Gastronomía", "gastronomia", ""],
  ["Licenciatura en Ingeniería Ambiental", "ingenieria-ambiental", ""], ["Licenciatura en Ingeniería Biomédica", "ingenieria-biomedica", ""], ["Licenciatura en Ingeniería Civil", "ingenieria-civil", ""],
  ["Licenciatura en Ingeniería Geofísica", "ingenieria-geofisica", ""], ["Licenciatura en Ingeniería Industrial", "ingenieria-industrial", ""], ["Licenciatura en Ingeniería Mecatrónica", "mecatronica", ""],
  ["Licenciatura en Ingeniería Mecánica y Eléctrica", "ingenieria-electrica", ""], ["Licenciatura en Ingeniería Química", "ingenieria-quimica", ""], ["Licenciatura en Ingeniería Textil", "ingenieria-textil", ""],
  ["Licenciatura en Ingeniería Topográfica y Geodésica", "ingenieria-topografica", ""], ["Licenciatura en Ingeniería en Alimentos", "ingenieria-alimentos", ""],
  ["Licenciatura en Ingeniería en Ciberseguridad", "ciberseguridad", ""], ["Licenciatura en Ingeniería en Ciencia de Datos", "ciencia-de-datos", ""],
  ["Licenciatura en Ingeniería en Ciencias de la Computación", "ciencias-computacion", ""], ["Licenciatura en Ingeniería en Ciudades Inteligentes y Sostenibles", "ciudades-inteligentes", ""],
  ["Licenciatura en Ingeniería en Electrónica", "ingenieria-electronica", ""], ["Licenciatura en Ingeniería en Energías Renovables", "energias-renovables", ""],
  ["Licenciatura en Ingeniería en Logística Digital y Cadena de Suministro", "logistica", ""], ["Licenciatura en Ingeniería en Materiales", "ingenieria-materiales", ""],
  ["Licenciatura en Ingeniería en Sistemas Automotrices", "ingenieria-automotriz", ""], ["Licenciatura en Ingeniería en Tecnologías de la Información", "ingenieria-software", ""],
  ["Licenciatura en Innovación Emprendedora", "emprendimiento", ""], ["Licenciatura en Matemáticas", "matematicas", ""], ["Licenciatura en Matemáticas Aplicadas", "matematicas", ""],
  ["Licenciatura en Negocios Internacionales", "negocios-internacionales", ""], ["Licenciatura en Química", "quimica", ""], ["Licenciatura en Químico Farmacobiólogo", "farmacia", ""],
  ["Licenciatura en Readaptación y Activación Física", "ciencias-del-deporte", ""], ["Licenciatura en Relaciones Internacionales", "relaciones-internacionales", ""],
  ["Licenciatura en Sociología", "sociologia", ""], ["Licenciatura en Urbanismo y Diseño Ambiental", "urbanismo", ""],
];
const buapCentro: BRow[] = [
  ["Licenciatura en Antropología Social", "antropologia", ""], ["Licenciatura en Enseñanza de Lenguas con Opción: Inglés", "idiomas", ""], ["Licenciatura en la Enseñanza del Inglés", "idiomas", ""],
  ["Licenciatura en Filosofía", "filosofia", ""], ["Licenciatura en Gestión de la Información", "bibliotecologia", ""], ["Licenciatura en Historia", "historia", ""],
  ["Licenciatura en Humanidades", "humanidades", ""], ["Licenciatura en Lengua Francesa, Cultura y Mediación", "idiomas", ""], ["Licenciatura en Lingüística y Literatura Hispánica", "letras", ""],
  ["Licenciatura en Procesos Educativos", "ciencias-educacion", ""], ["Licenciatura en Psicología", "psicologia", ""],
];
const buapSalud: BRow[] = [
  ["Licenciatura en Biomedicina", "biomedicina", ""], ["Licenciatura en Ciencia Forense", "ciencia-forense", ""], ["Licenciatura en Enfermería", "enfermeria", ""],
  ["Licenciatura en Estomatología", "odontologia", ""], ["Licenciatura en Fisioterapia", "fisioterapia", ""], ["Licenciatura en Gerontología", "gerontologia", ""],
  ["Licenciatura en Medicina", "medicina", ""], ["Licenciatura en Nutrición Clínica", "nutricion", ""], ["Licenciatura en Podología", "podologia", ""],
];
const buapArte: BRow[] = [
  ["Licenciatura en Arte Digital", "animacion", ""], ["Licenciatura en Arte Dramático", "teatro", ""], ["Licenciatura en Artes Plásticas", "artes-visuales", ""],
  ["Licenciatura en Cinematografía", "cine", ""], ["Licenciatura en Comunicación", "comunicacion", ""], ["Licenciatura en Danza y Estudios del Cuerpo", "danza", ""],
  ["Licenciatura en Etnocoreología", "danza", ""], ["Licenciatura en Mercadotecnia y Medios Digitales", "mercadotecnia", ""], ["Licenciatura en Música", "musica", ""],
  ["Licenciatura en Periodismo", "periodismo", ""],
];
const buapRows = (sede: string, rows: BRow[]) =>
  make(sede, BUAP_SRC, BUAP_URL, rows.map(([n, c]) => [n, c, undefined, c === "derecho" && n.endsWith("Derecho") ? "pmo" : "p"] as Row));
const buapDerecho = make("buap-ciudad-universitaria", "BUAP – Oferta educativa; Planes de estudio DES (des.buap.mx)", "https://des.buap.mx/?q=content%2Fplanes-de-estudio", [
  ["Licenciatura en Derecho", "derecho", undefined, "pmo", "La BUAP publica Derecho en modalidades escolarizada, semiescolarizada y a distancia."],
]);

// --- UDLAP (www.udlap.mx/ofertaacademica) ---
const udlapRows: Row[] = [
  ["Ingeniería Ambiental", "ingenieria-ambiental", "Ambiental"], ["Ingeniería Biomédica", "ingenieria-biomedica", "Biomedica"], ["Ingeniería Civil", "ingenieria-civil", "Civil"],
  ["Ingeniería en Industrias Alimentarias", "ingenieria-alimentos", "IndustriasAlimentarias"], ["Ingeniería en Logística y Cadena de Suministros", "logistica", "Logistica"],
  ["Ingeniería en Robótica y Telecomunicaciones", "robotica", "Robotica"], ["Ingeniería en Sistemas Computacionales", "ingenieria-software", "SistemasComputacionales"],
  ["Ingeniería Industrial", "ingenieria-industrial", "Industrial"], ["Ingeniería Mecánica", "ingenieria-mecanica", "Mecanica"], ["Ingeniería Mecatrónica", "mecatronica", "Mecatronica"],
  ["Ingeniería Química", "ingenieria-quimica", "Quimica"], ["Nanotecnología e Ingeniería Molecular", "nanotecnologia", "Nanotecnologia"],
  ["Administración de Empresas", "administracion", "AdministracionEmpresas"], ["Administración de la Hospitalidad", "turismo", "AdministracionHospitalidad"], ["Artes Culinarias", "gastronomia", "ArtesCulinarias"],
  ["Banca e Inversiones", "finanzas", "BancaeInversiones"], ["Economía", "economia", "Economia"], ["Estrategias Financieras y Contaduría Pública", "contaduria", "EstrategiasFinancieras"],
  ["Mercadotecnia", "mercadotecnia", "Mercadotecnia"], ["Negocios Internacionales", "negocios-internacionales", "NegociosInternacionales"], ["Actuaría", "actuaria", "Actuaria"],
  ["Biología", "biologia", "Biologia"], ["Bioquímica Clínica", "bioquimica", "Bioquimica"], ["Ciencia de Datos", "ciencia-de-datos", "CienciaDeDatos"], ["Ciencias de la Nutrición", "nutricion", "Nutricion"],
  ["Cirujano Dentista", "odontologia", "CirujanoDentista"], ["Enfermería", "enfermeria", "Enfermeria"], ["Física", "fisica", "Fisica"], ["Médico Cirujano", "medicina", "MedicoCirujano"],
  ["Químico Farmacéutico Biólogo", "farmacia", "QuimicoFarmaceuticoBiologo"], ["Antropología", "antropologia", "Antropologia"], ["Ciencia Política", "ciencias-politicas", "CienciaPolitica"],
  ["Comunicación y Producción de Medios", "comunicacion", "ComunicacionyMedios"], ["Comunicación y Relaciones Públicas", "comunicacion", "ComunicacionyRP"], ["Derecho", "derecho", "Derecho"],
  ["Psicología Clínica", "psicologia", "PsicologiaClinica"], ["Psicología Organizacional", "psicologia", "PsicologiaOrganizacional"], ["Relaciones Internacionales", "relaciones-internacionales", "RelacionesInternacionales"],
  ["Animación Digital", "animacion", "AnimacionDigital"], ["Arquitectura", "arquitectura", "Arquitectura"], ["Arquitectura de Interiores", "diseno-interiores", "ArquitecturaInteriores"],
  ["Artes Visuales", "artes-visuales", "ArtesVisuales"], ["Danza", "danza", "Danza"], ["Diseño de Información Visual", "diseno-grafico", "InformacionVisual"],
  ["Diseño de Productos", "diseno-industrial", "DisenoProductos"], ["Historia del Arte y Curaduría", "historia-del-arte", "HistoriaDelArte"], ["Idiomas", "idiomas", "Idiomas"],
  ["Literatura", "letras", "Literatura"], ["Música", "musica", "Musica"], ["Teatro", "teatro", "Teatro"],
];

// --- Ibero Puebla (www.iberopuebla.mx/licenciaturas) ---
const iberoRows: Row[] = [
  ["Arquitectura", "arquitectura", "arquitectura"], ["Arte Contemporáneo", "artes-visuales", "arte-contemporaneo"], ["Diseño de Interacción y Animación", "diseno-digital", "diseno-interaccion-animacion"],
  ["Diseño Gráfico", "diseno-grafico", "diseno-grafico"], ["Diseño Industrial", "diseno-industrial", "diseno-industrial"], ["Diseño Textil", "diseno-textil", "diseno-textil"],
  ["Nutrición y Ciencia de los Alimentos", "nutricion", "nutricion-ciencia-alimentos"], ["Psicología", "psicologia", "psicologia"], ["Ingeniería Automotriz", "ingenieria-automotriz", "ingenieria-automotriz"],
  ["Ingeniería Biomédica", "ingenieria-biomedica", "ingenieria-biomedica"], ["Ingeniería Civil", "ingenieria-civil", "ingenieria-civil"], ["Ingeniería de Negocios", "ingenieria-de-negocios", "ingenieria-negocios"],
  ["Ingeniería en Biotecnología", "biotecnologia", "ingenieria-biotecnologia"], ["Ingeniería en Logística", "logistica", "ingenieria-logistica"],
  ["Ingeniería en Sistemas Computacionales", "ingenieria-software", "ingenieria-sistemas-computacionales"], ["Ingeniería Física", "ingenieria-fisica", "ingenieria-fisica"],
  ["Ingeniería Industrial", "ingenieria-industrial", "ingenieria-industrial"], ["Ingeniería Mecánica", "ingenieria-mecanica", "ingenieria-mecanica"],
  ["Ingeniería Mecánica Industrial", "ingenieria-mecanica", "ingenieria-mecanica-industrial"], ["Ingeniería Mecatrónica", "mecatronica", "ingenieria-mecatronica"], ["Ingeniería Química", "ingenieria-quimica", "ingenieria-quimica"],
  ["Ciencias Ambientales y Sustentabilidad", "ciencias-ambientales", "ciencias-ambientales-sustentabilidad"], ["Ciencias Políticas e Innovación Democrática", "ciencias-politicas", "ciencias-politicas-innovacion-democratica"],
  ["Derecho", "derecho", "derecho"], ["Economía y Finanzas", "economia", "economia-finanzas"], ["Relaciones Internacionales", "relaciones-internacionales", "relaciones-internacionales"],
  ["Comunicación", "comunicacion", "comunicacion"], ["Educación", "ciencias-educacion", "educacion"], ["Literatura y Filosofía", "letras", "literatura-filosofia"],
  ["Administración de Empresas", "administracion", "administracion-empresas"], ["Administración Turística y de la Hospitalidad", "turismo", "administracion-turistica-hospitalidad"],
  ["Comercio Internacional", "negocios-internacionales", "comercio-internacional"], ["Contaduría y Estrategias Financieras", "contaduria", "contaduria-estrategias-financieras"],
  ["Dirección del Talento Humano", "recursos-humanos", "direccion-talento-humano"], ["Mercadotecnia", "mercadotecnia", "mercadotecnia"], ["Negocios Internacionales", "negocios-internacionales", "negocios-internacionales"],
];

// --- Anáhuac Puebla (puebla.anahuac.mx/licenciaturas/oferta-educativa) ---
const anahuacRows: Row[] = [
  ["Arquitectura", "arquitectura", "arquitectura"], ["Diseño Visual Transmedia", "diseno-digital", "diseno-visual-transmedia"], ["Diseño Industrial", "diseno-industrial", "diseno-industrial"],
  ["Diseño de Moda e Innovación", "diseno-modas", "moda-innovacion-tendencia"], ["Comunicación", "comunicacion", "comunicacion"], ["Derecho", "derecho", "derecho"],
  ["Ingeniería Industrial para la Dirección", "ingenieria-industrial", "ingenieria-industrial-para-la-direccion"], ["Ingeniería en Dirección de Negocios", "ingenieria-de-negocios", "ingenieria-en-direccion-de-negocios"],
  ["Ingeniería Mecatrónica", "mecatronica", "ingenieria-mecatronica"], ["Actuaría", "actuaria", "actuaria"], ["Médico Cirujano", "medicina", "medico-cirujano"],
  ["Administración y Dirección de Empresas", "administracion", "administracion-y-direccion-de-empresas"], ["Mercadotecnia Estratégica", "mercadotecnia", "mercadotecnia-estrategica"],
  ["Negocios Internacionales", "negocios-internacionales", "negocios-internacionales"], ["Finanzas y Contaduría Pública", "contaduria", "finanzas-y-contaduria-publica"],
  ["Psicología", "psicologia", "psicologia"], ["Gastronomía", "gastronomia", "gastronomia"], ["Relaciones Internacionales", "relaciones-internacionales", "relaciones-internacionales"],
  ["Economía", "economia", "economia"], ["Ingeniería Civil", "ingenieria-civil", "ingenieria-civil"], ["Nutrición", "nutricion", "nutricion"], ["Dirección Financiera", "finanzas", "direccion-financiera"],
  ["Ingeniería en Innovación y Desarrollo", "ingenieria-innovacion-desarrollo", "ingenieria-en-innovacion-y-desarrollo"], ["Diseño Multimedia", "diseno-digital", "diseno-multimedia"],
  ["Arquitectura de Interiores", "diseno-interiores", "arquitectura-interiores"], ["Ciencia de Datos", "ciencia-de-datos", "ciencia-de-datos"],
  ["Ingeniería en Tecnologías de la Información y Negocios Digitales", "ingenieria-software", "ingenieria-tecnologias-de-informacion-en-negocios-digitales"],
];

// --- UVP (www.uvp.mx, campus Puebla) ---
const uvpRows: Row[] = [
  ["Licenciatura en Cirujano Dentista", "odontologia", "cirujano-dentista"], ["Licenciatura en Enfermería", "enfermeria", "enfermeria"], ["Licenciatura en Fisioterapia", "fisioterapia", "fisioterapia"],
  ["Licenciatura en Medicina", "medicina", "medicina"], ["Licenciatura en Arquitectura", "arquitectura", "arquitectura"], ["Licenciatura en Comunicación y Medios Digitales", "comunicacion", "comunicacion-y-medios-digitales"],
  ["Licenciatura en Diseño de Modas", "diseno-modas", "diseno-de-modas"], ["Licenciatura en Diseño y Comunicación Visual", "diseno-grafico", "diseno-y-comunicacion-visual"],
  ["Licenciatura en Lenguas Extranjeras Aplicadas a la Diplomacia y Negociación Internacional", "idiomas", "lenguas-extranjeras-aplicadas-a-la-diplomacia-y-negociacion-internacional"],
  ["Licenciatura en Pedagogía", "pedagogia", "pedagogia"], ["Licenciatura en Producción y Animación", "animacion", "produccion-y-animacion"], ["Ingeniería en Producción Musical", "produccion-musical", "ingenieria-en-produccion-musical"],
  ["Licenciatura en Medicina Veterinaria y Zootecnia", "medicina-veterinaria", "medicina-veterinaria-y-zootecnia"], ["Ingeniería Civil", "ingenieria-civil", "ingenieria-civil"],
  ["Ingeniería Biomédica", "ingenieria-biomedica", "ingenieria-biomedica"], ["Licenciatura en Nutrición", "nutricion", "nutricion"],
  ["Ingeniería en Sistemas y Tecnologías de la Información", "ingenieria-software", "ingenieria-en-sistemas-y-tecnologias-de-la-informacion"], ["Licenciatura en Psicología", "psicologia", "psicologia"],
  ["Ingeniería Industrial", "ingenieria-industrial", "ingenieria-industrial"], ["Ingeniería Mecánica y Diseño Automotriz", "ingenieria-mecanica", "ingenieria-mecanica-y-diseno-automotriz"],
  ["Ingeniería en Mecatrónica", "mecatronica", "ingenieria-en-mecatronica"], ["Licenciatura en Actuaría", "actuaria", "actuaria"], ["Licenciatura en Administración e Innovación Estratégica", "administracion", "administracion-e-innovacion-estrategica"],
  ["Licenciatura en Turismo, Sostenibilidad e Innovación", "turismo", "turismo-sostenibilidad-e-innovacion"], ["Licenciatura en Ciencias Políticas y Administración Pública", "ciencias-politicas", "ciencias-politicas-y-administracion-publica"],
  ["Licenciatura en Contaduría Pública y Auditoría", "contaduria", "contaduria-publica-y-auditoria"], ["Licenciatura en Criminología y Criminalística", "criminologia", "criminologia-y-criminalistica"],
  ["Licenciatura en Derecho", "derecho", "derecho"], ["Licenciatura en Economía y Finanzas", "economia", "economia-y-finanzas"], ["Licenciatura en Gastronomía e Innovación Culinaria", "gastronomia", "gastronomia-e-innovacion-culinaria"],
  ["Licenciatura en Mercadotecnia Estratégica, Analítica e Innovación", "mercadotecnia", "mercadotecnia-estrategica--analitica-e-innovacion"],
  ["Licenciatura en Negocios Internacionales y Estrategia Global", "negocios-internacionales", "negocios-internacionales-y-estrategia-global"],
  ["Licenciatura en Químico Farmacobiólogo", "farmacia", "quimico-farmacobiologo"], ["Ingeniería en Agronomía", "agronomia", "ingenieria-en-agronomia"], ["Ingeniería en Ciencia de Datos", "ciencia-de-datos", "ciencia-de-datos"],
];

// --- UPAEP (web.upaep.mx/licenciaturas) – modalidades según el listado oficial ---
const upaepRows: Row[] = [
  ["Fisioterapia", "fisioterapia"], ["Médico Cirujano Odontólogo", "odontologia"], ["Nutrición", "nutricion"], ["Enfermería (complementario, abierta)", "enfermeria", undefined, "m", "Programa complementario en modalidad abierta."],
  ["Medicina", "medicina"], ["Animación y Arte Digital", "animacion"], ["Arquitectura", "arquitectura"], ["Diseño e Innovación Visual", "diseno-grafico"], ["Estrategia y Creación Publicitaria", "publicidad"],
  ["Filosofía", "filosofia", undefined, "po"], ["Humanidades y Gestión Cultural", "humanidades"], ["Pedagogía e Innovación Educativa", "pedagogia"], ["Psicología", "psicologia"],
  ["Innovación y Asesoramiento Educativo", "ciencias-educacion", undefined, "o"], ["Trabajo Social", "trabajo-social", undefined, "o"], ["Psicología Educativa y Organizacional", "psicologia", undefined, "m", "Modalidad abierta."],
  ["Administración de Empresas", "administracion", undefined, "po"], ["Administración Financiera y Bursátil", "finanzas"], ["Comercio y Estrategia Internacional", "negocios-internacionales"],
  ["Contaduría y Alta Dirección", "contaduria"], ["Dirección de Hospitalidad y Turismo", "turismo"], ["Gastronomía", "gastronomia"], ["Inteligencia de Negocios", "inteligencia-de-negocios"],
  ["Logística de Negocios", "logistica"], ["Mercadotecnia", "mercadotecnia", undefined, "po"], ["Ingeniería Aeroespacial", "ingenieria-aeronautica"], ["Ingeniería Civil", "ingenieria-civil"],
  ["Ingeniería de Software", "ingenieria-software"], ["Ingeniería en Ciencia de Datos", "ciencia-de-datos"], ["Ingeniería en Computación y Sistemas", "ingenieria-software"],
  ["Ingeniería en Diseño Automotriz", "ingenieria-automotriz"], ["Ingeniería Industrial", "ingenieria-industrial"], ["Ingeniería Mecatrónica", "mecatronica"],
  ["Ingeniería Química Industrial", "ingenieria-quimica"], ["Ingeniería en Proyectos Industriales", "ingenieria-industrial", undefined, "o"],
  ["Ingeniería Ambiental y Desarrollo Sustentable", "ingenieria-ambiental"], ["Ingeniería en Agronomía", "agronomia"], ["Ingeniería en Biotecnología", "biotecnologia"],
  ["Administración, Gobierno y Políticas Públicas", "administracion-publica"], ["Ciencias Políticas", "ciencias-politicas"], ["Cine y Producción Audiovisual", "cine"],
  ["Comunicación y Medios Digitales", "comunicacion"], ["Derecho", "derecho", undefined, "po"], ["Economía", "economia"], ["Relaciones Internacionales", "relaciones-internacionales"],
  ["Medicina Veterinaria y Zootecnia", "medicina-veterinaria"], ["Químico Farmacobiólogo", "farmacia"],
  ["Idiomas, Enseñanza y Diversidad Cultural", "idiomas", undefined, "p", "Listado complementario; confirmar en la ficha oficial del programa."],
];

// --- Tec de Monterrey, Campus Puebla (tec.mx/en/puebla-campus) ---
const P2 = "En el campus Puebla se cursa solo una parte del plan (hasta 2.º o 3.º semestre); el resto se completa en otro campus. Confirma con el Tec.";
const tecRows: Row[] = [
  ["Arquitectura", "arquitectura"], ["Ingeniería Biomédica", "ingenieria-biomedica", undefined, "p", P2], ["Ingeniería Civil", "ingenieria-civil"], ["Ingeniería en Alimentos", "ingenieria-alimentos", undefined, "p", P2],
  ["Ingeniería en Biosistemas Agroalimentarios", "agroindustria", undefined, "p", P2], ["Ingeniería en Biotecnología", "biotecnologia"], ["Ingeniería en Desarrollo Sustentable", "ingenieria-ambiental", undefined, "p", P2],
  ["Ingeniería en Electrónica y Semiconductores", "ingenieria-electronica", undefined, "p", P2], ["Ingeniería en Física Industrial", "ingenieria-fisica", undefined, "p", P2],
  ["Ingeniería en Innovación y Desarrollo", "ingenieria-innovacion-desarrollo", undefined, "p", P2],
  ["Ingeniería en Inteligencia Artificial y Ciencia de Datos", "inteligencia-artificial", undefined, "p", "Anunciada por el Tec y la prensa local para agosto-diciembre de 2027; confirma su disponibilidad antes de considerarla.", "pending"],
  ["Ingeniería en Nanotecnología y Materiales", "nanotecnologia", undefined, "p", P2], ["Ingeniería en Robótica y Sistemas Inteligentes", "robotica"], ["Ingeniería en Tecnologías Computacionales", "ingenieria-software"],
  ["Ingeniería en Transformación Digital de Negocios", "ingenieria-de-negocios", undefined, "p", P2], ["Ingeniería Industrial y de Sistemas", "ingenieria-industrial"], ["Ingeniería Mecánica", "ingenieria-mecanica"],
  ["Ingeniería Mecatrónica", "mecatronica"], ["Ingeniería Química", "ingenieria-quimica"], ["Licenciatura en Arte Digital", "animacion"], ["Licenciatura en Comunicación y Producción Digital", "comunicacion"],
  ["Licenciatura en Contaduría Pública y Finanzas", "contaduria"], ["Licenciatura en Derecho", "derecho"], ["Licenciatura en Desarrollo de Talento y Cultura Organizacional", "recursos-humanos", undefined, "p", P2],
  ["Licenciatura en Diseño", "diseno-industrial"], ["Licenciatura en Economía", "economia"], ["Licenciatura en Emprendimiento e Innovación", "emprendimiento"],
  ["Licenciatura en Estrategia y Transformación de Negocios", "administracion"], ["Licenciatura en Finanzas", "finanzas"], ["Licenciatura en Gobierno y Transformación Pública", "administracion-publica", undefined, "p", P2],
  ["Licenciatura en Humanidades Digitales e Inteligencia Artificial", "humanidades", undefined, "p", P2], ["Licenciatura en Innovación y Transformación Educativa", "ciencias-educacion", undefined, "p", P2],
  ["Licenciatura en Inteligencia de Negocios", "inteligencia-de-negocios"], ["Licenciatura en Letras y Emprendimiento Editorial", "letras", undefined, "p", P2], ["Licenciatura en Mercadotecnia", "mercadotecnia"],
  ["Licenciatura en Negocios Internacionales", "negocios-internacionales", undefined, "p", P2], ["Licenciatura en Relaciones Internacionales", "relaciones-internacionales"],
  ["Licenciatura en Tecnología y Producción Musical", "produccion-musical"], ["Licenciatura en Urbanismo", "urbanismo", undefined, "p", P2],
];

// --- Universidad Madero (umad.edu.mx) ---
const umadRows: Row[] = [
  ["Licenciatura en Ingeniería de Software", "ingenieria-software", "https://umad.edu.mx/licenciatura-ingenieria-de-software-isf/"],
  ["Licenciatura en Ingeniería Industrial y Rentabilidad de Negocios", "ingenieria-industrial", "https://umad.edu.mx/licenciatura-en-ingenieria-industrial-y-rentabilidad-de-negocios/"],
  ["Ingeniería en Mecatrónica", "mecatronica", "https://umad.edu.mx/ingenieria-en-mecatronica/"], ["Ingeniería en Diseño Industrial", "diseno-industrial", "https://umad.edu.mx/ingenieria-en-diseno-industrial/"],
  ["Licenciatura en Lenguas Extranjeras", "idiomas", "https://umad.edu.mx/oferta-educativa/licenciatura-en-lenguas-extranjeras/"],
  ["Diseño Digital", "diseno-digital"], ["Comunicación y Multimedia", "comunicacion"], ["Arquitectura e Interiorismo", "arquitectura"], ["Administración e Innovación de Negocios", "administracion"],
  ["Mercadotecnia", "mercadotecnia"], ["Comercio Exterior y Derecho Aduanero", "negocios-internacionales"], ["Derecho", "derecho"],
].map(([n, c, u]) => [n, c, u ?? "https://umad.edu.mx/oferta-educativa-licenciaturas/"] as Row);

// --- Instituto Tecnológico de Puebla (www.puebla.tecnm.mx) ---
const itpRows: Row[] = [
  ["Ingeniería Industrial", "ingenieria-industrial", "ingenieria-industrial"], ["Ingeniería Electrónica", "ingenieria-electronica", "ingenieria-electronica"], ["Ingeniería Eléctrica", "ingenieria-electrica", "ingenieria-electrica"],
  ["Ingeniería Mecánica", "ingenieria-mecanica", "ingenieria-mecanica"], ["Ingeniería en Tecnologías de la Información y Comunicaciones", "ingenieria-software", "ingenieria-en-tecnologias-de-la-informacion-y-comunicaciones"],
  ["Ingeniería en Logística", "logistica", "ingenieria-en-logistica"], ["Ingeniería en Gestión Empresarial", "ingenieria-gestion-empresarial", "ingenieria-en-gestion-empresarial"],
  ["Licenciatura en Administración", "administracion", "licenciatura-en-administracion"],
];

// --- Universidad Tecnológica de Puebla (www.utpuebla.edu.mx) ---
const utpRows: Row[] = [
  ["Licenciatura en Administración", "administracion", "licenciatura-en-administracion-nme.html"], ["Licenciatura en Negocios y Mercadotecnia", "mercadotecnia", "licenciatura-en-negocios-mercadotecnia-nme.html"],
  ["Licenciatura en Gastronomía", "gastronomia", "licenciatura-en-gastronomia-nme.html"], ["Ingeniería Industrial", "ingenieria-industrial", "ingenieria-industrial-nme.html"],
  ["Ingeniería en Mantenimiento Industrial", "mantenimiento-industrial", "ingenieria-en-mantenimiento-industrial-nme.html"], ["Ingeniería en Mecatrónica", "mecatronica", "ingenieria-en-mecatronica-nme.html"],
  ["Ingeniería en Sistemas Automotrices", "ingenieria-automotriz", "ingenieria-en-sistemas-automotrices-nme.html"], ["Ingeniería en Energía y Desarrollo Sostenible", "energias-renovables", "ingenieria-en-energia-desarrollo-sostenible-nme.html"],
  ["Ingeniería en Ambiental y Sustentabilidad", "ingenieria-ambiental", "ingenieria-en-ambiental-sustentabilidad-nme.html"],
  ["Ingeniería en Tecnologías de la Información e Innovación Digital", "ingenieria-software", "ingenieria-en-tecnologias-informacion-nme.html"],
];

export const PROGRAMS: Program[] = [
  ...buapRows("buap-ciudad-universitaria", buapCU),
  ...buapDerecho,
  ...buapRows("buap-centro", buapCentro),
  ...buapRows("buap-salud", buapSalud),
  ...buapRows("buap-atlixcayotl", buapArte),
  ...make("udlap", "UDLAP – Oferta académica (udlap.mx/ofertaacademica)", "https://www.udlap.mx/ofertaacademica/", udlapRows, (p) => `https://www.udlap.mx/ofertaacademica/${p}`),
  ...make("ibero-puebla", "Ibero Puebla – Licenciaturas (iberopuebla.mx/licenciaturas)", "https://www.iberopuebla.mx/licenciaturas", iberoRows, (p) => `https://www.iberopuebla.mx/licenciaturas/${p}`),
  ...make("anahuac-puebla", "Anáhuac Puebla – Oferta educativa (puebla.anahuac.mx/licenciaturas/oferta-educativa)", "https://puebla.anahuac.mx/licenciaturas/oferta-educativa", anahuacRows, (p) => `https://puebla.anahuac.mx/licenciaturas/${p}`),
  ...make("uvp", "UVP – Oferta académica (uvp.mx/oferta-academica)", "https://www.uvp.mx/oferta-academica", uvpRows, (p) => `https://www.uvp.mx/${p}`),
  ...make("upaep", "UPAEP – Licenciaturas (web.upaep.mx/licenciaturas)", "https://web.upaep.mx/licenciaturas", upaepRows),
  ...make("tec-puebla", "Tecnológico de Monterrey – Campus Puebla (tec.mx/en/puebla-campus)", "https://tec.mx/en/puebla-campus", tecRows),
  ...make("umad", "Universidad Madero – Oferta educativa (umad.edu.mx)", "https://umad.edu.mx/oferta-educativa-licenciaturas/", umadRows),
  ...make("itp", "Instituto Tecnológico de Puebla – Oferta académica (puebla.tecnm.mx)", "https://www.puebla.tecnm.mx/", itpRows, (p) => `https://www.puebla.tecnm.mx/${p}/`),
  ...make("utp", "Universidad Tecnológica de Puebla – Oferta educativa (utpuebla.edu.mx)", "https://www.utpuebla.edu.mx/", utpRows, (p) => `https://www.utpuebla.edu.mx/${p}`),
];
