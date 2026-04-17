import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Search, Package, MapPin, Truck, CheckCircle, Clock, Box } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const trackingSteps = [
  { id: 1, title: "Order Placed", location: "New York, NY", date: "Dec 10, 2024 - 09:00 AM", completed: true },
  { id: 2, title: "Package Picked Up", location: "New York Distribution Center", date: "Dec 10, 2024 - 02:30 PM", completed: true },
  { id: 3, title: "In Transit", location: "Chicago Hub", date: "Dec 12, 2024 - 11:45 AM", completed: true },
  { id: 4, title: "In Transit", location: "Denver Distribution Center", date: "Dec 13, 2024 - 08:20 AM", completed: true, current: true },
  { id: 5, title: "Out for Delivery", location: "Los Angeles, CA", date: "Expected: Dec 15, 2024", completed: false },
  { id: 6, title: "Delivered", location: "Los Angeles, CA", date: "Expected: Dec 15, 2024", completed: false },
];

export default function TrackShipment() {
  const [trackingNumber, setTrackingNumber] = useState("SHP-2024-00142");
  const [isTracking, setIsTracking] = useState(true);

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Track Shipment</h1>
        <p className="text-muted-foreground">Enter a tracking number to view shipment status</p>
      </div>

      {/* Search */}
      <div className="mb-8 rounded-xl border border-border bg-card p-6">
        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input 
              placeholder="Enter tracking number (e.g., SHP-2024-00142)" 
              className="pl-10"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
            />
          </div>
          <Button onClick={() => setIsTracking(true)}>
            <Package className="mr-2 h-4 w-4" />
            Track Shipment
          </Button>
        </div>
      </div>

      {isTracking && (
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Shipment details */}
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="mb-4 font-semibold text-card-foreground">Shipment Details</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Tracking Number</p>
                <p className="font-medium text-card-foreground">{trackingNumber}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Origin</p>
                <p className="font-medium text-card-foreground">New York, NY</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Destination</p>
                <p className="font-medium text-card-foreground">Los Angeles, CA</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Customer</p>
                <p className="font-medium text-card-foreground">Acme Corp</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Weight</p>
                <p className="font-medium text-card-foreground">2,450 lbs</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Estimated Delivery</p>
                <p className="font-medium text-primary">Dec 15, 2024</p>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="lg:col-span-2 rounded-xl border border-border bg-card p-6">
            <h3 className="mb-6 font-semibold text-card-foreground">Shipment Progress</h3>
            <div className="relative">
              {trackingSteps.map((step, index) => (
                <div key={step.id} className="relative flex gap-4 pb-8 last:pb-0">
                  {/* Line */}
                  {index < trackingSteps.length - 1 && (
                    <div className={cn(
                      "absolute left-[15px] top-8 h-full w-0.5",
                      step.completed ? "bg-primary" : "bg-border"
                    )} />
                  )}
                  
                  {/* Icon */}
                  <div className={cn(
                    "relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
                    step.current ? "bg-primary text-primary-foreground ring-4 ring-primary/20" :
                    step.completed ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
                  )}>
                    {step.completed ? (
                      step.title.includes("Transit") ? <Truck className="h-4 w-4" /> :
                      step.title === "Delivered" ? <CheckCircle className="h-4 w-4" /> :
                      step.title === "Order Placed" ? <Box className="h-4 w-4" /> :
                      <Package className="h-4 w-4" />
                    ) : (
                      <Clock className="h-4 w-4" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className={cn(
                        "font-medium",
                        step.current ? "text-primary" : step.completed ? "text-card-foreground" : "text-muted-foreground"
                      )}>
                        {step.title}
                      </h4>
                      {step.current && (
                        <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">Current</span>
                      )}
                    </div>
                    <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      {step.location}
                    </div>
                    <p className="mt-0.5 text-xs text-muted-foreground">{step.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
