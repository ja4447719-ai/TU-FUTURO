import { doublePrecision, index, jsonb, pgTable, text, timestamp, uuid, boolean } from "drizzle-orm/pg-core";

export const areasTable = pgTable("areas", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  icon: text("icon").notNull(),
  color: text("color").notNull(),
});

export const careersTable = pgTable(
  "careers",
  {
    slug: text("slug").primaryKey(),
    name: text("name").notNull(),
    area: text("area").notNull().references(() => areasTable.id),
    duration: text("duration").notNull(),
    profile: text("profile").notNull(),
    description: text("description").notNull(),
    studies: text("studies").notNull(),
    subjects: jsonb("subjects").$type<string[]>().notNull(),
    skills: jsonb("skills").$type<string[]>().notNull(),
    activities: jsonb("activities").$type<string[]>().notNull(),
    fields: jsonb("fields").$type<string[]>().notNull(),
    specializations: jsonb("specializations").$type<string[]>().notNull(),
    challenges: text("challenges").notNull(),
    related: jsonb("related").$type<string[]>().notNull(),
    aliases: jsonb("aliases").$type<string[]>().notNull(),
  },
  (t) => [index("careers_area_idx").on(t.area)],
);

export const universitiesTable = pgTable("universities", {
  slug: text("slug").primaryKey(),
  institution: text("institution").notNull(),
  shortName: text("short_name").notNull(),
  campus: text("campus").notNull(),
  type: text("type").$type<"publica" | "privada">().notNull(),
  address: text("address").notNull(),
  city: text("city").notNull(),
  municipality: text("municipality").notNull(),
  state: text("state").notNull(),
  postalCode: text("postal_code").notNull(),
  lat: doublePrecision("lat").notNull(),
  lng: doublePrecision("lng").notNull(),
  coordApprox: boolean("coord_approx").notNull(),
  coordSource: text("coord_source").notNull(),
  website: text("website").notNull(),
  admissionsUrl: text("admissions_url").notNull(),
  color: text("color").notNull(),
});

export const programsTable = pgTable(
  "programs",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    universitySlug: text("university_slug").notNull().references(() => universitiesTable.slug),
    careerSlug: text("career_slug").notNull().references(() => careersTable.slug),
    officialName: text("official_name").notNull(),
    modalities: jsonb("modalities").$type<string[]>().notNull(),
    duration: text("duration"),
    url: text("url").notNull(),
    source: text("source").notNull(),
    note: text("note"),
    consultedAt: text("consulted_at").notNull(),
    status: text("status").$type<"verified" | "pending" | "outdated">().notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => [index("programs_career_idx").on(t.careerSlug), index("programs_university_idx").on(t.universitySlug)],
);
