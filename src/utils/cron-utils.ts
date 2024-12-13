import { SchedularFrequency } from "@prisma/client";

// Helper function to add time based on frequency
const addFrequencyToDate = (date: Date, frequency: SchedularFrequency): Date => {
  const newDate = new Date(date);
  switch (frequency) {
    case SchedularFrequency.DAILY:
      newDate.setDate(newDate.getDate() + 1);
      break;
    case SchedularFrequency.BI_WEEKLY:
      newDate.setDate(newDate.getDate() + 2);
      break;
    case SchedularFrequency.WEEKLY:
      newDate.setDate(newDate.getDate() + 7);
      break;
    case SchedularFrequency.MONTHLY:
      newDate.setMonth(newDate.getMonth() + 1);
      break;
    case SchedularFrequency.QUARTERLY:
      newDate.setMonth(newDate.getMonth() + 3);
      break;
    case SchedularFrequency.YEARLY:
      newDate.setFullYear(newDate.getFullYear() + 1);
      break;
    default:
      throw new Error("Invalid frequency");
  }
  return newDate;
};

// Main function to check if a blog should be recreated
export const shouldCreateBlog = (
  lastCreatedDate: Date,
  frequency: SchedularFrequency,
  currentDate: Date = new Date(),
): boolean => {
  const nextCreationDate = addFrequencyToDate(lastCreatedDate, frequency);
  return currentDate >= nextCreationDate; // If current date is past the next creation date, return true
};

type MarkdownHeader = {
  level: number;
  text?: string;
};

export function extractHeadersFromMarkdown(markdown: string): MarkdownHeader[] {
  const headers: MarkdownHeader[] = [];

  // Split markdown text by line
  const lines = markdown.split("\n");

  // Regex to match headers
  const headerRegex = /^(#{1,6})\s+(.*)$/;

  // Loop through each line and extract headers
  lines.forEach((line) => {
    const match = line.match(headerRegex);
    if (match) {
      const level = match[1].length; // Number of `#` characters defines the level
      const text = match[2].trim(); // The header text
      headers.push({ level, text });
    }
  });

  return headers;
}
