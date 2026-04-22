import * as React from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Package, Search, Filter, Download, Plus, CheckCircle, Clock, Truck, AlertTriangle, XCircle, PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { getCompanyTrips, getDriverTripsHistory, getTrips } from "@/services/tripService";

type TripRecord = Record<string, unknown> & {
  id?: string | number;
  _id?: string | number;
  tripId?: string | number;
  trackingNumber?: string;
  status?: string;
};

const extractTrips = (payload: unknown): TripRecord[] => {
  if (Array.isArray(payload)) return payload as TripRecord[];
  if (!payload || typeof payload !== "object") return [];

  const data = payload as Record<string, unknown>;
  if (Array.isArray(data.trips)) return data.trips as TripRecord[];
  if (Array.isArray(data.data)) return data.data as TripRecord[];
  if (Array.isArray(data.shipments)) return data.shipments as TripRecord[];

  const nested = data.data;
  if (nested && typeof nested === "object") {
    const nestedData = nested as Record<string, unknown>;
    if (Array.isArray(nestedData.trips)) return nestedData.trips as TripRecord[];
    if (Array.isArray(nestedData.shipments)) return nestedData.shipments as TripRecord[];
  }

  return [];
};

const resolveTripId = (trip: TripRecord, index: number) =>
  String(trip.id ?? trip._id ?? trip.tripId ?? trip.trackingNumber ?? `trip-${index + 1}`);

const toText = (value: unknown) => (value === null || value === undefined ? "-" : String(value));

const resolveRefId = (value: unknown) => {
  if (!value) return "-";
  if (typeof value === "string" || typeof value === "number") return String(value);
  if (typeof value === "object") {
    return String((value as any)?._id || (value as any)?.id || "-");
  }
  return String(value);
};

const resolveDriverName = (trip: TripRecord) => {
  // Check aggregation-embedded driverInfo first
  const driverInfo = (trip as any)?.driverInfo;
  if (driverInfo && typeof driverInfo === "object") {
    return String(
      driverInfo.fullName ||
      driverInfo.name ||
      driverInfo.email ||
      driverInfo.phoneNumber ||
      "-"
    );
  }
  // Fallback to populated driverId
  const value = (trip as any)?.driverId;
  if (!value) return "-";
  if (typeof value === "string" || typeof value === "number") return String(value);
  if (typeof value === "object") {
    return String(
      (value as any)?.fullName ||
      (value as any)?.name ||
      (value as any)?.driverName ||
      (value as any)?.email ||
      (value as any)?.phoneNumber ||
      "-"
    );
  }
  return String(value);
};

const resolveVehicleLabel = (trip: TripRecord) => {
  // Check aggregation-embedded vehicleInfo first
  const vehicleInfo = (trip as any)?.vehicleInfo;
  if (vehicleInfo && typeof vehicleInfo === "object") {
    return String(
      vehicleInfo.plateNumber ||
      vehicleInfo.model ||
      vehicleInfo.vehicleType ||
      vehicleInfo.name ||
      "-"
    );
  }
  // Fallback to populated vehicleId
  const value = (trip as any)?.vehicleId;
  if (!value) return "-";
  if (typeof value === "string" || typeof value === "number") return String(value);
  if (typeof value === "object") {
    return String(
      (value as any)?.plateNumber ||
      (value as any)?.model ||
      (value as any)?.vehicleType ||
      (value as any)?.name ||
      "-"
    );
  }
  return String(value);
};

const resolveStatus = (value: unknown) =>
  String(value || "pending")
    .toLowerCase()
    .replace(/\s+/g, "_")
    .replace(/-/g, "_");

const formatMilestone = (value: unknown) => {
  if (!value) return "pending";
  return String(value).toLowerCase().replace(/\s+/g, "_");
};

const statusConfig: Record<string, { label: string; icon: React.ComponentType<{ className?: string }>; className: string }> = {
  started: { label: "Started", icon: PlayCircle, className: "text-blue-600 bg-blue-100" },
  arrived: { label: "Arrived", icon: CheckCircle, className: "text-emerald-600 bg-emerald-100" },
  in_transit: { label: "In Transit", icon: Truck, className: "text-primary bg-primary/10" },
  delivered: { label: "Delivered", icon: CheckCircle, className: "text-success bg-success/10" },
  pending: { label: "Pending", icon: Clock, className: "text-warning bg-warning/10" },
  delayed: { label: "Delayed", icon: AlertTriangle, className: "text-destructive bg-destructive/10" },
  cancelled: { label: "Cancelled", icon: XCircle, className: "text-destructive bg-destructive/10" },
  completed: { label: "Completed", icon: CheckCircle, className: "text-success bg-success/10" },
};

export default function AllShipments() {
  const navigate = useNavigate();
  const [trips, setTrips] = React.useState<TripRecord[]>([]);
  const [query, setQuery] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const loadTrips = React.useCallback(async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      navigate("/login");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const role = localStorage.getItem("userRole");
      const result =
        role === "COMPANY_ADMIN"
          ? await getCompanyTrips(token)
          : role === "DRIVER"
          ? await getDriverTripsHistory(token)
          : await getTrips(token);
      if (!result.ok) {
        const message =
          (result.data && typeof result.data === "object" && "message" in result.data && result.data.message) ||
          "Unable to load trips.";
        setError(String(message));
        setTrips([]);
        return;
      }

      setTrips(extractTrips(result.data));
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unable to load trips.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  React.useEffect(() => {
    loadTrips();
  }, [loadTrips]);

  const normalizedQuery = query.trim().toLowerCase();
  const filteredTrips = trips.filter((trip, index) => {
    if (!normalizedQuery) return true;
    const id = resolveTripId(trip, index);
    const haystack = [
      id,
      resolveRefId((trip as any)?.orderId),
      resolveDriverName(trip),
      resolveVehicleLabel(trip),
      toText((trip as any)?.milestone),
      toText((trip as any)?.lastNote),
    ]
      .filter(Boolean)
      .map((value) => String(value).toLowerCase())
      .join(" ");

    return haystack.includes(normalizedQuery);
  });

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
          <Input
            placeholder="Search by trip ID, customer..."
            className="pl-10"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
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

      {isLoading ? (
        <div className="rounded-xl border border-border bg-card p-8 text-center text-muted-foreground">
          Loading trips...
        </div>
      ) : error ? (
        <div className="rounded-xl border border-destructive/40 bg-destructive/5 p-6 text-sm text-destructive">
          {error}
        </div>
      ) : (
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-secondary/50">
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Trip ID</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Driver</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Vehicle</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Milestone</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Status</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Updated</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredTrips.map((trip, index) => {
                  const id = resolveTripId(trip, index);
                  const statusKey = resolveStatus((trip as any)?.milestone);
                  const status = statusConfig[statusKey] || statusConfig.pending;
                  const StatusIcon = status.icon;

                  return (
                    <tr
                      key={id}
                      className="hover:bg-secondary/30 transition-colors cursor-pointer"
                      onClick={() => navigate(`/trips/${id}`)}
                    >
                      <td className="whitespace-nowrap px-5 py-4">
                        <div className="flex items-center gap-2">
                          <Package className="h-4 w-4 text-primary" />
                          <span className="font-medium text-card-foreground">{id}</span>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-5 py-4 text-sm text-muted-foreground">
                        {resolveDriverName(trip)}
                      </td>
                      <td className="whitespace-nowrap px-5 py-4 text-sm text-muted-foreground">
                        {resolveVehicleLabel(trip)}
                      </td>
                      <td className="whitespace-nowrap px-5 py-4 text-sm text-muted-foreground">
                        {formatMilestone((trip as any)?.milestone)}
                      </td>
                      <td className="whitespace-nowrap px-5 py-4">
                        <Badge className={cn("gap-1", status.className)}>
                          <StatusIcon className="h-3 w-3" />
                          {status.label}
                        </Badge>
                      </td>
                      <td className="whitespace-nowrap px-5 py-4 text-sm text-muted-foreground">
                        {toText((trip as any)?.updatedAt || (trip as any)?.createdAt)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {filteredTrips.length === 0 && (
            <div className="border-t border-border px-6 py-8 text-center text-sm text-muted-foreground">
              No trips found.
            </div>
          )}
        </div>
      )}
    </DashboardLayout>
  );
}
