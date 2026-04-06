import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { locations } from "@/lib/schema";
import { asc } from "drizzle-orm";

export async function GET() {
  const result = await db
    .select()
    .from(locations)
    .orderBy(asc(locations.name));

  return NextResponse.json(result);
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  const [created] = await db
    .insert(locations)
    .values({ name: body.name, is_default: body.is_default ?? 0 })
    .returning();

  return NextResponse.json(created, { status: 201 });
}
