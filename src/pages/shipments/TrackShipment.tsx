import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Search, Package, MapPin, Truck, CheckCircle, Clock, Box } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { API_BASE_URL } from "@/lib/api";

const defaultMockSteps = [
  { id: 1, title: "Order Placed", location: "Unknown", date: "", completed: true }
];

export default function TrackShipment() {
  const [trackingNumber, setTrackingNumber] = useState("SHP-2024-00142");
  const [isTracking, setIsTracking] = useState(true);
  const [trackingSteps, setTrackingSteps] = useState(defaultMockSteps);
  const [shipmentDetails, setShipmentDetails] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
          <Button onClick={async () => {
            setIsTracking(true);
            setError(null);
            setLoading(true);
            try {
              const q = encodeURIComponent(trackingNumber.trim());
              const token = localStorage.getItem('authToken');
              const headers: Record<string, string> = {};
              if (token) headers.Authorization = `Bearer ${token}`;
              const res = await fetch(`${API_BASE_URL}/api/v1/trips/lookup?q=${q}`, { headers, credentials: 'include' });
              if (!res.ok) {
                const body = await res.json().catch(() => ({}));
                throw new Error(body.message || res.statusText || 'Lookup failed');
              }
              const json = await res.json();
              const { order, trip } = json.data || {};
              setShipmentDetails({ order, trip });

              if (trip && Array.isArray(trip.locationHistory) && trip.locationHistory.length) {
                const steps = trip.locationHistory.map((p: any, i: number) => ({
                  id: i + 1,
                  title: `Location update ${i + 1}`,
                  location: p.coordinates ? `${p.coordinates[1].toFixed(5)}, ${p.coordinates[0].toFixed(5)}` : 'Unknown',
                  date: p.timestamp ? new Date(p.timestamp).toLocaleString() : '',
                  completed: true,
                  current: i === trip.locationHistory.length - 1
                }));
                setTrackingSteps(steps);
              } else {
                setTrackingSteps(defaultMockSteps);
              }
            } catch (err: any) {
              setError(err.message || 'Lookup failed');
            } finally {
              setLoading(false);
            }
          }}>
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
                <p className="font-medium text-card-foreground">{shipmentDetails?.order?.orderNumber || trackingNumber}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Origin</p>
                <p className="font-medium text-card-foreground">{shipmentDetails?.order?.pickupLocation?.address || '—'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Destination</p>
                <p className="font-medium text-card-foreground">{shipmentDetails?.order?.deliveryLocation?.address || '—'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Customer</p>
                <p className="font-medium text-card-foreground">{shipmentDetails?.order?.createdBy?.fullName || '—'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Weight</p>
                <p className="font-medium text-card-foreground">{shipmentDetails?.order?.cargo?.weightKg ? `${shipmentDetails.order.cargo.weightKg} kg` : '—'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Estimated Delivery</p>
                <p className="font-medium text-primary">{shipmentDetails?.order?.deliveryDeadline ? new Date(shipmentDetails.order.deliveryDeadline).toLocaleDateString() : '—'}</p>
              </div>
            </div>
          </div>

          {/* Trip & Driver Details */}
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="mb-4 font-semibold text-card-foreground">Trip & Driver</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Milestone</p>
                <p className="font-medium text-card-foreground">{shipmentDetails?.trip?.milestone || '—'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Driver</p>
                <p className="font-medium text-card-foreground">{shipmentDetails?.trip?.driver?.fullName || shipmentDetails?.trip?.driver?.name || '—'}</p>
                <p className="text-sm text-muted-foreground">{shipmentDetails?.trip?.driver?.phoneNumber || shipmentDetails?.trip?.driver?.phone || ''}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Vehicle</p>
                <p className="font-medium text-card-foreground">{shipmentDetails?.trip?.vehicle?.plateNumber || shipmentDetails?.trip?.vehicle?.registration || '—'}</p>
                <p className="text-sm text-muted-foreground">{shipmentDetails?.trip?.vehicle?.vehicleType || ''}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Last Note</p>
                <p className="font-medium text-card-foreground">{shipmentDetails?.trip?.lastNote || '—'}</p>
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
