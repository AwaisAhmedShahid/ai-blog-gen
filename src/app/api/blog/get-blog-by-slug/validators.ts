import { GlobalApiResponse } from "@/types";
import { Author, Blogs, Tag } from "@prisma/client";
import { z } from "zod";

// -- GET
export const getBlogBySlugReqSchema = z.object({
  title: z.string().min(1, "Message id is required"),
  createdAt: z.string().datetime().min(1, "CreatedAt is required"),
});

export type getBlogBySlugReqType = z.infer<typeof getBlogBySlugReqSchema>;
export type getBlogBySlugResType = GlobalApiResponse<
  Blogs & {
    tags: Tag[];
    author: Author;
  }
>;
