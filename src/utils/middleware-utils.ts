import { cookieClient } from "@/clients/cookie-client";
import { PAGE_ROUTES } from "@/constants/API_ROUTES";
import { PAGE_MAPPER, RESPONSE_MAPPER } from "@/constants/MIDDLEWARE_MAPPERS";
import { NextRequest } from "next/server";
import { matchRoute } from "./query-parser";
import { i18nRouter } from "next-i18n-router";
import { i18nConfig } from "../../18nConfig";
import { ENV } from "@/constants/ENV";
import { getAppId } from "@/server-actions";

export const routerReader = (req: NextRequest) => {
  const { getItem } = cookieClient();

  const APP_ID = getAppId();
  const REQ_ORIGIN = getItem("REQ_ORIGIN");
  const IS_LOGGED_IN = getItem("IS_LOGGED_IN");

  const URL = matchRoute(req.nextUrl.pathname);

  const _RESPONSE_MAPPER = RESPONSE_MAPPER(req.url, REQ_ORIGIN);

  const pageRoute = PAGE_MAPPER[URL as Exclude<PAGE_ROUTES, PAGE_ROUTES.UNKNOWN>];

  // PAGE
  if (pageRoute) {
    return {
      ...pageRoute,
      URL,
      REQ_ORIGIN,
      IS_LOGGED_IN,
      IS_APP_ID_INVALID: !isValidAppId(APP_ID) && URL !== PAGE_ROUTES.INVALID_APP_ID,
      IS_HOME: URL === PAGE_ROUTES.HOME,
      NOT_FOUND: false,
      RESPONSE_MAPPER: _RESPONSE_MAPPER,
    };
  }

  // NOT FOUND
  return {
    URL,
    REQ_ORIGIN,
    IS_LOGGED_IN,
    IS_APP_ID_INVALID: false,
    IS_HOME: false,
    PUBLIC: false,
    NOT_FOUND: !req.nextUrl.pathname.includes(PAGE_ROUTES.NOT_FOUND), // doing this to avoid infinite recursive loop
    PROTECTED: false,
    RESPONSE_MAPPER: _RESPONSE_MAPPER,
  };
};

export const saveCookies = (req: NextRequest) => {
  const urlObj = new URL(req.url);

  let [locale] = urlObj.pathname.split("/").filter(Boolean);
  const appId = req.cookies.get("APP_ID")?.value || ENV.TEST_APP_ID || urlObj.hostname.split(".").filter(Boolean)[0];

  if (!i18nConfig.locales.includes(locale)) {
    locale = i18nConfig.defaultLocale;
  }

  const response = i18nRouter(req, i18nConfig);

  if (req.nextUrl.pathname.includes(PAGE_ROUTES.NOT_FOUND)) {
    return response;
  }

  const pageName = req.nextUrl.pathname;
  const searchParams = req.nextUrl.searchParams.size > 0 ? `?${req.nextUrl.searchParams.toString()}` : "";

  const { setItem } = cookieClient(response);

  setItem("APP_ID", appId);
  setItem("LOCALE", locale);
  setItem("REQ_ORIGIN", pageName + searchParams);
  response.headers.set("Access-Control-Allow-Origin", "*");
  return response;
};

export const isValidAppId = (appId: string) => {
  return appId !== "localhosts";
};
