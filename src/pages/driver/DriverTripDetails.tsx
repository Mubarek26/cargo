import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import {
  ArrowLeft, Truck, MapPin, Package, Clock, CheckCircle,
  XCircle, Loader2, Navigation, MessageSquare, Phone, User,
  Calendar, Check, Shield, AlertTriangle, AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { tripService } from "@/services/tripService";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { RouteMap } from "@/components/RouteMap";
import { calculateDistance, formatDistance } from "@/utils/distance";

const milestoneConfig: any = {
  STARTED: { label: "Started", icon: Clock, className: "text-blue-500 bg-blue-500/10", next: "ARRIVED", action: "Arrive at Pickup" },
  ARRIVED: { label: "Arrived at Pickup", icon: MapPin, className: "text-warning bg-warning/10", next: "IN_TRANSIT", action: "Start Delivery" },
  IN_TRANSIT: { label: "In Transit", icon: Navigation, className: "text-primary bg-primary/10", next: "DELIVERED", action: "Confirm Delivery" },
  DELIVERED: { label: "Delivered", icon: CheckCircle, className: "text-success bg-success/10", next: "COMPLETED", action: "Finish Trip" },
  COMPLETED: { label: "Completed", icon: CheckCircle, className: "text-success bg-success/10", next: null },
};

export default function DriverTripDetails() {
  const { tripId } = useParams<{ tripId: string }>();
  const navigate = useNavigate();
  const token = localStorage.getItem("authToken") || "";

  const [trip, setTrip] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [note, setNote] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [roadData, setRoadData] = useState<{ distanceKm: number; durationMin: number } | null>(null);
  const [currentCoords, setCurrentCoords] = useState<[number, number] | null>(null);

  useEffect(() => {
    fetchTripDetails();
  }, [tripId]);

  // GPS Tracking Effect
  useEffect(() => {
    if (!tripId || !trip || !["STARTED", "ARRIVED", "IN_TRANSIT"].includes(trip.milestone)) return;

    let watchId: number;
    let streamInterval: NodeJS.Timeout;

    if ("geolocation" in navigator) {
      // 1. Watch for precise movement to update the UI
      watchId = navigator.geolocation.watchPosition(
        (pos) => {
          setCurrentCoords([pos.coords.longitude, pos.coords.latitude]);
        },
        (err) => console.error("GPS Error:", err),
        { enableHighAccuracy: true }
      );

      // 2. Periodic stream to backend (every 30 seconds)
      streamInterval = setInterval(async () => {
        if (!currentCoords) return;

        try {
          await streamLocation(token, {
            tripId,
            location: {
              type: "Point",
              coordinates: currentCoords
            }
          });
          console.log("Location streamed:", currentCoords);
        } catch (err) {
          console.error("Failed to stream location:", err);
        }
      }, 30000);
    }

    return () => {
      if (watchId) navigator.geolocation.clearWatch(watchId);
      if (streamInterval) clearInterval(streamInterval);
    };
  }, [tripId, trip?.milestone, currentCoords, token]);

  const fetchTripDetails = async () => {
    if (!tripId) return;
    setIsLoading(true);
    try {
      const res = await tripService.getTripDetails(tripId);
      if (res.status === "success") {
        setTrip(res.data.trip);
      }
    } catch (error) {
      toast.error("Failed to fetch trip details");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateMilestone = async () => {
    if (!tripId || !trip) return;

    const currentMilestone = milestoneConfig[trip.milestone];
    if (!currentMilestone?.next) return;

    if (currentMilestone.next === "COMPLETED" && !otpCode) {
      toast.error("Please enter the delivery OTP provided by the customer");
      return;
    }

    setIsActionLoading(true);
    try {
      // Use current GPS coordinates if available
      const location = currentCoords
        ? { type: "Point", coordinates: currentCoords }
        : { type: "Point", coordinates: [38.7578, 8.9806] }; // Fallback

      await tripService.updateMilestone(tripId, {
        milestone: currentMilestone.next,
        location: location,
        note: note,
        otpCode: otpCode
      });

      toast.success(`Trip status updated to ${currentMilestone.next}`);
      setNote("");
      setOtpCode("");
      fetchTripDetails();
    } catch (error: any) {
      toast.error(error.message || "Failed to update trip status");
    } finally {
      setIsActionLoading(false);
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex h-[60vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  if (!trip) {
    return (
      <DashboardLayout>
        <div className="flex h-[60vh] flex-col items-center justify-center gap-4">
          <XCircle className="h-12 w-12 text-destructive opacity-20" />
          <p className="text-xl font-medium text-muted-foreground">Trip not found</p>
          <Button onClick={() => navigate("/driver/trips")}>Back to Trips</Button>
        </div>
      </DashboardLayout>
    );
  }

  const order = trip.orderId;
  const currentMilestone = milestoneConfig[trip.milestone] || { label: trip.milestone, icon: Clock, className: "" };
  const StatusIcon = currentMilestone.icon;

  return (
    <DashboardLayout>
      <div className="mb-6 flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/driver/trips")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Trip Details</h1>
          <p className="text-muted-foreground">Order: {order?.orderNumber}</p>
        </div>
        <div className="ml-auto">
          <Badge className={cn("gap-1 py-1.5 px-3 text-sm", currentMilestone.className)}>
            <StatusIcon className="h-4 w-4" />
            {currentMilestone.label}
          </Badge>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {/* Milestone Action Card */}
          {currentMilestone.next && (
            <div className="rounded-xl border-2 border-primary/20 bg-primary/5 p-6">
              <h3 className="mb-2 text-lg font-semibold text-foreground">Update Progress</h3>
              <p className="mb-4 text-sm text-muted-foreground">Update the trip status as you reach milestones.</p>

              <div className="space-y-4">
                {currentMilestone.next === "COMPLETED" && (
                  <div className="space-y-2">
                    <span className="text-sm font-bold text-primary">Delivery OTP Verification</span>
                    <Input
                      placeholder="Enter 6-digit OTP from customer"
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      className="bg-background text-lg tracking-widest text-center h-12"
                      maxLength={6}
                    />
                    <p className="text-xs text-muted-foreground">The customer received this code via SMS when you arrived at the delivery location.</p>
                  </div>
                )}
                <div className="space-y-2">
                  <span className="text-sm font-medium">Add a note (optional)</span>
                  <Textarea
                    placeholder="e.g., Arrived at pickup location, Cargo loaded..."
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    className="bg-background"
                  />
                </div>
                <Button
                  className="w-full gap-2 h-12 text-lg"
                  onClick={handleUpdateMilestone}
                  disabled={isActionLoading}
                >
                  {isActionLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Check className="h-5 w-5" />}
                  {currentMilestone.action}
                </Button>
              </div>
            </div>
          )}

          {/* Route Info */}
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="mb-4 flex items-center gap-2 font-semibold">
              <MapPin className="h-5 w-5 text-primary" />
              Delivery Route
            </h3>

            {order?.pickupLocation?.latitude && order?.pickupLocation?.longitude &&
              order?.deliveryLocation?.latitude && order?.deliveryLocation?.longitude && (
                <div className="mb-6">
                  <RouteMap
                    pickup={{
                      lat: order.pickupLocation.latitude,
                      lng: order.pickupLocation.longitude,
                      address: order.pickupLocation.address
                    }}
                    delivery={{
                      lat: order.deliveryLocation.latitude,
                      lng: order.deliveryLocation.longitude,
                      address: order.deliveryLocation.address
                    }}
                    currentLocation={currentCoords ? { lat: currentCoords[1], lng: currentCoords[0] } : undefined}
                    geofences={trip.geofences}
                    onRouteCalculated={setRoadData}
                    className="h-[280px] w-full"
                  />
                  <div className="mt-3 grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1 bg-secondary/30 p-3 rounded-xl border border-border">
                      <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Road Trip Distance</span>
                      <span className="font-bold text-lg text-primary">
                        {roadData ? formatDistance(roadData.distanceKm) : formatDistance(calculateDistance(
                          order.pickupLocation.latitude,
                          order.pickupLocation.longitude,
                          order.deliveryLocation.latitude,
                          order.deliveryLocation.longitude
                        ))}
                      </span>
                    </div>
                    <div className="flex flex-col gap-1 bg-secondary/30 p-3 rounded-xl border border-border">
                      <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Estimated Duration</span>
                      <span className="font-bold text-lg text-foreground">
                        {roadData ? `${Math.round(roadData.durationMin)} mins` : "Calculating..."}
                      </span>
                    </div>
                  </div>
                </div>
              )}

            <div className="relative space-y-8 before:absolute before:left-[11px] before:top-2 before:h-[calc(100%-16px)] before:w-[2px] before:bg-muted">
              <div className="relative pl-8">
                <div className="absolute left-0 top-1.5 h-[24px] w-[24px] rounded-full border-4 border-background bg-primary" />
                <p className="text-xs font-medium uppercase text-muted-foreground">Pickup Location</p>
                <p className="font-medium">{order?.pickupLocation?.address}</p>
                <p className="text-sm text-muted-foreground">{order?.pickupLocation?.city}, {order?.pickupLocation?.state}</p>
                <div className="mt-2 flex gap-4">
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <User className="h-3 w-3" /> {order?.pickupLocation?.contactName}
                  </p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Phone className="h-3 w-3" /> {order?.pickupLocation?.contactPhone}
                  </p>
                </div>
              </div>
              <div className="relative pl-8">
                <div className="absolute left-0 top-1.5 h-[24px] w-[24px] rounded-full border-4 border-background bg-success" />
                <p className="text-xs font-medium uppercase text-muted-foreground">Delivery Destination</p>
                <p className="font-medium">{order?.deliveryLocation?.address}</p>
                <p className="text-sm text-muted-foreground">{order?.deliveryLocation?.city}, {order?.deliveryLocation?.state}</p>
                <div className="mt-2 flex gap-4">
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <User className="h-3 w-3" /> {order?.deliveryLocation?.contactName}
                  </p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Phone className="h-3 w-3" /> {order?.deliveryLocation?.contactPhone}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* History */}
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="mb-4 font-semibold">Milestone History</h3>
            <div className="space-y-4">
              {trip.milestoneHistory?.map((h: any, i: number) => (
                <div key={i} className="flex gap-4 pb-4 border-b border-border last:border-0 last:pb-0">
                  <div className="flex flex-col items-center">
                    <div className="rounded-full bg-primary/10 p-2">
                      <Clock className="h-4 w-4 text-primary" />
                    </div>
                  </div>
                  <div>
                    <p className="font-medium text-sm">{milestoneConfig[h.milestone]?.label || h.milestone}</p>
                    <p className="text-xs text-muted-foreground">{new Date(h.at).toLocaleString()}</p>
                    {h.note && <p className="mt-1 text-sm italic text-muted-foreground">"{h.note}"</p>}
                  </div>
                </div>
              )).reverse()}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Cargo Card */}
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="mb-4 flex items-center gap-2 font-semibold">
              <Package className="h-5 w-5 text-primary" />
              Cargo Details
            </h3>
            <div className="space-y-4 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Type</span>
                <span className="font-medium">{order?.cargo?.type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Weight</span>
                <span className="font-medium">{order?.cargo?.weightKg} Kg</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Quantity</span>
                <span className="font-medium">{order?.cargo?.quantity} {order?.cargo?.unit}</span>
              </div>
              {order?.description && (
                <div className="pt-2 border-t border-border">
                  <p className="text-xs text-muted-foreground mb-1">Description</p>
                  <p>{order.description}</p>
                </div>
              )}
            </div>
          </div>

          {/* Vehicle Card */}
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="mb-4 flex items-center gap-2 font-semibold">
              <Truck className="h-5 w-5 text-primary" />
              Your Vehicle
            </h3>
            {trip.vehicleId ? (
              <div className="space-y-3">
                <p className="text-lg font-bold">{trip.vehicleId.plateNumber}</p>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Type</span>
                  <span>{trip.vehicleId.vehicleType}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Model</span>
                  <span>{trip.vehicleId.model}</span>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No vehicle assigned</p>
            )}
          </div>

          {/* Restricted Areas Card */}
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="mb-4 flex items-center gap-2 font-semibold">
              <Shield className="h-5 w-5 text-destructive" />
              Restricted Areas
            </h3>

            {/* Real-time Status Alert */}
            {trip.lastNote?.includes("Geofence Status:") && (
              <div className={cn(
                "mb-4 p-3 rounded-lg border flex items-start gap-3 animate-pulse",
                trip.lastNote.includes("In Restricted") || trip.lastNote.includes("Off Route")
                  ? "bg-destructive/10 border-destructive/30 text-destructive"
                  : "bg-warning/10 border-warning/30 text-warning"
              )}>
                <AlertTriangle className="h-5 w-5 flex-shrink-0" />
                <div className="space-y-1">
                  <p className="text-xs font-bold uppercase tracking-tight">Safety Alert</p>
                  <p className="text-sm font-medium leading-tight">
                    {trip.lastNote.replace("Geofence Status: ", "")}
                  </p>
                </div>
              </div>
            )}

            <div className="space-y-3">
              {(trip.geofences || []).length === 0 ? (
                <p className="text-xs text-muted-foreground italic">No restricted areas defined for this trip.</p>
              ) : (
                (trip.geofences || []).map((gf: any) => (
                  <div key={gf._id} className="flex flex-col gap-1 p-2 rounded-lg border border-border bg-secondary/10">
                    <div className="flex items-center gap-2">
                      <div className={cn(
                        "h-2 w-2 rounded-full",
                        gf.type === 'restricted' ? "bg-destructive" : "bg-primary"
                      )} />
                      <span className="text-sm font-bold truncate">{gf.name}</span>
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                      <span>{gf.type === 'restricted' ? "Keep Out" : "Milestone"}</span>
                      <span>{gf.radius}m Radius</span>
                    </div>
                  </div>
                ))
              )}
              <div className="mt-4 p-3 rounded-lg bg-blue-500/5 border border-blue-500/20 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-blue-500" />
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  Stay at least <span className="font-bold text-foreground">2km</span> away from red zones to avoid proximity alerts.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
