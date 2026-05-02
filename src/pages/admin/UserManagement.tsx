import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { 
  Users, Search, Filter, Shield, ShieldAlert, 
  CheckCircle, XCircle, MoreVertical, Trash2, 
  UserCheck, UserX, Loader2, Mail, Phone
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { userService } from "@/services/userService";
import { setPrivateTransporterByUser, assignDriverToCompanyByUser } from "@/services/driverService";
import { getCompanies } from "@/services/companyService";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function UserManagement() {
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(27);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalResults, setTotalResults] = useState<number>(0);
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [assignTargetUser, setAssignTargetUser] = useState<any | null>(null);
  const [companies, setCompanies] = useState<any[]>([]);
  const [companiesLoading, setCompaniesLoading] = useState(false);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, limit, roleFilter]);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const roleParam = roleFilter === 'ALL' || roleFilter === 'PRIVATE_TRANSPORTER' ? undefined : roleFilter;
      const res = await userService.getAllUsers({ page, limit, role: roleParam });
      if (res.status === "success") {
        setUsers(res.data.data || res.data || []);
        if (res.meta) {
          setTotalResults(res.meta.totalResults || 0);
          setTotalPages(res.meta.totalPages || 1);
          setPage(res.meta.page || page);
          setLimit(res.meta.limit || limit);
        }
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error(`Failed to fetch users: ${error instanceof Error ? error.message : "Unknown error"}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateStatus = async (userId: string, newStatus: string) => {
    try {
      const res = await userService.updateUserStatus(userId, newStatus);
      if (res.status === "success") {
        toast.success(`User status updated to ${newStatus}`);
        fetchUsers();
      }
    } catch (error) {
      toast.error("Failed to update user status");
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user? This action cannot be undone.")) return;
    try {
      const res = await userService.deleteUser(userId);
      if (res.status === "success") {
        toast.success("User deleted successfully");
        fetchUsers();
      }
    } catch (error) {
      toast.error("Failed to delete user");
    }
  };

  const openAssignModal = async (user: any) => {
    setAssignTargetUser(user);
    setAssignModalOpen(true);
    setCompaniesLoading(true);
    try {
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("Not authenticated");
      const res = await getCompanies(token);
      if (res.ok) {
        // Normalize response shapes: { data: { companies: [] } } or { companies: [] } or []
        const payload = res.data;
        let list: any[] = [];
        if (payload) {
          if (Array.isArray(payload)) list = payload as any[];
          else if (payload.data && Array.isArray(payload.data.companies)) list = payload.data.companies;
          else if (Array.isArray((payload as any).companies)) list = (payload as any).companies;
        }
        setCompanies(list);
      } else {
        toast.error("Failed to load companies");
      }
    } catch (err) {
      toast.error("Failed to load companies");
    } finally {
      setCompaniesLoading(false);
    }
  };

  const handleAssignCompany = async () => {
    if (!assignTargetUser || !selectedCompanyId) return toast.error('Select a company first');
    try {
      const token = localStorage.getItem('authToken');
      if (!token) return void toast.error('Not authenticated');
      await assignDriverToCompanyByUser(token, assignTargetUser._id, selectedCompanyId);
      toast.success('Driver assigned to company');
      setAssignModalOpen(false);
      setAssignTargetUser(null);
      setSelectedCompanyId(null);
      fetchUsers();
    } catch (err) {
      toast.error('Failed to assign driver to company');
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      (user.fullName || user.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole =
      roleFilter === "ALL" ||
      (roleFilter === "PRIVATE_TRANSPORTER" ? Boolean(user.isPrivateTransporter) : user.role === roleFilter);
    return matchesSearch && matchesRole;
  });

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "SUPER_ADMIN":
      case "superadmin":
        return <Badge className="bg-destructive/10 text-destructive border-destructive/20 gap-1"><ShieldAlert className="h-3 w-3" /> Super Admin</Badge>;
      case "COMPANY_ADMIN":
        return <Badge className="bg-primary/10 text-primary border-primary/20 gap-1"><Shield className="h-3 w-3" /> Company Admin</Badge>;
      case "DRIVER":
        return <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20 gap-1">Driver</Badge>;
      case "VENDOR":
        return <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 gap-1">Vendor</Badge>;
      case "SHIPPER":
        return <Badge className="bg-orange-500/10 text-orange-500 border-orange-500/20 gap-1">Shipper</Badge>;
      default:
        return <Badge variant="outline">{role}</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case "active":
        return <Badge className="bg-success/10 text-success border-success/20 gap-1"><CheckCircle className="h-3 w-3" /> Active</Badge>;
      case "pending":
        return <Badge className="bg-warning/10 text-warning border-warning/20 gap-1">Pending</Badge>;
      case "inactive":
      case "deactivated":
        return <Badge className="bg-muted text-muted-foreground gap-1"><XCircle className="h-3 w-3" /> Inactive</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <DashboardLayout>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">User Management</h1>
          <p className="text-muted-foreground">Manage system users, roles, and account status</p>
        </div>
        <Button onClick={fetchUsers} variant="outline" size="sm">
          Refresh List
        </Button>
      </div>

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input 
            placeholder="Search by name or email..." 
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Button 
            variant={roleFilter === "ALL" ? "default" : "outline"} 
            size="sm"
            onClick={() => setRoleFilter("ALL")}
          >
            All
          </Button>
          <Button 
            variant={roleFilter === "COMPANY_ADMIN" ? "default" : "outline"} 
            size="sm"
            onClick={() => setRoleFilter("COMPANY_ADMIN")}
          >
            Admins
          </Button>
          <Button 
            variant={roleFilter === "DRIVER" ? "default" : "outline"} 
            size="sm"
            onClick={() => setRoleFilter("DRIVER")}
          >
            Drivers
          </Button>
          <Button
            variant={roleFilter === "PRIVATE_TRANSPORTER" ? "default" : "outline"}
            size="sm"
            onClick={() => setRoleFilter("PRIVATE_TRANSPORTER")}
          >
            Private Transporters
          </Button>
          <Button 
            variant={roleFilter === "VENDOR" ? "default" : "outline"} 
            size="sm"
            onClick={() => setRoleFilter("VENDOR")}
          >
            Vendors
          </Button>
          <Button 
            variant={roleFilter === "SHIPPER" ? "default" : "outline"} 
            size="sm"
            onClick={() => setRoleFilter("SHIPPER")}
          >
            Shippers
          </Button>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
            <p className="text-muted-foreground">Loading users...</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Users className="h-12 w-12 text-muted-foreground mb-4 opacity-20" />
            <p className="text-lg font-medium text-muted-foreground">No users found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-secondary/50">
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">User</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Role</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Status</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Contact</th>
                  <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-secondary/10 transition-colors">
                    <td className="whitespace-nowrap px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                          {(user.fullName || user.name || user.email)?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-card-foreground">{user.fullName || user.name}</p>
                          <p className="text-xs text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-5 py-4">
                      <div className="flex items-center gap-2">
                        {getRoleBadge(user.role)}
                        {user.isPrivateTransporter && user.role === 'DRIVER' && (
                          <Badge className="bg-primary/10 text-primary border-primary/20 gap-1">Private Transporter</Badge>
                        )}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-5 py-4">
                      {getStatusBadge(user.status)}
                    </td>
                    <td className="whitespace-nowrap px-5 py-4">
                      <div className="text-xs space-y-1">
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Mail className="h-3 w-3" /> {user.email}
                        </div>
                        {user.phoneNumber && (
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Phone className="h-3 w-3" /> {user.phoneNumber}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {user.status === "PENDING" || user.status === "pending" || user.status === "inactive" || user.status === "SUSPENDED" ? (
                            <DropdownMenuItem 
                              className="text-success gap-2"
                              onClick={() => handleUpdateStatus(user._id, "ACTIVE")}
                            >
                              <UserCheck className="h-4 w-4" /> Approve / Activate
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem 
                              className="text-warning gap-2"
                              onClick={() => handleUpdateStatus(user._id, "SUSPENDED")}
                            >
                              <UserX className="h-4 w-4" /> Deactivate
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem 
                            className="text-destructive gap-2"
                            onClick={() => handleDeleteUser(user._id)}
                            disabled={user.role?.toLowerCase().includes("admin")}
                          >
                            <Trash2 className="h-4 w-4" /> Delete User
                          </DropdownMenuItem>
                          {user.role === 'DRIVER' && (
                            <>
                              <DropdownMenuItem
                                className="gap-2"
                                onClick={async () => {
                                  try {
                                    const token = localStorage.getItem('authToken');
                                    if (!token) return void toast.error('Not authenticated');
                                    await setPrivateTransporterByUser(token, user._id, true);
                                    toast.success('Marked as private transporter');
                                    fetchUsers();
                                  } catch (err) {
                                    toast.error('Failed to mark as private transporter');
                                  }
                                }}
                              >
                                <UserCheck className="h-4 w-4" /> Mark as Private Transporter
                              </DropdownMenuItem>

                              <DropdownMenuItem
                                className="gap-2"
                                onClick={async () => {
                                  try {
                                    const token = localStorage.getItem('authToken');
                                    if (!token) return void toast.error('Not authenticated');
                                    await setPrivateTransporterByUser(token, user._id, false);
                                    toast.success('Unmarked as private transporter');
                                    fetchUsers();
                                  } catch (err) {
                                    toast.error('Failed to unmark private transporter');
                                  }
                                }}
                              >
                                <UserX className="h-4 w-4" /> Unmark Private Transporter
                              </DropdownMenuItem>
                              { (localStorage.getItem('userRole') === 'SUPER_ADMIN' || localStorage.getItem('userRole') === 'superadmin') && (
                                <DropdownMenuItem
                                  className="gap-2"
                                  onClick={async () => openAssignModal(user)}
                                >
                                  <Shield className="h-4 w-4" /> Assign To Company
                                </DropdownMenuItem>
                              )}
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div className="p-4 flex items-center justify-between">
          <div className="text-sm text-muted-foreground">Showing {users.length} of {totalResults} users</div>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>
              Previous
            </Button>
            <div className="text-sm">
              Page {page} / {totalPages}
            </div>
            <Button size="sm" variant="outline" disabled={page >= totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>
              Next
            </Button>
          </div>
        </div>
      </div>
      <Dialog open={assignModalOpen} onOpenChange={(open) => { if(!open) { setAssignModalOpen(false); setAssignTargetUser(null); setSelectedCompanyId(null); } }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Driver to Company</DialogTitle>
          </DialogHeader>

          <div className="mt-2">
            {companiesLoading ? (
              <div className="py-6 text-center">Loading companies...</div>
            ) : companies.length === 0 ? (
              <div className="py-6 text-center">No companies available</div>
            ) : (
              <div className="space-y-2 max-h-64 overflow-auto">
                {companies.map((c: any) => (
                  <label key={c._id} className={cn("flex items-center justify-between gap-3 p-3 rounded border", selectedCompanyId === c._id ? "border-primary bg-primary/5" : "border-border")}>
                    <div className="flex-1">
                      <div className="font-medium">{c.companyName || c.name}</div>
                      <div className="text-xs text-muted-foreground">{c.email} • {c.phoneNumber}</div>
                    </div>
                    <input type="radio" name="company" value={c._id} checked={selectedCompanyId === c._id} onChange={() => setSelectedCompanyId(c._id)} />
                  </label>
                ))}
              </div>
            )}
          </div>

          <DialogFooter>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => { setAssignModalOpen(false); setAssignTargetUser(null); setSelectedCompanyId(null); }}>Cancel</Button>
              <Button onClick={handleAssignCompany} disabled={!selectedCompanyId}>Assign</Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
