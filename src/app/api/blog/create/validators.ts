import { GlobalApiResponse } from "@/types";
import { Blogs, BlogStatus, Tag } from "@prisma/client";
import { z } from "zod";

// -- POST
export const postBlogReqSchema = z.object({
  title: z.string().min(5),
  content: z.string(),
  status: z.enum([BlogStatus.DRAFT, ...Object.values(BlogStatus)]),
  authId: z.string(),
  metaTitle: z.string(),
  coverImage: z.string().optional(),
  coverImageAlt: z.string().optional(),
  description: z.string().optional().default(""),
  tags: z.array(z.object({ id: z.string().uuid() })).optional(),
  tagTitle: z.array(z.string()).optional().default([]),
});

export type postBlogReqType = z.infer<typeof postBlogReqSchema>;
export type postBlogResType = GlobalApiResponse<
  Blogs & {
    tags: Tag[];
  }
>;
