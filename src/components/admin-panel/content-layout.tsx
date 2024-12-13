import { Navbar } from "@/components/admin-panel/navbar";
import { cn } from "@/utils/tailwind-utils";

interface ContentLayoutProps {
  title: string;
  children: React.ReactNode;
  style?: string;
}

export function ContentLayout({ title, children, style }: ContentLayoutProps) {
  return (
    <div>
      <Navbar title={title} />
      <div className={cn("py-6   px-8 sm:px-8", style)}>{children}</div>
    </div>
  );
}
