import { revalidateTag, revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const tag = body.tag ?? "home-secciones";
    const path = body.path;

    revalidateTag(tag);
    if (path) revalidatePath(path, "page");
    revalidatePath("/", "page");

    return NextResponse.json({ success: true, revalidated: true, tag, path });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: String(err) },
      { status: 500 },
    );
  }
}
