import Link from "next/link";
import Image from "next/image";
import {
  ShieldCheck,
  Boxes,
  ImageIcon,
  BarChart3,
  Sparkles,
} from "lucide-react";

const FEATURES = [
  { icon: Boxes, text: "Gestión completa de productos y variantes" },
  { icon: BarChart3, text: "Métricas de ventas en tiempo real" },
  { icon: ImageIcon, text: "Carga rápida de banners e imágenes" },
  { icon: ShieldCheck, text: "Acceso seguro con autenticación JWT" },
];

type Props = {
  children: React.ReactNode;
  title: string;
  subtitle: string;
  eyebrow?: string;
};

export function AuthShell({
  children,
  title,
  subtitle,
  eyebrow = "Bienvenido al CMS",
}: Props) {
  return (
    <div className="min-h-screen w-full grid grid-cols-1 lg:grid-cols-[1.05fr_1fr] bg-[var(--background-soft)]">
      {/* === Panel izquierdo (decorativo, solo desktop) === */}
      <aside className="relative hidden lg:flex flex-col justify-between p-12 xl:p-16 overflow-hidden gradient-avax text-white">
        {/* Orbs de luz */}
        <div className="pointer-events-none absolute -top-32 -left-32 w-96 h-96 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-40 -right-40 w-[32rem] h-[32rem] rounded-full bg-[var(--avax-blue-light)]/40 blur-3xl" />
        {/* Patrón de cuadrícula sutil */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)",
            backgroundSize: "44px 44px",
          }}
        />

        {/* Top: logo + badge */}
        <div className="relative z-10 flex flex-col items-start gap-3">
          <Link href="/" className="inline-flex">
            <Image
              src="/images/avax-logo.png"
              alt="AVAX"
              width={160}
              height={48}
              priority
              className="h-11 w-auto brightness-0 invert"
            />
          </Link>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-white text-[10px] font-bold tracking-[0.22em]">
            <ShieldCheck size={12} />
            CMS · PANEL ADMIN
          </span>
        </div>

        {/* Centro: mensaje + features */}
        <div className="relative z-10 max-w-lg">
          <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/70 mb-4">
            <Sparkles size={14} />
            {eyebrow}
          </span>
          <h2 className="text-4xl xl:text-[2.75rem] font-bold leading-[1.1] mb-5 tracking-tight">
            Administra AVAX desde un solo lugar.
          </h2>
          <p className="text-base text-white/80 leading-relaxed">
            La plataforma interna del equipo de AVAX Distribuidora para gestionar
            productos, pedidos, clientes y contenido del e-commerce.
          </p>

          <ul className="mt-9 space-y-3.5">
            {FEATURES.map(({ icon: Icon, text }) => (
              <li
                key={text}
                className="flex items-center gap-3.5 text-sm text-white/90"
              >
                <span className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-white/15 backdrop-blur-md border border-white/15 shrink-0">
                  <Icon size={16} />
                </span>
                {text}
              </li>
            ))}
          </ul>
        </div>

        {/* Bottom: footer corporativo */}
        <div className="relative z-10 flex items-center justify-between text-xs text-white/60">
          <span>© 2026 AVAX Distribuidora</span>
          <span className="inline-flex items-center gap-2">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400" />
            Sistema operativo · Lima, Perú
          </span>
        </div>
      </aside>

      {/* === Panel derecho (formulario) === */}
      <main className="relative flex flex-col items-center justify-center px-6 sm:px-10 py-12">
        {/* Header mobile */}
        <div className="lg:hidden flex flex-col items-center mb-8">
          <Link href="/" className="mb-4 inline-flex">
            <Image
              src="/images/avax-logo.png"
              alt="AVAX"
              width={130}
              height={40}
              priority
              className="h-9 w-auto"
            />
          </Link>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--avax-black)] text-white text-[10px] font-bold tracking-[0.22em]">
            <ShieldCheck size={12} />
            PANEL ADMIN
          </span>
        </div>

        <div className="w-full max-w-[420px]">
          <div className="mb-8">
            <h1 className="text-[2rem] leading-tight font-bold text-[var(--avax-black)] mb-2 tracking-tight">
              {title}
            </h1>
            <p className="text-sm text-[var(--foreground-muted)]">{subtitle}</p>
          </div>

          {children}
        </div>

        <p className="lg:hidden mt-10 text-center text-xs text-[var(--foreground-subtle)]">
          © 2026 AVAX Distribuidora.
        </p>
      </main>
    </div>
  );
}
