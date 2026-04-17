import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { MapPin, Package, Truck, Clock, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const shipmentLocations = [
  { id: 1, tracking: "SHP-2024-00142", location: "Denver, CO", status: "in_transit", driver: "John Smith", eta: "2h 30m" },
  { id: 2, tracking: "SHP-2024-00143", location: "Phoenix, AZ", status: "in_transit", driver: "Sarah Johnson", eta: "4h 15m" },
  { id: 3, tracking: "SHP-2024-00144", location: "Las Vegas, NV", status: "delayed", driver: "Mike Brown", eta: "6h 00m" },
  { id: 4, tracking: "SHP-2024-00145", location: "Salt Lake City, UT", status: "in_transit", driver: "Emily Davis", eta: "3h 45m" },
  { id: 5, tracking: "SHP-2024-00146", location: "Albuquerque, NM", status: "in_transit", driver: "Chris Wilson", eta: "5h 20m" },
];

export default function LiveShipmentMap() {
  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Live Shipment Map</h1>
        <p className="text-muted-foreground">Real-time tracking of all active shipments</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Map placeholder */}
        <div className="lg:col-span-2">
          <div className="relative h-[500px] rounded-xl border border-border bg-card overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-chart-2/5">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="mx-auto h-16 w-16 text-primary/30" />
                  <p className="mt-4 text-lg font-medium text-muted-foreground">Interactive Map View</p>
                  <p className="text-sm text-muted-foreground">42 active shipments being tracked</p>
                </div>
              </div>
              {/* Simulated map markers */}
              <div className="absolute top-1/4 left-1/3 animate-pulse">
                <div className="h-4 w-4 rounded-full bg-primary shadow-lg shadow-primary/50" />
              </div>
              <div className="absolute top-1/2 left-1/2 animate-pulse" style={{ animationDelay: "0.5s" }}>
                <div className="h-4 w-4 rounded-full bg-success shadow-lg shadow-success/50" />
              </div>
              <div className="absolute top-1/3 right-1/4 animate-pulse" style={{ animationDelay: "1s" }}>
                <div className="h-4 w-4 rounded-full bg-warning shadow-lg shadow-warning/50" />
              </div>
              <div className="absolute bottom-1/3 left-1/4 animate-pulse" style={{ animationDelay: "1.5s" }}>
                <div className="h-4 w-4 rounded-full bg-primary shadow-lg shadow-primary/50" />
              </div>
            </div>
          </div>
        </div>

        {/* Shipment list */}
        <div className="rounded-xl border border-border bg-card">
          <div className="border-b border-border p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-card-foreground">Active Shipments</h3>
              <Button variant="ghost" size="sm">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
            <Input placeholder="Search shipments..." className="h-9" />
          </div>
          <div className="max-h-[400px] overflow-y-auto">
            {shipmentLocations.map((shipment) => (
              <div key={shipment.id} className="border-b border-border p-4 hover:bg-secondary/30 transition-colors cursor-pointer">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-primary" />
                    <span className="font-medium text-card-foreground">{shipment.tracking}</span>
                  </div>
                  <Badge variant={shipment.status === "delayed" ? "destructive" : "default"} className="text-xs">
                    {shipment.status === "delayed" ? "Delayed" : "In Transit"}
                  </Badge>
                </div>
                <div className="space-y-1 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    {shipment.location}
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Truck className="h-3 w-3" />
                    {shipment.driver}
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    ETA: {shipment.eta}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
