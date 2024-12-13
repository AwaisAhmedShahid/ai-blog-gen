import { DateTime } from "luxon";
import { SERVER_TIMEZONE } from "@/constants";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isStringified(value: any): value is string {
  return typeof value === "string" && (/^{.*}$/.test(value.trim()) || value === "null");
}

// get enum keys and convert it to key:value pair
export function enumToRecord<T extends Record<string, string | number>>(enumObj: T): Record<keyof T, string> {
  const result = {} as Record<keyof T, string>;

  for (const key in enumObj) {
    if (Object.prototype.hasOwnProperty.call(enumObj, key)) {
      result[key as keyof T] = String(key);
    }
  }

  return result;
}

export function enumToArray<T extends Record<string, string | number>>(enumObj: T): string[] {
  return Object.keys(enumObj);
}

export function convertTimeZone({
  dateTime,
  to = SERVER_TIMEZONE,
  from,
}: {
  dateTime: string;
  from: string;
  to?: string;
}): string {
  const date = DateTime.fromISO(dateTime, { zone: from });

  const convertedDate = date.setZone(to);

  // Expected ISO-8601 DateTime string
  return convertedDate.toISO() || new Date().toISOString();
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isEmpty(value: any): boolean {
  // Check for null, undefined, or falsy values
  if (value == null || value === false || value === "" || value === 0 || Number.isNaN(value)) {
    return true;
  }

  // Check for empty objects
  if (typeof value === "object" && !Array.isArray(value)) {
    return Object.keys(value).length === 0;
  }

  // Check for empty arrays
  if (Array.isArray(value)) {
    return value.length === 0;
  }

  // All other values (including non-empty strings, numbers, etc.) are not considered empty
  return false;
}

// Define Falsy type
export function formatString(str: string) {
  return (
    str
      // Replace underscores with spaces
      .replace(/_/g, " ")
      // Change uppercase words to capitalized
      .toLowerCase()
      .replace(/\b[a-z]/g, (char) => char.toUpperCase())
  );
}

// image generator
export function generateImageURL({
  firstName,
  lastName = firstName.substring(1),
}: {
  firstName: string;
  lastName?: string;
}): string {
  return `https://avatar.vercel.sh/${firstName}_${lastName}.svg?text=${firstName?.substring(0, 1).toUpperCase() + lastName?.substring(0, 1).toUpperCase()}`;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const filterClientActionId = (key: string, actions: any[]) => {
  return actions.find((item) => item.name.includes(key));
};
