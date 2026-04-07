import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { classColors } from "@/lib/schema";

export async function GET() {
  const result = await db.select().from(classColors);
  return NextResponse.json(result);
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  const [created] = await db
    .insert(classColors)
    .values({ class_name: body.class_name, color_key: body.color_key })
    .onConflictDoUpdate({
      target: classColors.class_name,
      set: { color_key: body.color_key },
    })
    .returning();

  return NextResponse.json(created, { status: 201 });
}
