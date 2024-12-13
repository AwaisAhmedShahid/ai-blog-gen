import { cn } from "@/utils/tailwind-utils";
import React from "react";

const PageTitle = ({ title, style }: { title: string; style?: string }) => {
  return <h1 className={cn("font-bold text-2xl leading-4", style)}>{title}</h1>;
};

export default PageTitle;
