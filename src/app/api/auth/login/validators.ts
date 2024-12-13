import { GlobalApiResponse } from "@/types";
import { z } from "zod";

// -- POST
export const postLoginReqSchema = z.object({
  email: z.string().min(1, "Email is required").email("Please enter a valid email"),
  password: z.string().min(1, "Password is required").min(7, "Too short"),
});

export type postLoginReqType = z.infer<typeof postLoginReqSchema>;
export type postLoginResType = postLoginProfilerResType;

// -- POST [LOGIN PROFILER]
export const postLoginProfilerReqSchema = z.object({
  appId: z.string(),
  email: z.string().min(1, "Email is required").email("Please enter a valid email"),
  password: z.string().min(1, "Password is required").min(7, "Too short"),
});
export const postLoginProfilerResSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  app_id: z.string(),
  app_url: z.string(),
  first_name: z.string(),
  last_name: z.string(),
  is_onboarded: z.boolean(),
  is_subscribed: z.boolean(),
  avatar: z.string().nullable().default(null),
  contact_number: z.string().nullable().default(null),
  is_active: z.boolean(),
  is_logged_in: z.boolean(),
  stripe_id: z.string().nullable().default(null),
  role: z.enum(["APP_ADMIN", "APP_MODERATOR", "APP_USER"]), // Enum can be adjusted based on role options
  coin_tokens: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
  deleted_at: z.string().nullable(),
  subscription: z.string().nullable(),
  access_token: z.string(),
});

export type postLoginProfilerReqType = z.infer<typeof postLoginProfilerReqSchema>;
export type postLoginProfilerResType = GlobalApiResponse<z.infer<typeof postLoginProfilerResSchema>>;
