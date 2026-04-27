import Link from "next/link";
import {
  Image as ImageIcon,
  RefreshCw,
  Layers,
  Activity,
  ArrowRight,
} from "lucide-react";
import { Topbar } from "../../_components/Topbar";

const STATS = [
  {
    label: "Imágenes activas",
    value: "28",
    hint: "Hero · Populares · Promo · Lanzamientos · Destacados · Marcas · IG",
    icon: ImageIcon,
  },
  {
    label: "Secciones editables",
    value: "8",
    hint: "Áreas visuales del home",
    icon: Layers,
  },
  {
    label: "Última actualización",
    value: "Hoy",
    hint: "26 abr 2026",
    icon: RefreshCw,
  },
  {
    label: "Estado del sitio",
    value: "Operativo",
    hint: "Sin incidencias",
    icon: Activity,
  },
];

export default function DashboardPage() {
  return (
    <>
      <Topbar
        title="Bienvenido, Angel"
        subtitle="Resumen del contenido visual del e-commerce."
        breadcrumbs={[{ label: "AVAX CMS" }, { label: "General" }]}
      />

      <div className="px-6 lg:px-8 py-8 flex flex-col gap-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {STATS.map(({ label, value, hint, icon: Icon }) => (
            <div
              key={label}
              className="bg-[var(--admin-card)] border border-[var(--admin-border)] rounded-2xl p-5 hover:border-[var(--primary)] transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <span className="text-xs text-[var(--admin-fg-muted)]">{label}</span>
                <span className="w-8 h-8 rounded-lg bg-[var(--primary)]/15 text-[var(--primary)] flex items-center justify-center">
                  <Icon size={14} />
                </span>
              </div>
              <p className="text-2xl font-bold text-[var(--admin-fg)] mb-1 tracking-tight">
                {value}
              </p>
              <p className="text-[11px] text-[var(--admin-fg-subtle)]">{hint}</p>
            </div>
          ))}
        </div>

        <div className="relative overflow-hidden rounded-2xl border border-[var(--admin-border)] gradient-avax p-8 lg:p-10">
          <div className="pointer-events-none absolute -top-24 -right-24 w-80 h-80 rounded-full bg-white/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-[var(--avax-blue-light)]/30 blur-3xl" />

          <div className="relative max-w-2xl">
            <span className="inline-flex items-center gap-1.5 text-[10px] font-bold tracking-[0.22em] text-white/80 mb-3">
              <Layers size={12} />
              ACCIÓN PRINCIPAL
            </span>
            <h2 className="text-2xl lg:text-3xl font-bold text-white mb-3 tracking-tight">
              Cambia las imágenes del home
            </h2>
            <p className="text-sm text-white/85 mb-7 max-w-lg leading-relaxed">
              Actualiza el hero, banner promocional, logos de marcas y feed de
              Instagram que ven los clientes en la tienda pública.
            </p>
            <Link
              href="/admin/imagenes"
              className="inline-flex items-center gap-2 px-5 py-3 bg-white text-[var(--avax-black)] hover:bg-white/90 rounded-xl font-semibold text-sm transition-colors shadow-lg shadow-black/10"
            >
              Ir a imágenes del home
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>

        <div className="bg-[var(--admin-card)] border border-[var(--admin-border)] rounded-2xl p-6">
          <h3 className="text-sm font-semibold text-[var(--admin-fg)] mb-1">
            Próximamente
          </h3>
          <p className="text-xs text-[var(--admin-fg-muted)] mb-5">
            Estos módulos se habilitarán cuando el backend Laravel esté
            disponible.
          </p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              "Gestión de productos y variantes",
              "Pedidos y estados de envío",
              "Categorías del catálogo",
              "Clientes registrados",
              "Cupones y promociones",
              "Configuración general",
            ].map((item) => (
              <li
                key={item}
                className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-white/[0.03] border border-[var(--admin-border)] text-xs text-[var(--admin-fg-muted)]"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--admin-fg-subtle)]" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
