import { cn } from "@/utils/tailwind-utils";
import { ChevronRight, CircleCheck } from "lucide-react";

interface MenuBarType {
  menuList: {
    name: string;
    index: number;
    islast?: boolean;
  }[];
  current: number;
}
export default function MenuBar({ menuList, current }: MenuBarType) {
  return (
    <div className="flex-1 items-center max-w-md  border rounded-md  ">
      <div className="flex items-center space-x-4 py-2 px-4 text-sm font-medium">
        {menuList.map((menu) => {
          return (
            <div className="flex items-center gap-1  text-primary" key={menu.index}>
              {menu.index < current ? (
                <CircleCheck size={24} />
              ) : (
                <span
                  className={cn(
                    "h-6 w-6",
                    current === menu.index
                      ? "mr-2 rounded-full bg-primary text-white px-2 py-0.5"
                      : "mr-2 rounded-full bg-gray-200 text-gray-600 px-2 py-0.5",
                  )}
                >
                  {menu.index}
                </span>
              )}

              {menu.name}
              {!menu.islast && <ChevronRight className="ml-4 h-4 w-4" />}
            </div>
          );
        })}
      </div>
    </div>
  );
}
