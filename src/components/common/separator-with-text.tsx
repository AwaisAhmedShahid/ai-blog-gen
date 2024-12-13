import React from "react";
import { Separator } from "../ui";

export const SeparatorWithText = ({ text }: { text: string }) => {
  return (
    <div className="flex items-center gap-4">
      <Separator className="flex-1 bg-muted" />
      <span className="text-muted-foreground text-sm font-medium">{text}</span>
      <Separator className="flex-1 bg-muted" />
    </div>
  );
};
