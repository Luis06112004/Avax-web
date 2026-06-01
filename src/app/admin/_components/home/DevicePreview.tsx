"use client";

import { useEffect, useRef, useState } from "react";
import type { DeviceKey } from "./DeviceSwitcher";

const REAL_WIDTHS: Record<DeviceKey, number> = {
  desktop: 1440,
  tablet: 768,
  mobile: 390,
};

// Altura de referencia del iframe (viewport simulado) por dispositivo
const REAL_HEIGHTS: Record<DeviceKey, number> = {
  desktop: 760,
  tablet: 900,
  mobile: 780,
};

export type PreviewPayload = {
  tipo: string;
  titulo?: string;
  subtitulo?: string;
  config?: Record<string, unknown>;
  productos?: unknown[];
  marcas?: unknown[];
};

/**
 * Renderiza una sección de la home dentro de un IFRAME a su ancho real
 * (1440/768/390) y la escala para que entre en el área de preview. Como el
 * iframe tiene su propio viewport, los breakpoints de Tailwind responden al
 * ancho del device elegido → preview 100% fiel.
 *
 * La config se envía en vivo al iframe por postMessage cada vez que cambia.
 */
export function DevicePreview({
  device,
  payload,
}: {
  device: DeviceKey;
  payload: PreviewPayload;
}) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const [scale, setScale] = useState(0.5);

  const realW = REAL_WIDTHS[device];
  const realH = REAL_HEIGHTS[device];

  // Escala según el espacio disponible del contenedor
  useEffect(() => {
    const calc = () => {
      const el = containerRef.current;
      if (!el) return;
      const availW = el.clientWidth - 32;
      const availH = el.clientHeight - 32;
      const s = Math.min(availW / realW, availH / realH, 1);
      setScale(Math.max(0.2, s));
    };
    calc();
    const ro = new ResizeObserver(calc);
    if (containerRef.current) ro.observe(containerRef.current);
    window.addEventListener("resize", calc);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", calc);
    };
  }, [realW, realH]);

  // El iframe avisa cuando está listo (handshake)
  useEffect(() => {
    const onMsg = (e: MessageEvent) => {
      if (e.data && e.data.__avaxPreviewReady) setReady(true);
    };
    window.addEventListener("message", onMsg);
    return () => window.removeEventListener("message", onMsg);
  }, []);

  // Enviar config al iframe cuando: queda listo, cambia el payload, o termina de cargar.
  const sendConfig = () => {
    iframeRef.current?.contentWindow?.postMessage(
      { __avaxPreview: true, ...payload },
      "*",
    );
  };
  useEffect(() => {
    sendConfig();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, payload]);

  // Si cambia el tipo, el iframe recarga → resetear el handshake
  useEffect(() => {
    setReady(false);
  }, [payload.tipo]);

  return (
    <div ref={containerRef} className="w-full h-full flex items-center justify-center overflow-hidden">
      <div
        className="rounded-xl bg-white shadow-2xl overflow-hidden shrink-0"
        style={{
          width: `${realW}px`,
          height: `${realH}px`,
          transform: `scale(${scale})`,
          transformOrigin: "center center",
        }}
      >
        <iframe
          ref={iframeRef}
          src={`/admin/home-preview?tipo=${encodeURIComponent(payload.tipo)}`}
          title="Vista previa"
          className="w-full h-full border-0"
          // Garantiza el envío de config aunque el handshake se haya perdido
          onLoad={() => {
            setReady(true);
            sendConfig();
          }}
        />
      </div>
    </div>
  );
}
