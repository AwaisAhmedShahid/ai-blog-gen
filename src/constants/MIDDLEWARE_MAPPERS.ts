import { NextResponse } from "next/server";
import { PAGE_ROUTES } from "./API_ROUTES";

export const PAGE_MAPPER: Record<Exclude<PAGE_ROUTES, PAGE_ROUTES.UNKNOWN>, { PUBLIC: boolean; PROTECTED: boolean }> = {
  [PAGE_ROUTES.HOME]: {
    PUBLIC: true,
    PROTECTED: true,
  },
  [PAGE_ROUTES.LOGIN]: {
    PUBLIC: true,
    PROTECTED: false,
  },
  [PAGE_ROUTES.REGISTER]: {
    PUBLIC: true,
    PROTECTED: false,
  },
  [PAGE_ROUTES.BLOG]: {
    PUBLIC: true,
    PROTECTED: true,
  },
  [PAGE_ROUTES.BLOGS]: {
    PUBLIC: true,
    PROTECTED: true,
  },

  [PAGE_ROUTES.NOT_FOUND]: {
    PUBLIC: true,
    PROTECTED: true,
  },
  [PAGE_ROUTES.ADMIN_BLOGS]: {
    PROTECTED: true,
    PUBLIC: false,
  },
  [PAGE_ROUTES.ADMIN_BLOG_CREATE]: {
    PROTECTED: true,
    PUBLIC: false,
  },
  [PAGE_ROUTES.ADMIN_TAGS]: {
    PROTECTED: true,
    PUBLIC: false,
  },

  [PAGE_ROUTES.SCHEDULE_BLOGS]: {
    PROTECTED: true,
    PUBLIC: false,
  },
  [PAGE_ROUTES.INVALID_APP_ID]: {
    PROTECTED: true,
    PUBLIC: true,
  },
  [PAGE_ROUTES.SCHEDULE_BLOG]: {
    PROTECTED: true,
    PUBLIC: false,
  },
  [PAGE_ROUTES.ARCHIVED_BLOGS]: {
    PROTECTED: true,
    PUBLIC: false,
  },
  [PAGE_ROUTES.DRAFT_BLOGS]: {
    PROTECTED: true,
    PUBLIC: false,
  },
};

export const RESPONSE_MAPPER = (url: string, REQ_ORIGIN: string) => {
  return {
    NOT_FOUND: NextResponse.redirect(new URL(PAGE_ROUTES.NOT_FOUND, url)),
    ONLY_PUBLIC: NextResponse.redirect(new URL(REQ_ORIGIN, url)),
    UNAUTHORIZED: NextResponse.redirect(new URL(PAGE_ROUTES.LOGIN, url)),
    BASE: NextResponse.redirect(new URL(PAGE_ROUTES.BLOGS, url)),
    INVALID_APP_ID: NextResponse.redirect(new URL(PAGE_ROUTES.INVALID_APP_ID, url)),
  };
};
