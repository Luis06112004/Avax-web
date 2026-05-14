"use client";

import { useState, useMemo, useEffect } from "react";
import { 
  Users, UserPlus, Search, Pencil, Trash2, 
  ShieldCheck, UserCircle, X, AlertTriangle, ChevronLeft, ChevronRight
} from "lucide-react";
import { Topbar } from "../../_components/Topbar";
import { cn } from "@/lib/utils";

export default function UsuariosPage() {
  // --- 1. ESTADO DE DATOS ---
  const [usuarios, setUsuarios] = useState([
    { id: 1, nombre: "Jimena", email: "jimena@avax.com", rol: "Admin", estado: "Activo" },
    { id: 2, nombre: "Admin Principal", email: "admin@avax.com", rol: "Admin", estado: "Activo" },
    { id: 3, nombre: "Vendedor 1", email: "ventas@avax.com", rol: "Editor", estado: "Inactivo" },
    { id: 4, nombre: "Carlos Ruiz", email: "carlos@avax.com", rol: "Editor", estado: "Activo" },
    { id: 5, nombre: "Ana López", email: "ana@avax.com", rol: "Ventas", estado: "Activo" },
    { id: 6, nombre: "Roberto Fox", email: "roberto@avax.com", rol: "Editor", estado: "Inactivo" },
    { id: 7, nombre: "Lucía Sanz", email: "lucia@avax.com", rol: "Admin", estado: "Activo" },
    { id: 8, nombre: "Mateo Díaz", email: "mateo@avax.com", rol: "Ventas", estado: "Inactivo" },
    { id: 9, nombre: "Elena Guerra", email: "elena@avax.com", rol: "Editor", estado: "Activo" },
    { id: 10, nombre: "Oscar Miró", email: "oscar@avax.com", rol: "Editor", estado: "Activo" },
    { id: 11, nombre: "Sonia Valle", email: "sonia@avax.com", rol: "Ventas", estado: "Activo" },
  ]);

  // --- 2. ESTADOS DE UI Y FILTROS ---
  const [search, setSearch] = useState("");
  const [filterRol, setFilterRol] = useState("");
  const [filterEstado, setFilterEstado] = useState("");
  
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [drawerMode, setDrawerMode] = useState<"create" | "edit">("create");
  
  const [toast, setToast] = useState<{ msg: string; tone: "ok" | "err" } | null>(null);

  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 7;

  // --- 3. LÓGICA DE FILTRADO ---
  const filtered = useMemo(() => {
    return usuarios.filter(u => {
      const matchesSearch = u.nombre.toLowerCase().includes(search.toLowerCase()) || 
                            u.email.toLowerCase().includes(search.toLowerCase());
      const matchesRol = filterRol === "" || u.rol === filterRol;
      const matchesEstado = filterEstado === "" || u.estado === filterEstado;

      return matchesSearch && matchesRol && matchesEstado;
    });
  }, [usuarios, search, filterRol, filterEstado]);

  // Reset de página al filtrar
  useEffect(() => {
    setCurrentPage(1);
  }, [search, filterRol, filterEstado]);

  const totalPages = Math.ceil(filtered.length / usersPerPage);
  const currentUsers = filtered.slice((currentPage - 1) * usersPerPage, currentPage * usersPerPage);

  // --- 4. FUNCIONES DE ACCIÓN ---
  const showToast = (msg: string, tone: "ok" | "err" = "ok") => {
    setToast({ msg, tone });
    setTimeout(() => setToast(null), 2500);
  };

  const openCreate = () => {
    setDrawerMode("create");
    setSelectedUser({ nombre: "", email: "", rol: "Editor", estado: "Activo" });
    setIsDrawerOpen(true);
  };

  const openEdit = (u: any) => {
    setDrawerMode("edit");
    setSelectedUser(u);
    setIsDrawerOpen(true);
  };

  const openDelete = (u: any) => {
    setSelectedUser(u);
    setIsDeleteModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (drawerMode === "create") {
      setUsuarios([{ ...selectedUser, id: Date.now() }, ...usuarios]);
      showToast("Usuario creado correctamente");
    } else {
      setUsuarios(usuarios.map(u => u.id === selectedUser.id ? selectedUser : u));
      showToast("Cambios guardados");
    }
    setIsDrawerOpen(false);
  };

  const confirmDelete = () => {
    setUsuarios(usuarios.filter(u => u.id !== selectedUser.id));
    setIsDeleteModalOpen(false);
    showToast("Usuario eliminado", "err");
  };

  const stats = useMemo(() => ({
    total: usuarios.length,
    activos: usuarios.filter(u => u.estado === "Activo").length,
    inactivos: usuarios.filter(u => u.estado === "Inactivo").length,
  }), [usuarios]);

  return (
    <>
      <Topbar 
        title="Gestión de Usuarios"
        subtitle="Administra los accesos y roles del personal interno."
        breadcrumbs={[
          { label: "AVAX CMS", href: "/admin/dashboard" },
          { label: "Contenido" },
          { label: "Usuarios" },
        ]}
        actions={
          <button onClick={openCreate} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white shadow-md shadow-[var(--primary)]/25 transition-colors cursor-pointer">
            <UserPlus size={14} />
            Nuevo Usuario
          </button>
        }
      />

      <div className="px-6 lg:px-8 py-8 flex flex-col gap-6">
        {/* Tarjetas Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <Stat label="Total Usuarios" value={stats.total} icon={Users} />
          <Stat label="Usuarios Activos" value={stats.activos} accent="ok" icon={ShieldCheck} />
          <Stat label="En Pausa" value={stats.inactivos} accent="err" icon={UserCircle} />
        </div>

        {/* Filtros rápidos */}
        <div className="flex flex-col md:flex-row md:items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--admin-fg-subtle)]" />
            <input
              type="text"
              placeholder="Buscar por nombre o email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white/5 border border-[var(--admin-border)] rounded-lg pl-9 pr-4 py-2.5 text-sm text-[var(--admin-fg)] placeholder:text-[var(--admin-fg-subtle)] outline-none focus:border-[var(--primary)] transition-colors"
            />
          </div>

          <select 
            value={filterRol}
            onChange={(e) => setFilterRol(e.target.value)} 
            className="bg-white/5 border border-[var(--admin-border)] rounded-lg px-3 py-2.5 text-sm text-[var(--admin-fg)] outline-none focus:border-[var(--primary)] cursor-pointer min-w-[160px]"
          >
            <option value="" className="bg-[var(--admin-bg)]">Todos los Roles</option>
            <option value="Admin" className="bg-[var(--admin-bg)]">Administradores</option>
            <option value="Editor" className="bg-[var(--admin-bg)]">Editores</option>
            <option value="Ventas" className="bg-[var(--admin-bg)]">Ventas</option>
          </select>

          <select 
            value={filterEstado}
            onChange={(e) => setFilterEstado(e.target.value)}
            className="bg-white/5 border border-[var(--admin-border)] rounded-lg px-3 py-2.5 text-sm text-[var(--admin-fg)] outline-none focus:border-[var(--primary)] cursor-pointer min-w-[160px]"
          >
            <option value="" className="bg-[var(--admin-bg)]">Todos los Estados</option>
            <option value="Activo" className="bg-[var(--admin-bg)]">Activos</option>
            <option value="Inactivo" className="bg-[var(--admin-bg)]">Inactivos</option>
          </select>
        </div>

        {/* TABLA */}
        <div className="bg-[var(--admin-card)] border border-[var(--admin-border)] rounded-2xl overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead className="bg-white/5 border-b border-[var(--admin-border)]">
              <tr>
                <th className="p-4 font-bold text-[var(--admin-fg-subtle)] text-[10px] uppercase tracking-widest">Usuario / Rol</th>
                <th className="p-4 font-bold text-[var(--admin-fg-subtle)] text-[10px] uppercase tracking-widest text-center">Estado</th>
                <th className="p-4 font-bold text-[var(--admin-fg-subtle)] text-[10px] uppercase tracking-widest text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--admin-border)]">
              {currentUsers.map((u) => (
                <tr key={u.id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="p-4">
                    <div className="font-bold text-[var(--admin-fg)] text-sm group-hover:text-[var(--primary)] transition-colors">{u.nombre}</div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[var(--admin-fg-subtle)] text-xs">{u.email}</span>
                      <span className="text-[9px] bg-white/5 px-1.5 py-0.5 rounded border border-white/10 text-[var(--admin-fg-subtle)] font-bold uppercase tracking-tighter">
                        {u.rol}
                      </span>
                    </div>
                  </td>
                  <td className="p-4 text-center">
                    <span className={cn(
                      "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase",
                      u.estado === 'Activo' ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-500"
                    )}>
                      <span className={cn("w-1.5 h-1.5 rounded-full", u.estado === 'Activo' ? "bg-emerald-500" : "bg-red-500")}></span>
                      {u.estado}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <div className="flex justify-center gap-1">
                      <button onClick={() => openEdit(u)} className="p-2 text-[var(--admin-fg-subtle)] hover:text-[var(--primary)] hover:bg-[var(--primary)]/10 rounded-xl transition-all cursor-pointer">
                        <Pencil size={14} />
                      </button>
                      <button onClick={() => openDelete(u)} className="p-2 text-[var(--admin-fg-subtle)] hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all cursor-pointer">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {currentUsers.length === 0 && (
                <tr>
                  <td colSpan={3} className="p-10 text-center text-[var(--admin-fg-subtle)] text-sm">
                    No se encontraron usuarios con esos filtros.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* NAVEGACIÓN */}
          <div className="flex items-center justify-between p-4 border-t border-[var(--admin-border)] bg-white/[0.02]">
            <p className="text-[10px] text-[var(--admin-fg-subtle)] font-bold uppercase tracking-widest">
              Página <span className="text-[var(--admin-fg)]">{currentPage}</span> de <span className="text-[var(--admin-fg)]">{totalPages || 1}</span>
            </p>
            
            <div className="flex gap-2">
              <button 
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => prev - 1)}
                className="p-2 rounded-lg bg-white/5 border border-[var(--admin-border)] text-[var(--admin-fg)] hover:bg-white/10 disabled:opacity-20 disabled:cursor-not-allowed transition-all"
              >
                <ChevronLeft size={16} />
              </button>
              
              <button 
                disabled={currentPage === totalPages || totalPages === 0}
                onClick={() => setCurrentPage(prev => prev + 1)}
                className="p-2 rounded-lg bg-white/5 border border-[var(--admin-border)] text-[var(--admin-fg)] hover:bg-white/10 disabled:opacity-20 disabled:cursor-not-allowed transition-all"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* DRAWER */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsDrawerOpen(false)} />
          <div className="relative w-full max-w-md bg-[var(--admin-bg)] border-l border-[var(--admin-border)] shadow-2xl p-8 flex flex-col gap-6 animate-in slide-in-from-right duration-300">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-[var(--admin-fg)]">{drawerMode === "create" ? "Nuevo Usuario" : "Editar Usuario"}</h2>
              <button onClick={() => setIsDrawerOpen(false)} className="p-2 hover:bg-white/5 rounded-full transition-colors text-[var(--admin-fg-subtle)]"><X size={20}/></button>
            </div>
            <form onSubmit={handleSave} className="flex flex-col gap-5">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-[var(--admin-fg-subtle)] uppercase tracking-widest">Nombre Completo</label>
                <input required value={selectedUser?.nombre} onChange={e => setSelectedUser({...selectedUser, nombre: e.target.value})} className="w-full bg-white/5 border border-[var(--admin-border)] rounded-xl p-3 text-sm text-[var(--admin-fg)] outline-none focus:border-[var(--primary)]" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-[var(--admin-fg-subtle)] uppercase tracking-widest">Correo Electrónico</label>
                <input required type="email" value={selectedUser?.email} onChange={e => setSelectedUser({...selectedUser, email: e.target.value})} className="w-full bg-white/5 border border-[var(--admin-border)] rounded-xl p-3 text-sm text-[var(--admin-fg)] outline-none focus:border-[var(--primary)]" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-[var(--admin-fg-subtle)] uppercase tracking-widest">Rol</label>
                  <select value={selectedUser?.rol} onChange={e => setSelectedUser({...selectedUser, rol: e.target.value})} className="w-full bg-white/5 border border-[var(--admin-border)] rounded-xl p-3 text-sm text-[var(--admin-fg)] outline-none cursor-pointer">
                    <option value="Admin" className="bg-[var(--admin-bg)]">Admin</option>
                    <option value="Editor" className="bg-[var(--admin-bg)]">Editor</option>
                    <option value="Ventas" className="bg-[var(--admin-bg)]">Ventas</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-[var(--admin-fg-subtle)] uppercase tracking-widest">Estado</label>
                  <select value={selectedUser?.estado} onChange={e => setSelectedUser({...selectedUser, estado: e.target.value})} className={cn("w-full border rounded-xl p-3 text-sm font-bold outline-none cursor-pointer", selectedUser?.estado === "Activo" ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-500" : "bg-red-500/10 border-red-500/30 text-red-500")}>
                    <option value="Activo" className="bg-[var(--admin-bg)]">Activo</option>
                    <option value="Inactivo" className="bg-[var(--admin-bg)]">Inactivo</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-6">
                <button type="button" onClick={() => setIsDrawerOpen(false)} className="p-3 rounded-xl text-sm font-bold bg-white/5 hover:bg-white/10 text-[var(--admin-fg)]">Cancelar</button>
                <button type="submit" className="p-3 rounded-xl text-sm font-bold bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)]">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL ELIMINACIÓN */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setIsDeleteModalOpen(false)} />
          <div className="relative bg-[var(--admin-card)] border border-[var(--admin-border)] rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4"><AlertTriangle size={32} /></div>
            <h3 className="text-xl font-bold text-[var(--admin-fg)] mb-2">¿Estás seguro?</h3>
            <p className="text-[var(--admin-fg-subtle)] text-sm mb-8">Vas a eliminar a <span className="text-[var(--admin-fg)] font-bold">{selectedUser?.nombre}</span>.</p>
            <div className="flex gap-3">
              <button onClick={() => setIsDeleteModalOpen(false)} className="flex-1 p-3 rounded-xl text-sm font-bold bg-white/5 hover:bg-white/10">Cancelar</button>
              <button onClick={confirmDelete} className="flex-1 p-3 rounded-xl text-sm font-bold bg-red-500 text-white hover:bg-red-600">Eliminar</button>
            </div>
          </div>
        </div>
      )}

      {/* NOTIFICACIÓN TOAST */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-[200] animate-in fade-in slide-in-from-bottom-4">
          <div className={cn(
            "px-4 py-3 rounded-xl text-sm font-medium shadow-2xl border flex items-center gap-2",
            toast.tone === "ok" ? "bg-emerald-500 text-white border-emerald-400" : "bg-red-500 text-white border-red-400"
          )}>
            {toast.tone === "ok" ? <ShieldCheck size={16}/> : <AlertTriangle size={16}/>}
            {toast.msg}
          </div>
        </div>
      )}
    </>
  );
}

function Stat({ label, value, icon: Icon, accent }: any) {
  return (
    <div className="bg-[var(--admin-card)] border border-[var(--admin-border)] rounded-xl p-4 flex items-center gap-4">
      <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", accent === "ok" ? "bg-emerald-500/10 text-emerald-500" : accent === "err" ? "bg-red-500/10 text-red-500" : "bg-[var(--primary)]/10 text-[var(--primary)]")}>
        <Icon size={20} />
      </div>
      <div>
        <p className="text-[10px] uppercase tracking-wider text-[var(--admin-fg-subtle)] font-bold">{label}</p>
        <p className="text-xl font-bold text-[var(--admin-fg)]">{value}</p>
      </div>
    </div>
  );
}