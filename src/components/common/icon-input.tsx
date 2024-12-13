"use client";

import { forwardRef, ReactNode } from "react";
import { Input, InputProps } from "@/components/ui/input";
import { cn } from "@/utils/tailwind-utils";

interface IconInputProps extends InputProps {
  icon: ReactNode; // Icon passed as a prop
}

const IconInput = forwardRef<HTMLInputElement, IconInputProps>(({ className, icon, ...props }, ref) => {
  return (
    <div className="relative flex w-full items-center">
      <div className="absolute left-0 top-0 h-full flex items-center px-4">{icon}</div>
      <Input
        className={cn("pl-10  h-12 rounded-lg placeholder:text-base py-[10px] placeholder:text-gray-300", className)} // Padding left for icon space
        ref={ref}
        {...props}
      />
    </div>
  );
});

IconInput.displayName = "IconInput";

export { IconInput };
