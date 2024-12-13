import { GlobalApiResponse } from "@/types";
import { z } from "zod";

// -- GET
export const getAppInfoReqSchema = z.object({});

export type getAppInfoReqType = z.infer<typeof getAppInfoReqSchema>;
export type getAppInfoResType = getAppInfoProfilerResType;

// -- POST [GET APP INFO PROFILER]
export const getAppInfoProfilerReqSchema = z.object({
  appId: z.string(),
});

export const AppTypeSchema = z.object({
  id: z.string(),
  name: z.string(),
  is_active: z.boolean(),
  url: z.string(),
  description: z.string(),
  super_admin_id: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
  deleted_at: z.string().nullable(),
  config: z.array(z.any()), // Adjust this if config has a more specific type
});
const ThemeSchema = z.object({
  appearance: z.string(),
  primaryFont: z.string(),
  primaryColor: z.string(),
  secondaryFont: z.string(),
  backgroundColor: z.string(),
});
const ConfigSchema = z.object({
  id: z.string(),
  name: z.string(),
  is_active: z.boolean(),
  theme: ThemeSchema,
  localization: z.record(z.unknown()), // Adjust based on the actual structure
  logo: z.string().nullable(),
  super_admin_app_type_id: z.string(),
  modality: z.array(z.string()),
  created_at: z.string(), // Use z.date() if parsed as Date
  updated_at: z.string(), // Use z.date() if parsed as Date
  deleted_at: z.string().nullable(),
});
export const getAppInfoProfilerResSchema = z.object({
  app_type: z.object({
    id: z.string(),
    name: z.string(),
    is_active: z.boolean(),
    url: z.string(),
    description: z.string(),
    super_admin_id: z.string(),
    created_at: z.string(), // Use z.date() if parsed as Date
    updated_at: z.string(), // Use z.date() if parsed as Date
    deleted_at: z.string().nullable(),
    config: ConfigSchema,
  }),
  id: z.string(),
  name: z.string(),
  is_active: z.boolean(),
  app_type_name: z.string(),
  url: z.string(),
  description: z.string(),
  is_paid: z.boolean(),
  logo: z.string().nullable(),
  theme: z
    .object({
      dark: z
        .object({
          primaryColor: z.string(),
          backgroundColor: z.string(),
        })
        .optional(),
      light: z
        .object({
          primaryColor: z.string(),
          backgroundColor: z.string(),
        })
        .optional(),
      bodyFont: z.string().optional(),
      appearance: z.enum(["light", "dark"]).optional(),
      headerFont: z.string().optional(),
    })
    .nullable()
    .default({}),
  localization: z.object({}).nullable(),
  super_admin_app_type_id: z.string(),
  client_id: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
  deleted_at: z.string().nullable(),
});

export type getAppInfoProfilerReqType = z.infer<typeof getAppInfoProfilerReqSchema>;
export type getAppInfoProfilerResType = GlobalApiResponse<z.infer<typeof getAppInfoProfilerResSchema>>;
