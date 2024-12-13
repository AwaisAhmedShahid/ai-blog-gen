"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui";
import { cn } from "@/utils/tailwind-utils";
import { getMenuList } from "@/utils/menu-list";

interface MenuProps {
  isOpen: boolean | undefined;
}

export function Menu({ isOpen }: MenuProps) {
  const pathname = usePathname();
  const menuList = getMenuList(pathname);

  return (
    <ScrollArea className="[&>div>div[style]]:!block ">
      <nav className=" h-full w-full">
        <ul className="flex flex-col min-h-[calc(100vh-48px-36px-16px-32px)] lg:min-h-[calc(100vh-32px-40px-32px)] items-start space-y-1 ">
          {menuList.map(({ menus }, index) => (
            <li className={cn("w-full")} key={index}>
              {menus.map(({ href, label, icon: Icon, active, disabled }, index) => (
                <div className="w-full" key={index}>
                  <TooltipProvider disableHoverableContent>
                    <Tooltip delayDuration={100}>
                      <TooltipTrigger asChild>
                        <Button
                          disabled={disabled}
                          variant={active ? "secondary" : "ghost"}
                          className={cn(
                            "w-full justify-start h-10 mb-1  ",
                            disabled ? "cursor-not-allowed bg-slate-200" : "",
                          )}
                          asChild
                        >
                          <Link href={href}>
                            <span className={cn(isOpen === false ? "" : "mr-2")}>
                              <Icon size={isOpen ? 16 : 18} className={cn(disabled ? "text-slate-400" : "")} />
                            </span>

                            <p
                              className={cn(
                                "max-w-[200px]  truncate text-sm font-medium leading-5",
                                isOpen === false ? "-translate-x-100 opacity-0" : "translate-x-0 opacity-100",
                                disabled ? "text-slate-400 cursor-not-allowed" : "",
                              )}
                            >
                              {label}
                            </p>
                          </Link>
                        </Button>
                      </TooltipTrigger>
                      {isOpen === false && <TooltipContent side="right">{label}</TooltipContent>}
                    </Tooltip>
                  </TooltipProvider>
                </div>
              ))}
            </li>
          ))}
        </ul>
      </nav>
    </ScrollArea>
  );
}
