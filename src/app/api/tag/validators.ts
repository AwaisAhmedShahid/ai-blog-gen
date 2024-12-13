import { GlobalApiResponse } from "@/types";
import { Blogs, Tag } from "@prisma/client";
import { z } from "zod";

// -- POST
export const postTagReqSchema = z.object({
  title: z.string().min(3, "Title must contain at least 3 character"),
  isActive: z.boolean(),
  authId: z.string(),
});

export type postTagReqType = z.infer<typeof postTagReqSchema>;
export type postTagResType = GlobalApiResponse<Tag>;

// -- GET
export const getTagReqSchema = z.object({
  limit: z.number().int().optional(),
  searchTag: z.string().optional(),
  isActive: z.boolean().optional(),
  page: z.number().int().optional(),
});

export type getTagReqType = z.infer<typeof getTagReqSchema>;
export type getTagResType = GlobalApiResponse<{
  Tags: Array<
    Tag & {
      blogs: Blogs[];
    }
  >;
  count: number;
}>;
