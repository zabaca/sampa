import { initContract } from "@ts-rest/core";
import { z } from "zod";

const c = initContract();

const ClassSchema = z.object({
  id: z.string(),
  program: z.string(),
  day: z.string(),
  time: z.string(),
  name: z.string(),
  invite_only: z.number(),
  age_group: z.string().nullable(),
  location: z.string().nullable(),
});

const CreateClassSchema = z.object({
  program: z.string(),
  day: z.string(),
  time: z.string(),
  name: z.string(),
  invite_only: z.number().optional().default(0),
  age_group: z.string().nullable().optional(),
  location: z.string().nullable().optional(),
});

const UpdateClassSchema = z.object({
  program: z.string().optional(),
  day: z.string().optional(),
  time: z.string().optional(),
  name: z.string().optional(),
  invite_only: z.number().optional(),
  age_group: z.string().nullable().optional(),
  location: z.string().nullable().optional(),
});

const NoteSchema = z.object({
  id: z.number(),
  program: z.string(),
  note: z.string(),
  sort_order: z.number(),
});

const LocationSchema = z.object({
  id: z.number(),
  name: z.string(),
  is_default: z.number(),
});

const ClassColorSchema = z.object({
  id: z.number(),
  class_name: z.string(),
  color_key: z.string(),
});

export const contract = c.router(
  {
    classes: {
      list: {
        method: "GET",
        path: "/classes",
        query: z.object({ program: z.string().optional() }),
        responses: { 200: z.array(ClassSchema) },
      },
      create: {
        method: "POST",
        path: "/classes",
        body: CreateClassSchema,
        responses: { 201: ClassSchema },
      },
      update: {
        method: "PATCH",
        path: "/classes/:id",
        pathParams: z.object({ id: z.string() }),
        body: UpdateClassSchema,
        responses: {
          200: ClassSchema,
          400: z.object({ error: z.string() }),
          404: z.object({ error: z.string() }),
        },
      },
      delete: {
        method: "DELETE",
        path: "/classes/:id",
        pathParams: z.object({ id: z.string() }),
        body: c.noBody(),
        responses: { 200: z.object({ success: z.literal(true) }) },
      },
      reset: {
        method: "POST",
        path: "/classes/reset",
        body: c.noBody(),
        responses: {
          200: z.object({ success: z.literal(true), count: z.number() }),
        },
      },
    },
    notes: {
      list: {
        method: "GET",
        path: "/notes",
        query: z.object({ program: z.string().optional() }),
        responses: { 200: z.array(NoteSchema) },
      },
      create: {
        method: "POST",
        path: "/notes",
        body: z.object({ program: z.string(), note: z.string() }),
        responses: { 201: NoteSchema },
      },
      update: {
        method: "PATCH",
        path: "/notes/:id",
        pathParams: z.object({ id: z.coerce.string() }),
        body: z.object({ note: z.string() }),
        responses: { 200: NoteSchema },
      },
      delete: {
        method: "DELETE",
        path: "/notes/:id",
        pathParams: z.object({ id: z.coerce.string() }),
        body: c.noBody(),
        responses: { 200: z.object({ success: z.literal(true) }) },
      },
    },
    locations: {
      list: {
        method: "GET",
        path: "/locations",
        responses: { 200: z.array(LocationSchema) },
      },
      create: {
        method: "POST",
        path: "/locations",
        body: z.object({
          name: z.string(),
          is_default: z.number().optional().default(0),
        }),
        responses: { 201: LocationSchema },
      },
      update: {
        method: "PATCH",
        path: "/locations/:id",
        pathParams: z.object({ id: z.coerce.string() }),
        body: z.object({
          name: z.string().optional(),
          is_default: z.number().optional(),
        }),
        responses: { 200: LocationSchema },
      },
      delete: {
        method: "DELETE",
        path: "/locations/:id",
        pathParams: z.object({ id: z.coerce.string() }),
        body: c.noBody(),
        responses: { 200: z.object({ success: z.literal(true) }) },
      },
    },
    classColors: {
      list: {
        method: "GET",
        path: "/class-colors",
        responses: { 200: z.array(ClassColorSchema) },
      },
      upsert: {
        method: "POST",
        path: "/class-colors",
        body: z.object({
          class_name: z.string(),
          color_key: z.string(),
        }),
        responses: {
          201: ClassColorSchema,
          400: z.object({ error: z.string() }),
        },
      },
      update: {
        method: "PATCH",
        path: "/class-colors/:id",
        pathParams: z.object({ id: z.coerce.string() }),
        body: z.object({ color_key: z.string() }),
        responses: {
          200: ClassColorSchema,
          400: z.object({ error: z.string() }),
        },
      },
    },
    auth: {
      verifyEdit: {
        method: "POST",
        path: "/auth/edit",
        body: z.object({ password: z.string() }),
        responses: {
          200: z.object({ ok: z.literal(true) }),
          401: z.object({ ok: z.literal(false), error: z.string() }),
        },
      },
    },
  },
  { pathPrefix: "/api" }
);

// Export Zod schemas for reuse
export { ClassSchema, NoteSchema, LocationSchema, ClassColorSchema };
