import * as React from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCheckAuth } from "@/hooks/use-check-auth";
import { getCompanyMe } from "@/services/companyService";
import { getVendorApplication } from "@/services/vendorService";
import { getDriverApplication } from "@/services/driverService";

type RecordMap = Record<string, unknown> | null;

type InfoItem = {
  label: string;
  value: string;
};

const getUserFromPayload = (payload: RecordMap) =>
  (payload as any)?.data?.user || (payload as any)?.user || null;

const getCompanyFromPayload = (payload: RecordMap) =>
  (payload as any)?.data?.company || (payload as any)?.company || null;

const getApplicationFromPayload = (payload: RecordMap) =>
  (payload as any)?.data?.application || (payload as any)?.application || null;

const normalizeItems = (entries: InfoItem[]) =>
  entries.filter((entry) => entry.value.trim().length > 0);

const toValue = (value: unknown) =>
  value === null || value === undefined ? "" : String(value);

const DetailSection = ({ title, items }: { title: string; items: InfoItem[] }) => (
  <section className="rounded-xl border border-border bg-card p-6">
    <div className="mb-4 flex items-center justify-between">
      <h2 className="text-lg font-semibold text-foreground">{title}</h2>
    </div>
    {items.length === 0 ? (
      <p className="text-sm text-muted-foreground">No details available.</p>
    ) : (
      <div className="grid gap-4 sm:grid-cols-2">
        {items.map((item) => (
          <div key={item.label}>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">{item.label}</p>
            <p className="text-sm text-card-foreground">{item.value}</p>
          </div>
        ))}
      </div>
    )}
  </section>
);

export default function Profile() {
  const navigate = useNavigate();
  const { checkAuth } = useCheckAuth();
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [user, setUser] = React.useState<RecordMap>(null);
  const [company, setCompany] = React.useState<RecordMap>(null);
  const [vendorApplication, setVendorApplication] = React.useState<RecordMap>(null);
  const [driverApplication, setDriverApplication] = React.useState<RecordMap>(null);

  const loadProfile = React.useCallback(async () => {
    setIsLoading(true);
    setError(null);

    const authResult = await checkAuth();
    if (!authResult.isAuthenticated) {
      navigate("/login", { replace: true });
      return;
    }

    const authPayload = authResult.data || null;
    const resolvedUser = getUserFromPayload(authPayload);
    setUser(resolvedUser);

    const role = resolvedUser?.role || localStorage.getItem("userRole");
    const token = localStorage.getItem("authToken");

    if (!token || !role) {
      setIsLoading(false);
      return;
    }

    if (role === "COMPANY_ADMIN") {
      const companyResult = await getCompanyMe(token);
      if (companyResult.ok) {
        setCompany(getCompanyFromPayload(companyResult.data as RecordMap));
      }
    }

    if (role === "VENDOR") {
      const vendorResult = await getVendorApplication(token);
      if (vendorResult.ok) {
        setVendorApplication(getApplicationFromPayload(vendorResult.data as RecordMap));
      }
    }

    if (role === "DRIVER") {
      const driverResult = await getDriverApplication(token);
      if (driverResult.ok) {
        setDriverApplication(getApplicationFromPayload(driverResult.data as RecordMap));
      }
    }

    setIsLoading(false);
  }, [checkAuth, navigate]);

  React.useEffect(() => {
    loadProfile().catch((err) => {
      const message = err instanceof Error ? err.message : "Unable to load profile.";
      setError(message);
      setIsLoading(false);
    });
  }, [loadProfile]);

  const userItems = normalizeItems([
    { label: "Full name", value: toValue((user as any)?.fullName) },
    { label: "Email", value: toValue((user as any)?.email) },
    { label: "Phone", value: toValue((user as any)?.phoneNumber) },
    { label: "Role", value: toValue((user as any)?.role) },
    { label: "Status", value: toValue((user as any)?.status) },
  ]);

  const companyItems = normalizeItems([
    { label: "Company name", value: toValue((company as any)?.companyName || (company as any)?.name) },
    { label: "Email", value: toValue((company as any)?.email) },
    { label: "Phone", value: toValue((company as any)?.phoneNumber) },
    { label: "Website", value: toValue((company as any)?.website) },
    { label: "Address", value: toValue((company as any)?.address) },
    { label: "Status", value: toValue((company as any)?.status) },
  ]);

  const vendorItems = normalizeItems([
    { label: "Company name", value: toValue((vendorApplication as any)?.companyName) },
    { label: "Contact", value: toValue((vendorApplication as any)?.contactName) },
    { label: "Email", value: toValue((vendorApplication as any)?.email) },
    { label: "Phone", value: toValue((vendorApplication as any)?.contactNumber) },
    { label: "Business type", value: toValue((vendorApplication as any)?.businessType) },
    { label: "Status", value: toValue((vendorApplication as any)?.status) },
  ]);

  const driverItems = normalizeItems([
    { label: "Full name", value: toValue((driverApplication as any)?.fullName) },
    { label: "Email", value: toValue((driverApplication as any)?.email) },
    { label: "Phone", value: toValue((driverApplication as any)?.contactNumber) },
    { label: "Vehicle type", value: toValue((driverApplication as any)?.vehicleType) },
    { label: "Status", value: toValue((driverApplication as any)?.status) },
  ]);

  return (
    <DashboardLayout>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Profile</h1>
          <p className="text-muted-foreground">Review your account information and linked records</p>
        </div>
        <Button variant="outline" onClick={loadProfile} disabled={isLoading}>
          Refresh
        </Button>
      </div>

      {isLoading ? (
        <div className="rounded-xl border border-border bg-card p-8 text-center text-muted-foreground">
          Loading profile...
        </div>
      ) : error ? (
        <div className="rounded-xl border border-destructive/40 bg-destructive/5 p-6 text-sm text-destructive">
          {error}
        </div>
      ) : (
        <div className="space-y-6">
          <section className="rounded-xl border border-border bg-card p-6">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
              <div>
                <h2 className="text-lg font-semibold text-foreground">Account</h2>
                <p className="text-sm text-muted-foreground">Your primary login details</p>
              </div>
              {(user as any)?.role ? (
                <Badge className="bg-primary/10 text-primary">{String((user as any)?.role)}</Badge>
              ) : null}
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {userItems.map((item) => (
                <div key={item.label}>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">{item.label}</p>
                  <p className="text-sm text-card-foreground">{item.value}</p>
                </div>
              ))}
            </div>
          </section>

          {companyItems.length > 0 && <DetailSection title="Company" items={companyItems} />}
          {vendorItems.length > 0 && <DetailSection title="Vendor Application" items={vendorItems} />}
          {driverItems.length > 0 && <DetailSection title="Driver Application" items={driverItems} />}
        </div>
      )}
    </DashboardLayout>
  );
}
