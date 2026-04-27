import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AVAX CMS — Panel de administración",
  description: "Acceso interno para el equipo de AVAX Distribuidora.",
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className="flex-1 flex flex-col">{children}</div>;
}
