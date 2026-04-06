import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { programNotes } from "@/lib/schema";
import { eq, asc } from "drizzle-orm";

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
