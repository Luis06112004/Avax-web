import { HomeSections } from "@/components/sections/HomeSections";
import type { SeccionResuelta } from "@/components/sections/home-types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000/api";

async function getSecciones(): Promise<SeccionResuelta[]> {
  try {
    const res = await fetch(`${API_BASE}/home/secciones`, {
      next: { revalidate: 60, tags: ["home-secciones"] },
    });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data ?? [];
  } catch {
    return [];
  }
}

export default async function Home() {
  const secciones = await getSecciones();
  return <HomeSections secciones={secciones} />;
}
