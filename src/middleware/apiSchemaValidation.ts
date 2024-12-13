import { extractBodyParams, extractFormDataParams, extractRouteParams, parseQueryParams } from "@/utils/query-parser";
import QueryString from "qs";
import { CombinedMiddlewareProps } from "./apiValidations";

export const apiSchemaValidation = async ({ req, schema }: Omit<CombinedMiddlewareProps, "options">) => {
  const bodyParams = await extractBodyParams(req);
  const formParams = await extractFormDataParams(req);
  const routeParams = extractRouteParams(req.nextUrl.pathname);
  const queryParams = parseQueryParams(QueryString.parse(req.nextUrl.searchParams.toString() || ""));

  const totalParams = { ...bodyParams, ...queryParams, ...routeParams, ...formParams };

  if (!schema) {
    return {
      success: true,
      status: 200,
      error: null,
      params: totalParams,
    };
  }

  const validate = schema.safeParse(totalParams);
  if (!validate.success) {
    return {
      success: false,
      status: 400,
      error: validate.error,
      params: totalParams,
    };
  }

  return {
    success: true,
    status: 200,
    error: null,
    params: totalParams,
  };
};
