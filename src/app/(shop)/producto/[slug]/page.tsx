import { notFound } from "next/navigation";
import { getProductBySlug, listPopular } from "@/lib/shop-api";
import { ProductDetail } from "./ProductDetail";

export const dynamic = "force-dynamic";

type Params = { slug: string };

export default async function ProductoPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;

  let product;
  try {
    const res = await getProductBySlug(slug);
    product = res.data;
  } catch {
    notFound();
  }

  if (!product) notFound();

  let related: Awaited<ReturnType<typeof listPopular>>["data"] = [];
  try {
    const res = await listPopular();
    related = res.data.filter((p) => p.slug !== slug).slice(0, 4);
  } catch {
    related = [];
  }

  return <ProductDetail product={product} related={related} />;
}
