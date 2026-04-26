import * as React from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Building2, Search, Filter, Phone, Mail, Globe, MapPin, Hash, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { getCompanies } from "@/services/companyService";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "lucide-react";

type CompanyRecord = Record<string, unknown> & {
  id?: string | number;
  companyId?: string | number;
  _id?: string | number;
  companyName?: string;
  name?: string;
  email?: string;
  phoneNumber?: string;
  website?: string;
  address?: string;
  status?: string;
  companyStatus?: string;
  createdAt?: string;
  numberOfCars?: string | number;
};

const getCompanyDisplayName = (company: CompanyRecord) =>
  String(company.companyName || company.name || "Unnamed Company");

const getCompanyId = (company: CompanyRecord, index: number) => {
  const id = company.id ?? company.companyId ?? company._id ?? null;
  return id ? String(id) : `company-${index + 1}`;
};

const getCompanyStatus = (company: CompanyRecord) =>
  String(company.status || company.companyStatus || "unknown").toLowerCase();

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

const KNOWN_FIELDS = new Set([
  "id",
  "companyId",
  "_id",
  "companyName",
  "name",
  "email",
  "phoneNumber",
  "website",
  "address",
  "status",
  "companyStatus",
  "createdAt",
  "numberOfCars",
  "ownerId",
]);

const getExtraDetails = (company: CompanyRecord) =>
  Object.entries(company)
    .filter(([key, value]) => !KNOWN_FIELDS.has(key) && value !== null && value !== undefined && value !== "")
    .map(([key, value]) => ({ key, value: String(value) }));

export default function CompanyDirectory() {
  const navigate = useNavigate();
  const [companies, setCompanies] = React.useState<CompanyRecord[]>([]);
  const [query, setQuery] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [expandedId, setExpandedId] = React.useState<string | null>(null);

  const loadCompanies = React.useCallback(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      navigate("/login");
      return;
    }

    setIsLoading(true);
    setError(null);

    getCompanies(token)
      .then((result) => {
        if (!result.ok) {
          const message =
            (result.data &&
              typeof result.data === "object" &&
              "message" in result.data &&
              result.data.message) ||
            "Unable to load companies.";
          setError(String(message));
          setCompanies([]);
          return;
        }

        setCompanies(extractCompanies(result.data));
      })
      .catch((err) => {
        const message = err instanceof Error ? err.message : "Unable to load companies.";
        setError(message);
      })
      .finally(() => setIsLoading(false));
  }, [navigate]);

  React.useEffect(() => {
    loadCompanies();
  }, [loadCompanies]);

  const normalizedQuery = query.trim().toLowerCase();
  const filteredCompanies = companies.filter((company) => {
    if (!normalizedQuery) return true;
    const haystack = [
      getCompanyDisplayName(company),
      company.email,
      company.phoneNumber,
      company.website,
      company.address,
      company.status,
    ]
      .filter(Boolean)
      .map((value) => String(value).toLowerCase())
      .join(" ");

    return haystack.includes(normalizedQuery);
  });

  return (
    <DashboardLayout>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Company Directory</h1>
          <p className="text-muted-foreground">Review all registered companies and their details</p>
        </div>
        <Button variant="outline" onClick={loadCompanies} disabled={isLoading}>
          Refresh
        </Button>
      </div>

      <div className="mb-6 flex flex-col gap-4 rounded-xl border border-border bg-card p-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by company name, email, phone..."
            className="pl-10"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>
        <Button variant="outline" size="sm">
          <Filter className="mr-2 h-4 w-4" />
          Filters
        </Button>
      </div>

      {isLoading ? (
        <div className="rounded-xl border border-border bg-card p-8 text-center text-muted-foreground">
          Loading companies...
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
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Company</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Contact</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Address</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Cars</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Status</th>
                  <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredCompanies.map((company, index) => {
                  const status = getCompanyStatus(company);
                  const companyId = getCompanyId(company, index);
                  const isExpanded = expandedId === companyId;
                  const extraDetails = getExtraDetails(company);

                  return (
                    <React.Fragment key={companyId}>
                      <tr className="hover:bg-secondary/30 transition-colors">
                        <td className="whitespace-nowrap px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                              <Building2 className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <p className="font-medium text-card-foreground">{getCompanyDisplayName(company)}</p>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <Hash className="h-3 w-3" />
                                <span>{companyId}</span>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-5 py-4">
                          <div className="space-y-1 text-sm">
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Mail className="h-4 w-4" />
                              <span className="truncate">{company.email ? String(company.email) : "-"}</span>
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Phone className="h-4 w-4" />
                              <span>{company.phoneNumber ? String(company.phoneNumber) : "-"}</span>
                            </div>
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-5 py-4 text-sm">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <MapPin className="h-4 w-4" />
                            <span className="truncate">{company.address ? String(company.address) : "-"}</span>
                          </div>
                          {company.website ? (
                            <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                              <Globe className="h-3.5 w-3.5" />
                              <span>{String(company.website)}</span>
                            </div>
                          ) : null}
                        </td>
                        <td className="whitespace-nowrap px-5 py-4 text-sm text-muted-foreground">
                          {company.numberOfCars ?? "-"}
                        </td>
                        <td className="whitespace-nowrap px-5 py-4">
                          <Badge
                            className={
                              status === "approved"
                                ? "bg-success/10 text-success"
                                : status === "rejected"
                                ? "bg-destructive/10 text-destructive"
                                : status === "pending"
                                ? "bg-warning/10 text-warning"
                                : "bg-secondary text-muted-foreground"
                            }
                          >
                            {status}
                          </Badge>
                        </td>
                        <td className="whitespace-nowrap px-5 py-4 text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setExpandedId(isExpanded ? null : companyId)}
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
                          <td colSpan={6} className="px-5 py-4 text-sm">
                            <div className="grid gap-3 md:grid-cols-2">
                              <div>
                                <p className="text-xs uppercase tracking-wide text-muted-foreground">Created</p>
                                <p className="text-card-foreground">
                                  {company.createdAt ? String(company.createdAt) : "-"}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs uppercase tracking-wide text-muted-foreground">Website</p>
                                <p className="text-card-foreground">
                                  {company.website ? String(company.website) : "-"}
                                </p>
                              </div>
                              <div className="md:col-span-2">
                                <p className="text-xs uppercase tracking-wide text-muted-foreground mb-2">Company Owner</p>
                                {company.ownerId && typeof company.ownerId === "object" ? (
                                  <div className="flex items-center gap-4 p-3 rounded-lg border border-border/50 bg-background/50">
                                    <Avatar className="h-12 w-12 border-2 border-primary/20">
                                      <AvatarImage src={(company.ownerId as any).photo} alt={(company.ownerId as any).fullName} />
                                      <AvatarFallback className="bg-primary/10 text-primary">
                                        <User className="h-6 w-6" />
                                      </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 min-w-0">
                                      <p className="font-semibold text-foreground truncate">{(company.ownerId as any).fullName}</p>
                                      <div className="flex flex-col sm:flex-row sm:gap-4 mt-0.5">
                                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                          <Mail className="h-3 w-3" />
                                          <span className="truncate">{(company.ownerId as any).email}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                          <Phone className="h-3 w-3" />
                                          <span>{(company.ownerId as any).phoneNumber || "-"}</span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                ) : (
                                  <p className="text-card-foreground text-sm italic text-muted-foreground">
                                    {company.ownerId ? String(company.ownerId) : "Owner information not available"}
                                  </p>
                                )}
                              </div>
                              {extraDetails.length > 0 ? (
                                extraDetails.map((detail) => (
                                  <div key={detail.key}>
                                    <p className="text-xs uppercase tracking-wide text-muted-foreground">{detail.key}</p>
                                    <p className="text-card-foreground">{detail.value}</p>
                                  </div>
                                ))
                              ) : (
                                <div className="md:col-span-2 text-muted-foreground">
                                  No additional details available.
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
          {filteredCompanies.length === 0 && (
            <div className="border-t border-border px-6 py-8 text-center text-sm text-muted-foreground">
              No companies found.
            </div>
          )}
        </div>
      )}
    </DashboardLayout>
  );
}
