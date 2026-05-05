import * as React from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { roleService } from "@/services/roleService";
import { toast } from "sonner";
import { userService } from "@/services/userService";
import { Loader2, Plus, Edit, Trash, Users } from "lucide-react";

export default function RolesPage() {
  const [roles, setRoles] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [createOpen, setCreateOpen] = React.useState(false);
  const [editOpen, setEditOpen] = React.useState(false);
  const [editingRole, setEditingRole] = React.useState<any | null>(null);
  const [name, setName] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [permissions, setPermissions] = React.useState<any[]>([]);
  const [selectedPerms, setSelectedPerms] = React.useState<Record<string, boolean>>({});
  const [permQuery, setPermQuery] = React.useState('');
  const [assignOpen, setAssignOpen] = React.useState(false);
  const [assignRoleId, setAssignRoleId] = React.useState<string | null>(null);
  const [assignUserId, setAssignUserId] = React.useState<string | null>(null);
  const [assignUserQuery, setAssignUserQuery] = React.useState<string>('');
  const [assignUsers, setAssignUsers] = React.useState<any[]>([]);
  const [assignUsersLoading, setAssignUsersLoading] = React.useState(false);

  React.useEffect(() => { fetchData(); fetchPerms(); }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await roleService.getRoles();
      const data = res.data || res;
      setRoles(Array.isArray(data) ? data : (data));
    } catch (err: any) {
      toast.error(err.message || 'Failed to load roles');
    } finally { setLoading(false); }
  };

  const fetchPerms = async () => {
    try {
      const res = await roleService.getPermissions();
      const list = res.data || res;
      setPermissions(Array.isArray(list) ? list : []);
      const map: Record<string, boolean> = {};
      (Array.isArray(list) ? list : []).forEach((p: any) => map[p.key] = false);
      setSelectedPerms(map);
      setPermQuery('');
    } catch (err) {
      console.warn('Failed to load permissions', err);
    }
  };

  const handleCreate = async () => {
    const permKeys = Object.keys(selectedPerms).filter(k => selectedPerms[k]);
    try {
      await roleService.createRole({ name, description, permissions: permKeys });
      toast.success('Role created');
      setCreateOpen(false);
      setName(''); setDescription('');
      fetchData();
    } catch (err: any) {
      toast.error(err.message || 'Failed to create role');
    }
  };

  const openEdit = (role: any) => {
    setEditingRole(role);
    setEditOpen(true);
    // prefill fields
    setName(role.name || '');
    setDescription(role.description || '');
    // build permission map from available permissions
    const rolePermKeys = new Set((role.permissions || []).map((p: any) => (p && (p.key || p)) || String(p)));
    const map: Record<string, boolean> = {};
    permissions.forEach((p: any) => map[p.key] = rolePermKeys.has(p.key));
    setSelectedPerms(map);
    setPermQuery('');
  };

  const handleUpdate = async () => {
    if (!editingRole) return;
    const permKeys = Object.keys(selectedPerms).filter(k => selectedPerms[k]);
    try {
      await roleService.updateRole(editingRole._id, { name, description, permissions: permKeys });
      toast.success('Role updated');
      setEditOpen(false); setEditingRole(null); setName(''); setDescription('');
      fetchData();
    } catch (err: any) {
      toast.error(err.message || 'Failed to update role');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this role?')) return;
    try {
      await roleService.deleteRole(id);
      toast.success('Role deleted');
      fetchData();
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete');
    }
  };

  const openAssign = (roleId: string) => {
    setAssignRoleId(roleId); setAssignOpen(true);
  };

  const fetchAssignUsers = async () => {
    setAssignUsersLoading(true);
    try {
      // fetch a reasonably large page so admin can search locally
      const res = await userService.getAllUsers({ page: 1, limit: 200 });
      let list: any[] = [];
      if (res && res.status === 'success') {
        list = res.data?.data || res.data || [];
      }
      setAssignUsers(Array.isArray(list) ? list : []);
    } catch (err) {
      console.warn('Failed to load users for assign', err);
      setAssignUsers([]);
    } finally {
      setAssignUsersLoading(false);
    }
  };

  const handleAssign = async () => {
    if (!assignRoleId || !assignUserId) return toast.error('Select user id');
    try {
      await roleService.assignRole(assignRoleId, assignUserId);
      toast.success('Role assigned');
      setAssignOpen(false); setAssignUserId(null); setAssignRoleId(null);
    } catch (err: any) {
      toast.error(err.message || 'Failed to assign role');
    }
  };

  return (
    <DashboardLayout>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Roles & Permissions</h1>
          <p className="text-muted-foreground">Create, edit and assign roles</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setCreateOpen(true)}><Plus className="mr-2 h-4 w-4"/> New Role</Button>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-4">
        {loading ? (
          <div className="py-8 text-center"><Loader2 className="animate-spin mx-auto"/></div>
        ) : (
          <div className="space-y-3">
            {roles.map(r => (
              <div key={r._id} className="flex items-center justify-between p-3 border rounded">
                <div>
                  <div className="font-medium">{r.name}</div>
                  <div className="text-sm text-muted-foreground">{r.description}</div>
                  <div className="mt-2 text-xs text-muted-foreground">{(r.permissions||[]).map((p:any)=>p.key||p).join(', ')}</div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => openAssign(r._id)}><Users className="h-4 w-4"/> Assign</Button>
                  <Button variant="ghost" onClick={() => openEdit(r)}><Edit/></Button>
                  {!r.immutable && <Button variant="ghost" onClick={() => handleDelete(r._id)}><Trash/></Button>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Dialog open={createOpen} onOpenChange={(open)=>{ if(!open){ setCreateOpen(false); setName(''); setDescription(''); const map: Record<string, boolean> = {}; permissions.forEach((p:any)=>map[p.key]=false); setSelectedPerms(map); setPermQuery(''); } else { setCreateOpen(true); } }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Role</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <Input placeholder="Role name (e.g. COMPANY_ADMIN)" value={name} onChange={(e)=>setName(e.target.value)} />
            <Input placeholder="Description" value={description} onChange={(e)=>setDescription(e.target.value)} />
            <Input placeholder="Search permissions" value={permQuery} onChange={(e)=>setPermQuery(e.target.value)} />
            <div className="max-h-48 overflow-auto border p-2 rounded">
              {permissions.filter(p => {
                if (!permQuery) return true;
                const q = permQuery.toLowerCase();
                return (p.key || '').toLowerCase().includes(q) || (p.name || '').toLowerCase().includes(q);
              }).map(p=> (
                <label key={p._id} className="flex items-center gap-2 py-1">
                  <input type="checkbox" checked={!!selectedPerms[p.key]} onChange={(e)=> setSelectedPerms(s=>({...s,[p.key]: e.target.checked}))} />
                  <div className="text-sm">{p.key} — <span className="text-muted-foreground">{p.name}</span></div>
                </label>
              ))}
            </div>
          </div>
          <DialogFooter>
            <div className="flex gap-2">
              <Button variant="outline" onClick={()=>setCreateOpen(false)}>Cancel</Button>
              <Button onClick={handleCreate}>Create</Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={editOpen} onOpenChange={(open)=>{ if(!open){ setEditOpen(false); setEditingRole(null); setName(''); setDescription(''); const map: Record<string, boolean> = {}; permissions.forEach((p:any)=>map[p.key]=false); setSelectedPerms(map); setPermQuery(''); } else { setEditOpen(true); } }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Role</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <Input placeholder="Role name (e.g. COMPANY_ADMIN)" value={name} onChange={(e)=>setName(e.target.value)} />
            <Input placeholder="Description" value={description} onChange={(e)=>setDescription(e.target.value)} />
            <Input placeholder="Search permissions" value={permQuery} onChange={(e)=>setPermQuery(e.target.value)} />
            <div className="max-h-48 overflow-auto border p-2 rounded">
              {permissions.filter(p => {
                if (!permQuery) return true;
                const q = permQuery.toLowerCase();
                return (p.key || '').toLowerCase().includes(q) || (p.name || '').toLowerCase().includes(q);
              }).map(p=> (
                <label key={p._id} className="flex items-center gap-2 py-1">
                  <input type="checkbox" checked={!!selectedPerms[p.key]} onChange={(e)=> setSelectedPerms(s=>({...s,[p.key]: e.target.checked}))} />
                  <div className="text-sm">{p.key} — <span className="text-muted-foreground">{p.name}</span></div>
                </label>
              ))}
            </div>
          </div>
          <DialogFooter>
            <div className="flex gap-2">
              <Button variant="outline" onClick={()=>{ setEditOpen(false); setEditingRole(null); }}>Cancel</Button>
              <Button onClick={handleUpdate}>Save</Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={assignOpen} onOpenChange={setAssignOpen}>
        <DialogContent>
            <DialogHeader>
              <DialogTitle>Assign Role to User</DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              <Input
                placeholder="Search users by name or email..."
                value={assignUserQuery}
                onChange={(e) => setAssignUserQuery(e.target.value)}
                onFocus={() => { if (assignUsers.length === 0) fetchAssignUsers(); }}
              />
              <div className="max-h-48 overflow-auto border rounded">
                {assignUsersLoading ? (
                  <div className="p-4 text-center">Loading users...</div>
                ) : (
                  (assignUsers || []).filter(u => {
                    if (!assignUserQuery) return true;
                    const q = assignUserQuery.toLowerCase();
                    return (u.fullName || u.name || '').toLowerCase().includes(q) || (u.email || '').toLowerCase().includes(q);
                  }).map(u => (
                    <div
                      key={u._id}
                      className={`p-2 cursor-pointer hover:bg-secondary/10 flex items-center justify-between ${assignUserId === String(u._id) ? 'bg-primary/10' : ''}`}
                      onClick={() => setAssignUserId(String(u._id))}
                    >
                      <div>
                        <div className="font-medium">{u.fullName || u.name || u.email}</div>
                        <div className="text-sm text-muted-foreground">{u.email}</div>
                      </div>
                      <div className="text-xs text-muted-foreground">{u.role || ''}</div>
                    </div>
                  ))
                )}
              </div>
              <div className="text-sm text-muted-foreground">You can also paste a user id if you prefer.</div>
            </div>
            <DialogFooter>
              <div className="flex gap-2">
                <Button variant="outline" onClick={()=>{ setAssignOpen(false); setAssignUserQuery(''); setAssignUsers([]); setAssignUserId(null); }}>Cancel</Button>
                <Button onClick={handleAssign}>Assign</Button>
              </div>
            </DialogFooter>
          </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
