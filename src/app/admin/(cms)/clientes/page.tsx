"use client";

import { useState, useMemo } from "react";
import { 
  Users, Search, Filter, Download, 
  ShoppingBag, Mail, Phone, ArrowLeft,
  Star, Clock, Heart, ExternalLink,
  ChevronRight, Calendar, CreditCard
} from "lucide-react";
import { Topbar } from "../../_components/Topbar";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

interface Pedido {
  id: string;
  fecha: string;
  total: number;
  estado: "Entregado" | "Procesando" | "Cancelado";
}

interface Cliente {
  id: number;
  nombre: string;
  email: string;
  telefono: string;
  segmento: "VIP" | "Frecuente" | "Nuevo";
  fechaRegistro: string;
  pedidos: Pedido[];
  wishlist: string[];
}

const CLIENTES_MOCK: Cliente[] = [
  { 
    id: 1, 
    nombre: "Carla García", 
    email: "carla.g@gmail.com", 
    telefono: "987 654 321", 
    segmento: "VIP",
    fechaRegistro: "2024-01-15",
    pedidos: [
      { id: "ORD-7721", fecha: "2026-05-10", total: 450.00, estado: "Entregado" },
      { id: "ORD-6540", fecha: "2026-03-22", total: 800.50, estado: "Entregado" }
    ],
    wishlist: ["Zapatillas Nike Air Max", "Gorra AVAX Black Edition"]
  },
  { 
    id: 2, 
    nombre: "Roberto Soto", 
    email: "rsoto@outlook.com", 
    telefono: "912 345 678", 
    segmento: "Frecuente",
    fechaRegistro: "2025-11-02",
    pedidos: [
      { id: "ORD-8812", fecha: "2026-04-28", total: 450.00, estado: "Procesando" }
    ],
    wishlist: ["Polera Oversize Crema"]
  },
  { 
    id: 3, 
    nombre: "Ana Loayza", 
    email: "ana_l@yahoo.com", 
    telefono: "955 111 222", 
    segmento: "Nuevo",
    fechaRegistro: "2026-02-10",
    pedidos: [
      { id: "ORD-1022", fecha: "2026-05-15", total: 89.90, estado: "Entregado" }
    ],
    wishlist: ["Calcetines Sport"]
  }
];

export default function ClientesPage() {
  const [search, setSearch] = useState("");
  const [selectedCliente, setSelectedCliente] = useState<Cliente | null>(null);
  const [filtroSegmento, setFiltroSegmento] = useState("Todos");

  // Lógica de filtrado y cálculos de Stats
  const { filteredClientes, stats } = useMemo(() => {
    const filtered = CLIENTES_MOCK.filter(c => {
      const matchSearch = c.nombre.toLowerCase().includes(search.toLowerCase()) || 
                          c.email.toLowerCase().includes(search.toLowerCase());
      const matchSegmento = filtroSegmento === "Todos" || c.segmento === filtroSegmento;
      return matchSearch && matchSegmento;
    });

    const totalInversion = CLIENTES_MOCK.reduce((acc, c) => 
      acc + c.pedidos.reduce((sum, p) => sum + p.total, 0), 0
    );

    return {
      filteredClientes: filtered,
      stats: {
        total: CLIENTES_MOCK.length,
        vips: CLIENTES_MOCK.filter(c => c.segmento === "VIP").length,
        ticketPromedio: (totalInversion / CLIENTES_MOCK.length).toFixed(2)
      }
    };
  }, [search, filtroSegmento]);

  if (selectedCliente) {
    const totalGastado = selectedCliente.pedidos.reduce((acc, p) => acc + p.total, 0);

    return (
      <>
        <Topbar 
          title={`Detalle: ${selectedCliente.nombre}`}
          subtitle="Historial de compras y preferencias del cliente."
          breadcrumbs={[
            { label: "Clientes", href: "/admin/clientes" }, 
            { label: selectedCliente.nombre }
          ]}
        />
        <div className="px-6 lg:px-8 py-8 flex flex-col gap-6">
          <Button 
            variant="outline" 
            className="w-fit" 
            onClick={() => setSelectedCliente(null)}
            icon={<ArrowLeft size={16} />}
          >
            Volver al listado
          </Button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="flex flex-col gap-6">
              <div className="bg-[var(--admin-card)] border border-[var(--admin-border)] p-6 rounded-3xl text-center">
                <div className="w-20 h-20 rounded-full bg-[var(--primary)]/10 flex items-center justify-center mx-auto mb-4 text-3xl font-bold text-[var(--primary)]">
                  {selectedCliente.nombre.charAt(0)}
                </div>
                <h3 className="text-xl font-bold text-[var(--admin-fg)]">{selectedCliente.nombre}</h3>
                <p className="text-sm text-[var(--admin-fg-muted)] mb-4">{selectedCliente.email}</p>
                <span className="px-4 py-1 rounded-full bg-[var(--primary)]/10 text-[var(--primary)] text-xs font-bold uppercase tracking-widest">
                  Cliente {selectedCliente.segmento}
                </span>
                <div className="grid grid-cols-2 gap-4 mt-8 pt-6 border-t border-[var(--admin-border)] text-left">
                  <div>
                    <p className="text-[10px] text-[var(--admin-fg-subtle)] font-bold uppercase">Total Gastado</p>
                    <p className="text-lg font-bold text-[var(--admin-fg)]">S/ {totalGastado.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-[var(--admin-fg-subtle)] font-bold uppercase">Registro</p>
                    <p className="text-sm font-medium text-[var(--admin-fg)]">{selectedCliente.fechaRegistro}</p>
                  </div>
                </div>
              </div>

              <div className="bg-[var(--admin-card)] border border-[var(--admin-border)] p-6 rounded-3xl">
                <h4 className="font-bold text-[var(--admin-fg)] mb-4 flex items-center gap-2">
                  <Heart size={16} className="text-pink-500" /> Wishlist
                </h4>
                <ul className="flex flex-col gap-3">
                  {selectedCliente.wishlist.map((item, i) => (
                    <li key={i} className="text-sm text-[var(--admin-fg-muted)] flex items-center justify-between group">
                      {item}
                      <ExternalLink size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="lg:col-span-2 flex flex-col gap-6">
              <div className="bg-[var(--admin-card)] border border-[var(--admin-border)] rounded-3xl overflow-hidden">
                <div className="p-6 border-b border-[var(--admin-border)]">
                  <h4 className="font-bold text-[var(--admin-fg)]">Historial de Pedidos</h4>
                </div>
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-white/[0.02] text-[10px] font-bold text-[var(--admin-fg-subtle)] uppercase">
                      <th className="px-6 py-4">ID Pedido</th>
                      <th className="px-6 py-4">Fecha</th>
                      <th className="px-6 py-4">Estado</th>
                      <th className="px-6 py-4 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--admin-border)] text-sm">
                    {selectedCliente.pedidos.map((p) => (
                      <tr key={p.id} className="hover:bg-white/[0.01]">
                        <td className="px-6 py-4 font-mono text-[var(--primary)]">{p.id}</td>
                        <td className="px-6 py-4 text-[var(--admin-fg-muted)]">{p.fecha}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            p.estado === 'Entregado' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'
                          }`}>
                            {p.estado}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right font-bold">S/ {p.total.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Topbar 
        title="Gestión de Clientes" 
        subtitle="Analiza el comportamiento y contacto de tus compradores."
        breadcrumbs={[{ label: "AVAX CMS" }, { label: "Clientes" }]}
      />

      <div className="px-6 lg:px-8 py-8 flex flex-col gap-8">
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-[var(--admin-card)] border border-[var(--admin-border)] p-5 rounded-2xl shadow-sm">
            <p className="text-[10px] font-bold text-[var(--admin-fg-subtle)] uppercase tracking-widest">Total Registrados</p>
            <h3 className="text-2xl font-bold text-[var(--admin-fg)] mt-1">{stats.total}</h3>
          </div>
          <div className="bg-[var(--admin-card)] border border-[var(--admin-border)] p-5 rounded-2xl shadow-sm border-l-4 border-l-amber-500">
            <p className="text-[10px] font-bold text-amber-500 uppercase tracking-widest flex items-center gap-1">
              <Star size={10} fill="currentColor" /> Clientes VIP
            </p>
            <h3 className="text-2xl font-bold text-[var(--admin-fg)] mt-1">{stats.vips}</h3>
          </div>
          <div className="bg-[var(--admin-card)] border border-[var(--admin-border)] p-5 rounded-2xl shadow-sm">
            <p className="text-[10px] font-bold text-[var(--admin-fg-subtle)] uppercase tracking-widest">Ticket Promedio</p>
            <h3 className="text-2xl font-bold text-[var(--admin-fg)] mt-1">S/ {stats.ticketPromedio}</h3>
          </div>
        </div>

        {/* Filtros */}
        <div className="flex flex-col md:flex-row gap-4 justify-between bg-[var(--admin-card)] border border-[var(--admin-border)] p-4 rounded-2xl">
          <div className="flex gap-2 flex-1">
            <Input 
              placeholder="Buscar por nombre o correo..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              icon={<Search size={16}/>}
              className="max-w-md"
            />
            <select 
              className="bg-[var(--admin-bg)] border border-[var(--admin-border)] rounded-xl px-4 text-sm text-[var(--admin-fg)] outline-none"
              value={filtroSegmento}
              onChange={(e) => setFiltroSegmento(e.target.value)}
            >
              <option value="Todos">Todos</option>
              <option value="VIP">VIP</option>
              <option value="Frecuente">Frecuente</option>
              <option value="Nuevo">Nuevo</option>
            </select>
          </div>
          <Button variant="outline" icon={<Download size={16} />}>Exportar Excel</Button>
        </div>

        {/* Tabla */}
        <div className="bg-[var(--admin-card)] border border-[var(--admin-border)] rounded-2xl overflow-hidden shadow-sm">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-[var(--admin-border)] bg-white/[0.02] text-[10px] font-bold text-[var(--admin-fg-subtle)] uppercase">
                <th className="px-6 py-4">Cliente</th>
                <th className="px-6 py-4">Pedidos</th>
                <th className="px-6 py-4 text-right">Inversión Total</th>
                <th className="px-6 py-4 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--admin-border)]">
              {filteredClientes.map((cliente) => (
                <tr key={cliente.id} className="hover:bg-white/[0.01] transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--primary)] to-blue-600 flex items-center justify-center font-bold text-white shadow-lg shadow-blue-500/20">
                        {cliente.nombre.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-[var(--admin-fg)]">{cliente.nombre}</p>
                        <p className="text-[11px] text-[var(--admin-fg-muted)]">{cliente.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-[var(--admin-fg)]">
                    {cliente.pedidos.length} pedidos
                  </td>
                  <td className="px-6 py-4 text-sm text-right font-bold text-[var(--admin-fg)]">
                    S/ {cliente.pedidos.reduce((acc, p) => acc + p.total, 0).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => setSelectedCliente(cliente)}
                      className="p-2.5 bg-[var(--primary)]/10 text-[var(--primary)] hover:bg-[var(--primary)] hover:text-white rounded-xl transition-all"
                    >
                      <ChevronRight size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}