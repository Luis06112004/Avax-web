import { AdminShell } from "../_components/AdminShell";

export default function CmsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <AdminShell>{children}</AdminShell>;
}
