import * as React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getTripById } from "@/services/tripService";
import { RouteMap } from "@/components/RouteMap";
import { calculateDistance, formatDistance } from "@/utils/distance";

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

          <Section title="Shipment Info">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Cargo</p>
                <p className="text-sm text-foreground">{toText(cargo?.type)}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Description</p>
                <p className="text-sm text-foreground">{toText(cargo?.description)}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Quantity</p>
                <p className="text-sm text-foreground">{toText(cargo?.quantity)} {toText(cargo?.unit)}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Weight (kg)</p>
                <p className="text-sm text-foreground">{toText(cargo?.weightKg)}</p>
              </div>
            </div>
          </Section>

          <Section title="Locations">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Pickup</p>
                <p className="text-sm text-foreground">{toText(pickup?.address)}</p>
                <p className="text-xs text-muted-foreground">{toText(pickup?.contactName)} • {toText(pickup?.contactPhone)}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Delivery</p>
                <p className="text-sm text-foreground">{toText(delivery?.address)}</p>
                <p className="text-xs text-muted-foreground">{toText(delivery?.contactName)} • {toText(delivery?.contactPhone)}</p>
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
