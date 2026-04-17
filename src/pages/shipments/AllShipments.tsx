import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Package, Search, Filter, Download, Plus, CheckCircle, Clock, Truck, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const shipments = [
  { id: "SHP-2024-00142", origin: "New York, NY", destination: "Los Angeles, CA", status: "in_transit", customer: "Acme Corp", weight: "2,450 lbs", date: "Dec 10, 2024", eta: "Dec 15, 2024" },
  { id: "SHP-2024-00143", origin: "Chicago, IL", destination: "Miami, FL", status: "delivered", customer: "Tech Solutions", weight: "1,200 lbs", date: "Dec 08, 2024", eta: "Dec 12, 2024" },
  { id: "SHP-2024-00144", origin: "Seattle, WA", destination: "Denver, CO", status: "pending", customer: "Global Retail", weight: "3,100 lbs", date: "Dec 12, 2024", eta: "Dec 18, 2024" },
  { id: "SHP-2024-00145", origin: "Boston, MA", destination: "Atlanta, GA", status: "delayed", customer: "Fast Logistics", weight: "890 lbs", date: "Dec 09, 2024", eta: "Dec 17, 2024" },
  { id: "SHP-2024-00146", origin: "Dallas, TX", destination: "Phoenix, AZ", status: "in_transit", customer: "Prime Shipping", weight: "1,750 lbs", date: "Dec 11, 2024", eta: "Dec 16, 2024" },
  { id: "SHP-2024-00147", origin: "San Francisco, CA", destination: "Portland, OR", status: "delivered", customer: "West Coast Inc", weight: "2,100 lbs", date: "Dec 07, 2024", eta: "Dec 10, 2024" },
  { id: "SHP-2024-00148", origin: "Philadelphia, PA", destination: "Detroit, MI", status: "in_transit", customer: "Motor City Co", weight: "4,200 lbs", date: "Dec 12, 2024", eta: "Dec 14, 2024" },
  { id: "SHP-2024-00149", origin: "Houston, TX", destination: "New Orleans, LA", status: "pending", customer: "Gulf Trading", weight: "1,500 lbs", date: "Dec 13, 2024", eta: "Dec 19, 2024" },
];

const statusConfig = {
  in_transit: { label: "In Transit", icon: Truck, className: "text-primary bg-primary/10" },
  delivered: { label: "Delivered", icon: CheckCircle, className: "text-success bg-success/10" },
  pending: { label: "Pending", icon: Clock, className: "text-warning bg-warning/10" },
  delayed: { label: "Delayed", icon: AlertTriangle, className: "text-destructive bg-destructive/10" },
};

export default function AllShipments() {
  return (
    <DashboardLayout>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">All Shipments</h1>
          <p className="text-muted-foreground">Manage and track all shipments</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Shipment
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col gap-4 rounded-xl border border-border bg-card p-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search by tracking number, customer..." className="pl-10" />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Filters
          </Button>
          <Button variant="outline" size="sm">All Status</Button>
          <Button variant="outline" size="sm">Date Range</Button>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-secondary/50">
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Tracking #</th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Route</th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Customer</th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Weight</th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Status</th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Ship Date</th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">ETA</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {shipments.map((shipment) => {
                const status = statusConfig[shipment.status as keyof typeof statusConfig];
                const StatusIcon = status.icon;

                return (
                  <tr key={shipment.id} className="hover:bg-secondary/30 transition-colors cursor-pointer">
                    <td className="whitespace-nowrap px-5 py-4">
                      <div className="flex items-center gap-2">
                        <Package className="h-4 w-4 text-primary" />
                        <span className="font-medium text-card-foreground">{shipment.id}</span>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-5 py-4">
                      <div className="text-sm">
                        <p className="text-card-foreground">{shipment.origin}</p>
                        <p className="text-muted-foreground">→ {shipment.destination}</p>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 text-sm text-card-foreground">{shipment.customer}</td>
                    <td className="whitespace-nowrap px-5 py-4 text-sm text-muted-foreground">{shipment.weight}</td>
                    <td className="whitespace-nowrap px-5 py-4">
                      <Badge className={cn("gap-1", status.className)}>
                        <StatusIcon className="h-3 w-3" />
                        {status.label}
                      </Badge>
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 text-sm text-muted-foreground">{shipment.date}</td>
                    <td className="whitespace-nowrap px-5 py-4 text-sm text-muted-foreground">{shipment.eta}</td>
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
