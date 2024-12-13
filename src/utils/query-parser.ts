import { API_ROUTES, PAGE_ROUTES } from "@/constants/API_ROUTES";
import { i18nConfig } from "../../18nConfig";
import { NextRequest } from "next/server";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const parseQueryParams = (query: any): any => {
  if (typeof query === "string") {
    // Parse boolean values
    if (query === "true") {
      return true;
    } else if (query === "false") {
      return false;
    }
    // Parse numeric values
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    else if (!isNaN(query as any) && query.trim() !== "") {
      return parseFloat(query);
    }
    // check if array string
    else if (query.startsWith("[")) {
      const temp = JSON.parse(query);

      return temp.map((item: string) => parseQueryParams(item));
    }
    // check if object string
    else if (query.startsWith("{")) {
      const temp = JSON.parse(query);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const parsedQuery: { [key: string]: any } = {};
      for (const key in temp) {
        if (Object.prototype.hasOwnProperty.call(temp, key)) {
          parsedQuery[key] = parseQueryParams(temp[key]);
        }
      }
      return parsedQuery;
    }

    // Return the string as is if it's neither a boolean nor a numeric string
    return query;
  }

  // If query is an array, recursively parse each element
  if (Array.isArray(query)) {
    return query.map((item) => parseQueryParams(item));
  }

  // If query is an object, recursively parse each property
  if (typeof query === "object" && query !== null) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const parsedQuery: { [key: string]: any } = {};
    for (const key in query) {
      if (Object.prototype.hasOwnProperty.call(query, key)) {
        parsedQuery[key] = parseQueryParams(query[key]);
      }
    }
    return parsedQuery;
  }

  // Return query as is if it doesn't match any of the above types
  return query;
};

type Params = Record<string, string | undefined>;

export const extractRouteParams = (pathname: string): Params => {
  const routeTemplate = matchRoute(pathname);
  const routeParts = routeTemplate.split("/").filter(Boolean);
  const urlParts = pathname.split("/").filter(Boolean);

  const params: Params = {};

  routeParts.forEach((part, index) => {
    if (part.startsWith(":")) {
      const paramName = part.slice(1);
      params[paramName] = urlParts[index];
    }
  });

  return params;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const extractBodyParams = async (req: NextRequest): Promise<any> => {
  let bodyParams = {};
  if (req.headers.get("content-type")?.includes("application/json")) {
    try {
      bodyParams = await req?.json();
    } catch (_) {}
  }

  return bodyParams;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const extractFormDataParams = async (req: NextRequest): Promise<any> => {
  const formParams = {};
  if (req.headers.get("content-type")?.includes("multipart/form-data")) {
    try {
      const formData = await req.formData();
      formData.forEach(async (value, key) => {
        if (Object.keys(formParams).includes(key)) {
          return;
        }

        if (formData.getAll(key).length > 1) {
          formParams[key] = formData.getAll(key);
          return;
        }

        formParams[key] = value;
      });
    } catch (e) {
      console.log("error", e);
    }
  }

  return formParams;
};

export const matchRoute = (pathname: string): PAGE_ROUTES => {
  const enumValues = [...Object.values(PAGE_ROUTES), ...Object.values(API_ROUTES)];
  for (const enumRoute of enumValues) {
    const localeRegex = `/(${i18nConfig.locales.join("|")})`;

    // adding localeRegex to the route to match the locale
    // and also replacing the :id with [^/]+ to match any string
    // and also removing the trailing slash
    const route = enumRoute.replace(/\/:[^/]+/g, "/[^/]+").replace(/\/$/, "");

    // creating two regex to match the route with and without locale
    const reg1 = new RegExp(`^${localeRegex + route}$`);
    const reg2 = new RegExp(`^${route}$`);

    if (reg1.test(pathname) || reg2.test(pathname) || enumRoute === pathname) {
      return enumRoute as PAGE_ROUTES;
    }
  }

  return PAGE_ROUTES.UNKNOWN;
};
export const sanitizeHTMLString = (inputString: string) => {
  // Create a new DOMParser instance
  let sanitized = inputString.replace(/(^|\n)#{1,6}\s+/g, "");

  // Remove bold and italic (e.g., **bold**, _italic_, __bold__, *italic*)
  sanitized = sanitized.replace(/(\*\*|__)(.*?)\1/g, "$2"); // Bold
  sanitized = sanitized.replace(/(\*|_)(.*?)\1/g, "$2"); // Italics

  // Remove inline code (e.g., `code`)
  sanitized = sanitized.replace(/`{1,3}([^`]*)`{1,3}/g, "$1");

  // Remove code blocks (e.g., ``` code block ```)
  sanitized = sanitized.replace(/```[\s\S]*?```|~~~[\s\S]*?~~~/g, "");

  // Remove links (e.g., [text](url))
  sanitized = sanitized.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");

  // Remove images (e.g., ![alt](url))
  sanitized = sanitized.replace(/!\[([^\]]*)\]\([^)]+\)/g, "$1");

  // Remove blockquotes (e.g., > Quote)
  sanitized = sanitized.replace(/^\s*>+\s?/gm, "");

  // Remove unordered list markers (e.g., - item, * item)
  sanitized = sanitized.replace(/^\s*[-*+]\s+/gm, "");

  // Remove ordered list markers (e.g., 1. item)
  sanitized = sanitized.replace(/^\s*\d+\.\s+/gm, "");

  // Remove extra whitespace
  sanitized = sanitized.trim();
  const parser = new DOMParser();

  // Parse the input string as an HTML document
  const doc = parser.parseFromString(sanitized, "text/html");

  // Extract and return the text content, stripping away all HTML tags
  return doc.body.textContent || "";
};

export const generateSlugUrl = (title: string, createdAt: string): string => {
  return `${title
    .replaceAll(":", "_colons_")
    .replaceAll("@", "_rate_")
    .replaceAll("?", "_question_")
    .replaceAll("=", "_equal_")
    .replaceAll("'", "_sq_")
    .replaceAll("-", "_dash_")
    .replaceAll(" ", "_space_")
    .replaceAll(".", "_dot_")
    .replaceAll('"', "_dq_")}--${createdAt.replaceAll(":", "_colons_").replaceAll(".", "_dot_")}`;
};

export const extractSlugParams = (slug: string): { title: string; createdAt: string } => {
  const [title, createdAt] = slug.split("--");

  return {
    title: title
      .replaceAll("_colons_", ":")
      .replaceAll("_rate_", "@")
      .replaceAll("_question_", "?")
      .replaceAll("_equal_", "=")
      .replaceAll("_sq_", "'")
      .replaceAll("_dash_", "-")
      .replaceAll("_space_", " ")
      .replaceAll("_dot_", ".")
      .replaceAll("_dq_", '"'),
    createdAt: createdAt.replaceAll("_colons_", ":").replaceAll("_dot_", "."),
  };
};
