import { GlobalApiResponse } from "@/types";
import { z } from "zod";

// -- POST
export const postLogoutReqSchema = z.object({});

export type postLogoutReqType = z.infer<typeof postLogoutReqSchema>;
export type postLogoutResType = GlobalApiResponse<undefined>;
