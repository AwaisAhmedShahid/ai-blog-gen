import { GlobalApiResponse } from "@/types";
import { Blogs, Schedular, Tag } from "@prisma/client";
import { z } from "zod";

// -- GET
export const getSchedularReqSchema = z.object({
  schedulerId: z.string(),
});

export type getSchedularReqType = z.infer<typeof getSchedularReqSchema>;
export type getSchedularResType = GlobalApiResponse<
  Schedular & {
    tags: Array<{
      tag: Tag;
      blogs: Array<Blogs & { tags: Tag[] }>;
    }>;
  }
>;
