import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getDashboardStats } from "@/services/analyticsService";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { ShipmentTrendsChart } from "@/components/dashboard/ShipmentTrendsChart";
import { FleetStatusOverview } from "@/components/dashboard/FleetStatusOverview";
import { RecentShipments } from "@/components/dashboard/RecentShipments";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import {
  Package,
  CheckCircle,
  Clock,
  DollarSign,
  Truck,
  Users,
  AlertTriangle,
  Plus,
  Calendar as CalendarIcon,
  XCircle,
  Ban,
} from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const Index = () => {
  const [timeRange, setTimeRange] = useState("30d");
  const [date, setDate] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined,
  });

  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ["dashboardStats", timeRange, date.from, date.to],
    queryFn: () => getDashboardStats({
      timeRange: timeRange === "custom" ? undefined : timeRange,
      startDate: date.from?.toISOString(),
      endDate: date.to?.toISOString(),
    }),
  });

  const stats = [
    {
      title: "Active Shipments",
      value: dashboardData?.stats?.activeShipments?.toString() || "0",
      subtitle: "Currently in transit",
      icon: <Package className="h-5 w-5 text-primary" />,
      iconBgColor: "bg-primary/10",
      trend: { value: "+12%", isPositive: true },
    },
    {
      title: "Pending Orders",
      value: dashboardData?.stats?.pendingOrders?.toString() || "0",
      subtitle: "Awaiting processing",
      icon: <Clock className="h-5 w-5 text-warning" />,
      iconBgColor: "bg-warning/10",
      trend: { value: "-5%", isPositive: false },
    },
    {
      title: "Completed Orders",
      value: dashboardData?.stats?.completedOrders?.toString() || "0",
      subtitle: "Successfully delivered",
      icon: <CheckCircle className="h-5 w-5 text-success" />,
      iconBgColor: "bg-success/10",
      trend: { value: "+18%", isPositive: true },
    },
    {
      title: "Total Revenue",
      value: dashboardData?.stats?.revenue ? `ETB ${dashboardData.stats.revenue.toLocaleString()}` : "ETB 0",
      subtitle: "Selected period",
      icon: <DollarSign className="h-5 w-5 text-success" />,
      iconBgColor: "bg-success/10",
      trend: { value: "+15%", isPositive: true },
    },
  ];

  const stats2 = [
    {
      title: "Rejected Orders",
      value: dashboardData?.stats?.rejectedOrders?.toString() || "0",
      subtitle: "Orders turned down",
      icon: <XCircle className="h-5 w-5 text-destructive" />,
      iconBgColor: "bg-destructive/10",
      trend: { value: "-2%", isPositive: true },
    },
    {
      title: "Cancelled Orders",
      value: dashboardData?.stats?.cancelledOrders?.toString() || "0",
      subtitle: "Withdrawn shipments",
      icon: <Ban className="h-5 w-5 text-muted-foreground" />,
      iconBgColor: "bg-muted",
      trend: { value: "0%", isPositive: true },
    },
    {
      title: "Fleet Utilization",
      value: `${dashboardData?.stats?.fleetUtilization || 0}%`,
      subtitle: "Vehicle efficiency",
      icon: <Truck className="h-5 w-5 text-primary" />,
      iconBgColor: "bg-primary/10",
      trend: { value: "+3%", isPositive: true },
    },
    {
      title: "Delayed Shipments",
      value: dashboardData?.stats?.delayedShipments?.toString() || "0",
      subtitle: "Requiring attention",
      icon: <AlertTriangle className="h-5 w-5 text-destructive" />,
      iconBgColor: "bg-destructive/10",
      trend: { value: "-12%", isPositive: true },
    },
  ];

  const navigate = useNavigate();

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
        <div className="flex flex-wrap items-center gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Select range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
              <SelectItem value="custom">Custom Range</SelectItem>
            </SelectContent>
          </Select>

          {timeRange === "custom" && (
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-[240px] justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date?.from ? (
                    date.to ? (
                      <>
                        {format(date.from, "LLL dd, y")} -{" "}
                        {format(date.to, "LLL dd, y")}
                      </>
                    ) : (
                      format(date.from, "LLL dd, y")
                    )
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={date?.from}
                  selected={{ from: date.from, to: date.to }}
                  onSelect={(range: any) => setDate(range || { from: undefined, to: undefined })}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
          )}

          <Button variant="outline" onClick={() => navigate("/fleet/vehicles")}>
            <Plus className="mr-2 h-4 w-4" />
            Add Vehicle
          </Button>
          <Button onClick={() => navigate("/shipments/create")}>
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
          <ShipmentTrendsChart data={dashboardData?.chartData} />
        </div>
        <div>
          <FleetStatusOverview />
        </div>
      </div>

      {/* Recent shipments table */}
      <RecentShipments data={dashboardData?.recentOrders} />
    </DashboardLayout>
  );
};

export default Index;
