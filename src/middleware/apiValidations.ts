import { NextRequest, NextResponse } from "next/server";
import { ZodEffects, ZodObject } from "zod";

import { apiSchemaValidation } from "./apiSchemaValidation";
import { isApiAuthenticated } from "./isApiAuthenticated";
import { cookieClient } from "@/clients/cookie-client";
import { GlobalErrorResType } from "@/types";

export type CombinedMiddlewareProps = {
  req: NextRequest;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handler: (req: NextRequest, params?: any) => Promise<NextResponse>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  schema?: ZodObject<any> | ZodEffects<ZodObject<any>>;
  options?: {
    ignoreAuth?: boolean;
    ignoreValidation?: boolean;
    onlyPublic?: boolean;
  };
};

export const apiValidations = async (props: CombinedMiddlewareProps) => {
  try {
    const { req, handler, schema, options } = props;

    const appId = req.headers.get("x-app-name");
    const isLoggedIn = cookieClient().getItem("IS_LOGGED_IN");

    if (!appId) {
      return NextResponse.json<GlobalErrorResType>(
        { success: false, data: { message: "App id not found in headers" } },
        { status: 400 },
      );
    }

    if (options?.onlyPublic && isLoggedIn) {
      return NextResponse.json<GlobalErrorResType>(
        { success: false, data: { message: "API only accessible for not logged-in users" } },
        { status: 405 },
      );
    }

    if (!options?.ignoreAuth && !options?.onlyPublic) {
      const { success: authSuccess, status: authStatus, error: authError } = await isApiAuthenticated(req);

      if (!authSuccess) {
        const response = NextResponse.json<GlobalErrorResType>(
          { success: false, data: { message: authError } },
          { status: authStatus },
        );

        cookieClient(response).cleanCookieStore();

        return response;
      }
    }

    let params = {};
    if (!options?.ignoreValidation) {
      const {
        success: validationSuccess,
        status: validationStatus,
        error: validationError,
        params: parsedParams,
      } = await apiSchemaValidation({ req, handler, schema });

      params = parsedParams;

      if (!validationSuccess) {
        return NextResponse.json<GlobalErrorResType>(
          { success: false, data: { message: validationError } },
          { status: validationStatus },
        );
      }
    }

    return await handler(req, params);
  } catch (e) {
    return NextResponse.json<GlobalErrorResType>(
      { success: false, data: { message: (e as Error).message } },
      { status: 500, statusText: (e as Error).name || "unknown" },
    );
  }
};
