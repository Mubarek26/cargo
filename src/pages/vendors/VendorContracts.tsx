import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { 
  FileText, Plus, Search, Building2, 
  CheckCircle, Clock, XCircle, MoreVertical,
  Handshake, AlertCircle, Loader2
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
import { contractService } from "@/services/contractService";
import { getCompanies } from "@/services/companyService";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";

export default function VendorContracts() {
  const [contracts, setContracts] = useState<any[]>([]);
  const [companies, setCompanies] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isRequestDialogOpen, setIsRequestDialogOpen] = useState(false);
  const [selectedCompanyId, setSelectedCompanyId] = useState("");
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
  const [requestMessage, setRequestMessage] = useState("");

  useEffect(() => {
    fetchContracts();
    fetchCompanies();
  }, []);

  const fetchContracts = async () => {
    setIsLoading(true);
    try {
      const res = await contractService.getVendorContracts();
      if (res.status === "success") {
        setContracts(res.data.contracts || []);
      }
    } catch (error) {
      toast.error("Failed to fetch contracts");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCompanies = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (token) {
        const res = await getCompanies(token);
        if (res.ok) {
          setCompanies(res.data.data.companies || []);
        }
      }
    } catch (error) {
      console.error("Failed to fetch companies", error);
    }
  };

  const handleInitiateContract = async () => {
    if (!selectedCompanyId || !startDate || !endDate) return;
    try {
      const res = await contractService.initiateContract(
        selectedCompanyId, 
        startDate, 
        endDate, 
        requestMessage
      );
      if (res.status === "success") {
        toast.success("Contract request sent successfully");
        setIsRequestDialogOpen(false);
        fetchContracts();
      } else {
        toast.error(res.message || "Failed to initiate contract");
      }
    } catch (error) {
      toast.error("An error occurred while initiating contract");
    }
  };

  const handleTerminateContract = async (contractId: string) => {
    if (!confirm("Are you sure you want to terminate this contract?")) return;
    try {
      const res = await contractService.terminateContract(contractId);
      if (res.status === "success") {
        toast.success("Contract terminated");
        fetchContracts();
      }
    } catch (error) {
      toast.error("Failed to terminate contract");
    }
  };

  const filteredContracts = contracts.filter(contract => {
    const companyName = contract.transporterCompanyId?.companyName || "";
    return companyName.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return <Badge className="bg-success/10 text-success border-success/20 gap-1"><CheckCircle className="h-3 w-3" /> Active</Badge>;
      case "PENDING":
        return <Badge className="bg-warning/10 text-warning border-warning/20 gap-1"><Clock className="h-3 w-3" /> Pending</Badge>;
      case "TERMINATED":
        return <Badge className="bg-muted text-muted-foreground gap-1"><XCircle className="h-3 w-3" /> Terminated</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <DashboardLayout>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Handshake className="h-6 w-6 text-primary" />
            My Contracts
          </h1>
          <p className="text-muted-foreground">Manage your partnerships with logistics companies</p>
        </div>
        <Dialog open={isRequestDialogOpen} onOpenChange={setIsRequestDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              New Contract
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Request New Contract</DialogTitle>
            </DialogHeader>
            <div className="py-4 space-y-4">
              <p className="text-sm text-muted-foreground">
                Select a logistics company to request a direct partnership. Once approved, you can create direct orders for them.
              </p>
              <div className="space-y-2">
                <label className="text-sm font-medium">Select Company</label>
                <select 
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={selectedCompanyId}
                  onChange={(e) => setSelectedCompanyId(e.target.value)}
                >
                  <option value="">Choose a company...</option>
                  {companies.map(company => (
                    <option key={company._id} value={company._id}>{company.companyName}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Start Date</label>
                  <Input 
                    type="date" 
                    value={startDate} 
                    onChange={(e) => setStartDate(e.target.value)} 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">End Date</label>
                  <Input 
                    type="date" 
                    value={endDate} 
                    onChange={(e) => setEndDate(e.target.value)} 
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Message (Optional)</label>
                <textarea 
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm h-20"
                  placeholder="Introduce your business..."
                  value={requestMessage}
                  onChange={(e) => setRequestMessage(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsRequestDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleInitiateContract} disabled={!selectedCompanyId}>Send Request</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input 
            placeholder="Search by company name..." 
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
            <p className="text-muted-foreground">Loading contracts...</p>
          </div>
        ) : filteredContracts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <FileText className="h-12 w-12 text-muted-foreground mb-4 opacity-20" />
            <p className="text-lg font-medium text-muted-foreground">No contracts found</p>
            <p className="text-sm text-muted-foreground mb-4">Request your first partnership to get started</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-secondary/50">
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Company</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Status</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Date</th>
                  <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredContracts.map((contract) => (
                  <tr key={contract._id} className="hover:bg-secondary/10 transition-colors">
                    <td className="whitespace-nowrap px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-primary/10 p-2">
                          <Building2 className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-card-foreground">
                            {contract.transporterCompanyId?.companyName || "Unknown Company"}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {contract.transporterCompanyId?.email || "No email available"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-5 py-4">
                      {getStatusBadge(contract.status)}
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 text-sm text-muted-foreground">
                      {new Date(contract.createdAt).toLocaleDateString()}
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {contract.status === "ACTIVE" && (
                            <DropdownMenuItem 
                              className="text-destructive gap-2"
                              onClick={() => handleTerminateContract(contract._id)}
                            >
                              <XCircle className="h-4 w-4" /> Terminate Contract
                            </DropdownMenuItem>
                          )}
                          {contract.status === "PENDING" && (
                            <div className="px-2 py-1.5 text-xs text-muted-foreground flex items-center gap-1">
                              <Clock className="h-3 w-3" /> Awaiting company approval
                            </div>
                          )}
                          <DropdownMenuItem className="gap-2">
                             <AlertCircle className="h-4 w-4" /> View Details
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
