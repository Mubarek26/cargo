import * as React from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { API_BASE_URL } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  PieChart, 
  Pie, 
  Cell,
  Legend
} from "recharts";
import { 
  TrendingUp, 
  TrendingDown, 
  Package, 
  Truck, 
  Clock, 
  AlertCircle, 
  Download, 
  Calendar,
  DollarSign,
  MapPin,
  ChevronRight,
  Filter,
  Loader2,
  CheckCircle2,
  Ban,
  Building2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { companyService } from "@/services/companyService";

function formatDateInput(date?: string) {
  if (!date) return '';
  const d = new Date(date);
  return d.toISOString().slice(0, 10);
}

export default function AnalyticsDashboard() {
  const [startDate, setStartDate] = React.useState<string>('');
  const [endDate, setEndDate] = React.useState<string>('');
  const [selectedCompany, setSelectedCompany] = React.useState<string>('all');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [dashboardData, setDashboardData] = React.useState<any>(null);
  const [companies, setCompanies] = React.useState<any[]>([]);
  const [activeTab, setActiveTab] = React.useState("overview");

  const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
  const userRole = typeof window !== 'undefined' ? localStorage.getItem('userRole') : null;
  const isSuperAdmin = userRole === 'SUPER_ADMIN';

  const fetchDashboardStats = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const qs = new URLSearchParams();
      if (startDate) qs.set('startDate', startDate);
      if (endDate) qs.set('endDate', endDate);
      if (selectedCompany !== 'all') qs.set('companyId', selectedCompany);

      const res = await fetch(`${API_BASE_URL}/api/v1/analytics/dashboard-stats?${qs.toString()}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.message || res.statusText || 'Failed to load analytics');
      }
      const json = await res.json();
      setDashboardData(json.data || json);
    } catch (err: any) {
      setError(err.message || 'Failed to load analytics');
      toast.error("Failed to load analytics data");
    } finally {
      setLoading(false);
    }
  }, [startDate, endDate, selectedCompany, token]);

  const fetchCompanies = React.useCallback(async () => {
    if (!isSuperAdmin || !token) return;
    try {
      const res = await companyService.getCompanies(token);
      if (res.ok && res.data && res.data.data && Array.isArray(res.data.data.companies)) {
        setCompanies(res.data.data.companies);
      }
    } catch (err) {
      console.error("Failed to fetch companies", err);
    }
  }, [isSuperAdmin, token]);

  const exportCsv = React.useCallback(async () => {
    setLoading(true);
    try {
      const qs = new URLSearchParams();
      if (startDate) qs.set('start', startDate);
      if (endDate) qs.set('end', endDate);
      if (selectedCompany !== 'all') qs.set('companyId', selectedCompany);
      qs.set('format', 'csv');

      const res = await fetch(`${API_BASE_URL}/api/v1/analytics/export?${qs.toString()}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });

      if (!res.ok) throw new Error('Export failed');

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `analytics-report.csv`;
      a.click();
      toast.success("Report exported successfully");
    } catch (err: any) {
      toast.error("Failed to export report");
    } finally {
      setLoading(false);
    }
  }, [startDate, endDate, selectedCompany, token]);

  React.useEffect(() => {
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - 30);
    setStartDate(formatDateInput(start.toISOString()));
    setEndDate(formatDateInput(end.toISOString()));
    fetchCompanies();
  }, [fetchCompanies]);

  React.useEffect(() => {
    if (startDate && endDate) fetchDashboardStats();
  }, [startDate, endDate, selectedCompany, fetchDashboardStats]);

  const stats = [
    { 
      label: "Total Orders", 
      value: dashboardData?.stats?.totalOrders ?? '0', 
      icon: Package, 
      trend: "Orders", 
      trendUp: true,
      color: "text-blue-600",
      bg: "bg-blue-500/10"
    },
    { 
      label: "Delivered", 
      value: dashboardData?.stats?.completedOrders ?? '0', 
      icon: CheckCircle2, 
      trend: "Success", 
      trendUp: true,
      color: "text-emerald-600",
      bg: "bg-emerald-500/10"
    },
    { 
      label: "Revenue", 
      value: dashboardData?.stats?.revenue ? `ETB ${dashboardData.stats.revenue.toLocaleString()}` : 'ETB 0', 
      icon: DollarSign, 
      trend: "Gross", 
      trendUp: true,
      color: "text-amber-600",
      bg: "bg-amber-500/10"
    },
    { 
      label: "Utilization", 
      value: `${dashboardData?.stats?.fleetUtilization ?? 0}%`, 
      icon: Truck, 
      trend: "Fleet", 
      trendUp: true,
      color: "text-primary",
      bg: "bg-primary/10"
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8 pb-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
              <TrendingUp className="h-8 w-8 text-primary" />
              Real-time Analytics
            </h1>
            <p className="text-muted-foreground mt-1 text-lg">Integrated data directly from your backend services.</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {isSuperAdmin && (
              <div className="flex items-center gap-2 bg-card border border-border rounded-xl px-3 py-1 shadow-sm min-w-[200px]">
                <Building2 className="h-4 w-4 text-muted-foreground" />
                <Select value={selectedCompany} onValueChange={setSelectedCompany}>
                  <SelectTrigger className="border-none bg-transparent shadow-none focus:ring-0 text-xs h-8">
                    <SelectValue placeholder="Filter by Company" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Companies</SelectItem>
                    {companies.map((c) => (
                      <SelectItem key={c._id} value={c._id}>{c.companyName}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            <div className="flex items-center gap-2 bg-card border border-border rounded-xl px-3 py-1.5 shadow-sm">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div className="flex items-center gap-1 text-sm">
                <input 
                  type="date" 
                  value={startDate} 
                  onChange={(e) => setStartDate(e.target.value)}
                  className="bg-transparent border-none focus:outline-none text-xs w-24"
                />
                <span className="text-muted-foreground text-[10px]">to</span>
                <input 
                  type="date" 
                  value={endDate} 
                  onChange={(e) => setEndDate(e.target.value)}
                  className="bg-transparent border-none focus:outline-none text-xs w-24"
                />
              </div>
            </div>
            <Button onClick={exportCsv} disabled={loading} className="gap-2 shadow-lg shadow-primary/20">
              <Download className="h-4 w-4" /> Export
            </Button>
          </div>
        </div>

        {loading && !dashboardData ? (
          <div className="flex h-96 items-center justify-center">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
          </div>
        ) : (
          <>
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, i) => (
                <Card key={i} className="border-none shadow-xl shadow-primary/5">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className={cn("h-12 w-12 rounded-2xl flex items-center justify-center", stat.bg)}>
                        <stat.icon className={cn("h-6 w-6", stat.color)} />
                      </div>
                      <Badge variant="secondary" className="text-[10px] font-bold uppercase">
                        {stat.trend}
                      </Badge>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{stat.label}</p>
                      <h3 className="text-3xl font-black text-foreground">{stat.value}</h3>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Tabs defaultValue="overview" className="w-full" onValueChange={setActiveTab}>
          <div className="flex items-center justify-between mb-6">
            <TabsList className="bg-card border border-border h-12 p-1 rounded-xl">
              <TabsTrigger value="overview" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-6">Overview</TabsTrigger>
              <TabsTrigger value="operational" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-6">Network</TabsTrigger>
              <TabsTrigger value="financials" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-6">Growth</TabsTrigger>
              <TabsTrigger value="reports" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-6">Recent Activity</TabsTrigger>
            </TabsList>
            {loading && (
              <div className="flex items-center gap-2 text-primary animate-pulse">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-xs font-medium">Refreshing Data...</span>
              </div>
            )}
          </div>

          <div className={cn("transition-all duration-300 relative", loading ? "opacity-50 pointer-events-none" : "opacity-100")}>
            {loading && (
              <div className="absolute inset-0 z-50 flex items-center justify-center bg-background/5 rounded-3xl">
                <Loader2 className="h-10 w-10 text-primary animate-spin" />
              </div>
            )}
            
            <TabsContent value="overview" className="space-y-8 mt-0 focus-visible:ring-0">
                <div className="grid gap-6 lg:grid-cols-3">
                  <Card className="lg:col-span-2 border-none shadow-xl shadow-primary/5">
                    <CardHeader>
                      <CardTitle className="text-xl font-bold">Volume & Revenue Trends</CardTitle>
                      <CardDescription>Daily order volume and completed transaction totals</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[350px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={dashboardData?.chartData || []}>
                          <defs>
                            <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                          <XAxis 
                            dataKey="date" 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{fill: 'hsl(var(--muted-foreground))', fontSize: 10}}
                          />
                          <YAxis 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{fill: 'hsl(var(--muted-foreground))', fontSize: 10}}
                          />
                          <Tooltip />
                          <Area 
                            type="monotone" 
                            dataKey="shipments" 
                            stroke="hsl(var(--primary))" 
                            strokeWidth={3}
                            fillOpacity={1} 
                            fill="url(#colorVolume)" 
                            name="Orders"
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  <Card className="border-none shadow-xl shadow-primary/5">
                    <CardHeader>
                      <CardTitle className="text-xl font-bold">Carrier Share</CardTitle>
                      <CardDescription>Distribution across transport partners</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                      {dashboardData?.carrierDistribution?.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={dashboardData.carrierDistribution}
                              cx="50%"
                              cy="50%"
                              innerRadius={60}
                              outerRadius={80}
                              paddingAngle={5}
                              dataKey="value"
                            >
                              {dashboardData.carrierDistribution.map((entry: any, index: number) => (
                                <Cell key={`cell-${index}`} fill={`hsl(var(--primary), ${1 - index * 0.2})`} />
                              ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                          </PieChart>
                        </ResponsiveContainer>
                      ) : (
                        <div className="flex items-center justify-center h-full text-muted-foreground text-sm">No carrier data available</div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="operational" className="space-y-6 outline-none">
                <Card className="border-none shadow-xl shadow-primary/5">
                  <CardHeader>
                    <CardTitle className="text-xl font-bold">Geographic Performance</CardTitle>
                    <CardDescription>Delivery volume by city</CardDescription>
                  </CardHeader>
                  <CardContent className="h-[400px]">
                    {dashboardData?.geoPerformance?.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={dashboardData.geoPerformance}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} />
                          <XAxis dataKey="name" axisLine={false} tickLine={false} />
                          <YAxis axisLine={false} tickLine={false} />
                          <Tooltip />
                          <Bar dataKey="value" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} name="Orders" />
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="flex items-center justify-center h-full text-muted-foreground text-sm">No geographic data available</div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="financials" className="space-y-6 outline-none">
                <Card className="border-none shadow-xl shadow-primary/5">
                  <CardHeader>
                    <CardTitle className="text-xl font-bold">Revenue Growth</CardTitle>
                    <CardDescription>Historical revenue collection over time</CardDescription>
                  </CardHeader>
                  <CardContent className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={dashboardData?.chartData || []}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="date" axisLine={false} tickLine={false} />
                        <YAxis axisLine={false} tickLine={false} />
                        <Tooltip />
                        <Area type="monotone" dataKey="revenue" stroke="#10b981" fill="#10b981" fillOpacity={0.1} strokeWidth={3} name="Revenue (ETB)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="reports" className="space-y-6 outline-none">
                <Card className="border-none shadow-xl shadow-primary/5 overflow-hidden">
                  <CardHeader className="bg-muted/20 border-b border-border">
                    <CardTitle className="text-xl font-bold">Latest Operational Logs</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="text-left text-muted-foreground border-b border-border bg-muted/50">
                            <th className="px-6 py-4 uppercase text-[10px] font-black tracking-widest">ID</th>
                            <th className="px-6 py-4 uppercase text-[10px] font-black tracking-widest">Origin</th>
                            <th className="px-6 py-4 uppercase text-[10px] font-black tracking-widest">Destination</th>
                            <th className="px-6 py-4 uppercase text-[10px] font-black tracking-widest">Status</th>
                            <th className="px-6 py-4 uppercase text-[10px] font-black tracking-widest">Date</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                          {dashboardData?.recentOrders?.length ? (
                            dashboardData.recentOrders.map((o: any) => (
                              <tr key={o.id} className="hover:bg-muted/30 transition-colors">
                                <td className="px-6 py-4 font-mono text-[10px] text-muted-foreground">{o.orderNumber || o.id.slice(-8)}</td>
                                <td className="px-6 py-4 truncate max-w-[150px]">{o.origin}</td>
                                <td className="px-6 py-4 truncate max-w-[150px]">{o.destination}</td>
                                <td className="px-6 py-4">
                                  <Badge variant="outline" className="text-[10px] font-bold uppercase">{o.status}</Badge>
                                </td>
                                <td className="px-6 py-4 text-muted-foreground">
                                  {new Date(o.createdAt).toLocaleDateString()}
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan={5} className="py-20 text-center text-muted-foreground">No recent activity found</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </div>
          </Tabs>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
