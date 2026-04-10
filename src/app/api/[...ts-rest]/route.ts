import { createNextHandler } from "@ts-rest/serverless/next";
import { contract } from "@/contract";
import { db } from "@/lib/db";
import { classes, programNotes, locations, classColors } from "@/lib/schema";
import { eq, asc, max, count } from "drizzle-orm";
import { seed } from "@/lib/seed";
import { COLOR_PALETTE } from "@/lib/colors";

const VALID_COLOR_KEYS = new Set(COLOR_PALETTE.map((c) => c.key));

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

const handler = createNextHandler(
  contract,
  {
    classes: {
      list: async ({ query }) => {
        const result = query.program
          ? await db.select().from(classes).where(eq(classes.program, query.program))
          : await db.select().from(classes);
        return { status: 200, body: result };
      },

      create: async ({ body }) => {
        const id = uid();
        await db.insert(classes).values({
          id,
          program: body.program,
          day: body.day,
          time: body.time,
          name: body.name,
          invite_only: body.invite_only ?? 0,
          age_group: body.age_group ?? null,
          location: body.location ?? null,
        });
        const [created] = await db.select().from(classes).where(eq(classes.id, id));
        return { status: 201, body: created };
      },

      update: async ({ params, body }) => {
        const updates: Record<string, unknown> = {};
        for (const [key, value] of Object.entries(body)) {
          if (key !== "id" && value !== undefined) updates[key] = value;
        }

        if (Object.keys(updates).length === 0) {
          return { status: 400, body: { error: "No fields to update" } };
        }

        await db.update(classes).set(updates).where(eq(classes.id, params.id));
        const [updated] = await db.select().from(classes).where(eq(classes.id, params.id));

        if (!updated) {
          return { status: 404, body: { error: "Not found" } };
        }

        return { status: 200, body: updated };
      },

      delete: async ({ params }) => {
        await db.delete(classes).where(eq(classes.id, params.id));
        return { status: 200, body: { success: true as const } };
      },

      reset: async () => {
        await seed();
        const [result] = await db.select({ count: count() }).from(classes);
        return { status: 200, body: { success: true as const, count: result.count } };
      },
    },

    notes: {
      list: async ({ query }) => {
        const result = query.program
          ? await db
              .select()
              .from(programNotes)
              .where(eq(programNotes.program, query.program))
              .orderBy(asc(programNotes.sort_order))
          : await db
              .select()
              .from(programNotes)
              .orderBy(asc(programNotes.program), asc(programNotes.sort_order));
        return { status: 200, body: result };
      },

      create: async ({ body }) => {
        const [maxOrder] = await db
          .select({ max: max(programNotes.sort_order) })
          .from(programNotes)
          .where(eq(programNotes.program, body.program));

        const nextOrder = (maxOrder?.max ?? 0) + 1;

        const [created] = await db
          .insert(programNotes)
          .values({ program: body.program, note: body.note, sort_order: nextOrder })
          .returning();

        return { status: 201, body: created };
      },

      update: async ({ params, body }) => {
        const numId = Number(params.id);
        await db.update(programNotes).set({ note: body.note }).where(eq(programNotes.id, numId));
        const [updated] = await db.select().from(programNotes).where(eq(programNotes.id, numId));
        return { status: 200, body: updated };
      },

      delete: async ({ params }) => {
        await db.delete(programNotes).where(eq(programNotes.id, Number(params.id)));
        return { status: 200, body: { success: true as const } };
      },
    },

    locations: {
      list: async () => {
        const result = await db.select().from(locations).orderBy(asc(locations.name));
        return { status: 200, body: result };
      },

      create: async ({ body }) => {
        const [created] = await db
          .insert(locations)
          .values({ name: body.name, is_default: body.is_default ?? 0 })
          .returning();
        return { status: 201, body: created };
      },

      update: async ({ params, body }) => {
        const numId = Number(params.id);

        if (body.name) {
          const [old] = await db.select().from(locations).where(eq(locations.id, numId));
          if (old && old.name !== body.name) {
            await db.update(classes).set({ location: body.name }).where(eq(classes.location, old.name));
          }
        }

        if (body.is_default === 1) {
          await db.update(locations).set({ is_default: 0 });
        }

        const updates: Record<string, unknown> = {};
        if (body.name !== undefined) updates.name = body.name;
        if (body.is_default !== undefined) updates.is_default = body.is_default;

        await db.update(locations).set(updates).where(eq(locations.id, numId));
        const [updated] = await db.select().from(locations).where(eq(locations.id, numId));
        return { status: 200, body: updated };
      },

      delete: async ({ params }) => {
        const numId = Number(params.id);
        const [loc] = await db.select().from(locations).where(eq(locations.id, numId));

        if (loc) {
          const allLocs = await db.select().from(locations);
          const defaultLoc = allLocs.find((l) => l.is_default === 1 && l.id !== numId);
          await db
            .update(classes)
            .set({ location: defaultLoc?.name ?? null })
            .where(eq(classes.location, loc.name));
          await db.delete(locations).where(eq(locations.id, numId));
        }

        return { status: 200, body: { success: true as const } };
      },
    },

    classColors: {
      list: async () => {
        const result = await db.select().from(classColors);
        return { status: 200, body: result };
      },

      upsert: async ({ body }) => {
        const className = body.class_name.trim();
        const colorKey = body.color_key;

        if (!className || !VALID_COLOR_KEYS.has(colorKey)) {
          return { status: 400, body: { error: "Invalid class_name or color_key" } };
        }

        const [created] = await db
          .insert(classColors)
          .values({ class_name: className, color_key: colorKey })
          .onConflictDoUpdate({ target: classColors.class_name, set: { color_key: colorKey } })
          .returning();

        return { status: 201, body: created };
      },

      update: async ({ params, body }) => {
        if (!VALID_COLOR_KEYS.has(body.color_key)) {
          return { status: 400, body: { error: "Invalid color_key" } };
        }

        const numId = Number(params.id);
        await db.update(classColors).set({ color_key: body.color_key }).where(eq(classColors.id, numId));
        const [updated] = await db.select().from(classColors).where(eq(classColors.id, numId));
        return { status: 200, body: updated };
      },
    },
    auth: {
      verifyEdit: async ({ body }) => {
        const correct = process.env.EDIT_PASSWORD;
        if (!correct || body.password === correct) {
          return { status: 200 as const, body: { ok: true as const } };
        }
        return { status: 401 as const, body: { ok: false as const, error: "Wrong password" } };
      },
    },
  },
  {
    handlerType: "app-router",
  }
);

export {
  handler as GET,
  handler as POST,
  handler as PATCH,
  handler as DELETE,
};
