import { NextResponse } from "next/server";
import { seed } from "@/lib/seed";
import { db } from "@/lib/db";
import { classes } from "@/lib/schema";
import { count } from "drizzle-orm";

export async function POST() {
  await seed();

  const [result] = await db.select({ count: count() }).from(classes);

  return NextResponse.json({ success: true, count: result.count });
}
