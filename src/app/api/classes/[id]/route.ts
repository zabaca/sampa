import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();

  const fields: string[] = [];
  const args: unknown[] = [];

  for (const [key, value] of Object.entries(body)) {
    if (key === "id") continue;
    fields.push(`${key} = ?`);
    args.push(value);
  }

  if (fields.length === 0) {
    return NextResponse.json({ error: "No fields to update" }, { status: 400 });
  }

  args.push(id);
  await db.execute({
    sql: `UPDATE classes SET ${fields.join(", ")} WHERE id = ?`,
    args: args as (string | number | null)[],
  });

  const result = await db.execute({
    sql: "SELECT * FROM classes WHERE id = ?",
    args: [id],
  });

  if (result.rows.length === 0) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(result.rows[0]);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  await db.execute({
    sql: "DELETE FROM classes WHERE id = ?",
    args: [id],
  });

  return NextResponse.json({ success: true });
}
