import { Bell, Globe, Search, Sun, Moon, PanelLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import * as React from "react";
import { useCheckAuth } from "@/hooks/use-check-auth";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { SidebarToggle } from "./Sidebar";

interface HeaderProps {
  onSidebarToggle: () => void;
  isCollapsed: boolean;
  onCollapseToggle: () => void;
}

export function Header({ onSidebarToggle, isCollapsed, onCollapseToggle }: HeaderProps) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userRole");
    navigate("/login", { replace: true });
  };

  const { checkAuth } = useCheckAuth();
  const [user, setUser] = React.useState<any>(null);

  React.useEffect(() => {
    const loadUser = async () => {
      const result = await checkAuth();
      if (result.isAuthenticated) {
        setUser(result.data?.data?.user || result.data?.user);
      }
    };
    loadUser();
  }, [checkAuth]);

  const handleProfile = () => {
    navigate("/profile");
  };

  const handleSettings = () => {
    toast.info("Settings page coming soon.");
  };

  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-white/10 bg-white/80 backdrop-blur-xl px-6 lg:px-8">
      <div className="flex items-center gap-6">
        <SidebarToggle onToggle={onSidebarToggle} />
        
        <Button 
          variant="ghost" 
          size="icon" 
          className="hidden lg:flex hover:bg-slate-100 rounded-xl transition-colors"
          onClick={onCollapseToggle}
        >
          <PanelLeft className={cn("h-5 w-5 text-slate-600 transition-transform duration-300", isCollapsed && "rotate-180")} />
        </Button>
        
        {/* Search */}
        <div className="relative hidden lg:block group">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" />
          <Input
            type="search"
            placeholder="Search shipments, fleet, or records..."
            className="w-96 pl-12 h-11 bg-slate-50 border-slate-200 focus:bg-white focus:ring-primary/20 rounded-xl transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Theme toggle placeholder */}
        <Button variant="ghost" size="icon" className="hidden sm:flex hover:bg-slate-100 rounded-xl transition-colors">
          <Sun className="h-5 w-5 text-slate-600" />
        </Button>

        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative hover:bg-slate-100 rounded-xl transition-colors">
          <Bell className="h-5 w-5 text-slate-600" />
          <span className="absolute right-2 top-2 flex h-2.5 w-2.5 items-center justify-center rounded-full bg-primary ring-2 ring-white"></span>
        </Button>

        {/* Language */}
        <Button variant="ghost" size="icon" className="hidden sm:flex">
          <Globe className="h-5 w-5" />
        </Button>

        {/* Profile */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button type="button" className="rounded-full">
              <Avatar className="h-9 w-9 cursor-pointer border border-border">
                <AvatarImage src={user?.photo} alt={user?.fullName} />
                <AvatarFallback className="bg-primary/10 text-primary text-xs">
                  {user?.fullName?.split(' ').map((n: string) => n[0]).join('').toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem onClick={handleProfile}>Profile</DropdownMenuItem>
            <DropdownMenuItem onClick={handleSettings}>Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
