import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Map,
  Truck,
  Package,
  Navigation,
  PlusCircle,
  Clock,
  Car,
  Wrench,
  Users,
  Warehouse,
  Boxes,
  RefreshCw,
  Building2,
  UserPlus,
  Contact,
  MessageSquare,
  ShoppingCart,
  Calendar,
  ChevronDown,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

type NavSection = {
  title: string;
  items: {
    label: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
  }[];
};

const navigation: NavSection[] = [
  {
    title: "Dashboard",
    items: [
      { label: "Overview", href: "/", icon: LayoutDashboard },
      { label: "Live Shipment Map", href: "/dashboard/map", icon: Map },
      { label: "Fleet Status", href: "/dashboard/fleet-status", icon: Truck },
    ],
  },
  {
    title: "Shipments",
    items: [
      { label: "All Shipments", href: "/shipments", icon: Package },
      { label: "Track Shipment", href: "/shipments/track", icon: Navigation },
      { label: "Create Shipment", href: "/shipments/create", icon: PlusCircle },
      { label: "Delayed Shipments", href: "/shipments/delayed", icon: Clock },
    ],
  },
  {
    title: "Fleet Management",
    items: [
      { label: "Vehicle List", href: "/fleet/vehicles", icon: Car },
      { label: "Maintenance Logs", href: "/fleet/maintenance", icon: Wrench },
      { label: "Driver Assignments", href: "/fleet/drivers", icon: Users },
    ],
  },
  {
    title: "Warehouses",
    items: [
      { label: "Warehouse Locations", href: "/warehouses", icon: Warehouse },
      { label: "Inventory Levels", href: "/warehouses/inventory", icon: Boxes },
      { label: "Restock Requests", href: "/warehouses/restock", icon: RefreshCw },
    ],
  },
  {
    title: "Vendors & Clients",
    items: [
      { label: "Vendor Directory", href: "/vendors", icon: Building2 },
      { label: "Add Vendor", href: "/vendors/add", icon: UserPlus },
      { label: "Clients List", href: "/clients", icon: Contact },
      { label: "Client Feedback", href: "/clients/feedback", icon: MessageSquare },
    ],
  },
  {
    title: "Orders",
    items: [
      { label: "All Orders", href: "/orders", icon: ShoppingCart },
      { label: "Scheduled Deliveries", href: "/orders/scheduled", icon: Calendar },
    ],
  },
];

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

export function Sidebar({ isOpen, onToggle }: SidebarProps) {
  const [expandedSections, setExpandedSections] = useState<string[]>(
    navigation.map((s) => s.title)
  );

  const toggleSection = (title: string) => {
    setExpandedSections((prev) =>
      prev.includes(title)
        ? prev.filter((s) => s !== title)
        : [...prev, title]
    );
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-foreground/50 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-50 h-full w-64 bg-sidebar text-sidebar-foreground transition-transform duration-300 lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Package className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold text-sidebar-accent-foreground">
              CargoMax
            </span>
          </div>
          <button
            onClick={onToggle}
            className="rounded-lg p-1.5 hover:bg-sidebar-accent lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="h-[calc(100%-4rem)] overflow-y-auto p-4">
          {navigation.map((section) => (
            <div key={section.title} className="mb-4">
              <button
                onClick={() => toggleSection(section.title)}
                className="mb-2 flex w-full items-center justify-between text-xs font-semibold uppercase tracking-wider text-sidebar-muted"
              >
                {section.title}
                {expandedSections.includes(section.title) ? (
                  <ChevronDown className="h-3 w-3" />
                ) : (
                  <ChevronRight className="h-3 w-3" />
                )}
              </button>

              {expandedSections.includes(section.title) && (
                <ul className="space-y-1">
                  {section.items.map((item) => (
                    <li key={item.href}>
                      <NavLink
                        to={item.href}
                        className={({ isActive }) =>
                          cn(
                            "flex items-center gap-3 rounded-lg px-3 py-2 text-sm sidebar-transition",
                            isActive
                              ? "bg-sidebar-accent text-sidebar-accent-foreground"
                              : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                          )
                        }
                      >
                        <item.icon className="h-4 w-4" />
                        {item.label}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </nav>
      </aside>
    </>
  );
}

export function SidebarToggle({ onToggle }: { onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className="rounded-lg p-2 hover:bg-secondary lg:hidden"
    >
      <Menu className="h-5 w-5" />
    </button>
  );
}
