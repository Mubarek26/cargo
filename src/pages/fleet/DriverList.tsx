import * as React from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Users, Search, CheckCircle, AlertTriangle, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { getCompanies, getCompanyMe } from "@/services/companyService";
import { getAllDrivers, getCompanyDrivers } from "@/services/driverService";

type CompanyRecord = Record<string, unknown> & {
  id?: string | number;
  companyId?: string | number;
  _id?: string | number;
  companyName?: string;
  name?: string;
  status?: string;
};

type DriverRecord = Record<string, unknown> & {
  id?: string | number;
  _id?: string | number;
  fullName?: string;
  phoneNumber?: string;
  email?: string;
  licenseNumber?: string;
  status?: string;
  active?: boolean;
  companyId?: CompanyRecord | string;
  currentVehicleId?: string | { _id?: string | number; plateNumber?: string };
};

const statusConfig = {
  active: { label: "Active", className: "text-success bg-success/10" },
  inactive: { label: "Inactive", className: "text-muted-foreground bg-secondary" },
  pending: { label: "Pending", className: "text-warning bg-warning/10" },
  unknown: { label: "Unknown", className: "text-muted-foreground bg-secondary" },
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

const getDriverId = (driver: DriverRecord, index: number) => {
  const id = driver.id ?? driver._id ?? driver.email ?? null;
  return id ? String(id) : `driver-${index + 1}`;
};

const getDriverStatus = (driver: DriverRecord) =>
  String(driver.status || "unknown").toLowerCase();

const getStatusLabel = (status: string) =>
  statusConfig[status as keyof typeof statusConfig]?.label ||
  status
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());

const getDriverCompanyId = (driver: DriverRecord) => {
  if (!driver.companyId) return null;
  if (typeof driver.companyId === "string") return driver.companyId;
  const companyId = driver.companyId as CompanyRecord;
  return String(companyId._id ?? companyId.companyId ?? companyId.id ?? "");
};

const getDriverCompanyName = (driver: DriverRecord) => {
  if (!driver.companyId) return "-";
  if (typeof driver.companyId === "string") return driver.companyId;
  return getCompanyDisplayName(driver.companyId as CompanyRecord);
};

const getDriverVehicle = (driver: DriverRecord) => {
  if (!driver.currentVehicleId) return "-";
  if (typeof driver.currentVehicleId === "string") return driver.currentVehicleId;
  return String(driver.currentVehicleId.plateNumber || driver.currentVehicleId._id || "-");
};

const extractDrivers = (payload: unknown): DriverRecord[] => {
  if (Array.isArray(payload)) return payload as DriverRecord[];
  if (!payload || typeof payload !== "object") return [];

  const data = payload as Record<string, unknown>;
  if (Array.isArray(data.drivers)) return data.drivers as DriverRecord[];
  const nested = data.data;
  if (nested && typeof nested === "object") {
    const nestedData = nested as Record<string, unknown>;
    if (Array.isArray(nestedData.drivers)) return nestedData.drivers as DriverRecord[];
  }

  return [];
};

export default function DriverList() {
  const navigate = useNavigate();
  const userRole = localStorage.getItem("userRole");
  const isCompanyAdmin = userRole === "COMPANY_ADMIN";
  const [drivers, setDrivers] = React.useState<DriverRecord[]>([]);
  const [companies, setCompanies] = React.useState<CompanyRecord[]>([]);
  const [query, setQuery] = React.useState("");
  const [selectedCompany, setSelectedCompany] = React.useState("all");
  const [selectedStatus, setSelectedStatus] = React.useState("all");
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [expandedDriverId, setExpandedDriverId] = React.useState<string | null>(null);

  const getCompanyIdFromMe = (payload: Record<string, unknown> | null) => {
    if (!payload) return null;
    const company =
      (payload as any)?.data?.company ||
      (payload as any)?.company ||
      null;

    if (!company || typeof company !== "object") return null;
    return String((company as any)._id || (company as any).companyId || (company as any).id || "");
  };

  const loadDrivers = React.useCallback(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      navigate("/login");
      return;
    }

    setIsLoading(true);
    setError(null);

    const driverRequest = isCompanyAdmin
      ? getCompanyMe(token).then((result) => {
          if (!result.ok) {
            return {
              ok: false,
              status: result.status,
              data: result.data,
            } as const;
          }

          const companyId = getCompanyIdFromMe(result.data as Record<string, unknown> | null);
          if (!companyId) {
            return {
              ok: false,
              status: 400,
              data: { message: "Company profile not found." },
            } as const;
          }

          return getCompanyDrivers(token, companyId);
        })
      : getAllDrivers(token);
    const companyRequest = isCompanyAdmin ? Promise.resolve(null) : getCompanies(token);

    Promise.all([driverRequest, companyRequest])
      .then(([driverResult, companyResult]) => {
        if (!driverResult.ok) {
          const message =
            (driverResult.data &&
              typeof driverResult.data === "object" &&
              "message" in driverResult.data &&
              driverResult.data.message) ||
            "Unable to load drivers.";
          setError(String(message));
          setDrivers([]);
        } else {
          setDrivers(extractDrivers(driverResult.data));
        }

        if (companyResult && companyResult.ok) {
          setCompanies(extractCompanies(companyResult.data));
        } else if (isCompanyAdmin) {
          setCompanies([]);
        }
      })
      .catch((err) => {
        const message = err instanceof Error ? err.message : "Unable to load drivers.";
        setError(message);
      })
      .finally(() => setIsLoading(false));
  }, [navigate]);

  React.useEffect(() => {
    loadDrivers();
  }, [loadDrivers]);

  const normalizedQuery = query.trim().toLowerCase();
  const filteredDrivers = drivers.filter((driver) => {
    const status = getDriverStatus(driver);
    const companyId = getDriverCompanyId(driver);

    if (selectedStatus !== "all" && status !== selectedStatus) return false;
    if (selectedCompany !== "all" && companyId !== selectedCompany) return false;

    if (!normalizedQuery) return true;
    const haystack = [
      driver.fullName,
      driver.email,
      driver.phoneNumber,
      driver.licenseNumber,
      getDriverCompanyName(driver),
    ]
      .filter(Boolean)
      .map((value) => String(value).toLowerCase())
      .join(" ");

    return haystack.includes(normalizedQuery);
  });

  const statusOptions = React.useMemo(() => {
    const seen = new Set<string>();
    drivers.forEach((driver) => {
      seen.add(getDriverStatus(driver));
    });
    return Array.from(seen).filter((status) => status !== "unknown");
  }, [drivers]);

  const toggleDriverDetails = (driverId: string) => {
    setExpandedDriverId((current) => (current === driverId ? null : driverId));
  };

  return (
    <DashboardLayout>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Driver List</h1>
          <p className="text-muted-foreground">Review all registered drivers</p>
        </div>
        <Button variant="outline" onClick={loadDrivers} disabled={isLoading}>
          Refresh
        </Button>
      </div>

      <div className="mb-6 flex flex-col gap-4 rounded-xl border border-border bg-card p-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name, email, phone, company..."
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
          Loading drivers...
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
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Driver</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Company</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Contact</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">License</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Vehicle</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Status</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredDrivers.map((driver, index) => {
                  const driverId = getDriverId(driver, index);
                  const statusKey = getDriverStatus(driver) as keyof typeof statusConfig;
                  const status = statusConfig[statusKey] ?? statusConfig.unknown;
                  const isExpanded = expandedDriverId === driverId;
                  const companyId = getDriverCompanyId(driver);
                  const companyRecord =
                    driver.companyId && typeof driver.companyId !== "string"
                      ? (driver.companyId as CompanyRecord)
                      : null;

                  return (
                    <React.Fragment key={driverId}>
                      <tr
                        className="hover:bg-secondary/30 transition-colors cursor-pointer"
                        onClick={() => toggleDriverDetails(driverId)}
                      >
                        <td className="whitespace-nowrap px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                              <Users className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <p className="font-medium text-card-foreground">
                                {driver.fullName ? String(driver.fullName) : "-"}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {driver.email ? String(driver.email) : "-"}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-5 py-4 text-sm text-card-foreground">
                          {getDriverCompanyName(driver)}
                        </td>
                        <td className="whitespace-nowrap px-5 py-4 text-sm text-muted-foreground">
                          {driver.phoneNumber ? String(driver.phoneNumber) : "-"}
                        </td>
                        <td className="whitespace-nowrap px-5 py-4 text-sm text-muted-foreground">
                          {driver.licenseNumber ? String(driver.licenseNumber) : "-"}
                        </td>
                        <td className="whitespace-nowrap px-5 py-4 text-sm text-muted-foreground">
                          {getDriverVehicle(driver)}
                        </td>
                        <td className="whitespace-nowrap px-5 py-4">
                          <Badge className={cn("gap-1", status.className)}>
                            {status.label}
                          </Badge>
                        </td>
                        <td className="whitespace-nowrap px-5 py-4">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(event) => event.stopPropagation()}
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                      {isExpanded && (
                        <tr className="bg-secondary/10">
                          <td colSpan={7} className="px-5 py-4 text-sm">
                            <div className="grid gap-3 md:grid-cols-3">
                              <div>
                                <p className="text-xs uppercase tracking-wide text-muted-foreground">Driver</p>
                                <p className="text-card-foreground">{driver.fullName ? String(driver.fullName) : "-"}</p>
                              </div>
                              <div>
                                <p className="text-xs uppercase tracking-wide text-muted-foreground">Email</p>
                                <p className="text-card-foreground">{driver.email ? String(driver.email) : "-"}</p>
                              </div>
                              <div>
                                <p className="text-xs uppercase tracking-wide text-muted-foreground">Phone</p>
                                <p className="text-card-foreground">{driver.phoneNumber ? String(driver.phoneNumber) : "-"}</p>
                              </div>
                              <div>
                                <p className="text-xs uppercase tracking-wide text-muted-foreground">Company</p>
                                <p className="text-card-foreground">{getDriverCompanyName(driver)}</p>
                              </div>
                              <div>
                                <p className="text-xs uppercase tracking-wide text-muted-foreground">Company ID</p>
                                <p className="text-card-foreground">{companyId || "-"}</p>
                              </div>
                              <div>
                                <p className="text-xs uppercase tracking-wide text-muted-foreground">Vehicle</p>
                                <p className="text-card-foreground">{getDriverVehicle(driver)}</p>
                              </div>
                              <div>
                                <p className="text-xs uppercase tracking-wide text-muted-foreground">License</p>
                                <p className="text-card-foreground">{driver.licenseNumber ? String(driver.licenseNumber) : "-"}</p>
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
          {filteredDrivers.length === 0 && (
            <div className="border-t border-border px-6 py-8 text-center text-sm text-muted-foreground">
              No drivers found.
            </div>
          )}
        </div>
      )}
    </DashboardLayout>
  );
}
