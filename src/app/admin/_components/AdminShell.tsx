import { Sidebar } from "./Sidebar";

export function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen w-full flex bg-[var(--admin-bg)] text-[var(--admin-fg)]">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">{children}</div>
    </div>
  );
}
