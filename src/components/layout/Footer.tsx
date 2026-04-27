import Image from "next/image";
import Link from "next/link";
import { Facebook, Instagram, Twitter, Youtube, Mail } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

const COLUMNS = [
  {
    title: "TIENDA",
    links: [
      { label: "Hombre", href: "/tienda/hombre" },
      { label: "Mujer", href: "/tienda/mujer" },
      { label: "Niños", href: "/tienda/ninos" },
      { label: "Ofertas", href: "/ofertas" },
      { label: "Lanzamientos", href: "/lanzamientos" },
    ],
  },
  {
    title: "AYUDA",
    links: [
      { label: "Envíos", href: "/envios" },
      { label: "Devoluciones", href: "/devoluciones" },
      { label: "Guía de tallas", href: "/tallas" },
      { label: "FAQ", href: "/faq" },
      { label: "Contacto", href: "/contacto" },
    ],
  },
  {
    title: "EMPRESA",
    links: [
      { label: "Sobre nosotros", href: "/nosotros" },
      { label: "Tiendas físicas", href: "/tiendas" },
      { label: "Blog", href: "/blog" },
      { label: "Trabaja con nosotros", href: "/empleos" },
    ],
  },
];

const SOCIAL = [
  { icon: Facebook, label: "Facebook", href: "#" },
  { icon: Instagram, label: "Instagram", href: "https://www.instagram.com/avax_pe/" },
  { icon: Twitter, label: "Twitter", href: "#" },
  { icon: Youtube, label: "Youtube", href: "#" },
];

export function Footer() {
  return (
    <footer className="bg-[var(--avax-black)] text-white">
      <div className="container-page py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          <div className="md:col-span-4 flex flex-col gap-5">
            <Link href="/" className="inline-flex">
              <Image
                src="/images/avax-logo.png"
                alt="AVAX"
                width={140}
                height={40}
                className="h-10 w-auto brightness-0 invert"
              />
            </Link>
            <p className="text-sm text-white/60 leading-relaxed max-w-sm">
              E-commerce de zapatillas premium con las mejores marcas del
              mercado. Originales 100% garantizadas.
            </p>
            <div className="flex items-center gap-2">
              {SOCIAL.map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.title} className="md:col-span-2 flex flex-col gap-4">
              <h4 className="text-xs font-extrabold tracking-[0.2em] text-white">
                {col.title}
              </h4>
              <ul className="flex flex-col gap-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/60 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="md:col-span-2 flex flex-col gap-4">
            <h4 className="text-xs font-extrabold tracking-[0.2em] text-white">
              NEWSLETTER
            </h4>
            <p className="text-sm text-white/60">
              Promos exclusivas y drops antes que nadie.
            </p>
            <Input
              icon={<Mail size={16} />}
              type="email"
              placeholder="tu@email.com"
              className="!bg-white/5 !border-white/10 !text-white"
              fullWidth
            />
            <Button variant="white" size="sm" fullWidth>
              Suscribirme
            </Button>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col md:flex-row gap-3 md:items-center md:justify-between text-xs text-white/50">
          <span>© 2026 AVAX. Todos los derechos reservados.</span>
          <div className="flex items-center gap-4">
            <Link href="/terminos" className="hover:text-white transition-colors">
              Términos
            </Link>
            <Link href="/privacidad" className="hover:text-white transition-colors">
              Privacidad
            </Link>
            <Link href="/cookies" className="hover:text-white transition-colors">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
