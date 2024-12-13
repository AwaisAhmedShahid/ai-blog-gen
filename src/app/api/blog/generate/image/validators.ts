import { GlobalApiResponse } from "@/types";
import { z } from "zod";

export const postGenerateBlogImageReqSchema = z.object({
  blogTitle: z.string().optional(),
  size: z.string().optional().default("1792x1024"),
  temperature: z.number().optional(),
});

export type postGenerateBlogImageReqType = z.infer<typeof postGenerateBlogImageReqSchema>;

export const postImageGenerationReqSchema = z.object({
  gateToken: z.string(),
  systemPrompt: z.string().optional(),
  prompt: z.string().optional(),
  size: z.string().optional(),
  temperature: z.number().optional(),
});
export const postImageGenerationResSchema = z.object({
  keys: z.array(
    z.object({
      fileKey: z.string(),
      publicURL: z.string(),
    }),
  ),
  urls: z.array(z.string()),
});

export type postImageGenerationReqType = z.infer<typeof postImageGenerationReqSchema>;
export type postImageGenerationResType = GlobalApiResponse<z.infer<typeof postImageGenerationResSchema>>;
