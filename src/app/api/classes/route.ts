import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { classes } from "@/lib/schema";
import { eq } from "drizzle-orm";

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

export async function GET(req: NextRequest) {
  const program = req.nextUrl.searchParams.get("program");

  const result = program
    ? await db.select().from(classes).where(eq(classes.program, program))
    : await db.select().from(classes);

  return NextResponse.json(result);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const id = uid();

  const values = {
    id,
    program: body.program,
    day: body.day,
    time: body.time,
    name: body.name,
    invite_only: body.invite_only ?? 0,
    age_group: body.age_group ?? null,
    location: body.location ?? null,
  };

  await db.insert(classes).values(values);

  const [created] = await db.select().from(classes).where(eq(classes.id, id));
  return NextResponse.json(created, { status: 201 });
}
