import { useState } from "react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { useNotifications } from "@/hooks/useNotifications";
import { cn } from "@/lib/utils";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  // Initialize real-time notifications
  useNotifications();

  return (
    <div className="min-h-screen bg-background">
      <Sidebar 
        isOpen={sidebarOpen} 
        onToggle={() => setSidebarOpen(false)} 
        isCollapsed={isCollapsed}
      />
      
      <div className={cn(
        "transition-all duration-300 ease-in-out",
        isCollapsed ? "lg:pl-20" : "lg:pl-64"
      )}>
        <Header 
          onSidebarToggle={() => setSidebarOpen(true)} 
          isCollapsed={isCollapsed}
          onCollapseToggle={() => setIsCollapsed(!isCollapsed)}
        />
        <main className="p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}
