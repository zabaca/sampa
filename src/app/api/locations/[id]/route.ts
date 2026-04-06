import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { locations, classes } from "@/lib/schema";
import { eq } from "drizzle-orm";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();
  const numId = Number(id);

  // If renaming, update classes that reference the old name
  if (body.name) {
    const [old] = await db.select().from(locations).where(eq(locations.id, numId));
    if (old && old.name !== body.name) {
      await db
        .update(classes)
        .set({ location: body.name })
        .where(eq(classes.location, old.name));
    }
  }

  // If setting as default, unset others first
  if (body.is_default === 1) {
    await db.update(locations).set({ is_default: 0 });
  }

  const updates: Record<string, unknown> = {};
  if (body.name !== undefined) updates.name = body.name;
  if (body.is_default !== undefined) updates.is_default = body.is_default;

  await db.update(locations).set(updates).where(eq(locations.id, numId));

  const [updated] = await db.select().from(locations).where(eq(locations.id, numId));
  return NextResponse.json(updated);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const numId = Number(id);

  // Get the location name before deleting
  const [loc] = await db.select().from(locations).where(eq(locations.id, numId));

  if (loc) {
    // Find default location to reassign classes
    const allLocs = await db.select().from(locations);
    const defaultLoc = allLocs.find((l) => l.is_default === 1 && l.id !== numId);

    // Reassign classes at this location to the default (or null)
    await db
      .update(classes)
      .set({ location: defaultLoc?.name ?? null })
      .where(eq(classes.location, loc.name));

    await db.delete(locations).where(eq(locations.id, numId));
  }

  return NextResponse.json({ success: true });
}
