import { useState, useEffect, useMemo, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { MapPin, Package, Truck, Clock, Filter, Search, Loader2, Navigation, AlertCircle, Maximize } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { tripService } from "@/services/tripService";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X } from "lucide-react";

// Custom Truck Icon for Map
const truckIcon = L.divIcon({
  className: "custom-div-icon",
  html: `<div style="background-color: #3b82f6; width: 34px; height: 34px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 3px solid white; box-shadow: 0 4px 10px rgba(0,0,0,0.3); transform: scale(1); transition: transform 0.2s;"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18H9"/><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/></svg></div>`,
  iconSize: [34, 34],
  iconAnchor: [17, 17]
});

const selectedTruckIcon = L.divIcon({
  className: "custom-div-icon",
  html: `<div style="background-color: #f59e0b; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 3px solid white; box-shadow: 0 4px 15px rgba(245, 158, 11, 0.5); transform: scale(1.1); transition: transform 0.2s;"><svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18H9"/><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/></svg></div>`,
  iconSize: [40, 40],
  iconAnchor: [20, 20]
});

function MapController({ center, trips }: { center: [number, number] | null; trips: any[] }) {
  const map = useMap();
  
  useEffect(() => {
    if (center) {
      map.flyTo(center, 13, { duration: 1.5 });
    } else if (trips.length > 0) {
      const bounds = L.latLngBounds(trips.map(t => [t.location.coordinates[1], t.location.coordinates[0]]));
      if (bounds.isValid()) {
        map.fitBounds(bounds, { padding: [50, 50], duration: 1.5 });
      }
    }
  }, [center, trips, map]);
  
  return null;
}

export default function LiveShipmentMap() {
  const [trips, setTrips] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTripId, setSelectedTripId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    fetchTrips();
    const interval = setInterval(fetchTrips, 30000); // Auto-refresh every 30s
    return () => clearInterval(interval);
  }, []);

  const fetchTrips = async () => {
    try {
      const res = await tripService.getCompanyTrips();
      if (res.ok && res.data?.status === "success") {
        // Include all trips that have location data, regardless of status
        const activeTrips = res.data.data.trips.filter((t: any) => 
          t.location?.coordinates
        );
        setTrips(activeTrips);
      } else {
        setError("Failed to load live tracking data");
      }
    } catch (err) {
      setError("An error occurred while connecting to the tracking service");
    } finally {
      setIsLoading(false);
    }
  };

  const filteredTrips = useMemo(() => {
    return trips.filter(t => {
      const matchesSearch = 
        t.orderId?.orderNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.driverId?.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.vehicleId?.plateNumber?.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === "all" || t.milestone === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [trips, searchQuery, statusFilter]);

  const selectedTrip = useMemo(() => 
    trips.find(t => t._id === selectedTripId), 
  [trips, selectedTripId]);

  const mapCenter = useMemo(() => {
    if (selectedTrip?.location?.coordinates) {
      return [selectedTrip.location.coordinates[1], selectedTrip.location.coordinates[0]] as [number, number];
    }
    if (trips.length > 0) {
      // Default to first trip if none selected
      return [trips[0].location.coordinates[1], trips[0].location.coordinates[0]] as [number, number];
    }
    return [9.03, 38.74] as [number, number]; // Addis Ababa default
  }, [selectedTrip, trips]);

  if (isLoading && trips.length === 0) {
    return (
      <DashboardLayout>
        <div className="flex h-[70vh] items-center justify-center">
          <div className="text-center">
            <Loader2 className="mx-auto h-10 w-10 animate-spin text-primary" />
            <p className="mt-4 text-muted-foreground font-medium">Initializing tracking system...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Live Shipment Map</h1>
          <p className="text-muted-foreground">Monitor all active deliveries in real-time</p>
        </div>
        <div className="flex items-center gap-2 text-sm font-medium">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-success animate-pulse" />
            <span>{trips.length} Active Shipments</span>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-6 flex items-center gap-3 rounded-xl border border-destructive/20 bg-destructive/5 p-4 text-destructive">
          <AlertCircle className="h-5 w-5" />
          <p className="text-sm font-medium">{error}</p>
          <Button variant="outline" size="sm" onClick={() => fetchTrips()} className="ml-auto">Retry</Button>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-4">
        {/* Map View */}
        <div className="lg:col-span-3">
          <div className="relative h-[600px] w-full rounded-2xl border border-border bg-card shadow-xl overflow-hidden group">
            <MapContainer 
              center={mapCenter} 
              zoom={12} 
              style={{ height: "100%", width: "100%" }}
              zoomControl={false}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              
              <MapController center={selectedTripId ? mapCenter : null} trips={trips} />

              {trips.map((trip) => (
                <Marker 
                  key={trip._id}
                  position={[trip.location.coordinates[1], trip.location.coordinates[0]]}
                  icon={selectedTripId === trip._id ? selectedTruckIcon : truckIcon}
                  eventHandlers={{
                    click: () => setSelectedTripId(trip._id),
                  }}
                >
                  <Popup className="custom-popup">
                    <div className="p-1 w-64">
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="outline" className="text-[10px] font-bold">
                          {trip.orderId?.orderNumber}
                        </Badge>
                        <div className="flex flex-col items-end gap-1">
                          <Badge className={cn(
                            "border-none text-[10px]",
                            ["DELIVERED", "COMPLETED"].includes(trip.milestone) 
                              ? "bg-success/10 text-success" 
                              : "bg-primary/10 text-primary"
                          )}>
                            {trip.milestone}
                          </Badge>
                          {trip.lastNote?.includes("Geofence Status:") && (
                            <Badge className={cn(
                              "text-[9px] border-none",
                              trip.lastNote.includes("Off Route") || trip.lastNote.includes("Restricted")
                                ? "bg-destructive/10 text-destructive animate-pulse"
                                : "bg-muted text-muted-foreground"
                            )}>
                              {trip.lastNote.replace("Geofence Status: ", "")}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <h4 className="font-bold text-sm mb-1">{trip.orderId?.title}</h4>
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mb-3">
                        <Truck className="h-3 w-3" /> Driver: {trip.driverId?.fullName}
                      </p>
                      
                      <div className="space-y-2 border-t pt-2">
                        <div className="flex items-center gap-2 text-[10px]">
                          <div className="h-2 w-2 rounded-full bg-blue-500" />
                          <span className="text-muted-foreground truncate">{trip.orderId?.pickupLocation?.address}</span>
                        </div>
                        <div className="flex items-center gap-2 text-[10px]">
                          <div className="h-2 w-2 rounded-full bg-success" />
                          <span className="text-muted-foreground truncate">{trip.orderId?.deliveryLocation?.address}</span>
                        </div>
                      </div>
                      
                      <Button 
                        size="sm" 
                        className="w-full mt-3 h-8 text-xs gap-2"
                        onClick={() => window.open(`/dashboard/orders/${trip.orderId?._id}`, '_blank')}
                      >
                        View Order Details
                      </Button>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
            
            {/* Map UI Elements */}
            <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-2">
              <div className="bg-background/90 backdrop-blur-md p-2 rounded-lg border border-border shadow-lg flex flex-col gap-1">
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => fetchTrips()}>
                  <Navigation className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
        {/* Sidebar List */}
        <div className="flex flex-col rounded-2xl border border-border bg-card shadow-xl overflow-hidden h-[600px]">
          <div className="p-4 border-b border-border bg-muted/30">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-foreground text-sm uppercase tracking-wider">Shipment List</h3>
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-7 text-[10px] px-2 gap-1.5 border-primary/30 text-primary hover:bg-primary/5"
                  onClick={() => setSelectedTripId(null)}
                >
                  <Maximize className="h-3 w-3" />
                  View All
                </Button>
                <Badge variant="secondary" className="font-bold h-7">{filteredTrips.length}</Badge>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input 
                  placeholder="Search ID, driver..." 
                  className="pl-9 h-9 text-xs bg-background"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="flex gap-2">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="h-8 text-[10px] bg-background">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="STARTED">Started</SelectItem>
                    <SelectItem value="IN_TRANSIT">In Transit</SelectItem>
                    <SelectItem value="ARRIVED">Arrived</SelectItem>
                    <SelectItem value="DELIVERED">Delivered</SelectItem>
                    <SelectItem value="COMPLETED">Completed</SelectItem>
                  </SelectContent>
                </Select>

                {(searchQuery || statusFilter !== "all") && (
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    onClick={() => {
                      setSearchQuery("");
                      setStatusFilter("all");
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto divide-y divide-border scrollbar-hide">
            {filteredTrips.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                <Package className="h-10 w-10 text-muted-foreground/30 mb-3" />
                <p className="text-sm font-medium text-muted-foreground">No active shipments found</p>
              </div>
            ) : (
              filteredTrips.map((trip) => (
                <div 
                  key={trip._id} 
                  className={cn(
                    "p-4 cursor-pointer transition-all hover:bg-secondary/40 border-l-4",
                    selectedTripId === trip._id ? "bg-primary/5 border-primary" : "border-transparent"
                  )}
                  onClick={() => setSelectedTripId(trip._id)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                      {trip.orderId?.orderNumber}
                    </span>
                    <div className="flex flex-col items-end gap-1">
                      <Badge className={cn(
                        "text-[9px] px-1.5 h-4 border-none",
                        ["DELIVERED", "COMPLETED"].includes(trip.milestone) 
                          ? "bg-success/10 text-success" 
                          : "bg-primary/10 text-primary"
                      )}>
                        {trip.milestone}
                      </Badge>
                      {trip.lastNote?.includes("Geofence Status:") && (trip.lastNote.includes("Off Route") || trip.lastNote.includes("Restricted")) && (
                        <span className="text-[8px] font-bold text-destructive animate-pulse uppercase">
                          {trip.lastNote.replace("Geofence Status: ", "")}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <h4 className="font-bold text-sm mb-1 truncate text-foreground">{trip.orderId?.title}</h4>
                  
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                      <Truck className="h-3 w-3" />
                      <span className="truncate">{trip.driverId?.fullName}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      <span className="truncate">{trip.orderId?.deliveryLocation?.city}</span>
                    </div>
                  </div>
                  
                  {selectedTripId === trip._id && (
                    <div className="mt-3 pt-3 border-t border-border/50 animate-in fade-in slide-in-from-top-2 duration-300">
                      <div className="grid grid-cols-2 gap-2 mb-3">
                        <div className="bg-background p-2 rounded-md border border-border">
                          <p className="text-[9px] text-muted-foreground uppercase">Vehicle</p>
                          <p className="text-[10px] font-bold">{trip.vehicleId?.plateNumber}</p>
                        </div>
                        <div className="bg-background p-2 rounded-md border border-border">
                          <p className="text-[9px] text-muted-foreground uppercase">Last Update</p>
                          <p className="text-[10px] font-bold">{new Date(trip.updatedAt).toLocaleTimeString()}</p>
                        </div>
                      </div>
                      <Button size="sm" variant="outline" className="w-full h-7 text-[10px]" onClick={() => setSelectedTripId(null)}>
                        Deselect
                      </Button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
