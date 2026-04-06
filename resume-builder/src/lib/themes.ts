// Theme configurations for modular styling
export const themes = {
  card: "bg-[var(--card-bg)] print:bg-white",
  white: "bg-white",
  gradient: "bg-gradient-to-b from-white via-slate-50 to-slate-100 print:from-white print:via-white print:to-white",
} as const;

export type ThemeType = keyof typeof themes;