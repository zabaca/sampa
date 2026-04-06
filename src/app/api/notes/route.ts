import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { programNotes } from "@/lib/schema";
import { eq, asc, max } from "drizzle-orm";

export async function GET(req: NextRequest) {
  const program = req.nextUrl.searchParams.get("program");

  const result = program
    ? await db
        .select()
        .from(programNotes)
        .where(eq(programNotes.program, program))
        .orderBy(asc(programNotes.sort_order))
    : await db
        .select()
        .from(programNotes)
        .orderBy(asc(programNotes.program), asc(programNotes.sort_order));

  return NextResponse.json(result);
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  // Get next sort_order
  const [maxOrder] = await db
    .select({ max: max(programNotes.sort_order) })
    .from(programNotes)
    .where(eq(programNotes.program, body.program));

  const nextOrder = (maxOrder?.max ?? 0) + 1;

  const [created] = await db
    .insert(programNotes)
    .values({
      program: body.program,
      note: body.note,
      sort_order: nextOrder,
    })
    .returning();

  return NextResponse.json(created, { status: 201 });
}
