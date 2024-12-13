import { GlobalApiResponse } from "@/types";
import { z } from "zod";

// -- POST
export const getAppActionsReqSchema = z.object({
  appId: z.string(),
  token: z.string(),
});
export const getAppActionsResSchema = z.any();

export type getAppActionsReqType = z.infer<typeof getAppActionsReqSchema>;
export type getAppActionsResType = GlobalApiResponse<z.infer<typeof getAppActionsResSchema>>;

// -- POST
export const postGenerateBlogReqSchema = z.object({
  tags: z.array(z.string()).optional(),
  title: z.string().min(5, "Title should be at least 5 character long"),
  prompt: z.string().optional(),
  length: z.number().max(3200),
});

export type postGenerateBlogReqType = z.infer<typeof postGenerateBlogReqSchema>;
export type postGenerateBlogResType = GlobalApiResponse<z.infer<typeof postTextGenerationResSchema>>;

// -- POST [OPEN GATE PROFILER]
export const postOpenGateProfilerReqSchema = z.object({
  token: z.string(),
  appId: z.string(),
  actionId: z.string(),
});

export const postOpenGateProfilerResSchema = z.string();
export type postOpenGateProfilerReqType = z.infer<typeof postOpenGateProfilerReqSchema>;
export type postOpenGateProfilerResType = GlobalApiResponse<z.infer<typeof postOpenGateProfilerResSchema>>;

// -- POST [TEXT GENERATION]
export const postTextGenerationReqSchema = z.object({
  gateToken: z.string(),
  systemPrompt: z.string().optional(),
  prompt: z.string().optional(),
});
export const postTextGenerationResSchema = z.string();

export type postTextGenerationReqType = z.infer<typeof postTextGenerationReqSchema>;
export type postTextGenerationResType = GlobalApiResponse<z.infer<typeof postTextGenerationResSchema>>;
