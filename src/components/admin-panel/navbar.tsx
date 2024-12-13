import { UserNav } from "./use-nav";
import { SheetMenu } from "./sheet-menu";

interface NavbarProps {
  title: string;
}

export function Navbar({ title }: NavbarProps) {
  return (
    <header className="sticky   top-0 z-10 w-full   border-b  dark:bg-zinc-900 bg-white">
      <div className="mx-4 sm:mx-8 flex h-16 justify-between items-center">
        <div className="flex items-center  space-x-4 lg:space-x-0">
          <SheetMenu />
          <h1 className="font-bold">{title}</h1>
        </div>
        <UserNav />
      </div>
    </header>
  );
}
