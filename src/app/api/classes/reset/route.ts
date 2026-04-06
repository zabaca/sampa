import { NextResponse } from "next/server";
import { seed } from "@/lib/seed";
import { db } from "@/lib/db";

export async function POST() {
  await seed();

  const result = await db.execute("SELECT COUNT(*) as count FROM classes");
  const count = Number(result.rows[0].count);

  return NextResponse.json({ success: true, count });
}
