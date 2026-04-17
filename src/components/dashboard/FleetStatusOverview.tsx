import { CheckCircle, Wrench, AlertTriangle } from "lucide-react";
import { Truck } from "lucide-react";

const fleetData = {
  totalVehicles: 45,
  efficiency: 87,
  statuses: [
    { label: "Active", count: 32, percentage: 71, icon: CheckCircle, color: "bg-success" },
    { label: "Maintenance", count: 8, percentage: 18, icon: Wrench, color: "bg-warning" },
    { label: "Available", count: 5, percentage: 11, icon: AlertTriangle, color: "bg-muted" },
  ],
};

export function FleetStatusOverview() {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="mb-6 flex items-center gap-2">
        <Truck className="h-5 w-5 text-card-foreground" />
        <h3 className="text-lg font-semibold text-card-foreground">
          Fleet Status Overview
        </h3>
      </div>

      {/* Summary stats */}
      <div className="mb-6 flex items-center justify-around">
        <div className="text-center">
          <p className="text-3xl font-bold text-card-foreground">
            {fleetData.totalVehicles}
          </p>
          <p className="text-sm text-muted-foreground">Total Vehicles</p>
        </div>
        <div className="text-center">
          <p className="text-3xl font-bold text-success">{fleetData.efficiency}%</p>
          <p className="text-sm text-muted-foreground">Efficiency</p>
        </div>
      </div>

      {/* Status breakdown */}
      <div className="space-y-4">
        {fleetData.statuses.map((status) => (
          <div key={status.label}>
            <div className="mb-1.5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <status.icon className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium text-card-foreground">
                  {status.label}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-card-foreground">
                  {status.count}
                </span>
                <span className="rounded-full bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground">
                  {status.percentage}%
                </span>
              </div>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
              <div
                className={`h-full ${status.color} transition-all duration-500`}
                style={{ width: `${status.percentage}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
