import * as React from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { 
  Clock, 
  MapPin, 
  CheckCircle, 
  AlertTriangle, 
  Search, 
  Loader2, 
  Filter, 
  Eye, 
  Map as MapIcon,
  Truck,
  User,
  MoreHorizontal
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { getAllIdleEvents, resolveIdleEvent } from "@/services/idleService";
import { format } from "date-fns";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix Leaflet marker icon issue
const idleIcon = L.divIcon({
  className: "custom-div-icon",
  html: `<div style="background-color: #ef4444; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 3px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.4);"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg></div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 16]
});

type IdleEvent = {
  _id: string;
  tripId: string;
  driverId: string;
  detectedAt: string;
  location: {
    coordinates: [number, number];
  };
  distanceMoved: number;
  idleDurationMinutes: number;
  resolved: boolean;
  resolvedAt?: string;
  notes?: string;
  trip: any;
  vehicle: any;
  driver: any;
};

export default function IdleDetection() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [events, setEvents] = React.useState<IdleEvent[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [query, setQuery] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<"all" | "active" | "resolved">("active");
  const [selectedEvent, setSelectedEvent] = React.useState<IdleEvent | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = React.useState(false);
  const [isResolveOpen, setIsResolveOpen] = React.useState(false);
  const [resolveNotes, setResolveNotes] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const loadEvents = React.useCallback(async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      navigate("/login");
      return;
    }

    setIsLoading(true);
    try {
      const result = await getAllIdleEvents(token);
      if (result.ok) {
        setEvents(result.data.data.idleEvents);
      } else {
        toast({
          title: "Error",
          description: "Failed to load idle events",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [navigate, toast]);

  React.useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  const filteredEvents = events.filter((event) => {
    const matchesStatus = 
      statusFilter === "all" || 
      (statusFilter === "active" && !event.resolved) || 
      (statusFilter === "resolved" && event.resolved);
    
    if (!matchesStatus) return false;

    if (!query) return true;
    const q = query.toLowerCase();
    return (
      event.vehicle?.plateNumber?.toLowerCase().includes(q) ||
      event.driver?.fullName?.toLowerCase().includes(q) ||
      event.notes?.toLowerCase().includes(q)
    );
  });

  const handleResolve = async () => {
    if (!selectedEvent) return;
    const token = localStorage.getItem("authToken");
    if (!token) return;

    setIsSubmitting(true);
    try {
      const result = await resolveIdleEvent(token, selectedEvent._id, resolveNotes);
      if (result.ok) {
        toast({
          title: "Success",
          description: "Idle event resolved successfully",
        });
        setIsResolveOpen(false);
        setResolveNotes("");
        loadEvents();
      } else {
        toast({
          title: "Error",
          description: "Failed to resolve event",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const activeCount = events.filter(e => !e.resolved).length;
  const resolvedCount = events.filter(e => e.resolved).length;

  return (
    <DashboardLayout>
      <div className="mb-8 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Idle Detection</h1>
          <p className="text-muted-foreground mt-1">Monitor vehicle inactivity and optimize fleet utilization</p>
        </div>
        <Button onClick={loadEvents} disabled={isLoading} variant="outline" className="shadow-sm">
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Refresh
        </Button>
      </div>

      {/* Stats Section */}
      <div className="grid gap-6 sm:grid-cols-3 mb-8">
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader className="pb-2">
            <CardDescription className="text-primary font-medium uppercase text-[10px] tracking-wider">Total Events</CardDescription>
            <CardTitle className="text-4xl font-black">{events.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card className="bg-amber-500/5 border-amber-500/20">
          <CardHeader className="pb-2">
            <CardDescription className="text-amber-600 font-medium uppercase text-[10px] tracking-wider">Active Idle</CardDescription>
            <CardTitle className="text-4xl font-black text-amber-600">{activeCount}</CardTitle>
          </CardHeader>
        </Card>
        <Card className="bg-emerald-500/5 border-emerald-500/20">
          <CardHeader className="pb-2">
            <CardDescription className="text-emerald-600 font-medium uppercase text-[10px] tracking-wider">Resolved</CardDescription>
            <CardTitle className="text-4xl font-black text-emerald-600">{resolvedCount}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Filters & Actions */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by vehicle or driver..."
            className="pl-9 bg-background/50 border-border/50"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2 p-1 bg-muted rounded-lg border border-border">
          <Button 
            variant={statusFilter === "active" ? "secondary" : "ghost"} 
            size="sm" 
            onClick={() => setStatusFilter("active")}
            className="text-xs h-8 px-4"
          >
            Active
          </Button>
          <Button 
            variant={statusFilter === "resolved" ? "secondary" : "ghost"} 
            size="sm" 
            onClick={() => setStatusFilter("resolved")}
            className="text-xs h-8 px-4"
          >
            Resolved
          </Button>
          <Button 
            variant={statusFilter === "all" ? "secondary" : "ghost"} 
            size="sm" 
            onClick={() => setStatusFilter("all")}
            className="text-xs h-8 px-4"
          >
            All
          </Button>
        </div>
      </div>

      {/* Events Grid */}
      {isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
      ) : filteredEvents.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-20 text-center">
          <Clock className="mx-auto h-16 w-16 text-muted-foreground/20 mb-4" />
          <p className="text-xl font-medium text-muted-foreground">No idle events found</p>
          <p className="text-sm text-muted-foreground/60 mt-1">Check back later or adjust your filters</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredEvents.map((event) => (
            <Card key={event._id} className="group overflow-hidden border-border/50 hover:border-primary/30 hover:shadow-lg transition-all duration-300">
              <div className={`h-1.5 w-full ${event.resolved ? "bg-emerald-500" : "bg-amber-500"}`} />
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start">
                  <Badge variant="outline" className={event.resolved ? "text-emerald-600 bg-emerald-50 border-emerald-200" : "text-amber-600 bg-amber-50 border-amber-200"}>
                    {event.resolved ? "RESOLVED" : "ACTIVE IDLE"}
                  </Badge>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => { setSelectedEvent(event); setIsDetailsOpen(true); }}>
                        <Eye className="mr-2 h-4 w-4" /> View Details
                      </DropdownMenuItem>
                      {!event.resolved && (
                        <DropdownMenuItem onClick={() => { setSelectedEvent(event); setIsResolveOpen(true); }}>
                          <CheckCircle className="mr-2 h-4 w-4 text-emerald-500" /> Resolve Event
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => navigate(`/trips/${event.tripId}`)}>
                        <Truck className="mr-2 h-4 w-4" /> View Trip
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <CardTitle className="mt-4 flex items-center gap-2">
                  <Truck className="h-5 w-5 text-muted-foreground" />
                  {event.vehicle?.plateNumber || "Unknown Vehicle"}
                </CardTitle>
                <CardDescription className="flex items-center gap-1">
                  <User className="h-3 w-3" />
                  {event.driver?.fullName || "Unknown Driver"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>Duration</span>
                  </div>
                  <span className="font-bold text-foreground">{event.idleDurationMinutes} mins</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>Detected</span>
                  </div>
                  <span className="text-foreground">{format(new Date(event.detectedAt), "MMM dd, HH:mm")}</span>
                </div>
                
                {/* Mini Map Placeholder/Visual */}
                <div className="h-32 rounded-xl bg-muted/30 overflow-hidden relative border border-border/50 group-hover:border-primary/20 transition-colors">
                   <div className="absolute inset-0 flex items-center justify-center opacity-20 grayscale group-hover:grayscale-0 group-hover:opacity-40 transition-all">
                      <MapIcon className="h-12 w-12" />
                   </div>
                   <div className="absolute bottom-2 left-2 right-2 p-2 bg-background/80 backdrop-blur-sm rounded-lg text-[10px] font-medium border border-border/50 flex items-center gap-2">
                      <MapPin className="h-3 w-3 text-destructive" />
                      <span className="truncate">Lng: {event.location?.coordinates?.[0]?.toFixed(4) ?? 'N/A'}, Lat: {event.location?.coordinates?.[1]?.toFixed(4) ?? 'N/A'}</span>
                   </div>
                </div>

                {!event.resolved ? (
                  <Button 
                    className="w-full mt-2 bg-amber-500 hover:bg-amber-600 text-white border-none shadow-md shadow-amber-500/20"
                    onClick={() => { setSelectedEvent(event); setIsResolveOpen(true); }}
                  >
                    Resolve Now
                  </Button>
                ) : (
                  <div className="pt-2">
                    <p className="text-[10px] uppercase font-bold text-muted-foreground mb-1">Resolution Note</p>
                    <p className="text-xs text-muted-foreground italic line-clamp-2">"{event.notes || "No notes provided"}"</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl flex items-center gap-2">
              <AlertTriangle className="h-6 w-6 text-amber-500" />
              Idle Event Details
            </DialogTitle>
            <DialogDescription>
              Detailed information about vehicle inactivity recorded on {selectedEvent && format(new Date(selectedEvent.detectedAt), "PPPP 'at' p")}
            </DialogDescription>
          </DialogHeader>

          {selectedEvent && (
            <div className="space-y-6 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-[10px] font-bold uppercase text-muted-foreground">Vehicle</p>
                  <p className="font-semibold">{selectedEvent.vehicle?.plateNumber} ({selectedEvent.vehicle?.vehicleType})</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold uppercase text-muted-foreground">Driver</p>
                  <p className="font-semibold">{selectedEvent.driver?.fullName}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold uppercase text-muted-foreground">Idle Duration</p>
                  <p className="font-semibold text-amber-600">{selectedEvent.idleDurationMinutes} minutes</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold uppercase text-muted-foreground">Status</p>
                  <Badge variant={selectedEvent.resolved ? "secondary" : "destructive"}>
                    {selectedEvent.resolved ? "RESOLVED" : "ACTIVE"}
                  </Badge>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-semibold flex items-center gap-2">
                  <MapIcon className="h-4 w-4" />
                  Location Map
                </p>
                <div className="h-[300px] w-full rounded-xl border border-border overflow-hidden z-0">
                  <MapContainer 
                    center={[selectedEvent.location?.coordinates?.[1] ?? 0, selectedEvent.location?.coordinates?.[0] ?? 0]} 
                    zoom={15} 
                    style={{ height: "100%", width: "100%" }}
                  >
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Marker 
                      position={[selectedEvent.location?.coordinates?.[1] ?? 0, selectedEvent.location?.coordinates?.[0] ?? 0]}
                      icon={idleIcon}
                    >
                      <Popup>
                        <div className="text-center">
                          <p className="font-bold">Idle Location</p>
                          <p className="text-xs">{selectedEvent.vehicle?.plateNumber}</p>
                        </div>
                      </Popup>
                    </Marker>
                  </MapContainer>
                </div>
              </div>

              {selectedEvent.resolved && (
                <div className="rounded-lg bg-emerald-50 p-4 border border-emerald-100">
                  <p className="text-sm font-bold text-emerald-800 mb-1 flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    Resolution Details
                  </p>
                  <p className="text-sm text-emerald-700">Resolved on {format(new Date(selectedEvent.resolvedAt!), "MMM dd, HH:mm")}</p>
                  <p className="text-sm mt-2 font-medium">Notes:</p>
                  <p className="text-sm italic text-emerald-900">"{selectedEvent.notes || "No notes provided"}"</p>
                </div>
              )}
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDetailsOpen(false)}>Close</Button>
            {selectedEvent && !selectedEvent.resolved && (
              <Button onClick={() => { setIsDetailsOpen(false); setIsResolveOpen(true); }}>Resolve Event</Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Resolve Dialog */}
      <Dialog open={isResolveOpen} onOpenChange={setIsResolveOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Resolve Idle Event</DialogTitle>
            <DialogDescription>
              Mark this idle event as resolved. Add any notes about the situation (e.g., traffic, breakdown, rest stop).
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold">Resolution Notes</label>
              <textarea 
                className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Enter notes about this event..."
                value={resolveNotes}
                onChange={(e) => setResolveNotes(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsResolveOpen(false)}>Cancel</Button>
            <Button onClick={handleResolve} disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle className="mr-2 h-4 w-4" />}
              Confirm Resolution
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
