import { Settings2 } from "lucide-react";
import React from "react";
import { Button, Popover, PopoverContent, PopoverTrigger } from "../ui";

interface PopOverFilterButtonType {
  children: React.ReactNode;
}
const PopOverFilterButton = ({ children }: PopOverFilterButtonType) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"ghost"}
          className="border rounded-lg h-12 w-12 cursor-pointer items-center align-middle flex flex-col justify-center p-2"
        >
          <Settings2 size={16} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">{children}</PopoverContent>
    </Popover>
  );
};

export default PopOverFilterButton;
