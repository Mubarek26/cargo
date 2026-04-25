import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Truck, CheckCircle, Wrench, AlertTriangle, Fuel, MapPin } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

import { useState, useEffect, useMemo } from "react";
import { getFleetStatus } from "@/services/analyticsService";
import { Loader2, Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const statusConfig = {
  active: { label: "Active", icon: CheckCircle, className: "text-success bg-success/10" },
  maintenance: { label: "Maintenance", icon: Wrench, className: "text-warning bg-warning/10" },
  available: { label: "Available", icon: Truck, className: "text-primary bg-primary/10" },
  inactive: { label: "Inactive", icon: AlertTriangle, className: "text-muted-foreground bg-muted" },
};

export default function FleetStatus() {
  const [data, setData] = useState<{ summary: any; vehicles: any[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await getFleetStatus();
        if (response.status === "success") {
          setData(response.data);
        } else {
          setError("Failed to fetch fleet status");
        }
      } catch (err: any) {
        setError(err.message || "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const vehicleTypes = useMemo(() => {
    if (!data?.vehicles) return [];
    return Array.from(new Set(data.vehicles.map(v => v.type)));
  }, [data]);

  const filteredVehicles = useMemo(() => {
    if (!data?.vehicles) return [];
    
    return data.vehicles.filter(vehicle => {
      const matchesSearch = 
        vehicle.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        vehicle.driver.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === "all" || vehicle.status === statusFilter;
      const matchesType = typeFilter === "all" || vehicle.type === typeFilter;
      
      return matchesSearch && matchesStatus && matchesType;
    });
  }, [data, searchQuery, statusFilter, typeFilter]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex h-[60vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="flex h-[60vh] flex-col items-center justify-center gap-4">
          <AlertTriangle className="h-12 w-12 text-destructive" />
          <p className="text-lg font-semibold text-foreground">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="rounded-lg bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
          >
            Retry
          </button>
        </div>
      </DashboardLayout>
    );
  }

  const { summary } = data!;

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Fleet Status</h1>
        <p className="text-muted-foreground">Monitor your fleet in real-time</p>
      </div>

      {/* Summary cards */}
      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-success/10 p-2.5">
              <CheckCircle className="h-5 w-5 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold text-card-foreground">{summary.active}</p>
              <p className="text-sm text-muted-foreground">Active Vehicles</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-warning/10 p-2.5">
              <Wrench className="h-5 w-5 text-warning" />
            </div>
            <div>
              <p className="text-2xl font-bold text-card-foreground">{summary.maintenance}</p>
              <p className="text-sm text-muted-foreground">In Maintenance</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-primary/10 p-2.5">
              <Truck className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-card-foreground">{summary.available}</p>
              <p className="text-sm text-muted-foreground">Available</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input 
            placeholder="Search by ID or Driver..." 
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">Filters:</span>
          </div>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="maintenance">Maintenance</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>

          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Vehicle Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {vehicleTypes.map(type => (
                <SelectItem key={type} value={type}>{type}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {(searchQuery || statusFilter !== "all" || typeFilter !== "all") && (
            <button 
              onClick={() => {
                setSearchQuery("");
                setStatusFilter("all");
                setTypeFilter("all");
              }}
              className="text-sm font-medium text-primary hover:underline"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Vehicle grid */}
      {filteredVehicles.length === 0 ? (
        <div className="flex h-64 flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card/50">
          <p className="text-muted-foreground">No vehicles match your filters.</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredVehicles.map((vehicle) => {
            const statusKey = vehicle.status as keyof typeof statusConfig;
            const status = statusConfig[statusKey] || statusConfig.inactive;
            const StatusIcon = status.icon;

            return (
              <div key={vehicle.id} className="rounded-xl border border-border bg-card p-5 stat-card-hover transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-card-foreground">{vehicle.id}</h3>
                    <p className="text-sm text-muted-foreground">{vehicle.type}</p>
                  </div>
                  <Badge className={cn("gap-1 border-none", status.className)}>
                    <StatusIcon className="h-3 w-3" />
                    {status.label}
                  </Badge>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Truck className="h-4 w-4 text-muted-foreground" />
                    <span className="text-card-foreground">{vehicle.driver}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground truncate" title={vehicle.location}>{vehicle.location}</span>
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="flex items-center gap-1 text-muted-foreground">
                        <Fuel className="h-4 w-4" /> Fuel Level
                      </span>
                      <span className={cn("font-medium", vehicle.fuel < 40 ? "text-destructive" : "text-card-foreground")}>
                        {vehicle.fuel}%
                      </span>
                    </div>
                    <Progress value={vehicle.fuel} className="h-2" />
                  </div>
                  <p className="text-xs text-muted-foreground">Mileage: {vehicle.mileage}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </DashboardLayout>
  );
}
