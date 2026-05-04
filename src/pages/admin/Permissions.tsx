import * as React from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { permissionService } from "@/services/permissionService";
import { toast } from "sonner";
import { Plus, Trash, Edit } from "lucide-react";

export default function PermissionsPage() {
  const [perms, setPerms] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [query, setQuery] = React.useState('');
  const [createOpen, setCreateOpen] = React.useState(false);
  const [key, setKey] = React.useState("");
  const [name, setName] = React.useState("");
  const [description, setDescription] = React.useState("");

  React.useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await permissionService.getPermissions();
      const data = res.data || res;
      setPerms(Array.isArray(data) ? data : []);
    } catch (err: any) {
      toast.error(err.message || 'Failed to load permissions');
    } finally { setLoading(false); }
  };

  const filteredPerms = React.useMemo(() => {
    const q = (query || '').trim().toLowerCase();
    if (!q) return perms;
    return perms.filter(p => {
      return (p.key || '').toLowerCase().includes(q)
        || (p.name || '').toLowerCase().includes(q)
        || (p.description || '').toLowerCase().includes(q);
    });
  }, [perms, query]);

  const handleCreate = async () => {
    if (!key || !name) return toast.error('Key and name are required');
    try {
      await permissionService.createPermission({ key: key.trim(), name: name.trim(), description: description.trim() });
      toast.success('Permission created');
      setCreateOpen(false); setKey(''); setName(''); setDescription('');
      fetchData();
    } catch (err: any) {
      toast.error(err.message || 'Failed to create permission');
    }
  };

  return (
    <DashboardLayout>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Permissions</h1>
          <p className="text-muted-foreground">Manage permission keys</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setCreateOpen(true)}><Plus className="mr-2 h-4 w-4"/> New Permission</Button>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-4">
        <div className="mb-4">
          <Input placeholder="Search permissions" value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>
        {loading ? (
          <div className="py-8 text-center">Loading...</div>
        ) : (
          <div className="space-y-2">
            {filteredPerms.length === 0 ? (
              <div className="py-6 text-center text-sm text-muted-foreground">No permissions found</div>
            ) : (
              filteredPerms.map(p => (
                <div key={p._id} className="flex items-center justify-between p-3 border rounded">
                  <div>
                    <div className="font-medium">{p.key}</div>
                    <div className="text-sm text-muted-foreground">{p.name} — {p.description}</div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost"><Edit/></Button>
                    <Button variant="ghost"><Trash/></Button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Permission</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <Input placeholder="Permission key (e.g. analytics:read)" value={key} onChange={(e)=>setKey(e.target.value)} />
            <Input placeholder="Display name" value={name} onChange={(e)=>setName(e.target.value)} />
            <Input placeholder="Description" value={description} onChange={(e)=>setDescription(e.target.value)} />
          </div>
          <DialogFooter>
            <div className="flex gap-2">
              <Button variant="outline" onClick={()=>setCreateOpen(false)}>Cancel</Button>
              <Button onClick={handleCreate}>Create</Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
