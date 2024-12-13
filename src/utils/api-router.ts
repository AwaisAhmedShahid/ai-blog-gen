import { postLoginResType } from "@/app/api/auth/login/validators";
import { postRegisterResType } from "@/app/api/auth/register/validators";
import { localStorageClient } from "@/clients/localstorage-client";
import { API_ROUTES } from "@/constants/API_ROUTES";
import { getBlogResType } from "@/app/api/blog/validators";
import { postGenerateBlogResType } from "@/app/api/blog/generate/validators";
import { getByIdBlogResType, putBlogResType } from "@/app/api/blog/[id]/validators";
import { getByIdTagResType, putTagResType } from "@/app/api/tag/[id]/validators";
import { getTagResType } from "@/app/api/tag/validators";
import { getSchedularListResType, postSchedularResType } from "@/app/api/schedular/validators";
import { postBlogResType } from "@/app/api/blog/create/validators";
import { ENV } from "@/constants/ENV";
import { postLogoutResType } from "@/app/api/auth/logout/validators";
import { getSchedularResType } from "@/app/api/schedular/[id]/validators";
import { postMediaResType } from "@/app/api/media/validators";
import { getAppInfoProfilerResType } from "@/app/api/auth/app-info/validators";
import { getBlogBySlugResType } from "@/app/api/blog/get-blog-by-slug/validators";
import { putIncrementViewCountResType } from "@/app/api/blog/[id]/increment-view-count/validators";
import { postImageGenerationResType } from "@/app/api/blog/generate/image/validators";
import { postGenerateTagResType } from "@/app/api/blog/generate/tags/validators";
import { postManyTagResType } from "@/app/api/tag/create-many/validators";
import { postGenerateFocusTopicsResType } from "@/app/api/blog/generate/focus-topics/validators";

export const apiRouter = async <T extends keyof typeof API_TYPE_MAPPER>(
  _input: T,
  init?: RequestInit & {
    routeParam?: string; // only supports 1 route param, and it should be the last one
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    queryParams?: any; // only supports object of depth 1
  },
  options?: {
    skipAuthorization?: boolean;
    skipContentType?: boolean;
    skipCredentials?: boolean;
    skipBaseUrl?: boolean;
  },
) => {
  const headers = new Headers(init?.headers);

  // Check if code is running on the client (browser)
  if (typeof window !== "undefined") {
    const appId =
      localStorageClient().getItem("APP_ID").replace(/"/g, "") ||
      ENV.TEST_APP_ID ||
      window.location.hostname.split(".").filter(Boolean)?.[0];
    const token = localStorageClient().getItem("USER_INFO")?.access_token;
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || "Asia/Karachi";

    if (!options?.skipAuthorization && token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    if (!options?.skipContentType) {
      headers.set("Content-Type", "application/json");
    }
    if (!options?.skipCredentials) {
      headers.set("credentials", "include");
    }
    if (appId) {
      headers.set("x-app-name", appId);
    }
    if (timeZone) {
      headers.set("x-timezone", timeZone);
    }
  }

  let apiRouter: string = API_ROUTES[_input];
  if (init?.routeParam) {
    apiRouter = API_ROUTES[_input].replace(":id", init.routeParam);
  }
  if (init?.queryParams) {
    const params = new URLSearchParams(init?.queryParams);
    apiRouter += "?" + params;
  }

  const response = await fetch(apiRouter, {
    ...init,
    headers,
  });

  // handle 401 error
  if (response.status === 401) {
    console.log("Unauthorized");

    localStorage.clear();
  }

  return response as Omit<Response, "json"> & { json: () => Promise<(typeof API_TYPE_MAPPER)[typeof _input]> };
};

const API_MAPPER = {
  LOGIN: {} as postLoginResType,
  REGISTER: {} as postRegisterResType,
  BLOGS_LIST: {} as getBlogResType,
  GEN_BLOG: {} as postGenerateBlogResType,
  LOGOUT: {} as postLogoutResType,
  SINGLE_BLOG: {} as getByIdBlogResType,
  UPDATE_BLOG: {} as putBlogResType,
  SINGLE_TAG: {} as getByIdTagResType,
  UPDATE_TAG: {} as putTagResType,
  TAGS_LIST: {} as getTagResType,
  SCHEDULE_BLOG: {} as postSchedularResType,
  CREATE_BLOG: {} as postBlogResType,
  GET_SINGLE_SCHEDULE: {} as getSchedularResType,
  UPDATE_SINGLE_SCHEDULE: {} as getSchedularResType,
  UPLOAD_IMAGE: {} as postMediaResType,
  GET_APP_INFO: {} as getAppInfoProfilerResType,
  SCHEDULE_BLOG_LIST: {} as getSchedularListResType,
  INCREMENT_BLOG_VIEW_COUNT: {} as putIncrementViewCountResType,
  GET_BLOG_BY_SLUG: {} as getBlogBySlugResType,
  GEN_IMAGE: {} as postImageGenerationResType,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  GEN_TAGS: {} as postGenerateTagResType,
  CREATE_MANY_TAGS: {} as postManyTagResType,
  GENERATE_FOCUS_TOPICS: {} as postGenerateFocusTopicsResType,
} as const;

// Utility type to check for missing keys
type EnsureAllKeys<T extends Record<keyof typeof API_ROUTES, unknown>> = T;

// Apply the utility type to enforce completeness
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const API_TYPE_MAPPER: EnsureAllKeys<typeof API_MAPPER> = API_MAPPER;
