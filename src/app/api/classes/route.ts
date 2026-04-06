import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

export async function GET(req: NextRequest) {
  const program = req.nextUrl.searchParams.get("program");

  let result;
  if (program) {
    result = await db.execute({
      sql: "SELECT * FROM classes WHERE program = ? ORDER BY day, time",
      args: [program],
    });
  } else {
    result = await db.execute("SELECT * FROM classes ORDER BY day, time");
  }

  return NextResponse.json(result.rows);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const id = uid();

  await db.execute({
    sql: "INSERT INTO classes (id, program, day, time, name, invite_only, age_group, location) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
    args: [
      id,
      body.program,
      body.day,
      body.time,
      body.name,
      body.invite_only ?? 0,
      body.age_group ?? null,
      body.location ?? null,
    ],
  });

  const result = await db.execute({
    sql: "SELECT * FROM classes WHERE id = ?",
    args: [id],
  });

  return NextResponse.json(result.rows[0], { status: 201 });
}
