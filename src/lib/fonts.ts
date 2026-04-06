// Font configurations for modular styling
export const fonts = {
  roboto: "font-roboto",
  sans: "font-sans",
  serif: "font-serif",
  mono: "font-mono",
} as const;

export type FontType = keyof typeof fonts;