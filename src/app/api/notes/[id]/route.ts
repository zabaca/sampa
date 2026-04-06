import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { programNotes } from "@/lib/schema";
import { eq } from "drizzle-orm";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();

  await db
    .update(programNotes)
    .set({ note: body.note })
    .where(eq(programNotes.id, Number(id)));

  const [updated] = await db
    .select()
    .from(programNotes)
    .where(eq(programNotes.id, Number(id)));

  return NextResponse.json(updated);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await db.delete(programNotes).where(eq(programNotes.id, Number(id)));
  return NextResponse.json({ success: true });
}
