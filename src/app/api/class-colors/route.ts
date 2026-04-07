import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { classColors } from "@/lib/schema";
import { COLOR_PALETTE } from "@/lib/colors";

const VALID_KEYS = new Set(COLOR_PALETTE.map((c) => c.key));

export async function GET() {
  const result = await db.select().from(classColors);
  return NextResponse.json(result);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const className = typeof body.class_name === "string" ? body.class_name.trim() : "";
  const colorKey = typeof body.color_key === "string" ? body.color_key : "";

  if (!className || !VALID_KEYS.has(colorKey)) {
    return NextResponse.json(
      { error: "Invalid class_name or color_key" },
      { status: 400 }
    );
  }

  const [created] = await db
    .insert(classColors)
    .values({ class_name: className, color_key: colorKey })
    .onConflictDoUpdate({
      target: classColors.class_name,
      set: { color_key: colorKey },
    })
    .returning();

  return NextResponse.json(created, { status: 201 });
}
