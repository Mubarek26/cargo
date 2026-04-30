import * as React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getTripById } from "@/services/tripService";
import { RouteMap } from "@/components/RouteMap";
import { calculateDistance, formatDistance } from "@/utils/distance";
import { geofenceService } from "@/services/geofenceService";
import { tripService } from "@/services/tripService";
import { Shield, Plus, Trash2, MapPin, Loader2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

const toText = (value: unknown) => (value === null || value === undefined ? "-" : String(value));

const resolveTrip = (payload: unknown) => {
  if (!payload || typeof payload !== "object") return null;
  const data = payload as Record<string, unknown>;
  return (data.data as any)?.trip || (data as any)?.trip || null;
};

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section className="rounded-xl border border-border bg-card p-6">
    <h2 className="text-lg font-semibold text-foreground mb-4">{title}</h2>
    {children}
  </section>
);

export default function TripDetails() {
  const navigate = useNavigate();
  const { tripId } = useParams();
  const [trip, setTrip] = React.useState<Record<string, unknown> | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [roadData, setRoadData] = React.useState<{ distanceKm: number; durationMin: number } | null>(null);
  const [isConfiguringGf, setIsConfiguringGf] = React.useState(false);
  const [isSavingGf, setIsSavingGf] = React.useState(false);
  const [newGf, setNewGf] = React.useState<{ name: string; lat: number; lng: number; radius: number } | null>(null);

  const loadTrip = React.useCallback(async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      navigate("/login");
      return;
    }

    if (!tripId) {
      setError("Trip ID is missing.");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await getTripById(token, tripId);
      if (!result.ok) {
        const message =
          (result.data && typeof result.data === "object" && "message" in result.data && result.data.message) ||
          "Unable to load trip.";
        setError(String(message));
        setTrip(null);
        return;
      }

      setTrip(resolveTrip(result.data));
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unable to load trip.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [navigate, tripId]);

  const handleMapClick = (lat: number, lng: number) => {
    if (!isConfiguringGf) return;
    setNewGf({
      name: `Restricted Zone ${((trip as any)?.geofences?.length || 0) + 1}`,
      lat,
      lng,
      radius: 500,
    });
  };

  const handleSaveGeofence = async () => {
    if (!newGf || !tripId) return;
    setIsSavingGf(true);
    try {
      const gfRes = await geofenceService.createGeofence({
        name: newGf.name,
        type: "restricted",
        radius: newGf.radius,
        geometry: {
          type: "Point",
          coordinates: [newGf.lng, newGf.lat],
        },
      });

      if (gfRes.status === "success") {
        const currentGfIds = ((trip as any)?.geofences || []).map((g: any) => g._id);
        const updatedIds = [...currentGfIds, gfRes.data._id];
        
        const token = localStorage.getItem("authToken") || "";
        const updateRes = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/v1/trips/${tripId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ geofences: updatedIds }),
        });

        if (updateRes.ok) {
          toast.success("Geofence assigned to trip");
          setNewGf(null);
          loadTrip();
        }
      }
    } catch (err) {
      toast.error("Failed to create geofence");
    } finally {
      setIsSavingGf(false);
    }
  };

  const handleRemoveGeofence = async (gfId: string) => {
    if (!tripId) return;
    try {
      const currentGfIds = ((trip as any)?.geofences || []).map((g: any) => g._id);
      const updatedIds = currentGfIds.filter((id: string) => id !== gfId);
      
      const token = localStorage.getItem("authToken") || "";
      const updateRes = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/v1/trips/${tripId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ geofences: updatedIds }),
      });

      if (updateRes.ok) {
        toast.success("Geofence removed from trip");
        loadTrip();
      }
    } catch (err) {
      toast.error("Failed to remove geofence");
    }
  };

  React.useEffect(() => {
    loadTrip();
  }, [loadTrip]);

  const order = (trip as any)?.orderId || {};
  const cargo = order?.cargo || {};
  const pickup = order?.pickupLocation || {};
  const delivery = order?.deliveryLocation || {};
  const vehicle = (trip as any)?.vehicleId || {};
  const pricing = order?.pricing || {};
  const otp = (trip as any)?.deliveryOtp || {};
  const milestoneHistory = Array.isArray((trip as any)?.milestoneHistory)
    ? (trip as any).milestoneHistory
    : [];

  return (
    <DashboardLayout>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Trip Details</h1>
          <p className="text-muted-foreground">Order {toText(order?.orderNumber)}</p>
        </div>
        <Button variant="outline" onClick={loadTrip} disabled={isLoading}>
          Refresh
        </Button>
      </div>

      {isLoading ? (
        <div className="rounded-xl border border-border bg-card p-8 text-center text-muted-foreground">
          Loading trip...
        </div>
      ) : error ? (
        <div className="rounded-xl border border-destructive/40 bg-destructive/5 p-6 text-sm text-destructive">
          {error}
        </div>
      ) : trip ? (
        <div className="space-y-6">
          <Section title="Header">
            <div className="flex flex-wrap items-center gap-4">
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Order Number</p>
                <p className="text-lg font-semibold text-foreground">{toText(order?.orderNumber)}</p>
              </div>
              <Badge className="bg-primary/10 text-primary">
                {toText((trip as any)?.milestone)}
              </Badge>
            </div>
          </Section>

          <Section title="Trip Route & Distance">
            {pickup?.latitude && pickup?.longitude && 
             delivery?.latitude && delivery?.longitude ? (
              <div className="space-y-4">
                <RouteMap 
                  pickup={{ 
                    lat: pickup.latitude, 
                    lng: pickup.longitude,
                    address: pickup.address 
                  }} 
                  delivery={{ 
                    lat: delivery.latitude, 
                    lng: delivery.longitude,
                    address: delivery.address
                  }}
                  onRouteCalculated={setRoadData}
                  className="h-[300px] w-full"
                />
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col bg-secondary/30 p-3 rounded-lg border border-border">
                    <span className="text-xs uppercase tracking-wide text-muted-foreground">Optimal Road Distance</span>
                    <span className="font-bold text-lg text-primary">
                      {roadData ? formatDistance(roadData.distanceKm) : formatDistance(calculateDistance(
                        pickup.latitude, 
                        pickup.longitude,
                        delivery.latitude, 
                        delivery.longitude
                      ))}
                    </span>
                  </div>
                  <div className="flex flex-col bg-secondary/30 p-3 rounded-lg border border-border text-right">
                    <span className="text-xs uppercase tracking-wide text-muted-foreground">Est. Drive Time</span>
                    <span className="font-bold text-lg text-foreground">
                      {roadData ? `${Math.round(roadData.durationMin)} mins` : "Calculating..."}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground bg-secondary/10 p-2 rounded border border-border">
                  <span>Last Known Location</span>
                  <span className="font-medium text-foreground">
                    {toText((trip as any)?.lastLocation?.lat)}, {toText((trip as any)?.lastLocation?.lng)}
                  </span>
                </div>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">Last location</p>
                  <p className="text-sm text-foreground">
                    {toText((trip as any)?.lastLocation?.lat)}, {toText((trip as any)?.lastLocation?.lng)}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">Speed / Heading</p>
                  <p className="text-sm text-foreground">
                    {toText((trip as any)?.lastLocation?.speed)} km/h • {toText((trip as any)?.lastLocation?.heading)}
                  </p>
                </div>
                <p className="col-span-2 text-sm text-muted-foreground italic">Coordinate data is missing for map visualization.</p>
              </div>
            )}
          </Section>

          <Section title="Safety Zones & Geofences">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  {isConfiguringGf ? "Click on the map to define a restricted area" : "Manage safety zones for this shipment"}
                </p>
                <Button 
                  size="sm" 
                  variant={isConfiguringGf ? "destructive" : "default"} 
                  onClick={() => {
                    setIsConfiguringGf(!isConfiguringGf);
                    setNewGf(null);
                  }}
                  className="gap-2"
                >
                  {isConfiguringGf ? "Cancel" : <><Shield className="h-4 w-4" /> Configure Zones</>}
                </Button>
              </div>

              <div className="relative group">
                <RouteMap 
                  pickup={{ 
                    lat: pickup.latitude, 
                    lng: pickup.longitude,
                    address: pickup.address 
                  }} 
                  delivery={{ 
                    lat: delivery.latitude, 
                    lng: delivery.longitude,
                    address: delivery.address
                  }}
                  geofences={(trip as any)?.geofences || []}
                  onMapClick={handleMapClick}
                  className={cn(
                    "h-[400px] w-full transition-all border-2",
                    isConfiguringGf ? "border-primary cursor-crosshair" : "border-transparent"
                  )}
                />
                
                {isConfiguringGf && !newGf && (
                  <div className="absolute inset-0 pointer-events-none flex items-center justify-center bg-primary/5 backdrop-blur-[1px]">
                    <div className="bg-background/90 px-4 py-2 rounded-full border border-primary shadow-xl flex items-center gap-2 animate-bounce">
                      <MapPin className="h-4 w-4 text-primary" />
                      <span className="text-xs font-bold text-primary uppercase">Click map to set zone</span>
                    </div>
                  </div>
                )}

                {newGf && (
                  <div className="absolute bottom-4 left-4 right-4 z-[1000] bg-background/95 backdrop-blur-md p-4 rounded-xl border border-border shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-300">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          <Shield className="h-4 w-4 text-destructive" />
                          <Input 
                            value={newGf.name} 
                            onChange={e => setNewGf({...newGf, name: e.target.value})}
                            className="h-8 text-xs font-bold"
                            placeholder="Zone Name"
                          />
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-[10px] font-bold text-muted-foreground uppercase">Radius: {newGf.radius}m</span>
                          <input 
                            type="range" min="100" max="2000" step="50"
                            className="flex-1 h-1.5 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
                            value={newGf.radius}
                            onChange={e => setNewGf({...newGf, radius: parseInt(e.target.value)})}
                          />
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => setNewGf(null)}>Discard</Button>
                        <Button size="sm" onClick={handleSaveGeofence} disabled={isSavingGf} className="gap-2">
                          {isSavingGf ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                          Add Zone
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {((trip as any)?.geofences || []).map((gf: any) => (
                  <div key={gf._id} className="flex items-center justify-between p-3 rounded-lg bg-secondary/20 border border-border group hover:border-primary/50 transition-colors">
                    <div className="flex items-center gap-2 min-w-0">
                      <Shield className={cn("h-4 w-4 flex-shrink-0", gf.type === 'restricted' ? "text-destructive" : "text-primary")} />
                      <div className="min-w-0">
                        <p className="text-xs font-bold truncate">{gf.name}</p>
                        <p className="text-[10px] text-muted-foreground">{gf.radius}m • {gf.type}</p>
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-7 w-7 text-muted-foreground hover:text-destructive"
                      onClick={() => handleRemoveGeofence(gf._id)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </Section>

          <Section title="Shipment Info">
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-4">
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">Cargo Type</p>
                  <p className="text-sm font-medium text-foreground">{toText(cargo?.type)}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">Description</p>
                  <p className="text-sm text-foreground">{toText(cargo?.description)}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">Quantity & Weight</p>
                  <p className="text-sm font-medium text-foreground">{toText(cargo?.quantity)} {toText(cargo?.unit)} • {toText(cargo?.weightKg)} kg</p>
                </div>
                {order.targetCompanyId && (
                  <div>
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">Transport Company</p>
                    <p className="text-sm font-bold text-primary">{toText(order.targetCompanyId?.companyName)}</p>
                    <p className="text-xs text-muted-foreground">{toText(order.targetCompanyId?.phoneNumber)}</p>
                  </div>
                )}
              </div>
            </div>
          </Section>

          <Section title="Client & Locations">
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-4">
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">Posted By</p>
                  <p className="text-sm font-medium text-foreground">{toText(order.createdBy?.fullName)}</p>
                  <p className="text-xs text-muted-foreground">{toText(order.createdBy?.role)} • {toText(order.createdBy?.phoneNumber)}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">Pickup Point</p>
                  <p className="text-sm text-foreground font-medium">{toText(pickup?.address)}</p>
                  <p className="text-xs text-muted-foreground">{toText(pickup?.contactName)} • {toText(pickup?.contactPhone)}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="invisible h-[44px] hidden sm:block" />
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">Delivery Point</p>
                  <p className="text-sm text-foreground font-medium">{toText(delivery?.address)}</p>
                  <p className="text-xs text-muted-foreground">{toText(delivery?.contactName)} • {toText(delivery?.contactPhone)}</p>
                </div>
              </div>
            </div>
          </Section>

          <Section title="Vehicle">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Plate Number</p>
                <p className="text-sm text-foreground">{toText(vehicle?.plateNumber)}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Model</p>
                <p className="text-sm text-foreground">{toText(vehicle?.model)}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Type</p>
                <p className="text-sm text-foreground">{toText(vehicle?.vehicleType)}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Capacity (kg)</p>
                <p className="text-sm text-foreground">{toText(vehicle?.capacityKg)}</p>
              </div>
            </div>
          </Section>

          <Section title="Driver">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Full Name</p>
                <p className="text-sm text-foreground">{toText(((trip as any)?.driverId)?.fullName)}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Phone Number</p>
                <p className="text-sm text-foreground">{toText(((trip as any)?.driverId)?.phoneNumber)}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Email</p>
                <p className="text-sm text-foreground">{toText(((trip as any)?.driverId)?.email)}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Status</p>
                <Badge variant={((trip as any)?.driverId)?.status === 'ACTIVE' ? 'secondary' : 'outline'}>
                  {toText(((trip as any)?.driverId)?.status)}
                </Badge>
              </div>
            </div>
          </Section>

          <Section title="Timeline">
            {milestoneHistory.length === 0 ? (
              <p className="text-sm text-muted-foreground">No milestones yet.</p>
            ) : (
              <div className="space-y-3">
                {milestoneHistory.map((entry: any, index: number) => (
                  <div key={`${entry.milestone || index}-${index}`} className="flex flex-col gap-1 rounded-lg border border-border p-3">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-foreground">{toText(entry.milestone)}</p>
                      <p className="text-xs text-muted-foreground">{toText(entry.at)}</p>
                    </div>
                    <p className="text-sm text-muted-foreground">{toText(entry.note)}</p>
                  </div>
                ))}
              </div>
            )}
          </Section>

          <Section title="Payment">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Budget</p>
                <p className="text-sm text-foreground">
                  {toText(pricing?.proposedBudget)} {toText(pricing?.currency)}
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Payment Status</p>
                <p className="text-sm text-foreground">{toText(order?.paymentStatus)}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Payment Method</p>
                <p className="text-sm text-foreground">{toText(pricing?.paymentMethod)}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Negotiable</p>
                <p className="text-sm text-foreground">{toText(pricing?.negotiable)}</p>
              </div>
            </div>
          </Section>

          <Section title="Delivery Verification">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">OTP Code</p>
                <p className="text-sm text-foreground">{toText(otp?.code)}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">OTP Status</p>
                <p className="text-sm text-foreground">{otp?.verified ? "Verified" : "Not verified"}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Expires At</p>
                <p className="text-sm text-foreground">{toText(otp?.expiresAt)}</p>
              </div>
            </div>
          </Section>
        </div>
      ) : (
        <div className="rounded-xl border border-border bg-card p-8 text-center text-muted-foreground">
          Trip not found.
        </div>
      )}
    </DashboardLayout>
  );
}
