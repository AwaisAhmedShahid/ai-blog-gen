import { ENV } from "./ENV";

export enum PAGE_ROUTES {
  HOME = "/",
  LOGIN = "/login",
  REGISTER = "/register",
  NOT_FOUND = "/404",
  BLOG = "/blogs/:blogId",
  BLOGS = "/blogs",
  UNKNOWN = "/unknown",
  INVALID_APP_ID = "/invalid-app-id",
  SCHEDULE_BLOGS = "/admin/blogs/schedule",
  ARCHIVED_BLOGS = "/admin/blogs/archived",
  DRAFT_BLOGS = "/admin/blogs/draft",
  SCHEDULE_BLOG = "/admin/blogs/schedule/create",
  ADMIN_BLOGS = "/admin/blogs",
  ADMIN_BLOG_CREATE = "/admin/blogs/create",
  ADMIN_TAGS = "/admin/tags",
}

export enum API_ROUTES {
  LOGIN = "/api/auth/login",
  REGISTER = "/api/auth/register",
  LOGOUT = "/api/auth/logout",
  BLOGS_LIST = "/api/blog",
  SINGLE_BLOG = "/api/blog/:id",
  UPDATE_BLOG = SINGLE_BLOG,
  GENERATE_FOCUS_TOPICS = "/api/blog/generate/focus-topics",
  TAGS_LIST = "/api/tag",
  CREATE_MANY_TAGS = "/api/tag/create-many",
  SINGLE_TAG = "/api/tag/:id",
  UPDATE_TAG = SINGLE_TAG,
  GEN_BLOG = "/api/blog/generate",
  GEN_TAGS = "/api/blog/generate/tags",
  GEN_IMAGE = "/api/blog/generate/image",
  SCHEDULE_BLOG = "/api/schedular",
  CREATE_BLOG = "/api/blog/create",
  GET_SINGLE_SCHEDULE = "/api/schedular/:id",
  UPDATE_SINGLE_SCHEDULE = SCHEDULE_BLOG,
  GET_APP_INFO = "/api/auth/app-info",
  SCHEDULE_BLOG_LIST = SCHEDULE_BLOG,
  INCREMENT_BLOG_VIEW_COUNT = "/api/blog/:id/increment-view-count",
  UPLOAD_IMAGE = "/api/media",
  GET_BLOG_BY_SLUG = "/api/blog/get-blog-by-slug",
}

export const PROFILER_API_ROUTES = {
  ACTIONS: ENV.PROFILER_BASE_URL + "/user/actions",
  OPEN_GATE: ENV.PROFILER_BASE_URL + "/user/action/gate-open/:action_id",
  LOGIN: ENV.PROFILER_BASE_URL + "/user/auth/login",
  REGISTER: ENV.PROFILER_BASE_URL + "/user/auth/register",
  GET_APP_INFO: ENV.PROFILER_BASE_URL + "/client/apps/slug/:slug",
  GET_APP_ACTIONS: ENV.PROFILER_BASE_URL + "/user/action",
};

export const PROVIDER_API_ROUTES = {
  TEXT_GENERATION: ENV.PROVIDER_BASE_URL + "/text-to-text/generate",
  IMAGE_GENERATION: ENV.PROVIDER_BASE_URL + "/text-to-image/generate",
};

export const BUCKET_SERVICE_API_ROUTES = {
  IMAGE_FILES: ENV.BUCKET_SERVICE + "/image",
};
