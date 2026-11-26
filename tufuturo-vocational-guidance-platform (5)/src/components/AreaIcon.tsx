import { BookOpen, Briefcase, Cpu, FlaskConical, HeartPulse, Palette, Scale, Sprout, type LucideProps } from "lucide-react";

const MAP = { HeartPulse, Cpu, FlaskConical, Briefcase, Scale, BookOpen, Palette, Sprout } as const;

export function AreaIcon({ name, ...props }: { name: string } & LucideProps) {
  const Icon = MAP[name as keyof typeof MAP] ?? BookOpen;
  return <Icon aria-hidden="true" {...props} />;
}
