import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { classColors } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { COLOR_PALETTE } from "@/lib/colors";

const VALID_KEYS = new Set(COLOR_PALETTE.map((c) => c.key));

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();
  const colorKey = typeof body.color_key === "string" ? body.color_key : "";

  if (!VALID_KEYS.has(colorKey)) {
    return NextResponse.json({ error: "Invalid color_key" }, { status: 400 });
  }

  await db
    .update(classColors)
    .set({ color_key: colorKey })
    .where(eq(classColors.id, Number(id)));

  const [updated] = await db
    .select()
    .from(classColors)
    .where(eq(classColors.id, Number(id)));

  return NextResponse.json(updated);
}
