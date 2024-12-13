import { postLoginProfilerResType } from "@/app/api/auth/login/validators";
import { PAGE_ROUTES } from "@/constants/API_ROUTES";
import { isEmpty, isStringified } from "@/utils";
import { NextResponse } from "next/server";
import { i18nConfig } from "../../18nConfig";
import { ENV } from "@/constants/ENV";
import { cookies } from "next/headers";
import { postRegisterProfilerResType } from "@/app/api/auth/register/validators";

export type CookieUser = {
  id: string;
  email: string;
  firebaseId: string;
};

export const COOKIE_MAPPER = {
  IS_LOGGED_IN: {
    TYPE: {} as boolean,
    KEY: "is-logged-in",
    DEFAULT: false,
  },
  REQ_ORIGIN: {
    TYPE: {} as string,
    KEY: "req-origin",
    DEFAULT: PAGE_ROUTES.UNKNOWN,
  },
  LOCALE: {
    TYPE: {} as string,
    KEY: "NEXT_LOCALE",
    DEFAULT: i18nConfig.defaultLocale,
  },
  APP_ID: {
    TYPE: {} as string,
    KEY: "APP_ID",
    DEFAULT: ENV.TEST_APP_ID || null,
  },
  USER_INFO: {
    TYPE: {} as null | postLoginProfilerResType["data"]["result"] | postRegisterProfilerResType["data"]["result"],
    KEY: "user-info",
    DEFAULT: null,
  },
};

export const cookieClient = (res: undefined | NextResponse = undefined) => {
  const getItem = <T extends keyof typeof COOKIE_MAPPER>(key: T): (typeof COOKIE_MAPPER)[T]["TYPE"] => {
    const item = cookies().get(COOKIE_MAPPER[key].KEY)?.value || COOKIE_MAPPER[key].DEFAULT;

    try {
      return isStringified(item)
        ? (JSON.parse(item) as (typeof COOKIE_MAPPER)[T]["TYPE"])
        : (item as unknown as (typeof COOKIE_MAPPER)[T]["TYPE"]);
    } catch (error) {
      console.log(error);
      return COOKIE_MAPPER[key].DEFAULT;
    }
  };

  // setItem will set the cookie on the response object if it is provided
  // thus will only work inside an API route
  const setItem = <T extends keyof typeof COOKIE_MAPPER>(key: T, value: (typeof COOKIE_MAPPER)[T]["TYPE"]) => {
    if (typeof value !== "boolean" && isEmpty(value)) {
      return;
    }

    if (!res) {
      throw new Error("setItem can only be used inside an API route, please provide the response object");
    }

    res.cookies.set(COOKIE_MAPPER[key].KEY, typeof value === "string" ? value : JSON.stringify(value), {
      // set path to root, so the cookie is valid for all PAGE_ROUTES
      path: "/",
      // set the cookie to expire in 1 week
      maxAge: 60 * 60 * 24 * 7,
      // don't allow the cookie to be read from JavaScript
      secure: true,
      // only allow cookies to be transmitted over HTTPS
      httpOnly: true,
    });
  };

  const removeItem = <T extends keyof typeof COOKIE_MAPPER>(key: T) => {
    if (!res) {
      throw new Error("removeItem can only be used inside an API route, please provide the response object");
    }

    res.cookies.delete(COOKIE_MAPPER[key].KEY);
  };

  const cleanCookieStore = () => {
    for (const key in COOKIE_MAPPER) {
      removeItem(key as keyof typeof COOKIE_MAPPER);
    }
  };

  return { getItem, setItem, removeItem, cleanCookieStore };
};
