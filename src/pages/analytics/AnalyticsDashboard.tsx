import * as React from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { API_BASE_URL } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

function formatDateInput(date?: string) {
  if (!date) return '';
  const d = new Date(date);
  return d.toISOString().slice(0, 10);
}

export default function AnalyticsDashboard() {
  const [startDate, setStartDate] = React.useState<string>('');
  const [endDate, setEndDate] = React.useState<string>('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [overview, setOverview] = React.useState<any>(null);

  const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
  const userRole = typeof window !== 'undefined' ? localStorage.getItem('userRole') : null;

  const fetchOverview = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const qs = new URLSearchParams();
      if (startDate) qs.set('start', startDate);
      if (endDate) qs.set('end', endDate);

      const res = await fetch(`${API_BASE_URL}/api/v1/analytics/overview?${qs.toString()}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.message || res.statusText || 'Failed to load analytics');
      }
      const json = await res.json();
      setOverview(json.data || json);
    } catch (err: any) {
      setError(err.message || 'Failed to load analytics');
    } finally {
      setLoading(false);
    }
  }, [startDate, endDate, token]);

  const exportCsv = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const qs = new URLSearchParams();
      if (startDate) qs.set('start', startDate);
      if (endDate) qs.set('end', endDate);
      qs.set('format', 'csv');

      const res = await fetch(`${API_BASE_URL}/api/v1/analytics/export?${qs.toString()}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });

      if (!res.ok) {
        const body = await res.text().catch(() => '');
        throw new Error(body || res.statusText || 'Export failed');
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `analytics-${startDate || 'all'}-${endDate || 'all'}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      setError(err.message || 'Export failed');
    } finally {
      setLoading(false);
    }
  }, [startDate, endDate, token]);

  React.useEffect(() => {
    // load initial overview for last 7 days by default
    if (!startDate && !endDate) {
      const end = new Date();
      const start = new Date();
      start.setDate(end.getDate() - 7);
      setStartDate(formatDateInput(start.toISOString()));
      setEndDate(formatDateInput(end.toISOString()));
    }
  }, []);

  React.useEffect(() => {
    if (startDate && endDate) fetchOverview();
  }, [startDate, endDate, fetchOverview]);

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Analytics & Reporting</h1>
        <p className="text-muted-foreground">Overview of delivery metrics, ETAs, failures and CSV export</p>
      </div>

      <div className="mb-6 rounded-xl border border-border bg-card p-6">
        <div className="flex flex-col gap-4 sm:flex-row items-center">
          <div className="flex items-center gap-2">
            <label className="text-sm text-muted-foreground">Start</label>
            <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm text-muted-foreground">End</label>
            <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          </div>

          <div className="ml-auto flex gap-2">
            <Button onClick={fetchOverview} disabled={loading}>
              Refresh
            </Button>
            <Button onClick={exportCsv} disabled={loading}>
              Export CSV
            </Button>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="mb-4 font-semibold text-card-foreground">Summary</h3>
          {error && <p className="text-sm text-destructive">{error}</p>}
          {overview ? (
            <div className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Total Trips</p>
                <p className="font-medium text-card-foreground">{overview.totalTrips ?? '—'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Delivered</p>
                <p className="font-medium text-card-foreground">{overview.delivered ?? '—'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Failed Deliveries</p>
                <p className="font-medium text-card-foreground">{overview.failed ?? '—'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Average Delivery Time</p>
                <p className="font-medium text-card-foreground">{overview.avgDeliveryTime ? `${overview.avgDeliveryTime} mins` : '—'}</p>
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Loading metrics…</p>
          )}
        </div>

        <div className="lg:col-span-2 rounded-xl border border-border bg-card p-6">
          <h3 className="mb-4 font-semibold text-card-foreground">Recent Trips</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-muted-foreground">
                  <th className="py-2">Trip ID</th>
                  <th className="py-2">Order</th>
                  <th className="py-2">Status</th>
                  <th className="py-2">Delivered At</th>
                  <th className="py-2">Delivery Time (mins)</th>
                </tr>
              </thead>
              <tbody>
                {overview && Array.isArray(overview.recent) && overview.recent.length ? (
                  overview.recent.map((t: any) => (
                    <tr key={t._id} className="border-t">
                      <td className="py-2">{t._id}</td>
                      <td className="py-2">{t.orderNumber || '—'}</td>
                      <td className="py-2">{t.status}</td>
                      <td className="py-2">{t.deliveredAt ? new Date(t.deliveredAt).toLocaleString() : '—'}</td>
                      <td className="py-2">{t.deliveryTimeMinutes ?? '—'}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-6 text-center text-muted-foreground">No recent trips</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
