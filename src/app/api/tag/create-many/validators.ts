import { GlobalApiResponse } from "@/types";
import { Tag } from "@prisma/client";
import { z } from "zod";

// -- POST
export const postManyTagReqSchema = z.object({
  tags: z.array(z.string().min(1, "Title must contain at least 1 character")),
  isActive: z.boolean(),
  authId: z.string(),
});

export type postManyTagReqType = z.infer<typeof postManyTagReqSchema>;
export type postManyTagResType = GlobalApiResponse<Tag[]>;
