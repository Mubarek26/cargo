import * as React from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { API_BASE_URL } from "@/lib/api";
import { getCompanies, approveCompany } from "@/services/companyService";
import { getVendors, updateVendorStatus } from "@/services/vendorService";
import { getPrivateTransporters, updatePrivateTransporterStatus } from "@/services/driverService";

type RecordMap = Record<string, unknown> & {
  id?: string | number;
  _id?: string | number;
};

type StatusValue = "approved" | "rejected" | "pending";

type UpdateKey = "company" | "vendor" | "driver";

type UpdateState = {
  key: UpdateKey;
  id: string;
};

type ExpandedState = {
  key: UpdateKey;
  id: string;
} | null;

const normalizeStatus = (value: unknown) =>
  value ? String(value).toUpperCase() : "PENDING";

const getId = (record: RecordMap, index: number) =>
  String(record.id ?? record._id ?? `item-${index + 1}`);

const getRecordId = (record: RecordMap) =>
  record.id ?? record._id ?? null;

const isImageUrl = (value: string) =>
  /^data:image\//.test(value) ||
  /\.(png|jpe?g|gif|webp|bmp|svg)(\?.*)?$/i.test(value);

const resolveFileUrl = (value: string) => {
  if (/^https?:\/\//i.test(value) || /^data:/i.test(value)) {
    return value;
  }

  const trimmed = value.replace(/^\//, "");
  if (!trimmed.includes("/")) {
    return `${API_BASE_URL}/uploads/users/${trimmed}`;
  }

  return `${API_BASE_URL}/${trimmed}`;
};

const renderDetailValue = (key: string, value: unknown) => {
  if (value === null || value === undefined) return "-";
  if (typeof value === "string") {
    if (value.trim().length === 0) return "-";
    const lowerKey = key.toLowerCase();
    const maybeFile = lowerKey.includes("image") || lowerKey.includes("photo") || lowerKey.includes("file");
    const resolved = maybeFile ? resolveFileUrl(value) : value;

    if (isImageUrl(resolved)) {
      return (
        <a href={resolved} target="_blank" rel="noreferrer">
          <img
            src={resolved}
            alt="Attachment"
            className="h-28 w-28 rounded-md border border-border object-cover transition hover:opacity-90"
            title="Open full size"
          />
        </a>
      );
    }

    if (maybeFile) {
      return (
        <a
          href={resolved}
          target="_blank"
          rel="noreferrer"
          className="text-primary underline"
        >
          View file
        </a>
      );
    }

    return value;
  }

  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }

  if (Array.isArray(value)) {
    if (value.length === 0) return "-";
    return (
      <div className="space-y-2">
        {value.map((entry, index) => (
          <div key={`${key}-${index}`}>
            {renderDetailValue(`${key}.${index}`, entry)}
          </div>
        ))}
      </div>
    );
  }

  if (typeof value === "object") {
    const entries = Object.entries(value as Record<string, unknown>);
    if (entries.length === 0) return "-";
    return (
      <div className="space-y-2">
        {entries.map(([childKey, childValue]) => (
          <div key={`${key}.${childKey}`}>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">{childKey}</p>
            <div className="mt-1">
              {renderDetailValue(`${key}.${childKey}`, childValue)}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return String(value);
};

const extractList = (payload: unknown, keys: string[]) => {
  if (Array.isArray(payload)) return payload as RecordMap[];
  if (!payload || typeof payload !== "object") return [];

  const data = payload as Record<string, unknown>;
  for (const key of keys) {
    if (Array.isArray(data[key])) return data[key] as RecordMap[];
  }

  const nested = data.data;
  if (nested && typeof nested === "object") {
    const nestedData = nested as Record<string, unknown>;
    for (const key of keys) {
      if (Array.isArray(nestedData[key])) return nestedData[key] as RecordMap[];
    }
  }

  return [];
};

const StatusBadge = ({ status }: { status: string }) => {
  const normalized = status.toLowerCase();
  const className =
    normalized === "approved"
      ? "bg-success/10 text-success"
      : normalized === "rejected"
      ? "bg-destructive/10 text-destructive"
      : "bg-warning/10 text-warning";

  return <Badge className={className}>{normalized}</Badge>;
};

export default function ApplicationsReview() {
  const navigate = useNavigate();
  const [companies, setCompanies] = React.useState<RecordMap[]>([]);
  const [vendors, setVendors] = React.useState<RecordMap[]>([]);
  const [drivers, setDrivers] = React.useState<RecordMap[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [updating, setUpdating] = React.useState<UpdateState | null>(null);
  const [expanded, setExpanded] = React.useState<ExpandedState>(null);

  const loadApplications = React.useCallback(async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      navigate("/login");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const [companyResult, vendorResult, driverResult] = await Promise.all([
        getCompanies(token),
        getVendors(token),
        getPrivateTransporters(token),
      ]);

      if (!companyResult.ok || !vendorResult.ok || !driverResult.ok) {
        setError("Unable to load applications.");
      }

      setCompanies(extractList(companyResult.data, ["companies", "company"]));
      setVendors(extractList(vendorResult.data, ["vendors", "vendor", "applications"]));
      setDrivers(extractList(driverResult.data, ["drivers", "privateTransporters", "applications"]));
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unable to load applications.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  React.useEffect(() => {
    loadApplications();
  }, [loadApplications]);

  const updateStatus = async (key: UpdateKey, id: string, status: StatusValue) => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      navigate("/login");
      return;
    }

    setUpdating({ key, id });
    try {
      if (key === "company") {
        await approveCompany(token, id);
        setCompanies((prev) =>
          prev.map((company) =>
            getRecordId(company) && String(getRecordId(company)) === id
              ? { ...company, status: "approved" }
              : company
          )
        );
      }

      if (key === "vendor") {
        await updateVendorStatus(token, id, status);
        setVendors((prev) =>
          prev.map((vendor) =>
            getRecordId(vendor) && String(getRecordId(vendor)) === id
              ? { ...vendor, status }
              : vendor
          )
        );
      }

      if (key === "driver") {
        await updatePrivateTransporterStatus(token, id, status);
        setDrivers((prev) =>
          prev.map((driver) =>
            getRecordId(driver) && String(getRecordId(driver)) === id
              ? { ...driver, status }
              : driver
          )
        );
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unable to update status.";
      setError(message);
    } finally {
      setUpdating(null);
    }
  };

  const isUpdating = (key: UpdateKey, id: string) =>
    updating?.key === key && updating?.id === id;

  const toggleExpanded = (key: UpdateKey, id: string) => {
    setExpanded((prev) =>
      prev && prev.key === key && prev.id === id ? null : { key, id }
    );
  };

  const renderDetailsRow = (record: RecordMap, key: UpdateKey, id: string) => {
      const entries = Object.entries(record || {})
        .filter(([entryKey, value]) => entryKey !== "nationalIdOrPassport" && value !== null && value !== undefined && value !== "")
      .sort(([a], [b]) => a.localeCompare(b));

    if (expanded?.key !== key || expanded?.id !== id) return null;

    return (
      <tr className="bg-secondary/10">
        <td colSpan={4} className="px-5 py-4 text-sm">
          <div className="grid gap-4 md:grid-cols-2">
            {entries.length === 0 ? (
              <div className="text-muted-foreground">No additional details available.</div>
            ) : (
              entries.map(([entryKey, value]) => (
                <div key={entryKey}>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">{entryKey}</p>
                  <div className="mt-1 text-sm text-card-foreground whitespace-pre-wrap">
                    {renderDetailValue(entryKey, value)}
                  </div>
                </div>
              ))
            )}
          </div>
        </td>
      </tr>
    );
  };

  return (
    <DashboardLayout>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Applications Review</h1>
          <p className="text-muted-foreground">Review and approve company, vendor, and driver applications</p>
        </div>
        <Button variant="outline" onClick={loadApplications} disabled={isLoading}>
          Refresh
        </Button>
      </div>

      {isLoading ? (
        <div className="rounded-xl border border-border bg-card p-8 text-center text-muted-foreground">
          Loading applications...
        </div>
      ) : error ? (
        <div className="rounded-xl border border-destructive/40 bg-destructive/5 p-6 text-sm text-destructive">
          {error}
        </div>
      ) : (
        <div className="space-y-6">
          <section className="rounded-xl border border-border bg-card overflow-hidden">
            <div className="border-b border-border px-6 py-4">
              <h2 className="text-lg font-semibold text-foreground">Companies</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-secondary/50">
                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Company</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Contact</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Status</th>
                    <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {companies.map((company, index) => {
                    const id = getId(company, index);
                    return (
                      <React.Fragment key={id}>
                        <tr className="hover:bg-secondary/30 transition-colors">
                          <td className="px-5 py-4 text-sm text-card-foreground">
                            {String((company as any)?.companyName || (company as any)?.name || "-")}
                          </td>
                          <td className="px-5 py-4 text-sm text-muted-foreground">
                            {String((company as any)?.email || (company as any)?.phoneNumber || "-")}
                          </td>
                          <td className="px-5 py-4">
                            <StatusBadge status={normalizeStatus((company as any)?.status)} />
                          </td>
                          <td className="px-5 py-4 text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => toggleExpanded("company", id)}
                              >
                                Review
                              </Button>
                              <Button
                                size="sm"
                                onClick={() => updateStatus("company", id, "approved")}
                                disabled={isUpdating("company", id)}
                              >
                                Approve
                              </Button>
                            </div>
                          </td>
                        </tr>
                        {renderDetailsRow(company, "company", id)}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>

          <section className="rounded-xl border border-border bg-card overflow-hidden">
            <div className="border-b border-border px-6 py-4">
              <h2 className="text-lg font-semibold text-foreground">Vendors</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-secondary/50">
                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Company</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Contact</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Status</th>
                    <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {vendors.map((vendor, index) => {
                    const id = getId(vendor, index);
                    return (
                      <React.Fragment key={id}>
                        <tr className="hover:bg-secondary/30 transition-colors">
                          <td className="px-5 py-4 text-sm text-card-foreground">
                            {String((vendor as any)?.companyName || (vendor as any)?.name || "-")}
                          </td>
                          <td className="px-5 py-4 text-sm text-muted-foreground">
                            {String((vendor as any)?.email || (vendor as any)?.contactNumber || "-")}
                          </td>
                          <td className="px-5 py-4">
                            <StatusBadge status={normalizeStatus((vendor as any)?.status)} />
                          </td>
                          <td className="px-5 py-4 text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => toggleExpanded("vendor", id)}
                              >
                                Review
                              </Button>
                              <Button
                                size="sm"
                                onClick={() => updateStatus("vendor", id, "approved")}
                                disabled={isUpdating("vendor", id)}
                              >
                                Approve
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => updateStatus("vendor", id, "rejected")}
                                disabled={isUpdating("vendor", id)}
                              >
                                Reject
                              </Button>
                            </div>
                          </td>
                        </tr>
                        {renderDetailsRow(vendor, "vendor", id)}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>

          <section className="rounded-xl border border-border bg-card overflow-hidden">
            <div className="border-b border-border px-6 py-4">
              <h2 className="text-lg font-semibold text-foreground">Private Transporters</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-secondary/50">
                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Driver</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Contact</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Status</th>
                    <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {drivers.map((driver, index) => {
                    const id = getId(driver, index);
                    return (
                      <React.Fragment key={id}>
                        <tr className="hover:bg-secondary/30 transition-colors">
                          <td className="px-5 py-4 text-sm text-card-foreground">
                            {String((driver as any)?.fullName || (driver as any)?.name || "-")}
                          </td>
                          <td className="px-5 py-4 text-sm text-muted-foreground">
                            {String((driver as any)?.email || (driver as any)?.contactNumber || "-")}
                          </td>
                          <td className="px-5 py-4">
                            <StatusBadge status={normalizeStatus((driver as any)?.status)} />
                          </td>
                          <td className="px-5 py-4 text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => toggleExpanded("driver", id)}
                              >
                                Review
                              </Button>
                              <Button
                                size="sm"
                                onClick={() => updateStatus("driver", id, "approved")}
                                disabled={isUpdating("driver", id)}
                              >
                                Approve
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => updateStatus("driver", id, "rejected")}
                                disabled={isUpdating("driver", id)}
                              >
                                Reject
                              </Button>
                            </div>
                          </td>
                        </tr>
                        {renderDetailsRow(driver, "driver", id)}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      )}
    </DashboardLayout>
  );
}
