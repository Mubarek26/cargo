import * as React from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Truck, Plus, Search, CheckCircle, Wrench, AlertTriangle, MoreVertical, ChevronDown, ChevronUp } from "lucide-react";
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

const statusConfig = {
  active: { label: "Active", icon: CheckCircle, className: "text-success bg-success/10" },
  inactive: { label: "Inactive", icon: AlertTriangle, className: "text-muted-foreground bg-secondary" },
  maintenance: { label: "Maintenance", icon: Wrench, className: "text-warning bg-warning/10" },
  unknown: { label: "Unknown", icon: AlertTriangle, className: "text-muted-foreground bg-secondary" },
};

const getCompanyDisplayName = (company: CompanyRecord) =>
  String(company.companyName || company.name || "Unnamed Company");

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
  const id = vehicle.id ?? vehicle._id ?? vehicle.plateNumber ?? null;
  return id ? String(id) : `vehicle-${index + 1}`;
};

const getVehicleStatus = (vehicle: VehicleRecord) =>
  String(vehicle.status || "unknown").toLowerCase();

const getStatusLabel = (status: string) =>
  statusConfig[status as keyof typeof statusConfig]?.label ||
  status
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());

const getVehicleCompanyId = (vehicle: VehicleRecord) => {
  if (!vehicle.companyId) return null;
  if (typeof vehicle.companyId === "string") return vehicle.companyId;
  const companyId = vehicle.companyId as CompanyRecord;
  return String(companyId._id ?? companyId.companyId ?? companyId.id ?? "");
};

const getVehicleCompanyName = (vehicle: VehicleRecord) => {
  if (!vehicle.companyId) return "-";
  if (typeof vehicle.companyId === "string") return vehicle.companyId;
  return getCompanyDisplayName(vehicle.companyId as CompanyRecord);
};

const getVehicleDriverName = (vehicle: VehicleRecord) => {
  if (!vehicle.currentDriverId) return "-";
  if (typeof vehicle.currentDriverId === "string") return vehicle.currentDriverId;
  return String(vehicle.currentDriverId.fullName || "-");
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
  const [expandedVehicleId, setExpandedVehicleId] = React.useState<string | null>(null);
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

    const vehicleRequest = isCompanyAdmin ? getCompanyVehicles(token) : getAllVehicles(token);
    const companyRequest = isCompanyAdmin ? Promise.resolve(null) : getCompanies(token);

    Promise.all([vehicleRequest, companyRequest])
      .then(([vehicleResult, companyResult]) => {
        if (!vehicleResult.ok) {
          const message =
            (vehicleResult.data &&
              typeof vehicleResult.data === "object" &&
              "message" in vehicleResult.data &&
              vehicleResult.data.message) ||
            "Unable to load vehicles.";
          setError(String(message));
          setVehicles([]);
        } else {
          setVehicles(extractVehicles(vehicleResult.data));
        }

        if (companyResult && companyResult.ok) {
          setCompanies(extractCompanies(companyResult.data));
        } else if (isCompanyAdmin) {
          setCompanies([]);
        }
      })
      .catch((err) => {
        const message = err instanceof Error ? err.message : "Unable to load vehicles.";
        setError(message);
      })
      .finally(() => setIsLoading(false));
  }, [navigate]);

  React.useEffect(() => {
    loadVehicles();
  }, [loadVehicles]);

  const normalizedQuery = query.trim().toLowerCase();
  const filteredVehicles = vehicles.filter((vehicle) => {
    const status = getVehicleStatus(vehicle);
    const companyId = getVehicleCompanyId(vehicle);

    if (selectedStatus !== "all" && status !== selectedStatus) return false;
    if (selectedCompany !== "all" && companyId !== selectedCompany) return false;

    if (!normalizedQuery) return true;
    const haystack = [
      vehicle.plateNumber,
      vehicle.model,
      vehicle.vehicleType,
      getVehicleDriverName(vehicle),
      getVehicleCompanyName(vehicle),
    ]
      .filter(Boolean)
      .map((value) => String(value).toLowerCase())
      .join(" ");

    return haystack.includes(normalizedQuery);
  });

  const statusOptions = React.useMemo(() => {
    const seen = new Set<string>();
    vehicles.forEach((vehicle) => {
      seen.add(getVehicleStatus(vehicle));
    });
    return Array.from(seen).filter((status) => status !== "unknown");
  }, [vehicles]);

  const toggleVehicleDetails = (vehicleId: string) => {
    setExpandedVehicleId((current) => (current === vehicleId ? null : vehicleId));
  };

  const resetAddForm = () => {
    setPlateNumber("");
    setVehicleType("");
    setModel("");
    setCapacityKg("");
  };

  const handleAddVehicle = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isCompanyAdmin) return;

    const token = localStorage.getItem("authToken");
    if (!token) {
      navigate("/login");
      return;
    }

    const normalizedPlate = plateNumber.trim();
    const normalizedType = vehicleType.trim().toUpperCase();
    const normalizedModel = model.trim();
    const numericCapacity = Number(capacityKg);

    if (!normalizedPlate || !normalizedType || !normalizedModel || !Number.isFinite(numericCapacity)) {
      toast({
        title: "Missing fields",
        description: "Plate number, type, model, and capacity are required.",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await createVehicle(token, {
        plateNumber: normalizedPlate,
        vehicleType: normalizedType,
        model: normalizedModel,
        capacityKg: numericCapacity,
      });

      if (!result.ok) {
        const message =
          (result.data &&
            typeof result.data === "object" &&
            "message" in result.data &&
            result.data.message) ||
          "Unable to add vehicle.";
        toast({
          title: "Add vehicle failed",
          description: String(message),
        });
        return;
      }

      toast({
        title: "Vehicle added",
        description: "The vehicle is now available in the list.",
      });
      setIsAddOpen(false);
      resetAddForm();
      loadVehicles();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unable to add vehicle.";
      toast({
        title: "Add vehicle failed",
        description: message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Vehicle List</h1>
          <p className="text-muted-foreground">Manage your fleet vehicles</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={loadVehicles} disabled={isLoading}>
            Refresh
          </Button>
          {isCompanyAdmin && (
            <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Vehicle
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Vehicle</DialogTitle>
                </DialogHeader>
                <form className="grid gap-4" onSubmit={handleAddVehicle}>
                  <div>
                    <label className="text-sm font-medium text-foreground">Plate number</label>
                    <Input
                      value={plateNumber}
                      onChange={(event) => setPlateNumber(event.target.value)}
                      placeholder="WXY1234"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground">Vehicle type</label>
                    <Input
                      value={vehicleType}
                      onChange={(event) => setVehicleType(event.target.value)}
                      placeholder="VAN"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground">Model</label>
                    <Input
                      value={model}
                      onChange={(event) => setModel(event.target.value)}
                      placeholder="Toyota Hiace"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground">Capacity (kg)</label>
                    <Input
                      type="number"
                      min={0}
                      value={capacityKg}
                      onChange={(event) => setCapacityKg(event.target.value)}
                      placeholder="1500"
                    />
                  </div>
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? "Saving..." : "Save Vehicle"}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>

      <div className="mb-6 flex flex-col gap-4 rounded-xl border border-border bg-card p-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by plate, model, driver, company..."
            className="pl-10"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {!isCompanyAdmin && (
            <Select value={selectedCompany} onValueChange={setSelectedCompany}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="All companies" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All companies</SelectItem>
                {companies.map((company, index) => {
                  const companyId = getCompanyId(company, index);
                  return (
                    <SelectItem key={companyId} value={companyId}>
                      {getCompanyDisplayName(company)}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          )}
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              {statusOptions.map((status) => (
                <SelectItem key={status} value={status}>
                  {getStatusLabel(status)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoading ? (
        <div className="rounded-xl border border-border bg-card p-8 text-center text-muted-foreground">
          Loading vehicles...
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
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Vehicle</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Company</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Driver</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Type</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Capacity</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Status</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredVehicles.map((vehicle, index) => {
                  const vehicleId = getVehicleId(vehicle, index);
                  const statusKey = getVehicleStatus(vehicle) as keyof typeof statusConfig;
                  const status = statusConfig[statusKey] ?? statusConfig.unknown;
                  const StatusIcon = status.icon;
                  const isExpanded = expandedVehicleId === vehicleId;
                  const companyId = getVehicleCompanyId(vehicle);
                  const companyRecord =
                    vehicle.companyId && typeof vehicle.companyId !== "string"
                      ? (vehicle.companyId as CompanyRecord)
                      : null;

                  return (
                    <React.Fragment key={vehicleId}>
                      <tr className="hover:bg-secondary/30 transition-colors">
                        <td className="whitespace-nowrap px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                              <Truck className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <button
                                type="button"
                                onClick={() => toggleVehicleDetails(vehicleId)}
                                className="text-left font-medium text-card-foreground hover:underline"
                              >
                                {vehicle.plateNumber ? String(vehicle.plateNumber) : "-"}
                              </button>
                              <p className="text-xs text-muted-foreground">
                                {vehicle.model ? String(vehicle.model) : "-"}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-5 py-4 text-sm text-card-foreground">
                          {getVehicleCompanyName(vehicle)}
                        </td>
                        <td className="whitespace-nowrap px-5 py-4 text-sm text-card-foreground">
                          {getVehicleDriverName(vehicle)}
                        </td>
                        <td className="whitespace-nowrap px-5 py-4 text-sm text-muted-foreground">
                          {vehicle.vehicleType ? String(vehicle.vehicleType) : "-"}
                        </td>
                        <td className="whitespace-nowrap px-5 py-4 text-sm text-muted-foreground">
                          {vehicle.capacityKg ? `${vehicle.capacityKg} kg` : "-"}
                        </td>
                        <td className="whitespace-nowrap px-5 py-4">
                          <Badge className={cn("gap-1", status.className)}>
                            <StatusIcon className="h-3 w-3" />
                            {status.label}
                          </Badge>
                        </td>
                        <td className="whitespace-nowrap px-5 py-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => toggleVehicleDetails(vehicleId)}
                            aria-expanded={isExpanded}
                          >
                            {isExpanded ? (
                              <ChevronUp className="mr-2 h-4 w-4" />
                            ) : (
                              <ChevronDown className="mr-2 h-4 w-4" />
                            )}
                            Details
                          </Button>
                        </td>
                      </tr>
                      {isExpanded && (
                        <tr className="bg-secondary/10">
                          <td colSpan={7} className="px-5 py-4 text-sm">
                            <div className="grid gap-3 md:grid-cols-3">
                              <div>
                                <p className="text-xs uppercase tracking-wide text-muted-foreground">Company</p>
                                <p className="text-card-foreground">{getVehicleCompanyName(vehicle)}</p>
                              </div>
                              <div>
                                <p className="text-xs uppercase tracking-wide text-muted-foreground">Company ID</p>
                                <p className="text-card-foreground">{companyId || "-"}</p>
                              </div>
                              <div>
                                <p className="text-xs uppercase tracking-wide text-muted-foreground">Driver</p>
                                <p className="text-card-foreground">{getVehicleDriverName(vehicle)}</p>
                              </div>
                              <div>
                                <p className="text-xs uppercase tracking-wide text-muted-foreground">Type</p>
                                <p className="text-card-foreground">
                                  {vehicle.vehicleType ? String(vehicle.vehicleType) : "-"}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs uppercase tracking-wide text-muted-foreground">Capacity</p>
                                <p className="text-card-foreground">
                                  {vehicle.capacityKg ? `${vehicle.capacityKg} kg` : "-"}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs uppercase tracking-wide text-muted-foreground">Status</p>
                                <p className="text-card-foreground">{status.label}</p>
                              </div>
                              {companyRecord?.email && (
                                <div>
                                  <p className="text-xs uppercase tracking-wide text-muted-foreground">Company Email</p>
                                  <p className="text-card-foreground">{String(companyRecord.email)}</p>
                                </div>
                              )}
                              {companyRecord?.phoneNumber && (
                                <div>
                                  <p className="text-xs uppercase tracking-wide text-muted-foreground">Company Phone</p>
                                  <p className="text-card-foreground">{String(companyRecord.phoneNumber)}</p>
                                </div>
                              )}
                              {companyRecord?.address && (
                                <div>
                                  <p className="text-xs uppercase tracking-wide text-muted-foreground">Company Address</p>
                                  <p className="text-card-foreground">{String(companyRecord.address)}</p>
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
          {filteredVehicles.length === 0 && (
            <div className="border-t border-border px-6 py-8 text-center text-sm text-muted-foreground">
              No vehicles found.
            </div>
          )}
        </div>
      )}
    </DashboardLayout>
  );
}
