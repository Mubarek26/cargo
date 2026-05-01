import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { maintenanceService } from '@/services/maintenanceService';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Wrench, ArrowDownCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function DriverReportsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [reports, setReports] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState({ plateNumber: '', maintenanceType: '', notes: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const load = async () => {
    setIsLoading(true);
    try {
      const data = await maintenanceService.getMyReports();
      setReports(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to load reports', err);
      toast.error('Failed to load reports');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const submit = async () => {
    if (!form.plateNumber || !form.maintenanceType) return toast.error('Provide plate number and issue type');
    setIsSubmitting(true);
    try {
      await maintenanceService.reportIssue({ plateNumber: form.plateNumber, maintenanceType: form.maintenanceType, notes: form.notes });
      toast.success('Reported');
      setForm({ plateNumber: '', maintenanceType: '', notes: '' });
      setIsOpen(false);
      await load();
    } catch (err) {
      console.error(err);
      toast.error('Failed to report');
    } finally { setIsSubmitting(false); }
  };

  return (
    <DashboardLayout>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">My Reports</h1>
          <p className="text-muted-foreground">Report vehicle issues and view your reported items</p>
        </div>
        <div>
          <Button onClick={() => setIsOpen(true)}>
            <Wrench className="mr-2 h-4 w-4" /> Report Issue
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="p-6"><Loader2 className="animate-spin" /></div>
      ) : reports.length === 0 ? (
        <Card className="border-dashed border-2 p-12 text-muted-foreground">
          <div className="text-center">
            <ArrowDownCircle className="mx-auto mb-4 opacity-20 h-10 w-10" />
            <p>No reports yet — create one with the button above.</p>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {reports.map((r) => (
            <Card key={r._id || r.id}>
              <CardContent className="flex items-center justify-between">
                <div>
                  <div className="font-semibold">{r.maintenanceType}</div>
                  <div className="text-xs text-muted-foreground">{r.plateNumber || r.vehicleId} • {r.status}</div>
                  <div className="mt-2 text-sm text-muted-foreground">{r.notes}</div>
                </div>
                <div className="text-right text-xs text-muted-foreground">{r.createdAt ? new Date(r.createdAt).toLocaleString() : ''}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={isOpen} onOpenChange={(o) => setIsOpen(o)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Report Vehicle Issue</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <label className="text-sm">Plate Number</label>
              <Input value={form.plateNumber} onChange={(e: any) => setForm({ ...form, plateNumber: e.target.value })} />
            </div>
            <div>
              <label className="text-sm">Issue Type</label>
              <Input value={form.maintenanceType} onChange={(e: any) => setForm({ ...form, maintenanceType: e.target.value })} />
            </div>
            <div>
              <label className="text-sm">Notes</label>
              <Textarea value={form.notes} onChange={(e: any) => setForm({ ...form, notes: e.target.value })} />
            </div>
          </div>
          <DialogFooter>
            <div className="flex gap-2">
              <Button variant="ghost" onClick={() => setIsOpen(false)}>Cancel</Button>
              <Button onClick={submit} disabled={isSubmitting}>{isSubmitting ? 'Reporting...' : 'Submit'}</Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
