import { GlobalApiResponse } from "@/types";
import { Author, Blogs, BlogStatus, Tag } from "@prisma/client";
import { z } from "zod";

// -- PUT
export const putBlogReqSchema = z.object({
  id: z.string().min(1, "Message id is required"),
  title: z.string().min(5).optional(),
  content: z.string().optional(),
  tags: z.array(z.object({ id: z.string().uuid() })).optional(),
  status: z.enum([BlogStatus.DRAFT, ...Object.values(BlogStatus)]).optional(),
});

export type putBlogReqType = z.infer<typeof putBlogReqSchema>;
export type putBlogResType = GlobalApiResponse<Blogs & { tags: Tag[] }>;

// -- DELETE
export const deleteBlogReqSchema = z.object({
  id: z.string().min(1, "Message id is required"),
});

export type deleteBlogReqType = z.infer<typeof deleteBlogReqSchema>;
export type deleteBlogResType = GlobalApiResponse<Blogs>;

// -- GET
export const getByIdBlogReqSchema = z.object({
  id: z.string().min(1, "Message id is required"),
});

export type getByIdBlogReqType = z.infer<typeof getByIdBlogReqSchema>;
export type getByIdBlogResType = GlobalApiResponse<
  Blogs & {
    tags: Tag[];
    author: Author;
  }
>;
