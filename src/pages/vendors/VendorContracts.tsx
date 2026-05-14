import { useState, useEffect, useMemo } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { 
  FileText, Plus, Search, Building2, 
  CheckCircle, Clock, XCircle, MoreVertical,
  Handshake, AlertCircle, Loader2, Check, X
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
import { FrontendPagination } from "@/components/FrontendPagination";
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
  const [terminationDialogOpen, setTerminationDialogOpen] = useState(false);
  const [contractToTerminate, setContractToTerminate] = useState<string | null>(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [selectedContract, setSelectedContract] = useState<any>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchContracts();
    fetchCompanies();
  }, []);

  // Reset to first page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

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
      const res = await contractService.initiateContract({
        transporterCompanyId: selectedCompanyId, 
        startDate, 
        endDate, 
        message: requestMessage
      });
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

  const handleApproveContract = async (contractId: string) => {
    try {
      const res = await contractService.approveContract(contractId);
      if (res.status === "success") {
        toast.success("Contract approved successfully");
        fetchContracts();
      }
    } catch (error) {
      toast.error("Failed to approve contract");
    }
  };

  const handleTerminateContract = async () => {
    if (!contractToTerminate) return;
    try {
      const res = await contractService.terminateContract(contractToTerminate);
      if (res.status === "success") {
        toast.success("Contract terminated");
        setTerminationDialogOpen(false);
        setContractToTerminate(null);
        fetchContracts();
      }
    } catch (error) {
      toast.error("Failed to terminate contract");
    }
  };

  const openTerminationDialog = (contractId: string) => {
    setContractToTerminate(contractId);
    setTerminationDialogOpen(true);
  };

  const openDetailsDialog = (contract: any) => {
    setSelectedContract(contract);
    setIsDetailsDialogOpen(true);
  };

  const filteredContracts = useMemo(() => {
    return contracts.filter(contract => {
      const companyName = contract.transporterCompanyId?.companyName || "";
      return companyName.toLowerCase().includes(searchQuery.toLowerCase());
    });
  }, [contracts, searchQuery]);

  const paginatedContracts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredContracts.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredContracts, currentPage]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ACCEPTED":
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
          <>
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
                  {paginatedContracts.map((contract) => (
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
                        <div className="flex justify-end gap-2">
                          {contract.status === "ACCEPTED" && (
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="text-destructive border-destructive/20 hover:bg-destructive/5 h-8 gap-1"
                              onClick={() => openTerminationDialog(contract._id)}
                            >
                              <XCircle className="h-3.5 w-3.5" /> Terminate
                            </Button>
                          )}
                          {contract.status === "PENDING" && (
                            <div className="flex gap-2">
                              {contract.initiatedBy === "COMPANY_ADMIN" ? (
                                <>
                                  <Button 
                                    size="sm" 
                                    className="bg-success hover:bg-success/90 h-8 gap-1 text-xs"
                                    onClick={() => handleApproveContract(contract._id)}
                                  >
                                    <Check className="h-3.5 w-3.5" /> Approve
                                  </Button>
                                  <Button 
                                    variant="outline"
                                    size="sm" 
                                    className="text-destructive border-destructive/20 hover:bg-destructive/5 h-8 gap-1 text-xs"
                                    onClick={() => openTerminationDialog(contract._id)}
                                  >
                                    <X className="h-3.5 w-3.5" /> Reject
                                  </Button>
                                </>
                              ) : (
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="text-destructive border-destructive/20 hover:bg-destructive/5 h-8 gap-1"
                                  onClick={() => openTerminationDialog(contract._id)}
                                >
                                  <XCircle className="h-3.5 w-3.5" /> Cancel
                                </Button>
                              )}
                            </div>
                          )}
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 gap-1 text-xs"
                            onClick={() => openDetailsDialog(contract)}
                          >
                             <AlertCircle className="h-3.5 w-3.5" /> Details
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-4 border-t border-border bg-card">
              <FrontendPagination 
                totalItems={filteredContracts.length}
                itemsPerPage={itemsPerPage}
                currentPage={currentPage}
                onPageChange={setCurrentPage}
              />
            </div>
          </>
        )}
      </div>

      <Dialog open={terminationDialogOpen} onOpenChange={setTerminationDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-5 w-5" />
              Confirm Termination
            </DialogTitle>
          </DialogHeader>
          <div className="py-6">
            <p className="text-sm text-muted-foreground leading-relaxed">
              Are you sure you want to terminate this partnership? This action will end the current contract immediately. You will no longer be able to create direct orders with this company.
            </p>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setTerminationDialogOpen(false)}>Keep Contract</Button>
            <Button variant="destructive" onClick={handleTerminateContract}>Terminate Immediately</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Contract Details
            </DialogTitle>
          </DialogHeader>
          {selectedContract && (
            <div className="py-4 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground uppercase font-semibold">Logistics Partner</p>
                  <p className="text-sm font-medium">{selectedContract.transporterCompanyId?.companyName}</p>
                </div>
                <div className="space-y-1 text-right">
                  <p className="text-xs text-muted-foreground uppercase font-semibold">Status</p>
                  <div className="flex justify-end">{getStatusBadge(selectedContract.status)}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 p-3 bg-muted/50 rounded-lg border border-border">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Start Date</p>
                  <p className="text-sm font-medium">{new Date(selectedContract.startDate).toLocaleDateString()}</p>
                </div>
                <div className="space-y-1 text-right">
                  <p className="text-xs text-muted-foreground">End Date</p>
                  <p className="text-sm font-medium">{new Date(selectedContract.endDate).toLocaleDateString()}</p>
                </div>
              </div>

              {selectedContract.message && (
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground uppercase font-semibold">Request Message</p>
                  <div className="p-3 bg-background border border-border rounded-lg italic text-sm text-foreground">
                    "{selectedContract.message}"
                  </div>
                </div>
              )}

              <div className="space-y-2 pt-2 border-t border-border">
                <p className="text-xs text-muted-foreground uppercase font-semibold">Contact Information</p>
                <div className="grid grid-cols-1 gap-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Building2 className="h-4 w-4" />
                    <span>{selectedContract.transporterCompanyId?.email}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDetailsDialogOpen(false)} className="w-full">Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
