import { Tag } from "lucide-react";
import { ComingSoon } from "../../_components/ComingSoon";

export default function CategoriasPage() {
  return (
    <ComingSoon
      title="Categorías"
      subtitle="Organización del catálogo en categorías y subcategorías."
      breadcrumbs={[
        { label: "AVAX CMS", href: "/admin/dashboard" },
        { label: "Contenido" },
        { label: "Categorías" },
      ]}
      icon={Tag}
      description="Pronto podrás crear, editar y reordenar las categorías del catálogo (Running, Lifestyle, Skate, Basketball, Casual, Ropa, Accesorios) sin tocar código."
      features={[
        "Crear categorías y subcategorías ilimitadas",
        "Reordenar arrastrando (drag & drop)",
        "Asignar productos masivamente a una categoría",
        "Imagen de portada por categoría",
      ]}
    />
  );
}
