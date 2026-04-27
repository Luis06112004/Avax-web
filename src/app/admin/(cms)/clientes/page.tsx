import { Users } from "lucide-react";
import { ComingSoon } from "../../_components/ComingSoon";

export default function ClientesPage() {
  return (
    <ComingSoon
      title="Clientes"
      subtitle="Gestión de clientes registrados en la tienda."
      breadcrumbs={[
        { label: "AVAX CMS", href: "/admin/dashboard" },
        { label: "Contenido" },
        { label: "Clientes" },
      ]}
      icon={Users}
      description="Pronto podrás ver el listado completo de clientes registrados, su historial de compras, lista de deseos y datos de contacto para enviar promociones segmentadas."
      features={[
        "Listado con búsqueda y filtros",
        "Detalle del cliente con historial de pedidos",
        "Segmentar por monto comprado o frecuencia",
        "Exportar a Excel para campañas",
      ]}
    />
  );
}
