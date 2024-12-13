import { GlobalApiResponse } from "@/types";
import { Author, Blogs, BlogStatus, Tag } from "@prisma/client";
import { z } from "zod";

// -- GET
export const getBlogReqSchema = z.object({
  page: z.number().int().optional(),
  limit: z.number().int().optional(),
  searchTags: z.array(z.string()).optional(),
  searchTitle: z.string().optional(),
  status: z.enum([BlogStatus.DELETED, ...Object.values(BlogStatus)]).optional(),
  sort: z.enum(["asc", "desc"]).optional().default("desc"),
  sortByViews: z.boolean().optional(),
  fromDate: z.string().datetime().optional(),
  toDate: z.string().datetime().optional(),
});

export type getBlogReqType = z.infer<typeof getBlogReqSchema>;
export type getBlogResType = GlobalApiResponse<{
  blogs: Array<
    Blogs & {
      tags: Tag[];
      author: Author;
    }
  >;
  count: number;
}>;
