import { GlobalApiResponse } from "@/types";
import { Blogs, Schedular, SchedularFrequency, Tag } from "@prisma/client";
import { z } from "zod";

// -- POST
export const postSchedularReqSchema = z
  .object({
    authId: z.string().uuid(),
    tags: z.array(z.string().uuid()).min(1, "Tags are required"),
    focusTopics: z.array(z.string()).min(1, "Tags are required"),
    startDate: z.string().datetime(),
    endDate: z.string().datetime(),
    frequency: z.enum([SchedularFrequency.DAILY, ...Object.values(SchedularFrequency)]),
  })
  .refine((data) => data.tags.length === data.focusTopics.length, {
    message: "Tags and focus topics must have the same length",
    path: ["focusTopics"], // Indicates where the error should be thrown
  });

export type postSchedularReqType = z.infer<typeof postSchedularReqSchema>;
export type postSchedularResType = GlobalApiResponse<Schedular>;

// -- GET
export const getSchedularListReqSchema = z.object({
  authId: z.string().uuid(),
  page: z.number().int().optional(),
  limit: z.number().int().optional(),
});

export type getSchedularListReqType = z.infer<typeof getSchedularListReqSchema>;
export type getSchedularListResType = GlobalApiResponse<{
  schedularList: Array<
    Schedular & {
      tags: Array<{
        tag: Tag;
        focusTopic: string;
        blogs: Array<Blogs & { tags: Tag[] }>;
      }>;
    }
  >;
  count: number;
}>;

// -- PATCH
export const patchSchedularReqSchema = z.object({
  schedularId: z.string().uuid(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  frequency: z.enum([SchedularFrequency.DAILY, ...Object.values(SchedularFrequency)]).optional(),
});

export type patchSchedularReqType = z.infer<typeof patchSchedularReqSchema>;
export type patchSchedularResType = GlobalApiResponse<Schedular>;

// -- DELETE
export const deleteSchedularReqSchema = z.object({
  schedularId: z.string().uuid(),
});

export type deleteSchedularReqType = z.infer<typeof deleteSchedularReqSchema>;
export type deleteSchedularResType = GlobalApiResponse<Schedular>;
