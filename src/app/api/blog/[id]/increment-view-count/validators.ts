import { GlobalApiResponse } from "@/types";
import { Blogs } from "@prisma/client";
import { z } from "zod";

// -- PUT
export const putIncrementViewCountReqSchema = z.object({
  id: z.string(),
});

export type putIncrementViewCountReqType = z.infer<typeof putIncrementViewCountReqSchema>;
export type putIncrementViewCountResType = GlobalApiResponse<Blogs>;
