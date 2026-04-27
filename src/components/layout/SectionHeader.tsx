import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Align = "start" | "center" | "between";

type TagPill = {
  label: string;
  icon?: ReactNode;
  /** Tailwind classes para color del pill, ej: "bg-[var(--primary-soft)] text-[var(--primary)]" */
  className?: string;
};

type Props = {
  tag?: TagPill;
  title: string;
  subtitle?: string;
  align?: Align;
  /** Render del slot derecho (controles, link, tabs, etc) */
  end?: ReactNode;
  className?: string;
  titleClassName?: string;
};

export function SectionHeader({
  tag,
  title,
  subtitle,
  align = "between",
  end,
  className,
  titleClassName,
}: Props) {
  const isCenter = align === "center";

  const inner = (
    <div className={cn("flex flex-col gap-2.5", isCenter && "items-center text-center")}>
      {tag && (
        <span
          className={cn(
            "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-extrabold tracking-[0.15em] uppercase",
            tag.className ??
              "bg-[var(--primary-soft)] text-[var(--primary)]"
          )}
        >
          {tag.icon && <span className="inline-flex">{tag.icon}</span>}
          {tag.label}
        </span>
      )}
      <h2
        className={cn(
          "text-3xl md:text-4xl lg:text-[42px] font-black text-[var(--avax-black)] leading-[1.05] tracking-tight",
          titleClassName
        )}
      >
        {title}
      </h2>
      {subtitle && (
        <p className={cn("text-sm md:text-base text-[var(--foreground-muted)]", isCenter && "max-w-xl")}>
          {subtitle}
        </p>
      )}
    </div>
  );

  if (align === "center") {
    return <header className={cn("flex flex-col items-center gap-4", className)}>{inner}{end}</header>;
  }

  return (
    <header
      className={cn(
        "flex flex-col md:flex-row gap-4 md:items-end md:justify-between",
        className
      )}
    >
      {inner}
      {end && <div className="shrink-0">{end}</div>}
    </header>
  );
}
