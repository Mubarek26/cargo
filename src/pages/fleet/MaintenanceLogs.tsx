import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Wrench, Plus, Search, Filter, CheckCircle, Clock, AlertTriangle, DollarSign, Calendar } from "lucide-react";
import { useEffect, useState } from "react";
import { maintenanceService } from '@/services/maintenanceService';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const sampleMaintenanceLogs = [
  { id: "MNT-001", vehicle: "TRK-001", type: "Oil Change", status: "completed", date: "Nov 15, 2024", cost: "$450", technician: "Bob Miller", notes: "Full synthetic oil change, filter replaced" },
  { id: "MNT-002", vehicle: "TRK-003", type: "Brake Repair", status: "in_progress", date: "Dec 13, 2024", cost: "$1,200", technician: "Tom Harris", notes: "Front and rear brake pads replacement" },
  { id: "MNT-003", vehicle: "TRK-006", type: "Engine Tune-up", status: "scheduled", date: "Dec 15, 2024", cost: "$800", technician: "Bob Miller", notes: "Regular 50,000 mile service" },
  { id: "MNT-004", vehicle: "TRK-002", type: "Tire Rotation", status: "completed", date: "Dec 10, 2024", cost: "$150", technician: "Joe Clark", notes: "All tires rotated, pressure checked" },
  { id: "MNT-005", vehicle: "TRK-004", type: "Transmission Service", status: "completed", date: "Dec 01, 2024", cost: "$650", technician: "Tom Harris", notes: "Fluid change and filter replacement" },
  { id: "MNT-006", vehicle: "TRK-007", type: "AC Repair", status: "scheduled", date: "Dec 18, 2024", cost: "$500", technician: "Joe Clark", notes: "Compressor replacement needed" },
  { id: "MNT-007", vehicle: "TRK-005", type: "Battery Replacement", status: "completed", date: "Nov 25, 2024", cost: "$320", technician: "Bob Miller", notes: "New heavy-duty battery installed" },
  { id: "MNT-008", vehicle: "TRK-008", type: "Inspection", status: "completed", date: "Nov 10, 2024", cost: "$200", technician: "Tom Harris", notes: "Annual DOT inspection passed" },
];

function MaintenanceLogsPage() {
  const [maintenanceLogs, setMaintenanceLogs] = useState(sampleMaintenanceLogs as any[]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setIsLoading(true);
      try {
        const data = await maintenanceService.getLogs();
        if (mounted && data && Array.isArray(data)) setMaintenanceLogs(data as any[]);
      } catch (err) {
        console.error('Failed to fetch maintenance logs', err);
      } finally {
        if (mounted) setIsLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, []);

  const completedCount = maintenanceLogs.filter(m => m.status === "completed").length;
  const inProgressCount = maintenanceLogs.filter(m => m.status === "in_progress").length;
  const scheduledCount = maintenanceLogs.filter(m => m.status === "scheduled").length;
  const reportedCount = maintenanceLogs.filter(m => m.status === "reported").length;
  const cancelledCount = maintenanceLogs.filter(m => m.status === "cancelled").length;

  // Modal/form state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingLog, setEditingLog] = useState<any | null>(null);
  const [form, setForm] = useState<any>({ vehicleId: '', maintenanceType: '', status: 'scheduled', cost: '', technician: '', notes: '', performedAt: '' });

  const openCreate = () => {
    setEditingLog(null);
    setForm({ vehicleId: '', maintenanceType: '', status: 'scheduled', cost: '', technician: '', notes: '', performedAt: '' });
    setModalOpen(true);
  };

  const openEdit = (log: any) => {
    setEditingLog(log);
    setForm({
      vehicleId: log.vehicleId || log.vehicle,
      maintenanceType: log.maintenanceType || log.type,
      status: log.status,
      cost: log.cost,
      technician: log.technician,
      notes: log.notes,
      performedAt: log.performedAt || log.date || ''
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingLog(null);
  };

  const submitForm = async () => {
    try {
      if (editingLog) {
        const updated = await maintenanceService.updateLog(editingLog._id || editingLog.id, form);
        setMaintenanceLogs((prev) => prev.map((p: any) => (p._id === (updated._id || updated.id) || p.id === (updated._id || updated.id) ? { ...p, ...updated } : p)));
        closeModal();
      } else {
        const created = await maintenanceService.createLog(form);
        setMaintenanceLogs((prev) => [created, ...prev]);
        closeModal();
      }
    } catch (err) {
      console.error('Failed to save maintenance', err);
      alert('Failed to save maintenance');
    }
  };

  const removeLog = async (id: string) => {
    if (!confirm('Delete this maintenance record?')) return;
    try {
      await maintenanceService.deleteLog(id);
      setMaintenanceLogs((prev) => prev.filter((p: any) => (p._id || p.id) !== id));
    } catch (err) {
      console.error('Failed to delete', err);
      alert('Failed to delete');
    }
  };

  return (
    <DashboardLayout>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Maintenance Logs</h1>
          <p className="text-muted-foreground">Track vehicle maintenance history</p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={openCreate}>
            <Plus className="mr-2 h-4 w-4" />
            Schedule Maintenance
          </Button>
        </div>
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
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-info/10 p-2">
              <AlertTriangle className="h-5 w-5 text-foreground" />
            </div>
            <div>
              <p className="text-2xl font-bold text-card-foreground">{reportedCount}</p>
              <p className="text-sm text-muted-foreground">Reported</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-muted/10 p-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <p className="text-2xl font-bold text-card-foreground">{cancelledCount}</p>
              <p className="text-sm text-muted-foreground">Cancelled</p>
            </div>
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
            {isLoading ? (
          <div className="p-6">Loading...</div>
        ) : (
          maintenanceLogs.map((log) => {
            const status = statusConfig[(log.status as keyof typeof statusConfig) || 'completed'] || statusConfig['completed'];
            const StatusIcon = status?.icon || CheckCircle;

            return (
              <div key={(log._id || log.id)} className="rounded-xl border border-border bg-card p-5 hover:shadow-lg transition-shadow">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        <Wrench className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold text-card-foreground">{log.maintenanceType || log.type}</p>
                        <p className="text-sm text-muted-foreground">{log._id || log.id} • {log.vehicleId || log.vehicle}</p>
                      </div>
                      <Badge className={cn("ml-2", status.className)}>
                        <StatusIcon className="mr-1 h-3 w-3" />
                        {status.label}
                      </Badge>
                      <div className="ml-4 flex items-center gap-2">
                        <Button variant="ghost" size="sm" onClick={() => openEdit(log)}>Edit</Button>
                        <Button variant="ghost" size="sm" onClick={() => removeLog((log._id || log.id))}>Delete</Button>
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground mb-2">{log.notes}</p>

                    <div className="flex flex-wrap gap-4 text-sm">
                      <span className="flex items-center gap-1 text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        {log.date || (log.createdAt ? new Date(log.createdAt).toLocaleDateString() : '')}
                      </span>
                      <span className="flex items-center gap-1 text-muted-foreground">
                        <Wrench className="h-4 w-4" />
                        {log.technician}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 rounded-lg bg-muted/10 px-3 py-2">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <span className="font-semibold text-foreground">{log.cost}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
      
      <Dialog open={modalOpen} onOpenChange={(open) => setModalOpen(open)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingLog ? 'Edit Maintenance' : 'Schedule Maintenance'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="grid grid-cols-1 gap-2">
              <label className="text-sm">Vehicle ID</label>
              <Input value={form.vehicleId} onChange={(e) => setForm({...form, vehicleId: e.target.value})} />
            </div>
            <div className="grid grid-cols-1 gap-2">
              <label className="text-sm">Type</label>
              <Input value={form.maintenanceType} onChange={(e) => setForm({...form, maintenanceType: e.target.value})} />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-sm">Status</label>
                <select className="w-full p-2 border rounded" value={form.status} onChange={(e) => setForm({...form, status: e.target.value})}>
                  <option value="reported">Reported</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              <div>
                <label className="text-sm">Cost</label>
                <Input className="bg-card text-card-foreground border-border" value={form.cost as any} onChange={(e) => setForm({...form, cost: e.target.value})} />
              </div>
            </div>
            <div>
              <label className="text-sm">Technician</label>
              <Input value={form.technician} onChange={(e) => setForm({...form, technician: e.target.value})} />
            </div>
            <div>
              <label className="text-sm">Notes</label>
              <Textarea value={form.notes} onChange={(e:any) => setForm({...form, notes: e.target.value})} />
            </div>
          </div>
          <DialogFooter>
            <div className="flex gap-2">
              <Button variant="ghost" onClick={closeModal}>Cancel</Button>
              <Button onClick={submitForm}>{editingLog ? 'Save' : 'Create'}</Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}

const statusConfig = {
  reported: { label: 'Reported', icon: AlertTriangle, className: 'text-foreground bg-muted/10' },
  scheduled: { label: 'Scheduled', icon: Clock, className: 'text-primary bg-primary/10' },
  in_progress: { label: 'In Progress', icon: Wrench, className: 'text-warning bg-warning/10' },
  completed: { label: 'Completed', icon: CheckCircle, className: 'text-success bg-success/10' },
  cancelled: { label: 'Cancelled', icon: AlertTriangle, className: 'text-destructive bg-destructive/10' },
};

export default MaintenanceLogsPage;
