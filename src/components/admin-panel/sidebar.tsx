import Link from "next/link";
import { CalendarCheckIcon, PanelsTopLeft, PencilIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Menu } from "@/components/admin-panel/menu";
import { useSidebarToggle } from "@/hooks/use-sidebar-toggle";
import { cn } from "@/utils/tailwind-utils";
import { useStore } from "@/hooks/use-store";
import { SidebarToggle } from "./sidebar-toggle";
import { usePathname, useRouter } from "next/navigation";
import { PAGE_ROUTES } from "@/constants/API_ROUTES";

export function Sidebar() {
  const sidebar = useStore(useSidebarToggle, (state) => state);
  const router = useRouter();
  const pathname = usePathname();

  if (!sidebar) return null;

  return (
    <aside
      className={cn(
        "fixed top-0 left-0 border-r z-20 h-screen  -translate-x-full lg:translate-x-0 transition-[width] ease-in-out duration-300",
        sidebar?.isOpen === false ? "w-[90px]" : "w-72",
      )}
    >
      <SidebarToggle isOpen={sidebar?.isOpen} setIsOpen={sidebar?.setIsOpen} />
      <div className="relative h-full flex flex-col pt-[1px]  ">
        <div className="border-b min-h-16 items-center flex justify-start px-2">
          <Button
            className={cn(
              "transition-transform ease-in-out    m-0 items-start justify-start  duration-300 rounded-none",
              sidebar?.isOpen === false ? "translate-x-0" : "translate-x-0",
            )}
            variant="link"
            asChild
          >
            <Link href={PAGE_ROUTES.BLOGS} className="flex items-center gap-2">
              <PanelsTopLeft className="w-6 h-6 " size={sidebar.isOpen ? 24 : 18} />
              <h1
                className={cn(
                  "font-bold text-lg  whitespace-nowrap transition-[transform,opacity,display] ease-in-out duration-300",
                  sidebar?.isOpen === false ? "-translate-x-96 opacity-0 hidden" : "translate-x-0 opacity-100",
                )}
              >
                Brand
              </h1>
            </Link>
          </Button>
        </div>
        <div className="px-4 py-[10px]">
          <div className="flex h-[84px] flex-col gap-1 justify-start items-stretch ">
            <div
              onClick={() => router.push(PAGE_ROUTES.ADMIN_BLOG_CREATE)}
              className={cn(
                "cursor-pointer hover:bg-gray-100 self-stretch flex flex-row justify-start items-center gap-2 px-2 py-1 rounded-lg backdrop-blur-sm",
                pathname.endsWith(PAGE_ROUTES.ADMIN_BLOG_CREATE) ? "bg-gray-100" : "",
              )}
            >
              <div
                className={cn(
                  "flex flex-row cursor-pointer   items-center flex-grow-0   px-2 py-[6px] ",
                  sidebar.isOpen ? "gap-2" : "",
                )}
              >
                <PencilIcon size={16} className="text-primary-color" />
                <p
                  className={cn(
                    "max-w-[200px] text-primary-color truncate text-[14px] font-bold text-left leading-6",
                    sidebar?.isOpen === false ? "-translate-x-100 opacity-0" : "translate-x-0 opacity-100",
                  )}
                >
                  AI Create
                </p>
              </div>
            </div>
            <div
              onClick={() => router.push(PAGE_ROUTES.SCHEDULE_BLOG)}
              className={cn(
                "cursor-pointer hover:bg-gray-100 self-stretch flex flex-row justify-start items-center gap-2 px-2 py-1 rounded-lg backdrop-blur-sm",
                pathname.endsWith(PAGE_ROUTES.SCHEDULE_BLOG) ? "bg-gray-100" : "",
              )}
            >
              <div className=" cursor-pointer flex flex-row items-center gap-2 flex-grow-0 leading-6 text-[14px] font-bold text-left px-2 py-[6px] text-primary-color">
                <CalendarCheckIcon size={16} />
                <p
                  className={cn(
                    "max-w-[200px] text-primary-color truncate text-[14px] font-bold text-left leading-6",
                    sidebar?.isOpen === false ? "-translate-x-100 opacity-0" : "translate-x-0 opacity-100",
                  )}
                >
                  AI Campaign
                </p>
              </div>
            </div>
          </div>
          <div className="border my-[10px]" />
          <Menu isOpen={sidebar?.isOpen} />
        </div>
      </div>
    </aside>
  );
}
