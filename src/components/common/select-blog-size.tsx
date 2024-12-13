import * as React from "react";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui";

interface SelectBlogSizeType {
  onChange: (e: string) => void;
}
export function SelectBlogSize({ onChange }: SelectBlogSizeType) {
  const blogLengths = [
    {
      value: 300,
      label: "Small",
      subLabel: "(300-500 Words)",
    },
    {
      value: 600,
      label: "Medium",
      subLabel: "(600-800 Words)",
    },

    {
      value: 900,
      label: "Large",
      subLabel: "(900-1200 Words)",
    },
  ];
  return (
    <Select onValueChange={onChange}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select Option" />
      </SelectTrigger>
      <SelectContent>
        {blogLengths.map((blogLength) => (
          <SelectItem key={blogLength.value} value={blogLength.value.toString()}>
            <div className="flex gap-1">
              <p className="font-medium text-sm">{blogLength.label}</p>{" "}
              <p className="text-slate-400 ">{blogLength.subLabel}</p>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
