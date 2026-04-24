import * as React from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Truck, Plus, Search, CheckCircle, Wrench, AlertTriangle, MoreVertical, ChevronDown, ChevronUp, XCircle, Loader2, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { getCompanies } from "@/services/companyService";
import { createVehicle, getAllVehicles, getCompanyVehicles } from "@/services/vehicleService";
import { useToast } from "@/hooks/use-toast";

type CompanyRecord = Record<string, unknown> & {
  id?: string | number;
  companyId?: string | number;
  _id?: string | number;
  companyName?: string;
  name?: string;
  status?: string;
};

type VehicleRecord = Record<string, unknown> & {
  id?: string | number;
  _id?: string | number;
  plateNumber?: string;
  vehicleType?: string;
  model?: string;
  capacityKg?: number | string;
  status?: string;
  active?: boolean;
  companyId?: CompanyRecord | string;
  currentDriverId?: {
    _id?: string | number;
    fullName?: string;
  } | string;
};

const getCompanyId = (company: CompanyRecord, index: number) => {
  const id = company.id ?? company.companyId ?? company._id ?? null;
  return id ? String(id) : `company-${index + 1}`;
};

const extractCompanies = (payload: unknown): CompanyRecord[] => {
  if (Array.isArray(payload)) return payload as CompanyRecord[];
  if (!payload || typeof payload !== "object") return [];

  const data = payload as Record<string, unknown>;
  if (Array.isArray(data.companies)) return data.companies as CompanyRecord[];
  const nested = data.data;
  if (nested && typeof nested === "object") {
    const nestedData = nested as Record<string, unknown>;
    if (Array.isArray(nestedData.companies)) return nestedData.companies as CompanyRecord[];
    if (Array.isArray(nestedData.company)) return nestedData.company as CompanyRecord[];
  }

  return [];
};

const getVehicleId = (vehicle: VehicleRecord, index: number) => {
  const id = (vehicle as any).id ?? (vehicle as any)._id ?? vehicle.plateNumber ?? null;
  return id ? String(id) : `vehicle-${index + 1}`;
};

const extractVehicles = (payload: unknown): VehicleRecord[] => {
  if (Array.isArray(payload)) return payload as VehicleRecord[];
  if (!payload || typeof payload !== "object") return [];

  const data = payload as Record<string, unknown>;
  if (Array.isArray(data.vehicles)) return data.vehicles as VehicleRecord[];
  const nested = data.data;
  if (nested && typeof nested === "object") {
    const nestedData = nested as Record<string, unknown>;
    if (Array.isArray(nestedData.vehicles)) return nestedData.vehicles as VehicleRecord[];
  }

  return [];
};

const statusConfig = {
  ACTIVE: { label: "Active", icon: CheckCircle, className: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20" },
  INACTIVE: { label: "Inactive", icon: XCircle, className: "text-slate-400 bg-slate-400/10 border-slate-400/20" },
  MAINTENANCE: { label: "Maintenance", icon: Wrench, className: "text-amber-500 bg-amber-500/10 border-amber-500/20" },
  unknown: { label: "Unknown", icon: AlertTriangle, className: "text-muted-foreground bg-secondary" },
};

const getCompanyDisplayName = (company: any) => {
  if (!company) return "-";
  if (typeof company === 'string') return company;
  return company.companyName || company.name || "Unnamed Company";
};

const getVehicleStatus = (vehicle: VehicleRecord) =>
  String(vehicle.status || "unknown").toUpperCase();

const getStatusLabel = (status: string) =>
  statusConfig[status as keyof typeof statusConfig]?.label || status;

const getVehicleDriverName = (vehicle: any) => {
  if (!vehicle.currentDriverId) return "No Driver Assigned";
  if (typeof vehicle.currentDriverId === "string") return vehicle.currentDriverId;
  return vehicle.currentDriverId.fullName || "Unnamed Driver";
};

export default function VehicleList() {
  const navigate = useNavigate();
  const userRole = localStorage.getItem("userRole");
  const isCompanyAdmin = userRole === "COMPANY_ADMIN";
  const { toast } = useToast();
  const [vehicles, setVehicles] = React.useState<VehicleRecord[]>([]);
  const [companies, setCompanies] = React.useState<CompanyRecord[]>([]);
  const [query, setQuery] = React.useState("");
  const [selectedCompany, setSelectedCompany] = React.useState("all");
  const [selectedStatus, setSelectedStatus] = React.useState("all");
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [isAddOpen, setIsAddOpen] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [plateNumber, setPlateNumber] = React.useState("");
  const [vehicleType, setVehicleType] = React.useState("");
  const [model, setModel] = React.useState("");
  const [capacityKg, setCapacityKg] = React.useState("");

  const loadVehicles = React.useCallback(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      navigate("/login");
      return;
    }

    setIsLoading(true);
    setError(null);

    const isSuperAdmin = userRole === "SUPER_ADMIN";
    const vehicleRequest = isSuperAdmin ? getAllVehicles(token) : getCompanyVehicles(token);
    const companyRequest = isSuperAdmin ? getCompanies(token) : Promise.resolve({ ok: true, data: { companies: [] } });

    Promise.all([vehicleRequest, companyRequest])
      .then(([vehicleResult, companyResult]) => {
        if (!vehicleResult.ok) {
          const message = (vehicleResult.data as any)?.message || "Unable to load vehicles.";
          setError(message);
          setVehicles([]);
        } else {
          setVehicles(extractVehicles(vehicleResult.data));
        }

        if (companyResult && companyResult.ok) {
          setCompanies(extractCompanies(companyResult.data));
        }
      })
      .catch(() => setError("Unable to load vehicles."))
      .finally(() => setIsLoading(false));
  }, [navigate, isCompanyAdmin]);

  React.useEffect(() => {
    loadVehicles();
  }, [loadVehicles]);

  const filteredVehicles = vehicles.filter((vehicle) => {
    const status = getVehicleStatus(vehicle);
    const company = vehicle.companyId;
    const companyId = typeof company === 'string' ? company : (company as any)?._id;

    if (selectedStatus !== "all" && status !== selectedStatus) return false;
    if (selectedCompany !== "all" && companyId !== selectedCompany) return false;

    if (!query) return true;
    const q = query.toLowerCase();
    return (
      vehicle.plateNumber?.toLowerCase().includes(q) ||
      vehicle.model?.toLowerCase().includes(q) ||
      vehicle.vehicleType?.toLowerCase().includes(q) ||
      getVehicleDriverName(vehicle).toLowerCase().includes(q) ||
      getCompanyDisplayName(vehicle.companyId).toLowerCase().includes(q)
    );
  });

  const handleAddVehicle = async (event: React.FormEvent) => {
    event.preventDefault();
    const token = localStorage.getItem("authToken");
    if (!token) return;

    setIsSubmitting(true);
    try {
      const result = await createVehicle(token, {
        plateNumber: plateNumber.toUpperCase(),
        vehicleType: vehicleType.toUpperCase(),
        model,
        capacityKg: Number(capacityKg),
      });

      if (result.ok) {
        setIsAddOpen(false);
        setPlateNumber(""); setVehicleType(""); setModel(""); setCapacityKg("");
        loadVehicles();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="mb-8 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Fleet Vehicles</h1>
          <p className="text-muted-foreground mt-1">Manage and monitor your transportation assets</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="lg" onClick={loadVehicles} disabled={isLoading} className="shadow-sm">
            Refresh
          </Button>
          {isCompanyAdmin && (
            <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
              <DialogTrigger asChild>
                <Button size="lg" className="shadow-md">
                  <Plus className="mr-2 h-5 w-5" />
                  Add Vehicle
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle className="text-2xl">New Vehicle</DialogTitle>
                  <p className="text-sm text-muted-foreground">Register a new asset to your company fleet.</p>
                </DialogHeader>
                <form className="grid gap-6 py-4" onSubmit={handleAddVehicle}>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold">Plate Number</label>
                      <Input value={plateNumber} onChange={(e) => setPlateNumber(e.target.value)} placeholder="ABC-123" required />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold">Vehicle Type</label>
                      <Input value={vehicleType} onChange={(e) => setVehicleType(e.target.value)} placeholder="VAN / TRUCK" required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold">Model / Make</label>
                    <Input value={model} onChange={(e) => setModel(e.target.value)} placeholder="Toyota Hiace 2024" required />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold">Payload Capacity (kg)</label>
                    <Input type="number" value={capacityKg} onChange={(e) => setCapacityKg(e.target.value)} placeholder="1500" required />
                  </div>
                  <DialogFooter className="pt-4">
                    <Button type="button" variant="ghost" onClick={() => setIsAddOpen(false)}>Cancel</Button>
                    <Button type="submit" disabled={isSubmitting} className="min-w-[120px]">
                      {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Register Vehicle"}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>

      <div className="mb-8 flex flex-col gap-4 rounded-2xl border border-border bg-card/50 p-6 backdrop-blur-sm sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by plate, model, driver..."
            className="pl-11 h-12 bg-background/50 border-border/50 text-lg"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-3">
          {!isCompanyAdmin && (
            <Select value={selectedCompany} onValueChange={setSelectedCompany}>
              <SelectTrigger className="w-[200px] h-12">
                <SelectValue placeholder="All companies" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Companies</SelectItem>
                {companies.map((company, index) => (
                  <SelectItem key={getCompanyId(company, index)} value={String(company._id)}>
                    {getCompanyDisplayName(company)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-[180px] h-12">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="ACTIVE">Active</SelectItem>
              <SelectItem value="MAINTENANCE">Maintenance</SelectItem>
              <SelectItem value="INACTIVE">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
      ) : error ? (
        <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-12 text-center">
          <AlertTriangle className="mx-auto h-12 w-12 text-destructive mb-4" />
          <p className="text-lg font-medium text-destructive">{error}</p>
          <Button variant="outline" className="mt-4" onClick={loadVehicles}>Try Again</Button>
        </div>
      ) : filteredVehicles.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-20 text-center">
          <Truck className="mx-auto h-16 w-16 text-muted-foreground/20 mb-4" />
          <p className="text-xl font-medium text-muted-foreground">No vehicles found matching your criteria</p>
          {(query || selectedStatus !== 'all') && (
            <Button variant="link" onClick={() => {setQuery(""); setSelectedStatus("all");}} className="mt-2 text-primary">
              Clear all filters
            </Button>
          )}
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredVehicles.map((vehicle, index) => {
            const statusKey = getVehicleStatus(vehicle) as keyof typeof statusConfig;
            const status = statusConfig[statusKey] || statusConfig.unknown;
            const StatusIcon = status.icon;

            return (
              <div 
                key={getVehicleId(vehicle, index)}
                className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card hover:border-primary/40 hover:shadow-xl transition-all duration-300"
              >
                {/* Status Bar */}
                <div className={cn("h-1.5 w-full", status.className.split(' ')[1])} />
                
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 group-hover:scale-110 transition-transform">
                      <Truck className="h-6 w-6 text-primary" />
                    </div>
                    <Badge variant="outline" className={cn("px-2.5 py-1 text-[10px] font-bold border", status.className)}>
                      <StatusIcon className="mr-1 h-3 w-3" />
                      {status.label.toUpperCase()}
                    </Badge>
                  </div>

                  <div className="mb-6">
                    <h3 className="text-xl font-bold text-foreground leading-tight">{vehicle.plateNumber}</h3>
                    <p className="text-sm font-medium text-muted-foreground">{vehicle.model || "Unknown Model"}</p>
                  </div>

                  <div className="space-y-3 pt-4 border-t border-border/50">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Type</span>
                      <span className="font-semibold text-foreground px-2 py-0.5 rounded bg-secondary">{vehicle.vehicleType}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Capacity</span>
                      <span className="font-semibold text-foreground">{vehicle.capacityKg} kg</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Company</span>
                      <span className="font-medium text-foreground truncate max-w-[120px]">
                        {getCompanyDisplayName(vehicle.companyId)}
                      </span>
                    </div>
                  </div>

                  <div className="mt-6 rounded-xl bg-secondary/30 p-4">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-background flex items-center justify-center">
                        <User className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div className="overflow-hidden">
                        <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">Current Driver</p>
                        <p className="text-xs font-semibold text-foreground truncate">
                          {getVehicleDriverName(vehicle)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </DashboardLayout>
  );
}
