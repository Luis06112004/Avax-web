import { Settings } from "lucide-react";
import { ComingSoon } from "../../_components/ComingSoon";

export default function ConfiguracionPage() {
  return (
    <ComingSoon
      title="Configuración"
      subtitle="Ajustes generales del sitio y del panel."
      breadcrumbs={[
        { label: "AVAX CMS", href: "/admin/dashboard" },
        { label: "Sistema" },
        { label: "Configuración" },
      ]}
      icon={Settings}
      description="Pronto podrás configurar los datos generales de la tienda: logo, colores de marca, métodos de pago, costos de envío y preferencias del panel administrativo."
      features={[
        "Datos de la empresa y logo",
        "Métodos de pago habilitados",
        "Tarifas y zonas de envío",
        "Usuarios y roles del panel admin",
      ]}
    />
  );
}
