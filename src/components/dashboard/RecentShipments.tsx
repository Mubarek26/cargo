import { Package, Clock, CheckCircle, Truck, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

type ShipmentStatus = "in_transit" | "delivered" | "pending" | "delayed";

interface Shipment {
  id: string;
  trackingNumber: string;
  origin: string;
  destination: string;
  status: ShipmentStatus;
  eta: string;
  customer: string;
}

const shipments: Shipment[] = [
  {
    id: "1",
    trackingNumber: "SHP-2024-00142",
    origin: "New York, NY",
    destination: "Los Angeles, CA",
    status: "in_transit",
    eta: "Dec 15, 2024",
    customer: "Acme Corp",
  },
  {
    id: "2",
    trackingNumber: "SHP-2024-00143",
    origin: "Chicago, IL",
    destination: "Miami, FL",
    status: "delivered",
    eta: "Dec 12, 2024",
    customer: "Tech Solutions",
  },
  {
    id: "3",
    trackingNumber: "SHP-2024-00144",
    origin: "Seattle, WA",
    destination: "Denver, CO",
    status: "pending",
    eta: "Dec 18, 2024",
    customer: "Global Retail",
  },
  {
    id: "4",
    trackingNumber: "SHP-2024-00145",
    origin: "Boston, MA",
    destination: "Atlanta, GA",
    status: "delayed",
    eta: "Dec 17, 2024",
    customer: "Fast Logistics",
  },
  {
    id: "5",
    trackingNumber: "SHP-2024-00146",
    origin: "Dallas, TX",
    destination: "Phoenix, AZ",
    status: "in_transit",
    eta: "Dec 16, 2024",
    customer: "Prime Shipping",
  },
];

const statusConfig: Record<
  ShipmentStatus,
  { label: string; icon: typeof Package; className: string }
> = {
  in_transit: {
    label: "In Transit",
    icon: Truck,
    className: "text-primary bg-primary/10",
  },
  delivered: {
    label: "Delivered",
    icon: CheckCircle,
    className: "text-success bg-success/10",
  },
  pending: {
    label: "Pending",
    icon: Clock,
    className: "text-warning bg-warning/10",
  },
  delayed: {
    label: "Delayed",
    icon: AlertTriangle,
    className: "text-destructive bg-destructive/10",
  },
};

export function RecentShipments() {
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
                Tracking #
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
                ETA
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {shipments.map((shipment) => {
              const status = statusConfig[shipment.status];
              const StatusIcon = status.icon;

              return (
                <tr
                  key={shipment.id}
                  className="hover:bg-secondary/30 transition-colors"
                >
                  <td className="whitespace-nowrap px-5 py-4">
                    <span className="font-medium text-card-foreground">
                      {shipment.trackingNumber}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-5 py-4">
                    <div className="text-sm">
                      <p className="text-card-foreground">{shipment.origin}</p>
                      <p className="text-muted-foreground">→ {shipment.destination}</p>
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
                    {shipment.eta}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
