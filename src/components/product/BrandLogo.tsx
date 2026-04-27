"use client";

import { cn } from "@/lib/utils";

/**
 * Wordmark estilizado por marca cuando no hay un logo real disponible.
 * Cada marca conocida tiene su propia tipografía y color para que se vea
 * inmediatamente reconocible (Nike, Adidas, etc.).
 */

type Style = {
  fontFamily?: string;
  fontWeight: number;
  fontStyle?: "italic" | "normal";
  letterSpacing?: string;
  textTransform: "uppercase" | "lowercase" | "none";
  color: string;
  /** Texto a mostrar (override del nombre). Útil para casos como "adidas" lowercase. */
  display?: string;
  /** Símbolo o caracter decorativo opcional al lado. */
  prefix?: string;
};

const BRAND_STYLES: Record<string, Style> = {
  nike: {
    fontWeight: 900,
    letterSpacing: "0.06em",
    textTransform: "uppercase",
    color: "#111111",
    fontStyle: "italic",
  },
  adidas: {
    fontWeight: 800,
    letterSpacing: "-0.02em",
    textTransform: "lowercase",
    color: "#111111",
    display: "adidas",
  },
  puma: {
    fontWeight: 900,
    letterSpacing: "0.04em",
    textTransform: "uppercase",
    color: "#111111",
    fontStyle: "italic",
  },
  "new balance": {
    fontWeight: 800,
    letterSpacing: "-0.01em",
    textTransform: "uppercase",
    color: "#C8102E",
    display: "NB",
  },
  converse: {
    fontWeight: 900,
    letterSpacing: "0.03em",
    textTransform: "uppercase",
    color: "#111111",
  },
  vans: {
    fontWeight: 900,
    letterSpacing: "0.02em",
    textTransform: "uppercase",
    color: "#111111",
    fontStyle: "italic",
  },
  reebok: {
    fontWeight: 900,
    letterSpacing: "0.02em",
    textTransform: "uppercase",
    color: "#E2231A",
  },
  fila: {
    fontWeight: 900,
    letterSpacing: "0.04em",
    textTransform: "uppercase",
    color: "#1B2D6B",
  },
  asics: {
    fontWeight: 800,
    letterSpacing: "0.04em",
    textTransform: "uppercase",
    color: "#0033A0",
    fontStyle: "italic",
  },
  jordan: {
    fontWeight: 900,
    letterSpacing: "0.04em",
    textTransform: "uppercase",
    color: "#111111",
  },
  lacoste: {
    fontWeight: 800,
    letterSpacing: "0.18em",
    textTransform: "uppercase",
    color: "#004F38",
    prefix: "🐊",
  },
  "armani exchange": {
    fontWeight: 700,
    letterSpacing: "0.32em",
    textTransform: "uppercase",
    color: "#111111",
    display: "A|X",
  },
  "tommy hilfiger": {
    fontWeight: 800,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    color: "#0E2B5E",
  },
  "calvin klein": {
    fontWeight: 800,
    letterSpacing: "0.18em",
    textTransform: "uppercase",
    color: "#111111",
    display: "CK",
  },
  guess: {
    fontWeight: 900,
    letterSpacing: "0.18em",
    textTransform: "uppercase",
    color: "#111111",
  },
};

const DEFAULT_STYLE: Style = {
  fontWeight: 900,
  letterSpacing: "-0.02em",
  textTransform: "uppercase",
  color: "#111111",
};

type Props = {
  name: string;
  className?: string;
  /** Tamaño relativo del wordmark. Default 'lg'. */
  size?: "sm" | "md" | "lg";
};

const SIZE_CLASS: Record<NonNullable<Props["size"]>, string> = {
  sm: "text-2xl",
  md: "text-4xl md:text-5xl",
  lg: "text-5xl md:text-6xl",
};

export function BrandLogo({ name, className, size = "lg" }: Props) {
  const key = name.trim().toLowerCase();
  const style = BRAND_STYLES[key] ?? DEFAULT_STYLE;
  const text = style.display ?? name;

  return (
    <div
      className={cn(
        "inline-flex items-center justify-center select-none leading-none",
        SIZE_CLASS[size],
        className,
      )}
    >
      {style.prefix && (
        <span className="mr-2" aria-hidden>
          {style.prefix}
        </span>
      )}
      <span
        style={{
          fontWeight: style.fontWeight,
          fontStyle: style.fontStyle,
          letterSpacing: style.letterSpacing,
          color: style.color,
          textTransform: style.textTransform,
          fontFamily: style.fontFamily,
        }}
      >
        {text}
      </span>
    </div>
  );
}
