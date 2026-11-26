export function LogoMark({ size = 36 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true">
      <defs>
        <linearGradient id="tf-g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#6366f1" />
          <stop offset="1" stopColor="#4338ca" />
        </linearGradient>
      </defs>
      <rect width="48" height="48" rx="14" fill="url(#tf-g)" />
      <path d="M13 17h22M24 17v18" stroke="#fff" strokeWidth="5" strokeLinecap="round" />
      <path d="M29 12l7-1-1 7" stroke="#ff6b4a" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2.5">
      <LogoMark />
      <span className={`text-xl font-extrabold tracking-tight ${light ? "text-white" : "text-ink"}`}>
        Tu<span className="text-coral">Futuro</span>
      </span>
    </span>
  );
}
