import { GlobalApiResponse } from "@/types";
import { z } from "zod";

// -- POST
export const postRegisterReqSchema = z.object({
  first_name: z.string().min(3),
  last_name: z.string().min(3),
  email: z.string().email(),
  id: z.string(),
  avatar: z.string().nullable().default(null),
});

export type postRegisterReqType = z.infer<typeof postRegisterReqSchema>;
export type postRegisterResType = postRegisterProfilerResType;

export type postRegisterProfilerResType = GlobalApiResponse<{
  id: string;
  firstName: string;
  lastName: string;
  profilePic: string;
  email: string;
  appId: string;
  createdAt: Date;
  updatedAt: Date;
}>;
