import { Sidebar } from "./Sidebar";
import { PageTransition } from "./PageTransition";

export function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen w-full flex bg-[var(--admin-bg)] text-[var(--admin-fg)]">
      <Sidebar />
      <div className="admin-scroll flex-1 flex flex-col min-w-0 overflow-y-auto h-screen">
        <PageTransition>{children}</PageTransition>
      </div>
    </div>
  );
}
