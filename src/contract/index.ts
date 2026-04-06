import { initContract } from "@ts-rest/core";
import { z } from "zod";

const c = initContract();

export const ClassSchema = z.object({
  id: z.string(),
  program: z.string(),
  day: z.string(),
  time: z.string(),
  name: z.string(),
  invite_only: z.number().default(0),
  age_group: z.string().nullable(),
  location: z.string().nullable(),
});

export const CreateClassSchema = z.object({
  program: z.string(),
  day: z.string(),
  time: z.string(),
  name: z.string(),
  invite_only: z.number().default(0),
  age_group: z.string().nullable().optional(),
  location: z.string().nullable().optional(),
});

export const contract = c.router({
  getClasses: {
    method: "GET",
    path: "/api/classes",
    query: z.object({
      program: z.string().optional(),
    }),
    responses: {
      200: z.array(ClassSchema),
    },
  },
  createClass: {
    method: "POST",
    path: "/api/classes",
    body: CreateClassSchema,
    responses: {
      201: ClassSchema,
    },
  },
  updateClass: {
    method: "PATCH",
    path: "/api/classes/:id",
    body: CreateClassSchema.partial(),
    responses: {
      200: ClassSchema,
    },
  },
  deleteClass: {
    method: "DELETE",
    path: "/api/classes/:id",
    body: z.object({}).optional(),
    responses: {
      200: z.object({ success: z.boolean() }),
    },
  },
  resetClasses: {
    method: "POST",
    path: "/api/classes/reset",
    body: z.object({}).optional(),
    responses: {
      200: z.object({ success: z.boolean(), count: z.number() }),
    },
  },
});
