import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { ShipmentTrendsChart } from "@/components/dashboard/ShipmentTrendsChart";
import { FleetStatusOverview } from "@/components/dashboard/FleetStatusOverview";
import { RecentShipments } from "@/components/dashboard/RecentShipments";
import { Button } from "@/components/ui/button";
import {
  Package,
  CheckCircle,
  Clock,
  DollarSign,
  Truck,
  Users,
  Warehouse,
  AlertTriangle,
  Plus,
} from "lucide-react";

const stats = [
  {
    title: "Active Shipments",
    value: "42",
    subtitle: "Currently in transit",
    icon: <Package className="h-5 w-5 text-primary" />,
    iconBgColor: "bg-primary/10",
    trend: { value: "+12%", isPositive: true },
  },
  {
    title: "Delivered Today",
    value: "28",
    subtitle: "Successful deliveries",
    icon: <CheckCircle className="h-5 w-5 text-success" />,
    iconBgColor: "bg-success/10",
    trend: { value: "+8%", isPositive: true },
  },
  {
    title: "Pending Orders",
    value: "156",
    subtitle: "Awaiting processing",
    icon: <Clock className="h-5 w-5 text-warning" />,
    iconBgColor: "bg-warning/10",
    trend: { value: "-5%", isPositive: false },
  },
  {
    title: "Revenue (MTD)",
    value: "$284,590",
    subtitle: "Month to date",
    icon: <DollarSign className="h-5 w-5 text-success" />,
    iconBgColor: "bg-success/10",
    trend: { value: "+15%", isPositive: true },
  },
];

const stats2 = [
  {
    title: "Fleet Utilization",
    value: "87%",
    subtitle: "Vehicle efficiency",
    icon: <Truck className="h-5 w-5 text-primary" />,
    iconBgColor: "bg-primary/10",
    trend: { value: "+3%", isPositive: true },
  },
  {
    title: "Active Clients",
    value: "1,247",
    subtitle: "Total active clients",
    icon: <Users className="h-5 w-5 text-chart-2" />,
    iconBgColor: "bg-chart-2/10",
    trend: { value: "+23%", isPositive: true },
  },
  {
    title: "Warehouse Capacity",
    value: "73%",
    subtitle: "Average utilization",
    icon: <Warehouse className="h-5 w-5 text-warning" />,
    iconBgColor: "bg-warning/10",
    trend: { value: "-2%", isPositive: false },
  },
  {
    title: "Delayed Shipments",
    value: "7",
    subtitle: "Requiring attention",
    icon: <AlertTriangle className="h-5 w-5 text-destructive" />,
    iconBgColor: "bg-destructive/10",
    trend: { value: "-12%", isPositive: true },
  },
];

const Index = () => {
  return (
    <DashboardLayout>
      {/* Page header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Dashboard Overview
          </h1>
          <p className="text-muted-foreground">
            Welcome back! Here's what's happening with your logistics operations.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Plus className="mr-2 h-4 w-4" />
            Add Vehicle
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Shipment
          </Button>
        </div>
      </div>

      {/* Stats row 1 */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <div
            key={stat.title}
            className="animate-fade-in"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <StatCard {...stat} />
          </div>
        ))}
      </div>

      {/* Stats row 2 */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats2.map((stat, index) => (
          <div
            key={stat.title}
            className="animate-fade-in"
            style={{ animationDelay: `${(index + 4) * 100}ms` }}
          >
            <StatCard {...stat} />
          </div>
        ))}
      </div>

      {/* Charts section */}
      <div className="mb-6 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ShipmentTrendsChart />
        </div>
        <div>
          <FleetStatusOverview />
        </div>
      </div>

      {/* Recent shipments table */}
      <RecentShipments />
    </DashboardLayout>
  );
};

export default Index;
