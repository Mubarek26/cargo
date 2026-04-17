import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Wrench, Plus, Search, Filter, CheckCircle, Clock, AlertTriangle, DollarSign, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const maintenanceLogs = [
  { id: "MNT-001", vehicle: "TRK-001", type: "Oil Change", status: "completed", date: "Nov 15, 2024", cost: "$450", technician: "Bob Miller", notes: "Full synthetic oil change, filter replaced" },
  { id: "MNT-002", vehicle: "TRK-003", type: "Brake Repair", status: "in_progress", date: "Dec 13, 2024", cost: "$1,200", technician: "Tom Harris", notes: "Front and rear brake pads replacement" },
  { id: "MNT-003", vehicle: "TRK-006", type: "Engine Tune-up", status: "scheduled", date: "Dec 15, 2024", cost: "$800", technician: "Bob Miller", notes: "Regular 50,000 mile service" },
  { id: "MNT-004", vehicle: "TRK-002", type: "Tire Rotation", status: "completed", date: "Dec 10, 2024", cost: "$150", technician: "Joe Clark", notes: "All tires rotated, pressure checked" },
  { id: "MNT-005", vehicle: "TRK-004", type: "Transmission Service", status: "completed", date: "Dec 01, 2024", cost: "$650", technician: "Tom Harris", notes: "Fluid change and filter replacement" },
  { id: "MNT-006", vehicle: "TRK-007", type: "AC Repair", status: "scheduled", date: "Dec 18, 2024", cost: "$500", technician: "Joe Clark", notes: "Compressor replacement needed" },
  { id: "MNT-007", vehicle: "TRK-005", type: "Battery Replacement", status: "completed", date: "Nov 25, 2024", cost: "$320", technician: "Bob Miller", notes: "New heavy-duty battery installed" },
  { id: "MNT-008", vehicle: "TRK-008", type: "Inspection", status: "completed", date: "Nov 10, 2024", cost: "$200", technician: "Tom Harris", notes: "Annual DOT inspection passed" },
];

const statusConfig = {
  completed: { label: "Completed", icon: CheckCircle, className: "text-success bg-success/10" },
  in_progress: { label: "In Progress", icon: Wrench, className: "text-warning bg-warning/10" },
  scheduled: { label: "Scheduled", icon: Clock, className: "text-primary bg-primary/10" },
};

export default function MaintenanceLogs() {
  const completedCount = maintenanceLogs.filter(m => m.status === "completed").length;
  const inProgressCount = maintenanceLogs.filter(m => m.status === "in_progress").length;
  const scheduledCount = maintenanceLogs.filter(m => m.status === "scheduled").length;

  return (
    <DashboardLayout>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Maintenance Logs</h1>
          <p className="text-muted-foreground">Track vehicle maintenance history</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Schedule Maintenance
        </Button>
      </div>

      {/* Summary cards */}
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-success/10 p-2">
              <CheckCircle className="h-5 w-5 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold text-card-foreground">{completedCount}</p>
              <p className="text-sm text-muted-foreground">Completed</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-warning/10 p-2">
              <Wrench className="h-5 w-5 text-warning" />
            </div>
            <div>
              <p className="text-2xl font-bold text-card-foreground">{inProgressCount}</p>
              <p className="text-sm text-muted-foreground">In Progress</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-primary/10 p-2">
              <Clock className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-card-foreground">{scheduledCount}</p>
              <p className="text-sm text-muted-foreground">Scheduled</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col gap-4 rounded-xl border border-border bg-card p-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search maintenance logs..." className="pl-10" />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Filters
          </Button>
          <Button variant="outline" size="sm">All Status</Button>
        </div>
      </div>

      {/* Logs */}
      <div className="space-y-4">
        {maintenanceLogs.map((log) => {
          const status = statusConfig[log.status as keyof typeof statusConfig];
          const StatusIcon = status.icon;

          return (
            <div key={log.id} className="rounded-xl border border-border bg-card p-5 hover:shadow-lg transition-shadow">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <Wrench className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-card-foreground">{log.type}</p>
                      <p className="text-sm text-muted-foreground">{log.id} • {log.vehicle}</p>
                    </div>
                    <Badge className={cn("ml-2", status.className)}>
                      <StatusIcon className="mr-1 h-3 w-3" />
                      {status.label}
                    </Badge>
                  </div>

                  <p className="text-sm text-muted-foreground mb-2">{log.notes}</p>

                  <div className="flex flex-wrap gap-4 text-sm">
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      {log.date}
                    </span>
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <Wrench className="h-4 w-4" />
                      {log.technician}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 rounded-lg bg-secondary px-3 py-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <span className="font-semibold text-card-foreground">{log.cost}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </DashboardLayout>
  );
}
