/**
 * Dispara la revalidación ISR de la home tras editar una sección.
 * Llama al route handler local /api/revalidate. Falla en silencio.
 */
export async function revalidateHome(): Promise<void> {
  try {
    await fetch("/api/revalidate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tag: "home-secciones", path: "/" }),
    });
  } catch {
    // no bloquea la UI
  }
}
