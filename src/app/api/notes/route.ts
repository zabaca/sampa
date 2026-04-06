import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  const program = req.nextUrl.searchParams.get("program");

  let result;
  if (program) {
    result = await db.execute({
      sql: "SELECT * FROM program_notes WHERE program = ? ORDER BY sort_order",
      args: [program],
    });
  } else {
    result = await db.execute("SELECT * FROM program_notes ORDER BY program, sort_order");
  }

  return NextResponse.json(result.rows);
}
