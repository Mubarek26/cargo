import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Truck, MapPin, Calendar, Clock, ArrowRight, Loader2, Package, CheckCircle, Search, Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { tripService } from "@/services/tripService";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const milestoneConfig: any = {
  STARTED: { label: "Started", className: "text-blue-500 bg-blue-500/10" },
  ARRIVED: { label: "Arrived", className: "text-warning bg-warning/10" },
  IN_TRANSIT: { label: "In Transit", className: "text-primary bg-primary/10" },
  DELIVERED: { label: "Delivered", className: "text-success bg-success/10" },
  COMPLETED: { label: "Completed", className: "text-success bg-success/10" },
};

export default function DriverTrips() {
  const navigate = useNavigate();
  const [trips, setTrips] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  useEffect(() => {
    fetchTrips();
  }, []);

  const fetchTrips = async () => {
    try {
      const res = await tripService.getDriverTrips();
      if (res.ok && res.data?.status === "success") {
        setTrips(res.data.data.trips);
      }
    } catch (error) {
      toast.error("Failed to fetch trips");
    } finally {
      setIsLoading(false);
    }
  };

  const filteredTrips = trips.filter(trip => {
    const matchesSearch = 
      trip.orderId?.orderNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.orderId?.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.orderId?.pickupLocation?.city?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.orderId?.deliveryLocation?.city?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === "ALL" || trip.milestone === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <DashboardLayout>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">My Trips</h1>
          <p className="text-muted-foreground">Manage and update your assigned deliveries</p>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="relative lg:col-span-2">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input 
            placeholder="Search by order #, city or title..." 
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Statuses</SelectItem>
            <SelectItem value="STARTED">Started</SelectItem>
            <SelectItem value="ARRIVED">Arrived</SelectItem>
            <SelectItem value="IN_TRANSIT">In Transit</SelectItem>
            <SelectItem value="DELIVERED">Delivered</SelectItem>
            <SelectItem value="COMPLETED">Completed</SelectItem>
          </SelectContent>
        </Select>
        { (searchQuery || statusFilter !== "ALL") && (
          <Button 
            variant="ghost" 
            className="gap-2 text-muted-foreground"
            onClick={() => {
              setSearchQuery("");
              setStatusFilter("ALL");
            }}
          >
            <X className="h-4 w-4" /> Clear Filters
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className="flex h-[50vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : filteredTrips.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-card rounded-xl border border-border shadow-sm">
          <Truck className="h-12 w-12 text-muted-foreground mb-4 opacity-20" />
          <p className="text-lg font-medium text-muted-foreground">
            {trips.length === 0 ? "No trips assigned to you yet" : "No trips match your filters"}
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredTrips.map((trip) => {
            const milestone = milestoneConfig[trip.milestone] || { label: trip.milestone, className: "" };
            const order = trip.orderId;
            
            return (
              <div 
                key={trip._id} 
                className="group relative overflow-hidden rounded-xl border border-border bg-card p-5 hover:border-primary/50 transition-all cursor-pointer shadow-sm hover:shadow-md"
                onClick={() => navigate(`/driver/trips/${trip._id}`)}
              >
                <div className="mb-4 flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className="rounded-lg bg-primary/10 p-2">
                      <Package className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold text-card-foreground line-clamp-1">{order?.title || "Shipment"}</h3>
                      <p className="text-xs text-muted-foreground">Order: {order?.orderNumber}</p>
                    </div>
                  </div>
                  <Badge className={cn("text-[10px] uppercase", milestone.className)}>
                    {milestone.label}
                  </Badge>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
                    <div className="flex items-center gap-1 overflow-hidden">
                      <span className="truncate">{order?.pickupLocation?.city}</span>
                      <ArrowRight className="h-3 w-3 text-muted-foreground shrink-0" />
                      <span className="truncate">{order?.deliveryLocation?.city}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>Pickup: {new Date(order?.pickupDate).toLocaleDateString()}</span>
                  </div>
                  {trip.vehicleId && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Truck className="h-4 w-4" />
                      <span>{trip.vehicleId.plateNumber} ({trip.vehicleId.vehicleType})</span>
                    </div>
                  )}
                </div>

                <Button className="w-full gap-2 group-hover:bg-primary group-hover:text-primary-foreground" variant="outline">
                  View Details
                </Button>
              </div>
            );
          })}
        </div>
      )}
    </DashboardLayout>
  );
}
