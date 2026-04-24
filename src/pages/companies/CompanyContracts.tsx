import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { 
  FileText, Search, User, 
  CheckCircle, XCircle, MoreVertical,
  Handshake, Loader2, Check, X
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
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function CompanyContracts() {
  const [contracts, setContracts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchContracts();
  }, []);

  const fetchContracts = async () => {
    setIsLoading(true);
    try {
      const res = await contractService.getCompanyContracts();
      if (res.status === "success") {
        setContracts(res.data.contracts || []);
      }
    } catch (error) {
      toast.error("Failed to fetch contracts");
    } finally {
      setIsLoading(false);
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
    const vendorName = contract.vendorId?.fullName || contract.vendorId?.name || "";
    return vendorName.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return <Badge className="bg-success/10 text-success border-success/20 gap-1"><CheckCircle className="h-3 w-3" /> Active</Badge>;
      case "PENDING":
        return <Badge className="bg-warning/10 text-warning border-warning/20 gap-1">Pending Approval</Badge>;
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
            Vendor Contracts
          </h1>
          <p className="text-muted-foreground">Manage direct partnerships and incoming requests from vendors</p>
        </div>
      </div>

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input 
            placeholder="Search by vendor name..." 
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
            <p className="text-lg font-medium text-muted-foreground">No contract requests</p>
            <p className="text-sm text-muted-foreground">Vendor partnership requests will appear here</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-secondary/50">
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Vendor</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Status</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Request Date</th>
                  <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredContracts.map((contract) => (
                  <tr key={contract._id} className="hover:bg-secondary/10 transition-colors">
                    <td className="whitespace-nowrap px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-emerald-500/10 p-2">
                          <User className="h-5 w-5 text-emerald-600" />
                        </div>
                        <div>
                          <p className="font-medium text-card-foreground">
                            {contract.vendorId?.fullName || contract.vendorId?.name || "Unknown Vendor"}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {contract.vendorId?.email || "No email available"}
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
                      {contract.status === "PENDING" ? (
                        <div className="flex justify-end gap-2">
                          <Button 
                            size="sm" 
                            variant="default" 
                            className="bg-success hover:bg-success/90 h-8 gap-1"
                            onClick={() => handleApproveContract(contract._id)}
                          >
                            <Check className="h-3.5 w-3.5" /> Approve
                          </Button>
                          <Button 
                            size="sm" 
                            variant="destructive" 
                            className="h-8 gap-1"
                            onClick={() => handleTerminateContract(contract._id)}
                          >
                            <X className="h-3.5 w-3.5" /> Reject
                          </Button>
                        </div>
                      ) : (
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
                            <DropdownMenuItem className="gap-2">
                               <FileText className="h-4 w-4" /> View Details
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
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
