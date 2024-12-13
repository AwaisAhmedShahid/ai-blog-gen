import { PanelRightCloseIcon, PanelRightOpen } from "lucide-react";

import { Button } from "@/components/ui/button";

interface SidebarToggleProps {
  isOpen: boolean | undefined;
  setIsOpen?: () => void;
}

export function SidebarToggle({ isOpen, setIsOpen }: SidebarToggleProps) {
  return (
    <div className="invisible lg:visible absolute top-[12px] -right-[16px] z-20">
      <Button onClick={() => setIsOpen?.()} className="rounded-md w-8 h-8" variant="outline" size="icon">
        {isOpen ? <PanelRightOpen size={16} /> : <PanelRightCloseIcon size={16} />}
      </Button>
    </div>
  );
}
