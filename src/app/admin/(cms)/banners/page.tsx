import { Layers } from "lucide-react";
import { ComingSoon } from "../../_components/ComingSoon";

export default function BannersPage() {
  return (
    <ComingSoon
      title="Banners"
      subtitle="Banners promocionales y campañas visuales del home."
      breadcrumbs={[
        { label: "AVAX CMS", href: "/admin/dashboard" },
        { label: "Contenido" },
        { label: "Banners" },
      ]}
      icon={Layers}
      description="Pronto podrás programar banners promocionales con título, copy, imagen, CTA y fechas de inicio y fin para campañas como '50% OFF', 'Nueva colección' o 'Black Friday'."
      features={[
        "Programar inicio y fin de campañas",
        "Variantes para desktop y mobile",
        "Botón con link interno o externo",
        "Vista previa antes de publicar",
      ]}
    />
  );
}
