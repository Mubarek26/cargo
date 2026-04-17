import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Truck, CheckCircle, Wrench, AlertTriangle, Fuel, MapPin } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const vehicles = [
  { id: "TRK-001", type: "Semi-Truck", driver: "John Smith", status: "active", fuel: 85, location: "Route I-70, Denver", mileage: "124,500 mi" },
  { id: "TRK-002", type: "Semi-Truck", driver: "Sarah Johnson", status: "active", fuel: 62, location: "Route I-40, Phoenix", mileage: "98,200 mi" },
  { id: "TRK-003", type: "Box Truck", driver: "Mike Brown", status: "maintenance", fuel: 45, location: "Depot A", mileage: "156,800 mi" },
  { id: "TRK-004", type: "Semi-Truck", driver: "Emily Davis", status: "active", fuel: 78, location: "Route I-15, Salt Lake", mileage: "87,400 mi" },
  { id: "TRK-005", type: "Van", driver: "Chris Wilson", status: "available", fuel: 95, location: "Depot B", mileage: "45,600 mi" },
  { id: "TRK-006", type: "Semi-Truck", driver: "Lisa Anderson", status: "active", fuel: 33, location: "Route I-25, Albuquerque", mileage: "178,900 mi" },
];

const statusConfig = {
  active: { label: "Active", icon: CheckCircle, className: "text-success bg-success/10" },
  maintenance: { label: "Maintenance", icon: Wrench, className: "text-warning bg-warning/10" },
  available: { label: "Available", icon: Truck, className: "text-primary bg-primary/10" },
};

export default function FleetStatus() {
  const activeCount = vehicles.filter(v => v.status === "active").length;
  const maintenanceCount = vehicles.filter(v => v.status === "maintenance").length;
  const availableCount = vehicles.filter(v => v.status === "available").length;

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Fleet Status</h1>
        <p className="text-muted-foreground">Monitor your fleet in real-time</p>
      </div>

      {/* Summary cards */}
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-success/10 p-2.5">
              <CheckCircle className="h-5 w-5 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold text-card-foreground">{activeCount}</p>
              <p className="text-sm text-muted-foreground">Active Vehicles</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-warning/10 p-2.5">
              <Wrench className="h-5 w-5 text-warning" />
            </div>
            <div>
              <p className="text-2xl font-bold text-card-foreground">{maintenanceCount}</p>
              <p className="text-sm text-muted-foreground">In Maintenance</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-primary/10 p-2.5">
              <Truck className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-card-foreground">{availableCount}</p>
              <p className="text-sm text-muted-foreground">Available</p>
            </div>
          </div>
        </div>
      </div>

      {/* Vehicle grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {vehicles.map((vehicle) => {
          const status = statusConfig[vehicle.status as keyof typeof statusConfig];
          const StatusIcon = status.icon;

          return (
            <div key={vehicle.id} className="rounded-xl border border-border bg-card p-5 stat-card-hover">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-card-foreground">{vehicle.id}</h3>
                  <p className="text-sm text-muted-foreground">{vehicle.type}</p>
                </div>
                <Badge className={cn("gap-1", status.className)}>
                  <StatusIcon className="h-3 w-3" />
                  {status.label}
                </Badge>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Truck className="h-4 w-4 text-muted-foreground" />
                  <span className="text-card-foreground">{vehicle.driver}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">{vehicle.location}</span>
                </div>
                <div>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <Fuel className="h-4 w-4" /> Fuel Level
                    </span>
                    <span className={cn("font-medium", vehicle.fuel < 40 ? "text-destructive" : "text-card-foreground")}>
                      {vehicle.fuel}%
                    </span>
                  </div>
                  <Progress value={vehicle.fuel} className="h-2" />
                </div>
                <p className="text-xs text-muted-foreground">Mileage: {vehicle.mileage}</p>
              </div>
            </div>
          );
        })}
      </div>
    </DashboardLayout>
  );
}
