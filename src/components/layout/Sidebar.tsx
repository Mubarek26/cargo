import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
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
  Building2,
  UserPlus,
  Contact,
  MessageSquare,
  ShoppingCart,
  Calendar,
  User,
  ClipboardCheck,
  ChevronDown,
  ChevronRight,
  Menu,
  X,
  Handshake,
  Briefcase,
  DollarSign,
  TrendingUp,
  Wallet,
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
      { label: "Overview", href: "/home", icon: LayoutDashboard },
      { label: "Live Shipment Map", href: "/dashboard/map", icon: Map },
      { label: "Fleet Status", href: "/dashboard/fleet-status", icon: Truck },
      { label: "Marketplace", href: "/marketplace", icon: Briefcase },
    ],
  },
  {
    title: "Partnerships",
    items: [
      { label: "My Contracts", href: "/vendors/contracts", icon: Handshake },
      { label: "Vendor Contracts", href: "/companies/contracts", icon: Handshake },
    ],
  },
  {
    title: "Shipments",
    items: [
      { label: "All Shipments", href: "/shipments", icon: Package },
      { label: "My Orders", href: "/shipper/orders", icon: Package },
      { label: "Track Shipment", href: "/shipments/track", icon: Navigation },
      { label: "Create Order", href: "/shipments/create", icon: PlusCircle },
      { label: "Delayed Shipments", href: "/shipments/delayed", icon: Clock },
    ],
  },
  {
    title: "Fleet Management",
    items: [
      { label: "Vehicle List", href: "/fleet/vehicles", icon: Car },
      { label: "Maintenance Logs", href: "/fleet/maintenance", icon: Wrench },
      { label: "Driver List", href: "/fleet/drivers", icon: Users },
      { label: "Idle Detection", href: "/fleet/idle", icon: Clock },
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
    title: "Companies",
    items: [
      { label: "Company Directory", href: "/companies", icon: Building2 },
      { label: "Drivers Wallets", href: "/company/drivers/wallets", icon: Wallet },
    ],
  },
  {
    title: "Account",
    items: [
      { label: "Profile", href: "/profile", icon: User },
      { label: "Transactions", href: "/transactions", icon: DollarSign },
    ],
  },
  {
    title: "Administration",
    items: [
      { label: "User Management", href: "/admin/users", icon: Users },
      { label: "Review Applications", href: "/applications", icon: ClipboardCheck },
      { label: "Pricing Config", href: "/admin/pricing-config", icon: DollarSign },
      { label: "Commission Settings", href: "/admin/commission-config", icon: TrendingUp },
    ],
  },
  {
    title: "Orders",
    items: [
      { label: "All Orders", href: "/orders", icon: ShoppingCart },
      { label: "Scheduled Deliveries", href: "/orders/scheduled", icon: Calendar },
    ],
  },
  {
    title: "Driver Portal",
    items: [
      { label: "My Trips", href: "/driver/trips", icon: Truck },
      { label: "My Wallet", href: "/driver/wallet", icon: Wallet },
    ],
  },
];

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  isCollapsed: boolean;
}

const ROLE_RULES: Array<{ prefixes: string[]; roles: string[] }> = [
  {
    prefixes: ["/home"],
    roles: ["SUPER_ADMIN", "COMPANY_ADMIN", "VENDOR"],
  },

  {
    prefixes: ["/marketplace"],
    roles: ["SUPER_ADMIN", "COMPANY_ADMIN", "SHIPPER", "VENDOR", "DRIVER"],
  },
  {
    prefixes: ["/dashboard"],
    roles: ["SUPER_ADMIN", "COMPANY_ADMIN"],
  },
  {
    prefixes: ["/vendors/contracts"],
    roles: ["SUPER_ADMIN", "VENDOR"],
  },
  {
    prefixes: ["/companies/contracts"],
    roles: ["SUPER_ADMIN", "COMPANY_ADMIN"],
  },
  {
    prefixes: ["/shipments"],
    roles: ["SUPER_ADMIN", "COMPANY_ADMIN", "VENDOR"],
  },
  {
    prefixes: ["/shipper/orders", "/shipments/create", "/shipments/track"],
    roles: ["SUPER_ADMIN", "SHIPPER"],
  },
  {
    prefixes: ["/fleet"],
    roles: ["SUPER_ADMIN", "COMPANY_ADMIN"],
  },
  {
    prefixes: ["/vendors", "/clients"],
    roles: ["SUPER_ADMIN"],
  },
  {
    prefixes: ["/orders"],
    roles: ["SUPER_ADMIN", "COMPANY_ADMIN", "VENDOR"],
  },
  {
    prefixes: ["/companies"],
    roles: ["SUPER_ADMIN"],
  },
  {
    prefixes: ["/company/drivers"],
    roles: ["SUPER_ADMIN", "COMPANY_ADMIN"],
  },
  {
    prefixes: ["/profile"],
    roles: ["SUPER_ADMIN", "COMPANY_ADMIN", "SHIPPER", "DRIVER", "VENDOR"],
  },
  {
    prefixes: ["/applications", "/admin"],
    roles: ["SUPER_ADMIN"],
  },
  {
    prefixes: ["/driver"],
    roles: ["DRIVER", "SUPER_ADMIN", "COMPANY_ADMIN"],
  },
  {
    prefixes: ["/transactions"],
    roles: ["SUPER_ADMIN", "COMPANY_ADMIN", "SHIPPER"],
  },
];

const isRouteAllowed = (role: string | null, href: string) => {
  if (!role) return false;
  if (role === "SUPER_ADMIN") return true;

  const rule = ROLE_RULES.find((entry) =>
    entry.prefixes.some((prefix) => href.startsWith(prefix))
  );

  if (!rule) return false;
  return rule.roles.includes(role);
};

export function Sidebar({ isOpen, onToggle, isCollapsed }: SidebarProps) {
  const navigate = useNavigate();
  const [expandedSections, setExpandedSections] = useState<string[]>(
    navigation.map((s) => s.title)
  );
  const userRole = localStorage.getItem("userRole");

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userRole");
    navigate("/login", { replace: true });
  };

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
          "fixed left-0 top-0 z-50 h-full bg-sidebar text-sidebar-foreground transition-all duration-300 ease-in-out lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full",
          isCollapsed ? "w-20" : "w-64"
        )}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/20 transition-all duration-300">
              <Truck className="h-6 w-6 text-primary-foreground" />
            </div>
            {!isCollapsed && (
              <span className="text-xl font-black tracking-tight text-white animate-in fade-in slide-in-from-left-2 duration-300">
                Cargo<span className="text-primary">Dash</span>
              </span>
            )}
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
          {navigation
            .map((section) => ({
              ...section,
              items: section.items.filter((item) =>
                isRouteAllowed(userRole, item.href)
              ),
            }))
            .filter((section) => section.items.length > 0)
            .map((section) => (
              <div key={section.title} className="mb-4">
                {!isCollapsed && (
                  <button
                    onClick={() => toggleSection(section.title)}
                    className="mb-2 flex w-full items-center justify-between text-xs font-semibold uppercase tracking-wider text-sidebar-muted px-2"
                  >
                    {section.title}
                    {expandedSections.includes(section.title) ? (
                      <ChevronDown className="h-3 w-3" />
                    ) : (
                      <ChevronRight className="h-3 w-3" />
                    )}
                  </button>
                )}

                {expandedSections.includes(section.title) && (
                  <ul className="space-y-1">
                    {section.items.map((item) => (
                      <li key={item.href}>
                        <NavLink
                          to={item.href}
                          className={({ isActive }) =>
                            cn(
                              "flex items-center rounded-xl text-sm transition-all duration-200 group",
                              isCollapsed ? "justify-center h-12 w-12 mx-auto mb-2" : "gap-3 px-4 py-2.5 mb-1",
                              isActive
                                ? "bg-primary text-white shadow-lg shadow-primary/25 font-bold"
                                : "text-slate-400 hover:bg-white/5 hover:text-white"
                            )
                          }
                          title={isCollapsed ? item.label : undefined}
                        >
                          <item.icon className={cn("h-5 w-5 shrink-0 transition-transform duration-200 group-hover:scale-110")} />
                          {!isCollapsed && (
                            <span className="truncate animate-in fade-in slide-in-from-left-2 duration-300">
                              {item.label}
                            </span>
                          )}
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          <div className={cn("mt-auto py-6 border-t border-white/5", isCollapsed ? "px-0 flex justify-center" : "px-4")}>
            <button
              type="button"
              onClick={handleLogout}
              className={cn(
                "flex items-center font-semibold text-slate-400 hover:bg-red-500/10 hover:text-red-500 transition-all duration-200 group",
                isCollapsed ? "h-12 w-12 justify-center rounded-xl" : "w-full gap-3 rounded-xl px-4 py-2.5 text-sm"
              )}
              title={isCollapsed ? "Logout Session" : undefined}
            >
              <X className="h-5 w-5 shrink-0 group-hover:rotate-90 transition-transform duration-300" />
              {!isCollapsed && <span>Logout Session</span>}
            </button>
          </div>
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
