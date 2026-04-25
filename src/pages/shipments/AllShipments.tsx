import * as React from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { 
  Package, Search, Filter, Download, Plus, CheckCircle, Clock, 
  Truck, AlertTriangle, XCircle, PlayCircle, ArrowRight, Loader2, X 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { getCompanyTrips, getDriverTripsHistory, getTrips } from "@/services/tripService";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type TripRecord = Record<string, unknown> & {
  id?: string | number;
  _id?: string | number;
  tripId?: string | number;
  trackingNumber?: string;
  status?: string;
  milestone?: string;
  orderId?: any;
  updatedAt?: string;
  createdAt?: string;
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
  const driverInfo = (trip as any)?.driverInfo;
  if (driverInfo && typeof driverInfo === "object") {
    return String(driverInfo.fullName || driverInfo.name || driverInfo.email || "-");
  }
  const value = (trip as any)?.driverId;
  if (!value) return "-";
  if (typeof value === "string" || typeof value === "number") return String(value);
  if (typeof value === "object") {
    return String((value as any)?.fullName || (value as any)?.name || (value as any)?.email || "-");
  }
  return String(value);
};

const resolveVehicleLabel = (trip: TripRecord) => {
  const vehicleInfo = (trip as any)?.vehicleInfo;
  if (vehicleInfo && typeof vehicleInfo === "object") {
    return String(vehicleInfo.plateNumber || vehicleInfo.model || "-");
  }
  const value = (trip as any)?.vehicleId;
  if (!value) return "-";
  if (typeof value === "string" || typeof value === "number") return String(value);
  if (typeof value === "object") {
    return String((value as any)?.plateNumber || (value as any)?.model || "-");
  }
  return String(value);
};

const resolveStatus = (value: unknown) =>
  String(value || "pending")
    .toLowerCase()
    .replace(/\s+/g, "_")
    .replace(/-/g, "_");

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
  const [statusFilter, setStatusFilter] = React.useState("ALL");
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

  const filteredTrips = trips.filter((trip, index) => {
    const id = resolveTripId(trip, index);
    const orderNumber = trip.orderId?.orderNumber || (trip as any)?.orderNumber || id;
    const title = trip.orderId?.title || "Shipment";
    const driver = resolveDriverName(trip);
    const vehicle = resolveVehicleLabel(trip);
    const cityFrom = trip.orderId?.pickupLocation?.city || "";
    const cityTo = trip.orderId?.deliveryLocation?.city || "";

    const matchesQuery = !query.trim() || [
      id, orderNumber, title, driver, vehicle, cityFrom, cityTo
    ].some(v => String(v).toLowerCase().includes(query.toLowerCase()));

    const currentStatus = resolveStatus(trip.milestone);
    const matchesStatus = statusFilter === "ALL" || currentStatus === statusFilter.toLowerCase();

    return matchesQuery && matchesStatus;
  });

  const stats = React.useMemo(() => {
    return {
      total: trips.length,
      inTransit: trips.filter(t => ["in_transit", "started"].includes(resolveStatus(t.milestone))).length,
      delivered: trips.filter(t => ["delivered", "completed", "arrived"].includes(resolveStatus(t.milestone))).length,
      delayed: trips.filter(t => resolveStatus(t.milestone) === "delayed").length,
    };
  }, [trips]);

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
          <Button onClick={() => navigate("/shipments/create")}>
            <Plus className="mr-2 h-4 w-4" />
            New Shipment
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Total Shipments", value: stats.total, icon: Package, color: "text-primary", bg: "bg-primary/10" },
          { label: "In Transit", value: stats.inTransit, icon: Truck, color: "text-blue-600", bg: "bg-blue-100" },
          { label: "Delivered", value: stats.delivered, icon: CheckCircle, color: "text-emerald-600", bg: "bg-emerald-100" },
          { label: "Delayed", value: stats.delayed, icon: AlertTriangle, color: "text-destructive", bg: "bg-destructive/10" },
        ].map((stat, i) => (
          <div key={i} className="rounded-xl border border-border bg-card p-4 transition-all hover:shadow-md">
            <div className="flex items-center gap-3">
              <div className={cn("rounded-lg p-2", stat.bg)}>
                <stat.icon className={cn("h-5 w-5", stat.color)} />
              </div>
              <div>
                <p className="text-2xl font-bold text-card-foreground">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="relative lg:col-span-2">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by ID, order #, driver or city..."
            className="pl-10"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger>
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Statuses</SelectItem>
            <SelectItem value="PENDING">Pending</SelectItem>
            <SelectItem value="IN_TRANSIT">In Transit</SelectItem>
            <SelectItem value="DELIVERED">Delivered</SelectItem>
            <SelectItem value="DELAYED">Delayed</SelectItem>
            <SelectItem value="CANCELLED">Cancelled</SelectItem>
          </SelectContent>
        </Select>
        { (query || statusFilter !== "ALL") && (
          <Button 
            variant="ghost" 
            className="gap-2 text-muted-foreground"
            onClick={() => {
              setQuery("");
              setStatusFilter("ALL");
            }}
          >
            <X className="h-4 w-4" /> Clear Filters
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 rounded-xl border border-border bg-card">
          <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
          <p className="text-muted-foreground">Loading shipments...</p>
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
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Shipment Details</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Route</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Drivers</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Current Status</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Updated</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredTrips.map((trip, index) => {
                  const id = resolveTripId(trip, index);
                  const statusKey = resolveStatus(trip.milestone);
                  const status = statusConfig[statusKey] || statusConfig.pending;
                  const StatusIcon = status.icon;

                  return (
                    <tr
                      key={id}
                      className="hover:bg-secondary/30 transition-colors cursor-pointer"
                      onClick={() => navigate(`/trips/${id}`)}
                    >
                      <td className="whitespace-nowrap px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="rounded-full bg-primary/10 p-2 shrink-0">
                            <Package className="h-4 w-4 text-primary" />
                          </div>
                          <div className="text-sm">
                            <p className="font-bold text-card-foreground leading-tight">
                              {trip.orderId?.orderNumber || (trip as any)?.orderNumber || id}
                            </p>
                            <p className="text-xs text-muted-foreground truncate max-w-[150px]">
                              {trip.orderId?.title || "Standard Shipment"}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-sm">
                        <div className="flex items-center gap-1.5">
                           <span className="text-card-foreground font-medium">{trip.orderId?.pickupLocation?.city || "N/A"}</span>
                           <ArrowRight className="h-3 w-3 text-muted-foreground" />
                           <span className="text-card-foreground font-medium">{trip.orderId?.deliveryLocation?.city || "N/A"}</span>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-sm">
                        <div className="flex flex-col">
                          <span className="font-medium text-card-foreground">{resolveDriverName(trip)}</span>
                          <span className="text-[11px] text-muted-foreground">{resolveVehicleLabel(trip)}</span>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3">
                        <Badge className={cn("gap-1 text-[11px] px-2.5 py-0.5 h-6 w-fit font-medium", status.className)}>
                          <StatusIcon className="h-3.5 w-3.5" />
                          {status.label}
                        </Badge>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-sm text-muted-foreground">
                        {trip.updatedAt ? new Date(trip.updatedAt).toLocaleDateString() : (trip.createdAt ? new Date(trip.createdAt).toLocaleDateString() : "-")}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {filteredTrips.length === 0 && (
            <div className="px-6 py-12 text-center">
              <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-20" />
              <p className="text-muted-foreground">No shipments found.</p>
            </div>
          )}
        </div>
      )}
    </DashboardLayout>
  );
}
