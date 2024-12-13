import { NextRequest } from "next/server";
import { routerReader, saveCookies } from "./utils/middleware-utils";

export function middleware(req: NextRequest) {
  const { NOT_FOUND, PROTECTED, PUBLIC, IS_LOGGED_IN, RESPONSE_MAPPER, IS_HOME, IS_APP_ID_INVALID } = routerReader(req);

  if (IS_APP_ID_INVALID) {
    return RESPONSE_MAPPER.INVALID_APP_ID;
  }

  // -------- NOT FOUND --------
  if (NOT_FOUND) {
    return RESPONSE_MAPPER.NOT_FOUND;
  }

  // -------- PUBLIC PAGES --------
  if (PUBLIC) {
    // STOP USERS FROM ACCESSING PAGES THAT ARE ONLY FOR PUBLIC USERS
    if (IS_LOGGED_IN && !PROTECTED) {
      return RESPONSE_MAPPER.ONLY_PUBLIC;
    }
  }

  // -------- PROTECTED PAGES --------
  else if (PROTECTED) {
    // STOP USERS FROM ACCESSING PAGES THAT ARE ONLY FOR LOGGED IN USERS
    if (!IS_LOGGED_IN) {
      return RESPONSE_MAPPER.UNAUTHORIZED;
    }
  }

  // -------- HOME PAGE --------
  if (IS_HOME) {
    return RESPONSE_MAPPER.BASE;
  }

  // SAVE PAGE REQUEST ORIGIN IN COOKIE
  const response = saveCookies(req);

  return response;
}

export const config = {
  matcher: "/((?!api|static|.*\\..*|_next).*)",
};
