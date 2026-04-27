"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Package,
  ImageIcon,
  CircleCheck,
  CircleSlash,
  CircleDashed,
} from "lucide-react";
import { Topbar } from "../../_components/Topbar";
import { ProductDrawer } from "../../_components/ProductDrawer";
import {
  type AdminProduct,
  type ProductInput,
  type ProductStatus,
  CATEGORIES,
  STATUS_LABEL,
  createProduct,
  deleteProduct,
  fetchProducts,
  updateProduct,
} from "../../_data/productosMock";
import { cn } from "@/lib/utils";

const STATUS_COLOR: Record<ProductStatus, string> = {
  active: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  draft: "bg-amber-500/15 text-amber-300 border-amber-500/30",
  out_of_stock: "bg-red-500/15 text-red-300 border-red-500/30",
};

const STATUS_ICON: Record<ProductStatus, React.ComponentType<{ size?: number }>> = {
  active: CircleCheck,
  draft: CircleDashed,
  out_of_stock: CircleSlash,
};

const formatPrice = (n: number) =>
  new Intl.NumberFormat("es-PE", {
    style: "currency",
    currency: "PEN",
    minimumFractionDigits: 2,
  }).format(n);

export default function ProductosPage() {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<ProductStatus | "">("");

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<"create" | "edit">("create");
  const [editing, setEditing] = useState<AdminProduct | null>(null);
  const [saving, setSaving] = useState(false);

  const [toast, setToast] = useState<{ msg: string; tone: "ok" | "err" } | null>(
    null,
  );

  useEffect(() => {
    void load();
  }, []);

  const load = async () => {
    setLoading(true);
    const list = await fetchProducts();
    setProducts(list);
    setLoading(false);
  };

  const showToast = (msg: string, tone: "ok" | "err" = "ok") => {
    setToast({ msg, tone });
    setTimeout(() => setToast(null), 2500);
  };

  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (filterCategory && p.category !== filterCategory) return false;
      if (filterStatus && p.status !== filterStatus) return false;
      if (search) {
        const q = search.toLowerCase();
        if (
          !p.name.toLowerCase().includes(q) &&
          !p.sku.toLowerCase().includes(q) &&
          !p.brand.toLowerCase().includes(q)
        )
          return false;
      }
      return true;
    });
  }, [products, search, filterCategory, filterStatus]);

  const stats = useMemo(() => {
    return {
      total: products.length,
      active: products.filter((p) => p.status === "active").length,
      draft: products.filter((p) => p.status === "draft").length,
      out: products.filter((p) => p.status === "out_of_stock").length,
    };
  }, [products]);

  const openCreate = () => {
    setDrawerMode("create");
    setEditing(null);
    setDrawerOpen(true);
  };

  const openEdit = (p: AdminProduct) => {
    setDrawerMode("edit");
    setEditing(p);
    setDrawerOpen(true);
  };

  const handleSubmit = async (data: ProductInput) => {
    setSaving(true);
    try {
      if (drawerMode === "create") {
        const created = await createProduct(data);
        setProducts((prev) => [created, ...prev]);
        showToast("Producto creado correctamente.");
      } else if (editing) {
        const updated = await updateProduct(editing.id, data);
        setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
        showToast("Cambios guardados.");
      }
      setDrawerOpen(false);
    } catch (err) {
      console.error(err);
      showToast("Hubo un error al guardar.", "err");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (p: AdminProduct) => {
    if (!confirm(`¿Eliminar "${p.name}"? Esta acción no se puede deshacer.`))
      return;
    try {
      await deleteProduct(p.id);
      setProducts((prev) => prev.filter((x) => x.id !== p.id));
      showToast("Producto eliminado.");
    } catch (err) {
      console.error(err);
      showToast("No se pudo eliminar.", "err");
    }
  };

  return (
    <>
      <Topbar
        title="Productos"
        subtitle="Gestiona el catálogo del e-commerce."
        breadcrumbs={[
          { label: "AVAX CMS", href: "/admin/dashboard" },
          { label: "Contenido" },
          { label: "Productos" },
        ]}
        actions={
          <button
            type="button"
            onClick={openCreate}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white shadow-md shadow-[var(--primary)]/25 transition-colors"
          >
            <Plus size={14} />
            Nuevo producto
          </button>
        }
      />

      <div className="px-6 lg:px-8 py-8 flex flex-col gap-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <Stat label="Total" value={stats.total} />
          <Stat label="Activos" value={stats.active} accent="ok" />
          <Stat label="Borradores" value={stats.draft} accent="warn" />
          <Stat label="Sin stock" value={stats.out} accent="err" />
        </div>

        <div className="flex flex-col md:flex-row md:items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--admin-fg-subtle)]"
            />
            <input
              type="text"
              placeholder="Buscar por nombre, SKU o marca..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white/5 border border-[var(--admin-border)] rounded-lg pl-9 pr-4 py-2.5 text-sm text-[var(--admin-fg)] placeholder:text-[var(--admin-fg-subtle)] outline-none focus:border-[var(--primary)] transition-colors"
            />
          </div>

          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="bg-white/5 border border-[var(--admin-border)] rounded-lg px-3 py-2.5 text-sm text-[var(--admin-fg)] outline-none focus:border-[var(--primary)] cursor-pointer min-w-[180px]"
          >
            <option value="" className="bg-[var(--admin-bg)]">
              Todas las categorías
            </option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c} className="bg-[var(--admin-bg)]">
                {c}
              </option>
            ))}
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as ProductStatus | "")}
            className="bg-white/5 border border-[var(--admin-border)] rounded-lg px-3 py-2.5 text-sm text-[var(--admin-fg)] outline-none focus:border-[var(--primary)] cursor-pointer min-w-[160px]"
          >
            <option value="" className="bg-[var(--admin-bg)]">
              Todos los estados
            </option>
            {(["active", "draft", "out_of_stock"] as ProductStatus[]).map((s) => (
              <option key={s} value={s} className="bg-[var(--admin-bg)]">
                {STATUS_LABEL[s]}
              </option>
            ))}
          </select>
        </div>

        {loading ? (
          <SkeletonGrid />
        ) : filtered.length === 0 ? (
          <EmptyState
            hasFilters={!!(search || filterCategory || filterStatus)}
            onCreate={openCreate}
            onClear={() => {
              setSearch("");
              setFilterCategory("");
              setFilterStatus("");
            }}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                onEdit={() => openEdit(p)}
                onDelete={() => handleDelete(p)}
              />
            ))}
          </div>
        )}
      </div>

      <ProductDrawer
        open={drawerOpen}
        mode={drawerMode}
        initial={editing}
        saving={saving}
        onClose={() => setDrawerOpen(false)}
        onSubmit={handleSubmit}
      />

      {toast && (
        <div className="fixed bottom-6 right-6 z-[60]">
          <div
            className={cn(
              "px-4 py-3 rounded-xl text-sm font-medium shadow-xl border",
              toast.tone === "ok"
                ? "bg-emerald-500/15 text-emerald-200 border-emerald-500/40"
                : "bg-red-500/15 text-red-200 border-red-500/40",
            )}
          >
            {toast.msg}
          </div>
        </div>
      )}
    </>
  );
}

function Stat({
  label,
  value,
  accent,
}: {
  label: string;
  value: number;
  accent?: "ok" | "warn" | "err";
}) {
  const dot =
    accent === "ok"
      ? "bg-emerald-400"
      : accent === "warn"
      ? "bg-amber-400"
      : accent === "err"
      ? "bg-red-400"
      : "bg-[var(--primary)]";
  return (
    <div className="bg-[var(--admin-card)] border border-[var(--admin-border)] rounded-xl p-4 flex items-center gap-3">
      <span className={cn("w-2 h-2 rounded-full", dot)} />
      <div className="flex flex-col">
        <span className="text-[10px] uppercase tracking-wider text-[var(--admin-fg-subtle)]">
          {label}
        </span>
        <span className="text-xl font-bold text-[var(--admin-fg)]">{value}</span>
      </div>
    </div>
  );
}

function ProductCard({
  product,
  onEdit,
  onDelete,
}: {
  product: AdminProduct;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const StatusIcon = STATUS_ICON[product.status];
  const cover = product.images[0];

  return (
    <article className="group relative bg-[var(--admin-card)] border border-[var(--admin-border)] rounded-2xl overflow-hidden hover:border-[var(--primary)] transition-colors flex flex-col">
      <div className="relative aspect-[4/3] bg-black/20 overflow-hidden">
        {cover ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={cover}
            alt={product.name}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-[var(--admin-fg-subtle)]">
            <ImageIcon size={32} />
          </div>
        )}

        <span
          className={cn(
            "absolute top-2 left-2 inline-flex items-center gap-1 px-2 py-1 rounded-md border text-[10px] font-bold tracking-wider",
            STATUS_COLOR[product.status],
          )}
        >
          <StatusIcon size={10} />
          {STATUS_LABEL[product.status].toUpperCase()}
        </span>

        {product.badge && (
          <span className="absolute top-2 right-2 inline-flex items-center px-2 py-1 rounded-md bg-[var(--primary)] text-white text-[10px] font-bold tracking-wider">
            {product.badge}
          </span>
        )}

        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <button
            type="button"
            onClick={onEdit}
            aria-label="Editar"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white text-[var(--avax-black)] text-xs font-semibold hover:bg-white/90 transition-colors"
          >
            <Pencil size={12} />
            Editar
          </button>
          <button
            type="button"
            onClick={onDelete}
            aria-label="Eliminar"
            className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-red-500/90 hover:bg-red-500 text-white transition-colors"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      <div className="p-4 flex flex-col gap-2 flex-1">
        <div className="flex items-center justify-between gap-2 text-[10px] tracking-wider">
          <span className="text-[var(--admin-fg-subtle)] uppercase">
            {product.brand}
          </span>
          <span className="text-[var(--admin-fg-subtle)]">{product.category}</span>
        </div>

        <h3 className="text-sm font-bold text-[var(--admin-fg)] line-clamp-1">
          {product.name}
        </h3>
        <p className="text-[11px] font-mono text-[var(--admin-fg-subtle)]">
          {product.sku}
        </p>

        <div className="flex items-baseline justify-between mt-1">
          <div className="flex items-baseline gap-2">
            <span className="text-base font-bold text-[var(--admin-fg)]">
              {formatPrice(product.price)}
            </span>
            {product.oldPrice && (
              <span className="text-[11px] line-through text-[var(--admin-fg-subtle)]">
                {formatPrice(product.oldPrice)}
              </span>
            )}
          </div>
          <span className="inline-flex items-center gap-1 text-[11px] text-[var(--admin-fg-muted)]">
            <Package size={11} />
            {product.stock}
          </span>
        </div>
      </div>
    </article>
  );
}

function SkeletonGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="bg-[var(--admin-card)] border border-[var(--admin-border)] rounded-2xl overflow-hidden animate-pulse"
        >
          <div className="aspect-[4/3] bg-white/5" />
          <div className="p-4 flex flex-col gap-2">
            <div className="h-3 w-1/3 bg-white/5 rounded" />
            <div className="h-4 w-3/4 bg-white/10 rounded" />
            <div className="h-3 w-1/2 bg-white/5 rounded" />
            <div className="h-5 w-2/3 bg-white/10 rounded mt-1" />
          </div>
        </div>
      ))}
    </div>
  );
}

function EmptyState({
  hasFilters,
  onCreate,
  onClear,
}: {
  hasFilters: boolean;
  onCreate: () => void;
  onClear: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-20 rounded-2xl bg-[var(--admin-card)] border border-[var(--admin-border)]">
      <span className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-[var(--admin-fg-subtle)] mb-4">
        <Package size={24} />
      </span>
      <h3 className="text-base font-bold text-[var(--admin-fg)] mb-1">
        {hasFilters ? "Sin resultados" : "Aún no tienes productos"}
      </h3>
      <p className="text-sm text-[var(--admin-fg-muted)] mb-5 max-w-sm">
        {hasFilters
          ? "Prueba ajustando o limpiando los filtros."
          : "Empieza creando tu primer producto para que aparezca en la tienda."}
      </p>
      {hasFilters ? (
        <button
          type="button"
          onClick={onClear}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold bg-white/5 hover:bg-white/10 text-[var(--admin-fg)] transition-colors"
        >
          Limpiar filtros
        </button>
      ) : (
        <button
          type="button"
          onClick={onCreate}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white shadow-md shadow-[var(--primary)]/25 transition-colors"
        >
          <Plus size={14} />
          Crear primer producto
        </button>
      )}
    </div>
  );
}
