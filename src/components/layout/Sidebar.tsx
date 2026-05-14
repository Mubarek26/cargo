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
import { useTranslation } from "react-i18next";

type NavSection = {
  id: string;
  titleKey: string;
  items: {
    labelKey: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
  }[];
};

const navigation: NavSection[] = [
  {
    id: "dashboard",
    titleKey: "nav:sections.dashboard",
    items: [
      { labelKey: "nav:items.overview", href: "/home", icon: LayoutDashboard },
      { labelKey: "nav:items.liveShipmentMap", href: "/dashboard/map", icon: Map },
      { labelKey: "nav:items.fleetStatus", href: "/dashboard/fleet-status", icon: Truck },
      { labelKey: "nav:items.marketplace", href: "/marketplace", icon: Briefcase },
    ],
  },
  {
    id: "analytics",
    titleKey: "nav:sections.analytics",
    items: [
      { labelKey: "nav:items.analyticsReporting", href: "/analytics", icon: TrendingUp },
    ],
  },
  {
    id: "partnerships",
    titleKey: "nav:sections.partnerships",
    items: [
      { labelKey: "nav:items.myContracts", href: "/vendors/contracts", icon: Handshake },
      { labelKey: "nav:items.vendorContracts", href: "/companies/contracts", icon: Handshake },
    ],
  },
  {
    id: "shipments",
    titleKey: "nav:sections.shipments",
    items: [
      { labelKey: "nav:items.allShipments", href: "/shipments", icon: Package },
      { labelKey: "nav:items.myOrders", href: "/shipper/orders", icon: Package },
      { labelKey: "nav:items.trackShipment", href: "/shipments/track", icon: Navigation },
      { labelKey: "nav:items.createOrder", href: "/shipments/create", icon: PlusCircle },
      { labelKey: "nav:items.delayedShipments", href: "/shipments/delayed", icon: Clock },
    ],
  },
  {
    id: "fleetManagement",
    titleKey: "nav:sections.fleetManagement",
    items: [
      { labelKey: "nav:items.vehicleList", href: "/fleet/vehicles", icon: Car },
      { labelKey: "nav:items.maintenanceLogs", href: "/fleet/maintenance", icon: Wrench },
      { labelKey: "nav:items.driverList", href: "/fleet/drivers", icon: Users },
      { labelKey: "nav:items.idleDetection", href: "/fleet/idle", icon: Clock },
    ],
  },
  {
    id: "vendorsClients",
    titleKey: "nav:sections.vendorsClients",
    items: [
      { labelKey: "nav:items.vendorDirectory", href: "/vendors", icon: Building2 },
      { labelKey: "nav:items.addVendor", href: "/vendors/add", icon: UserPlus },
      { labelKey: "nav:items.clientsList", href: "/clients", icon: Contact },
      { labelKey: "nav:items.clientFeedback", href: "/clients/feedback", icon: MessageSquare },
    ],
  },
  {
    id: "companies",
    titleKey: "nav:sections.companies",
    items: [
      { labelKey: "nav:items.companyDirectory", href: "/companies", icon: Building2 },
      { labelKey: "nav:items.driversWallets", href: "/company/drivers/wallets", icon: Wallet },
    ],
  },
  {
    id: "account",
    titleKey: "nav:sections.account",
    items: [
      { labelKey: "nav:items.profile", href: "/profile", icon: User },
      { labelKey: "nav:items.messages", href: "/chat", icon: MessageSquare },
      { labelKey: "nav:items.transactions", href: "/transactions", icon: DollarSign },
    ],
  },
  {
    id: "administration",
    titleKey: "nav:sections.administration",
    items: [
      { labelKey: "nav:items.userManagement", href: "/admin/users", icon: Users },
      { labelKey: "nav:items.rolesPermissions", href: "/admin/roles", icon: Users },
      { labelKey: "nav:items.permissions", href: "/admin/permissions", icon: ClipboardCheck },
      { labelKey: "nav:items.reviewApplications", href: "/applications", icon: ClipboardCheck },
      { labelKey: "nav:items.pricingConfig", href: "/admin/pricing-config", icon: DollarSign },
      { labelKey: "nav:items.commissionSettings", href: "/admin/commission-config", icon: TrendingUp },
    ],
  },
  {
    id: "orders",
    titleKey: "nav:sections.orders",
    items: [
      { labelKey: "nav:items.allOrders", href: "/orders", icon: ShoppingCart },
    ],
  },
  {
    id: "driverPortal",
    titleKey: "nav:sections.driverPortal",
    items: [
      { labelKey: "nav:items.myTrips", href: "/driver/trips", icon: Truck },
      { labelKey: "nav:items.myWallet", href: "/driver/wallet", icon: Wallet },
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
    prefixes: ["/profile", "/chat"],
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
    roles: ["SUPER_ADMIN", "COMPANY_ADMIN", "SHIPPER", ],
  },
  
  {
    prefixes: ["/analytics"],
    roles: ["SUPER_ADMIN", "COMPANY_ADMIN", "VENDOR"],
  },
];

const isRouteAllowed = (role: string | null, href: string) => {
  if (!role) return false;
  if (role === "SUPER_ADMIN") return true;

  // Special check for Marketplace and Drivers
  if (href.startsWith("/marketplace") && role === "DRIVER") {
    const isPrivate = localStorage.getItem("isPrivateTransporter") === "true";
    if (!isPrivate) return false;
  }

  const rule = ROLE_RULES.find((entry) =>
    entry.prefixes.some((prefix) => href.startsWith(prefix))
  );

  if (!rule) return false;
  return rule.roles.includes(role);
};


export function Sidebar({ isOpen, onToggle, isCollapsed }: SidebarProps) {
  const { t } = useTranslation("nav");
  const navigate = useNavigate();
  const [expandedSections, setExpandedSections] = useState<string[]>(() =>
    navigation.map((s) => s.id)
  );
  const userRole = localStorage.getItem("userRole");

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userRole");
    navigate("/login", { replace: true });
  };

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) =>
      prev.includes(sectionId)
        ? prev.filter((s) => s !== sectionId)
        : [...prev, sectionId]
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
          "fixed left-0 top-0 z-50 h-full bg-sidebar text-sidebar-foreground transition-all duration-300 ease-in-out lg:translate-x-0 shadow-[0_20px_60px_rgba(2,8,23,0.35)]",
          isOpen ? "translate-x-0" : "-translate-x-full",
          isCollapsed ? "w-20" : "w-64"
        )}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between border-b border-white/10 px-4">
          <div className="flex items-center gap-3 group">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/95 shadow-[0_10px_30px_rgba(15,23,42,0.3)] transition-all duration-300 group-hover:rotate-3 overflow-hidden ring-1 ring-white/20">
              <img src="/favicon.png" alt="CargoMax Logo" className="h-full w-full object-contain p-1" />
            </div>
            {!isCollapsed && (
              <span className="text-lg font-black tracking-[0.04em] text-white animate-in fade-in slide-in-from-left-2 duration-300">
                Cargo<span className="text-primary">Max</span>
              </span>
            )}
          </div>
          <button
            onClick={onToggle}
            className="rounded-lg p-1.5 hover:bg-white/10 lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="h-[calc(100%-4rem)] overflow-y-auto p-4 space-y-3">
          {navigation
            .map((section) => ({
              ...section,
              items: section.items.filter((item) =>
                isRouteAllowed(userRole, item.href)
              ),
            }))
            .filter((section) => section.items.length > 0)
            .map((section) => (
              <div key={section.id} className="">
                {!isCollapsed && (
                  <button
                    onClick={() => toggleSection(section.id)}
                    className="mb-2 flex w-full items-center justify-between text-[11px] font-semibold uppercase tracking-[0.2em] text-white/50 px-2"
                  >
                    {t(section.titleKey)}
                    {expandedSections.includes(section.id) ? (
                      <ChevronDown className="h-3 w-3" />
                    ) : (
                      <ChevronRight className="h-3 w-3" />
                    )}
                  </button>
                )}

                {expandedSections.includes(section.id) && (
                  <ul className="space-y-1">
                    {section.items.map((item) => (
                      <li key={item.href}>
                        <NavLink
                          to={item.href}
                          className={({ isActive }) =>
                            cn(
                              "flex items-center rounded-xl text-sm transition-all duration-200 group relative overflow-hidden",
                              isCollapsed ? "justify-center h-12 w-12 mx-auto mb-2" : "gap-3 px-3 py-2.5 mb-1",
                              isActive
                                ? "bg-gradient-to-r from-primary/90 to-primary text-white shadow-[0_12px_30px_rgba(249,115,22,0.3)] font-semibold"
                                : "text-white/70 hover:bg-white/8 hover:text-white"
                            )
                          }
                          title={isCollapsed ? t(item.labelKey) : undefined}
                        >
                          <item.icon className={cn("h-5 w-5 shrink-0 transition-transform duration-200 group-hover:scale-105")} />
                          {!isCollapsed && (
                            <span className="truncate animate-in fade-in slide-in-from-left-2 duration-300">
                              {t(item.labelKey)}
                            </span>
                          )}
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          <div className={cn("mt-auto py-6 border-t border-white/10", isCollapsed ? "px-0 flex justify-center" : "px-3")}>
            <button
              type="button"
              onClick={handleLogout}
              className={cn(
                "flex items-center font-semibold text-white/60 hover:bg-red-500/15 hover:text-red-400 transition-all duration-200 group",
                isCollapsed ? "h-12 w-12 justify-center rounded-xl" : "w-full gap-3 rounded-xl px-3 py-2.5 text-sm"
              )}
              title={isCollapsed ? t("nav:logoutSession") : undefined}
            >
              <X className="h-5 w-5 shrink-0 group-hover:rotate-90 transition-transform duration-300" />
              {!isCollapsed && <span>{t("nav:logoutSession")}</span>}
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
