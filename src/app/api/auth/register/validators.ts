import { GlobalApiResponse } from "@/types";
import { z } from "zod";

// -- POST
export const postRegisterReqSchema = z.object({
  first_name: z.string().min(3),
  last_name: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(6),
  confirm_password: z.string().min(3),
});

export type postRegisterReqType = z.infer<typeof postRegisterReqSchema>;
export type postRegisterResType = postRegisterProfilerResType;

// -- POST [REGISTER PROFILER]
export const postRegisterProfilerReqSchema = z.object({
  appId: z.string(),
  first_name: z.string().min(3),
  last_name: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(6),
  confirm_password: z.string().min(3),
});
export const postRegisterProfilerResSchema = z.object({
  id: z.string(),
  is_onboarded: z.boolean(),
  is_subscribed: z.boolean(),
  avatar: z.string().nullable().default(null),
  is_active: z.boolean(),
  is_logged_in: z.boolean(),
  role: z.enum(["APP_ADMIN", "APP_MODERATOR", "APP_USER"]), // Enum can be adjusted based on role options
  coin_tokens: z.string().default("0"),
  email: z.string().email(),
  first_name: z.string(),
  last_name: z.string(),
  app_id: z.string(),
  app_url: z.string(),
  updated_at: z.string(),
  created_at: z.string(),
  contact_number: z.string().nullable().default(null),
  stripe_id: z.string().nullable().default(null),
  deleted_at: z.string().nullable().default(null),
  subscription: z.string().optional().nullable(),
  access_token: z.string(),
});
export type postRegisterProfilerReqType = z.infer<typeof postRegisterProfilerReqSchema>;
export type postRegisterProfilerResType = GlobalApiResponse<z.infer<typeof postRegisterProfilerResSchema>>;
