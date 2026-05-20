"use client";

import { useEffect, useState } from "react";
import { Tag, Plus, RefreshCw, Search } from "lucide-react";
import { Topbar } from "../../_components/Topbar";
import { getAdminToken } from "@/lib/admin-auth";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000/api";

type Categoria = {
  id: number | string;
  nombre?: string;
  name?: string;
  slug: string;
  descripcion?: string;
  description?: string;
  productos_count?: number;
};

export default function CategoriasPage() {
  const token = getAdminToken() ?? "";
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/shop/categorias`, {
        headers: { Accept: "application/json", Authorization: `Bearer ${token}` },
        cache: "no-store",
      });
      if (!res.ok) throw new Error(`Error ${res.status}`);
      const data = await res.json();
      const list = Array.isArray(data) ? data : data.data ?? [];
      setCategorias(list);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al cargar categorías");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void loadData(); }, []);

  const filtered = categorias.filter((c) => {
    const nombre = c.nombre ?? c.name ?? "";
    return nombre.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <>
      <Topbar
        title="Categorías"
        subtitle="Organización del catálogo en categorías."
        breadcrumbs={[
          { label: "AVAX CMS", href: "/admin/dashboard" },
          { label: "Contenido" },
          { label: "Categorías" },
        ]}
        actions={
          <button
            type="button"
            onClick={() => void loadData()}
            disabled={loading}
            className="w-9 h-9 rounded-lg bg-white/5 hover:bg-white/10 text-[var(--admin-fg-muted)] hover:text-[var(--admin-fg)] flex items-center justify-center transition-colors disabled:opacity-40"
          >
            <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
          </button>
        }
      />

      <div className="px-6 lg:px-8 py-8 flex flex-col gap-6">

        {/* Barra de búsqueda */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--admin-fg-muted)]" />
            <input
              type="text"
              placeholder="Buscar categoría..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm bg-[var(--admin-card)] border border-[var(--admin-border)] rounded-lg text-[var(--admin-fg)] placeholder:text-[var(--admin-fg-muted)] focus:outline-none focus:border-[var(--primary)]"
            />
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Tabla */}
        <div className="bg-[var(--admin-card)] border border-[var(--admin-border)] rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--admin-border)]">
            <div>
              <h3 className="text-sm font-semibold text-[var(--admin-fg)]">Categorías del catálogo</h3>
              <p className="text-[11px] text-[var(--admin-fg-subtle)] mt-0.5">
                {loading ? "Cargando..." : `${filtered.length} categorías encontradas`}
              </p>
            </div>
          </div>

          {loading ? (
            <div className="p-8 flex items-center justify-center">
              <RefreshCw size={20} className="animate-spin text-[var(--admin-fg-muted)]" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-8 text-center">
              <Tag size={32} className="mx-auto mb-3 text-[var(--admin-fg-subtle)]" />
              <p className="text-sm text-[var(--admin-fg-muted)]">No se encontraron categorías</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[var(--admin-border)]">
                    <th className="text-left px-5 py-3 text-[10px] font-bold tracking-[0.12em] text-[var(--admin-fg-subtle)]">NOMBRE</th>
                    <th className="text-left px-5 py-3 text-[10px] font-bold tracking-[0.12em] text-[var(--admin-fg-subtle)]">SLUG</th>
                    <th className="text-left px-5 py-3 text-[10px] font-bold tracking-[0.12em] text-[var(--admin-fg-subtle)] hidden md:table-cell">DESCRIPCIÓN</th>
                    <th className="text-right px-5 py-3 text-[10px] font-bold tracking-[0.12em] text-[var(--admin-fg-subtle)]">PRODUCTOS</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((c) => (
                    <tr
                      key={c.id}
                      className="border-b border-[var(--admin-border)] last:border-0 hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2">
                          <span className="w-7 h-7 rounded-lg bg-[var(--primary)]/15 text-[var(--primary)] flex items-center justify-center">
                            <Tag size={13} />
                          </span>
                          <span className="font-medium text-[var(--admin-fg)]">{c.nombre ?? c.name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-[var(--admin-fg-muted)] font-mono text-xs">{c.slug}</td>
                      <td className="px-5 py-3 text-[var(--admin-fg-muted)] text-xs hidden md:table-cell">
                        {c.descripcion ?? c.description ?? "—"}
                      </td>
                      <td className="px-5 py-3 text-right font-semibold text-[var(--admin-fg)]">
                        {c.productos_count ?? "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
