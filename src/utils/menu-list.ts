import { PAGE_ROUTES } from "@/constants/API_ROUTES";
import { LucideIcon, Newspaper, CalendarDaysIcon, FilePen, ArchiveIcon, TagIcon } from "lucide-react";

type Menu = {
  href: string;
  label: string;
  active: boolean;
  icon: LucideIcon;
  disabled: boolean;
};

type Group = {
  menus: Menu[];
};

export function getMenuList(pathname: string): Group[] {
  return [
    {
      menus: [
        {
          href: PAGE_ROUTES.ADMIN_BLOGS,
          label: "Posts",
          active: pathname.endsWith(PAGE_ROUTES.ADMIN_BLOGS),
          icon: Newspaper,
          disabled: false,
        },
        {
          href: PAGE_ROUTES.SCHEDULE_BLOGS,
          label: "Campaigns",
          active: pathname.endsWith(PAGE_ROUTES.SCHEDULE_BLOGS),
          icon: CalendarDaysIcon,
          disabled: false,
        },
        {
          href: PAGE_ROUTES.DRAFT_BLOGS,
          label: "Drafts",
          active: pathname.endsWith(PAGE_ROUTES.DRAFT_BLOGS),
          icon: FilePen,
          disabled: false,
        },
        {
          href: PAGE_ROUTES.ARCHIVED_BLOGS,
          label: "Archived",
          active: pathname.endsWith(PAGE_ROUTES.ARCHIVED_BLOGS),
          icon: ArchiveIcon,
          disabled: false,
        },
        {
          href: PAGE_ROUTES.ADMIN_TAGS,
          label: "Tags",
          active: pathname.endsWith(PAGE_ROUTES.ADMIN_TAGS),
          icon: TagIcon,
          disabled: false,
        },
      ],
    },
  ];
}
