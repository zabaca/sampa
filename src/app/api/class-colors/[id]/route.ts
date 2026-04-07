import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { classColors } from "@/lib/schema";
import { eq } from "drizzle-orm";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();

  await db
    .update(classColors)
    .set({ color_key: body.color_key })
    .where(eq(classColors.id, Number(id)));

  const [updated] = await db
    .select()
    .from(classColors)
    .where(eq(classColors.id, Number(id)));

  return NextResponse.json(updated);
}
