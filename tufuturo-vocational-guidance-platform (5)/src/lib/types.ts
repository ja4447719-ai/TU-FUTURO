export type AreaId =
  | "salud"
  | "ingenierias"
  | "naturales"
  | "negocios"
  | "sociales"
  | "humanidades"
  | "arte"
  | "agro";

export interface Area {
  id: AreaId;
  name: string;
  description: string;
  icon: string;
  color: string;
}

export interface Career {
  slug: string;
  name: string;
  area: AreaId;
  duration: string;
  profile: string;
  description: string;
  studies: string;
  subjects: string[];
  skills: string[];
  activities: string[];
  fields: string[];
  specializations: string[];
  challenges: string;
  related: string[];
  aliases: string[];
}

export type InstitutionType = "publica" | "privada";
export type Modality = "presencial" | "online" | "mixta";
export type VerificationStatus = "verified" | "pending" | "outdated";

export interface University {
  slug: string;
  institution: string;
  shortName: string;
  campus: string;
  type: InstitutionType;
  address: string;
  city: string;
  municipality: string;
  state: string;
  postalCode: string;
  lat: number;
  lng: number;
  coordPrecision: "exact" | "approx";
  coordSource: string;
  website: string;
  admissionsUrl: string;
  color: string;
}

export interface Program {
  universitySlug: string;
  careerSlug: string;
  officialName: string;
  modalities: Modality[];
  duration: string | null;
  url: string;
  source: string;
  note: string | null;
  consultedAt: string;
  status: VerificationStatus;
}

export const AREA_ORDER: AreaId[] = [
  "salud",
  "ingenierias",
  "naturales",
  "negocios",
  "sociales",
  "humanidades",
  "arte",
  "agro",
];
