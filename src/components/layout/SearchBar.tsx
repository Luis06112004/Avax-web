"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Loader2, Search, X } from "lucide-react";
import { listProducts, type ShopProduct } from "@/lib/shop-api";
import { formatPrice } from "@/lib/utils";
import { SneakerPlaceholder } from "@/components/ui/SneakerPlaceholder";

type Props = {
  autoFocus?: boolean;
  onSubmitted?: () => void;
};

export function SearchBar({ autoFocus, onSubmitted }: Props) {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [results, setResults] = useState<ShopProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (autoFocus) inputRef.current?.focus();
  }, [autoFocus]);

  // Close dropdown on outside click
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!wrapperRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  // Debounced search
  useEffect(() => {
    const term = q.trim();
    if (term.length < 2) {
      setResults([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const handle = setTimeout(async () => {
      try {
        const res = await listProducts({ q: term, per_page: 6 });
        setResults(res.data);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);
    return () => clearTimeout(handle);
  }, [q]);

  const submit = (e?: React.FormEvent) => {
    e?.preventDefault();
    const term = q.trim();
    if (!term) return;
    router.push(`/tienda?q=${encodeURIComponent(term)}`);
    setOpen(false);
    onSubmitted?.();
  };

  return (
    <div ref={wrapperRef} className="relative w-full">
      <form
        onSubmit={submit}
        className="flex items-center gap-3 px-4 py-3 bg-[var(--surface-2)] border border-transparent focus-within:border-[var(--primary)] focus-within:bg-white transition-colors rounded-full"
      >
        <Search size={18} className="text-[var(--foreground-subtle)] shrink-0" />
        <input
          ref={inputRef}
          type="search"
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder="Buscar productos..."
          className="flex-1 bg-transparent outline-none text-sm text-[var(--foreground)] placeholder:text-[var(--foreground-subtle)] min-w-0"
        />
        {loading ? (
          <Loader2 size={14} className="animate-spin text-[var(--foreground-subtle)]" />
        ) : q ? (
          <button
            type="button"
            aria-label="Limpiar"
            onClick={() => {
              setQ("");
              setResults([]);
              inputRef.current?.focus();
            }}
            className="text-[var(--foreground-subtle)] hover:text-[var(--avax-black)] cursor-pointer"
          >
            <X size={14} />
          </button>
        ) : null}
      </form>

      {open && q.trim().length >= 2 && (
        <div className="absolute left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-[var(--border)] overflow-hidden z-50">
          {loading && results.length === 0 ? (
            <div className="px-4 py-6 text-sm text-center text-[var(--foreground-muted)]">
              Buscando...
            </div>
          ) : results.length === 0 ? (
            <div className="px-4 py-6 text-sm text-center text-[var(--foreground-muted)]">
              Sin resultados para <span className="font-bold">&ldquo;{q}&rdquo;</span>.
            </div>
          ) : (
            <>
              <ul className="max-h-[60vh] overflow-y-auto divide-y divide-[var(--border)]">
                {results.map((p) => (
                  <li key={p.id}>
                    <Link
                      href={`/producto/${p.slug}`}
                      onClick={() => {
                        setOpen(false);
                        onSubmitted?.();
                      }}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-[var(--surface-2)] transition-colors"
                    >
                      <div className="relative w-12 h-12 shrink-0 rounded-lg bg-[var(--surface-2)] overflow-hidden flex items-center justify-center">
                        {p.image ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={p.image}
                            alt={p.name}
                            className="absolute inset-0 w-full h-full object-cover"
                          />
                        ) : (
                          <SneakerPlaceholder
                            size={26}
                            className="text-[var(--avax-blue-medium)]"
                          />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] font-extrabold tracking-wider uppercase text-[var(--foreground-subtle)]">
                          {p.brand}
                        </p>
                        <p className="text-sm font-bold text-[var(--avax-black)] line-clamp-1">
                          {p.name}
                        </p>
                      </div>
                      <span className="text-sm font-black text-[var(--avax-black)] shrink-0">
                        {formatPrice(p.price)}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
              <button
                type="button"
                onClick={() => submit()}
                className="block w-full text-center px-4 py-3 bg-[var(--surface-2)] hover:bg-[var(--surface-3)] text-sm font-bold text-[var(--avax-black)] cursor-pointer"
              >
                Ver todos los resultados →
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
