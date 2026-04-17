import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Truck, Plus, Search, Filter, CheckCircle, Wrench, AlertTriangle, MoreVertical, Fuel, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const vehicles = [
  { id: "TRK-001", type: "Semi-Truck", model: "Freightliner Cascadia 2022", driver: "John Smith", status: "active", fuel: 85, lastService: "Nov 15, 2024", nextService: "Feb 15, 2025", mileage: "124,500" },
  { id: "TRK-002", type: "Semi-Truck", model: "Kenworth T680 2021", driver: "Sarah Johnson", status: "active", fuel: 62, lastService: "Oct 20, 2024", nextService: "Jan 20, 2025", mileage: "98,200" },
  { id: "TRK-003", type: "Box Truck", model: "Isuzu NPR-HD 2020", driver: "Mike Brown", status: "maintenance", fuel: 45, lastService: "Dec 10, 2024", nextService: "Mar 10, 2025", mileage: "156,800" },
  { id: "TRK-004", type: "Semi-Truck", model: "Peterbilt 579 2023", driver: "Emily Davis", status: "active", fuel: 78, lastService: "Dec 01, 2024", nextService: "Mar 01, 2025", mileage: "87,400" },
  { id: "TRK-005", type: "Van", model: "Ford Transit 2022", driver: "Chris Wilson", status: "available", fuel: 95, lastService: "Nov 25, 2024", nextService: "Feb 25, 2025", mileage: "45,600" },
  { id: "TRK-006", type: "Semi-Truck", model: "Volvo VNL 760 2021", driver: "Lisa Anderson", status: "active", fuel: 33, lastService: "Sep 15, 2024", nextService: "Dec 15, 2024", mileage: "178,900" },
  { id: "TRK-007", type: "Box Truck", model: "Hino 338 2022", driver: "David Martinez", status: "available", fuel: 88, lastService: "Dec 05, 2024", nextService: "Mar 05, 2025", mileage: "67,300" },
  { id: "TRK-008", type: "Semi-Truck", model: "Mack Anthem 2023", driver: "Jennifer Lee", status: "active", fuel: 71, lastService: "Nov 10, 2024", nextService: "Feb 10, 2025", mileage: "52,100" },
];

const statusConfig = {
  active: { label: "Active", icon: CheckCircle, className: "text-success bg-success/10" },
  maintenance: { label: "Maintenance", icon: Wrench, className: "text-warning bg-warning/10" },
  available: { label: "Available", icon: Truck, className: "text-primary bg-primary/10" },
};

export default function VehicleList() {
  return (
    <DashboardLayout>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Vehicle List</h1>
          <p className="text-muted-foreground">Manage your fleet vehicles</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Vehicle
        </Button>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col gap-4 rounded-xl border border-border bg-card p-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search vehicles..." className="pl-10" />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Filters
          </Button>
          <Button variant="outline" size="sm">All Types</Button>
          <Button variant="outline" size="sm">All Status</Button>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-secondary/50">
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Vehicle</th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Driver</th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Status</th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Fuel</th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Mileage</th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Next Service</th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {vehicles.map((vehicle) => {
                const status = statusConfig[vehicle.status as keyof typeof statusConfig];
                const StatusIcon = status.icon;

                return (
                  <tr key={vehicle.id} className="hover:bg-secondary/30 transition-colors">
                    <td className="whitespace-nowrap px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                          <Truck className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-card-foreground">{vehicle.id}</p>
                          <p className="text-xs text-muted-foreground">{vehicle.model}</p>
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 text-sm text-card-foreground">{vehicle.driver}</td>
                    <td className="whitespace-nowrap px-5 py-4">
                      <Badge className={cn("gap-1", status.className)}>
                        <StatusIcon className="h-3 w-3" />
                        {status.label}
                      </Badge>
                    </td>
                    <td className="whitespace-nowrap px-5 py-4">
                      <div className="flex items-center gap-2">
                        <Fuel className={cn("h-4 w-4", vehicle.fuel < 40 ? "text-destructive" : "text-muted-foreground")} />
                        <span className={cn("text-sm font-medium", vehicle.fuel < 40 ? "text-destructive" : "text-card-foreground")}>
                          {vehicle.fuel}%
                        </span>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 text-sm text-muted-foreground">{vehicle.mileage} mi</td>
                    <td className="whitespace-nowrap px-5 py-4">
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">{vehicle.nextService}</span>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-5 py-4">
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
