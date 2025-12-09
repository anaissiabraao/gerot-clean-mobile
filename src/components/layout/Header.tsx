import { Menu, Bell, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import portoexLogo from "@/assets/portoex-logo.png";

interface HeaderProps {
  onMenuClick?: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur-lg safe-top">
      <div className="flex h-14 items-center justify-between px-4 md:h-16 md:px-6">
        {/* Left side */}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon-sm"
            className="md:hidden"
            onClick={onMenuClick}
          >
            <Menu className="h-5 w-5" />
          </Button>
          
          <div className="flex items-center gap-2">
            <img
              src={portoexLogo}
              alt="PORTOEX"
              className="h-8 w-auto md:h-10"
            />
            <span className="hidden text-lg font-semibold text-foreground md:inline">
              GeRot
            </span>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon-sm" className="text-muted-foreground">
            <Search className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon-sm" className="relative text-muted-foreground">
            <Bell className="h-5 w-5" />
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-primary" />
          </Button>
          <div className="ml-2 h-8 w-8 overflow-hidden rounded-full bg-gradient-primary md:h-9 md:w-9">
            <div className="flex h-full w-full items-center justify-center text-sm font-semibold text-primary-foreground">
              AA
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
