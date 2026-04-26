import { Package, Clock, CheckCircle, Truck, AlertTriangle, XCircle, MapPin, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

type ShipmentStatus = 
  | "pending" | "accepted" | "rejected" | "open" | "matched" | "assigned" 
  | "in_transit" | "arrived" | "delivered" | "completed" | "cancelled" | "delayed";

interface Shipment {
  id: string;
  orderNumber: string;
  origin: string;
  destination: string;
  status: string;
  createdAt: string;
  customer: string;
}

const statusConfig: Record<
  string,
  { label: string; icon: any; className: string }
> = {
  pending: {
    label: "Pending",
    icon: Clock,
    className: "text-warning bg-warning/10",
  },
  accepted: {
    label: "Accepted",
    icon: CheckCircle,
    className: "text-info bg-info/10",
  },
  rejected: {
    label: "Rejected",
    icon: XCircle,
    className: "text-destructive bg-destructive/10",
  },
  open: {
    label: "Open",
    icon: Package,
    className: "text-primary bg-primary/10",
  },
  matched: {
    label: "Matched",
    icon: Users,
    className: "text-chart-2 bg-chart-2/10",
  },
  assigned: {
    label: "Assigned",
    icon: Truck,
    className: "text-primary bg-primary/10",
  },
  in_transit: {
    label: "In Transit",
    icon: Truck,
    className: "text-primary bg-primary/10",
  },
  arrived: {
    label: "Arrived",
    icon: MapPin,
    className: "text-success bg-success/10",
  },
  delivered: {
    label: "Delivered",
    icon: CheckCircle,
    className: "text-success bg-success/10",
  },
  completed: {
    label: "Completed",
    icon: CheckCircle,
    className: "text-success bg-success/10",
  },
  cancelled: {
    label: "Cancelled",
    icon: XCircle,
    className: "text-muted-foreground bg-muted",
  },
  delayed: {
    label: "Delayed",
    icon: AlertTriangle,
    className: "text-destructive bg-destructive/10",
  },
};

export function RecentShipments({ data }: { data?: Shipment[] }) {
  const displayShipments = data || [];

  return (
    <div className="rounded-xl border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border p-5">
        <div>
          <h3 className="text-lg font-semibold text-card-foreground">
            Recent Shipments
          </h3>
          <p className="text-sm text-muted-foreground">
            Latest shipment activities
          </p>
        </div>
        <button className="text-sm font-medium text-primary hover:underline">
          View All
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-secondary/50">
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Order #
              </th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Route
              </th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Customer
              </th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Status
              </th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Created At
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {displayShipments.length > 0 ? (
              displayShipments.map((shipment) => {
                const statusKey = shipment.status.toLowerCase();
                const status = statusConfig[statusKey] || statusConfig.pending;
                const StatusIcon = status.icon;

                return (
                  <tr
                    key={shipment.id}
                    className="hover:bg-secondary/30 transition-colors"
                  >
                    <td className="whitespace-nowrap px-5 py-4">
                      <span className="font-medium text-card-foreground">
                        {shipment.orderNumber}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-5 py-4">
                      <div className="text-sm">
                        <p className="text-card-foreground truncate max-w-[200px]" title={shipment.origin}>
                          {shipment.origin}
                        </p>
                        <p className="text-muted-foreground truncate max-w-[200px]" title={shipment.destination}>
                          → {shipment.destination}
                        </p>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 text-sm text-card-foreground">
                      {shipment.customer}
                    </td>
                    <td className="whitespace-nowrap px-5 py-4">
                      <span
                        className={cn(
                          "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
                          status.className
                        )}
                      >
                        <StatusIcon className="h-3 w-3" />
                        {status.label}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 text-sm text-muted-foreground">
                      {format(new Date(shipment.createdAt), "MMM dd, yyyy")}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={5} className="px-5 py-10 text-center text-muted-foreground">
                  No recent shipments found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
