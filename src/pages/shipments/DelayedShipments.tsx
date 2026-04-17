import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { AlertTriangle, Package, Clock, MapPin, Phone, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const delayedShipments = [
  { id: "SHP-2024-00145", origin: "Boston, MA", destination: "Atlanta, GA", customer: "Fast Logistics", delay: "2 days", reason: "Weather conditions", driver: "Mike Brown", phone: "+1 (555) 123-4567", lastUpdate: "Dec 13, 2024 - 10:30 AM" },
  { id: "SHP-2024-00151", origin: "Seattle, WA", destination: "San Diego, CA", customer: "Pacific Trade", delay: "1 day", reason: "Vehicle maintenance", driver: "Sarah Johnson", phone: "+1 (555) 234-5678", lastUpdate: "Dec 13, 2024 - 08:15 AM" },
  { id: "SHP-2024-00153", origin: "Minneapolis, MN", destination: "Kansas City, MO", customer: "Midwest Corp", delay: "3 days", reason: "Traffic congestion", driver: "Chris Wilson", phone: "+1 (555) 345-6789", lastUpdate: "Dec 12, 2024 - 04:45 PM" },
  { id: "SHP-2024-00157", origin: "Detroit, MI", destination: "Cleveland, OH", customer: "Auto Parts Inc", delay: "1 day", reason: "Customs clearance", driver: "Emily Davis", phone: "+1 (555) 456-7890", lastUpdate: "Dec 13, 2024 - 09:00 AM" },
  { id: "SHP-2024-00159", origin: "Nashville, TN", destination: "Memphis, TN", customer: "Music City Goods", delay: "4 hours", reason: "Route diversion", driver: "John Smith", phone: "+1 (555) 567-8901", lastUpdate: "Dec 13, 2024 - 11:20 AM" },
];

const getDelayBadgeColor = (delay: string) => {
  if (delay.includes("hour")) return "bg-warning/10 text-warning";
  if (delay.includes("1 day")) return "bg-warning/10 text-warning";
  return "bg-destructive/10 text-destructive";
};

export default function DelayedShipments() {
  return (
    <DashboardLayout>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <AlertTriangle className="h-6 w-6 text-destructive" />
            Delayed Shipments
          </h1>
          <p className="text-muted-foreground">Shipments requiring immediate attention</p>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">Total delayed:</span>
          <Badge variant="destructive" className="text-lg px-3 py-1">{delayedShipments.length}</Badge>
        </div>
      </div>

      {/* Alert banner */}
      <div className="mb-6 rounded-xl border border-destructive/30 bg-destructive/5 p-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
          <div>
            <h3 className="font-medium text-card-foreground">Action Required</h3>
            <p className="text-sm text-muted-foreground">
              These shipments are behind schedule. Contact drivers or customers to provide updates and resolve issues.
            </p>
          </div>
        </div>
      </div>

      {/* Delayed shipments list */}
      <div className="space-y-4">
        {delayedShipments.map((shipment) => (
          <div key={shipment.id} className="rounded-xl border border-border bg-card p-5 hover:shadow-lg transition-shadow">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex items-center gap-2">
                    <Package className="h-5 w-5 text-primary" />
                    <span className="font-semibold text-card-foreground">{shipment.id}</span>
                  </div>
                  <Badge className={getDelayBadgeColor(shipment.delay)}>
                    <Clock className="mr-1 h-3 w-3" />
                    Delayed {shipment.delay}
                  </Badge>
                </div>

                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Route</p>
                    <p className="text-sm text-card-foreground">{shipment.origin}</p>
                    <p className="text-sm text-muted-foreground">→ {shipment.destination}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Customer</p>
                    <p className="text-sm text-card-foreground">{shipment.customer}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Reason</p>
                    <p className="text-sm text-card-foreground">{shipment.reason}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Last Update</p>
                    <p className="text-sm text-muted-foreground">{shipment.lastUpdate}</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2 sm:flex-row lg:flex-col">
                <Button variant="outline" size="sm" className="gap-2">
                  <Phone className="h-4 w-4" />
                  Call Driver
                </Button>
                <Button variant="outline" size="sm" className="gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Notify Customer
                </Button>
                <Button size="sm" className="gap-2">
                  <MapPin className="h-4 w-4" />
                  Track
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}
