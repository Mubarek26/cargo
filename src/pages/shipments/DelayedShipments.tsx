import * as React from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { 
  AlertTriangle, Package, Clock, MapPin, Phone, MessageSquare, 
  Loader2, ArrowRight, Calendar, User, Search, Filter, X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { getDelayedTrips } from "@/services/tripService";
import { cn } from "@/lib/utils";

type TripRecord = Record<string, unknown> & {
  _id?: string;
  milestone?: string;
  updatedAt?: string;
  orderId?: any;
  driverId?: any;
  vehicleId?: any;
};

const extractTrips = (payload: unknown): TripRecord[] => {
  if (Array.isArray(payload)) return payload as TripRecord[];
  if (!payload || typeof payload !== "object") return [];
  const data = payload as Record<string, unknown>;
  if (Array.isArray(data.trips)) return data.trips as TripRecord[];
  if (Array.isArray(data.data)) return data.data as TripRecord[];
  return [];
};

export default function DelayedShipments() {
  const navigate = useNavigate();
  const [trips, setTrips] = React.useState<TripRecord[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [searchQuery, setSearchQuery] = React.useState("");

  const loadDelayedTrips = React.useCallback(async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      navigate("/login");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await getDelayedTrips(token);
      if (result.ok) {
        setTrips(extractTrips(result.data));
      } else {
        setError((result.data as any)?.message || "Failed to load delayed shipments.");
      }
    } catch (err) {
      setError("Unable to connect to the server.");
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  React.useEffect(() => {
    loadDelayedTrips();
  }, [loadDelayedTrips]);

  const filteredTrips = trips.filter(trip => {
    const searchStr = [
      trip.orderId?.orderNumber,
      trip.orderId?.title,
      trip.driverId?.fullName,
      trip.orderId?.pickupLocation?.city,
      trip.orderId?.deliveryLocation?.city
    ].join(" ").toLowerCase();
    return searchStr.includes(searchQuery.toLowerCase());
  });

  const getDelayText = (deadline: string) => {
    if (!deadline) return "Delayed";
    const now = new Date();
    const target = new Date(deadline);
    const diff = now.getTime() - target.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days > 0) return `${days} day${days > 1 ? 's' : ''} late`;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    return `${hours} hour${hours > 1 ? 's' : ''} late`;
  };

  return (
    <DashboardLayout>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="p-2 bg-destructive/10 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-destructive" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">Delayed Shipments</h1>
          </div>
          <p className="text-muted-foreground">Shipments that have exceeded their delivery deadline</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={loadDelayedTrips} disabled={isLoading}>
            Refresh
          </Button>
          <div className="flex flex-col items-end">
            <span className="text-[10px] uppercase font-bold text-muted-foreground">Total Delayed</span>
            <span className="text-2xl font-black text-destructive">{trips.length}</span>
          </div>
        </div>
      </div>

      {/* Alert banner */}
      <div className="mb-6 rounded-xl border border-destructive/20 bg-destructive/5 p-4 animate-in fade-in slide-in-from-top-2 duration-500">
        <div className="flex items-start gap-4">
          <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-destructive text-white">
            <Clock className="h-4 w-4" />
          </div>
          <div>
            <h3 className="font-bold text-destructive">Urgent Attention Required</h3>
            <p className="text-sm text-destructive/80 leading-relaxed">
              These shipments are past their promised delivery date. High priority should be given to resolving these delays to maintain customer satisfaction.
            </p>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input 
          className="pl-10 h-12 bg-card border-border rounded-xl shadow-sm"
          placeholder="Filter by Order #, Driver, or Location..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {searchQuery && (
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8"
            onClick={() => setSearchQuery("")}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-24 rounded-2xl border border-dashed border-border bg-card/50">
          <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
          <p className="text-muted-foreground font-medium">Analyzing shipments for delays...</p>
        </div>
      ) : error ? (
        <div className="rounded-xl border border-destructive/40 bg-destructive/5 p-6 text-center">
          <p className="text-destructive font-semibold">{error}</p>
          <Button variant="outline" className="mt-4" onClick={loadDelayedTrips}>Try Again</Button>
        </div>
      ) : filteredTrips.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 rounded-2xl border border-dashed border-border bg-card/50">
          <div className="h-16 w-16 rounded-full bg-success/10 flex items-center justify-center mb-4 text-success">
            <Package className="h-8 w-8" />
          </div>
          <p className="text-lg font-bold text-foreground">All Clear!</p>
          <p className="text-muted-foreground">No shipments are currently identified as delayed.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredTrips.map((trip) => (
            <div 
              key={trip._id} 
              className="group relative rounded-2xl border border-border bg-card p-5 transition-all hover:shadow-xl hover:border-primary/20 cursor-pointer overflow-hidden"
              onClick={() => navigate(`/trips/${trip._id}`)}
            >
              <div className="absolute top-0 left-0 w-1.5 h-full bg-destructive" />
              
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                <div className="flex-1 space-y-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 font-bold px-3 py-1">
                      {trip.orderId?.orderNumber || "SHIPMENT"}
                    </Badge>
                    <Badge className="bg-destructive text-white font-black px-3 py-1 uppercase text-[10px] tracking-widest">
                      {getDelayText(trip.orderId?.deliveryDeadline)}
                    </Badge>
                    <span className="text-sm font-bold text-foreground ml-auto lg:ml-0">
                      {trip.orderId?.title}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="flex items-start gap-3">
                      <div className="mt-1 h-8 w-8 shrink-0 flex items-center justify-center rounded-lg bg-secondary">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-[10px] uppercase font-black text-muted-foreground tracking-wider mb-0.5">Route</p>
                        <div className="flex items-center gap-2 text-sm font-semibold">
                          <span>{trip.orderId?.pickupLocation?.city || "N/A"}</span>
                          <ArrowRight className="h-3 w-3 text-muted-foreground" />
                          <span>{trip.orderId?.deliveryLocation?.city || "N/A"}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="mt-1 h-8 w-8 shrink-0 flex items-center justify-center rounded-lg bg-secondary">
                        <User className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-[10px] uppercase font-black text-muted-foreground tracking-wider mb-0.5">Driver & Vehicle</p>
                        <p className="text-sm font-semibold">{trip.driverId?.fullName || "Unassigned"}</p>
                        <p className="text-xs text-muted-foreground">{trip.vehicleId?.plateNumber || "No Vehicle"}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="mt-1 h-8 w-8 shrink-0 flex items-center justify-center rounded-lg bg-secondary">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-[10px] uppercase font-black text-muted-foreground tracking-wider mb-0.5">Deadline</p>
                        <p className="text-sm font-semibold text-destructive">
                          {trip.orderId?.deliveryDeadline ? new Date(trip.orderId.deliveryDeadline).toLocaleDateString(undefined, {
                            month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                          }) : "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-row lg:flex-col items-center gap-2 pt-4 lg:pt-0 border-t lg:border-t-0 lg:border-l border-border lg:pl-6 shrink-0">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="w-full justify-start text-xs font-bold gap-2 text-muted-foreground hover:text-primary hover:bg-primary/5"
                    onClick={(e) => {
                      e.stopPropagation();
                      window.location.href = `tel:${trip.driverId?.phoneNumber}`;
                    }}
                  >
                    <Phone className="h-3.5 w-3.5" />
                    Call Driver
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="w-full justify-start text-xs font-bold gap-2 text-muted-foreground hover:text-primary hover:bg-primary/5"
                    onClick={(e) => {
                      e.stopPropagation();
                      // Open modal or navigate to chat
                    }}
                  >
                    <MessageSquare className="h-3.5 w-3.5" />
                    Notify Client
                  </Button>
                  <Button 
                    size="sm" 
                    className="w-full text-xs font-black gap-2 mt-2 bg-foreground hover:bg-foreground/90 text-background shadow-lg"
                  >
                    <MapPin className="h-3.5 w-3.5" />
                    Track Live
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
