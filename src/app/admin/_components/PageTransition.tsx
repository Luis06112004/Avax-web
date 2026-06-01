"use client";

import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";

/**
 * Envuelve el contenido de cada módulo del CMS y aplica una transición
 * de entrada (fade + leve slide hacia arriba) cuando cambia la ruta.
 * Usa la pathname como key para que AnimatePresence detecte el cambio.
 */
export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
