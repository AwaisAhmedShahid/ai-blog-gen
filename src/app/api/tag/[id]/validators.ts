import { GlobalApiResponse } from "@/types";
import { Tag } from "@prisma/client";
import { z } from "zod";

//-- PUT
export const putTagReqSchema = z.object({
  id: z.string().min(1, "Message id is required"),
  title: z.string().min(5).optional(),
  isActive: z.boolean().optional(),
});

export type putTagReqType = z.infer<typeof putTagReqSchema>;
export type putTagResType = GlobalApiResponse<Tag>;

//-- DELETE

export const deleteTagReqSchema = z.object({
  id: z.string().min(1, "Message id is required"),
});

export type deleteTagReqType = z.infer<typeof deleteTagReqSchema>;
export type deleteTagResType = GlobalApiResponse<Tag>;

//-- GET BY ID

export const getByIdTagReqSchema = z.object({
  id: z.string().min(1, "Message id is required"),
});

export type getByIdTagReqType = z.infer<typeof getByIdTagReqSchema>;
export type getByIdTagResType = GlobalApiResponse<Tag>;
