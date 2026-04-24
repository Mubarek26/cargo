import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { 
  Package, MapPin, Calendar, 
  DollarSign, Truck, Building2, 
  ArrowLeft, Clock, Send, 
  CheckCircle2, XCircle, Info,
  Loader2, User as UserIcon,
  MessageSquare, History, Gavel,
  ShieldCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { orderService } from "@/services/orderService";
import { proposalService } from "@/services/proposalService";
import { useCheckAuth } from "@/hooks/use-check-auth";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";


export default function MarketplaceOrderDetails() {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const { checkAuth } = useCheckAuth();
  const [order, setOrder] = useState<any>(null);
  const [proposals, setProposals] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmittingProposal, setIsSubmittingProposal] = useState(false);
  const [isProcessingProposal, setIsProcessingProposal] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [acceptingProposalId, setAcceptingProposalId] = useState<string | null>(null);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [isAdminRejecting, setIsAdminRejecting] = useState(false);

  
  const [proposalForm, setProposalForm] = useState({
    proposedPrice: "",
    message: "",
    estimatedPickupDate: "",
    vehicleDetails: ""
  });

  const isCreator = order && currentUser && (
    (order.createdBy?._id || order.createdBy) === (currentUser._id || currentUser.id)
  );
  
  const userRole = currentUser?.role || localStorage.getItem("userRole");
  const canPropose = userRole === "DRIVER" || userRole === "PRIVATE_TRANSPORTER" || userRole === "COMPANY_ADMIN";

  useEffect(() => {
    const init = async () => {
      const auth = await checkAuth();
      if (auth.isAuthenticated) {
        const userData = (auth.data as any)?.data?.user || (auth.data as any)?.user;
        setCurrentUser(userData);
      }
      if (orderId) {
        fetchOrderDetails();
        fetchProposals();
      }
    };
    init();
  }, [orderId]);

  const fetchOrderDetails = async () => {
    try {
      const res = await orderService.getOrderById(orderId!);
      if (res.status === "success") {
        setOrder(res.data.order);
        setProposalForm(prev => ({
          ...prev,
          proposedPrice: String(res.data.order.pricing?.proposedBudget || res.data.order.proposedBudget)
        }));
      }
    } catch (error) {
      toast.error("Failed to load order details");
    }
  };

  const fetchProposals = async () => {
    try {
      const res = await proposalService.listOrderProposals(orderId!);
      if (res.status === "success") {
        setProposals(res.data.proposals);
      }
    } catch (error) {
      console.error("Failed to load proposals", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitProposal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!proposalForm.proposedPrice) return;

    setIsSubmittingProposal(true);
    try {
      const res = await proposalService.submitProposal(orderId!, {
        proposedPrice: Number(proposalForm.proposedPrice),
        message: proposalForm.message,
        estimatedPickupDate: proposalForm.estimatedPickupDate || undefined,
        vehicleDetails: proposalForm.vehicleDetails
      });
      if (res.status === "success") {
        toast.success("Proposal submitted successfully!");
        fetchProposals();
      } else {
        toast.error(res.message || "Failed to submit proposal");
      }
    } catch (error: any) {
      toast.error(error.message || "An error occurred");
    } finally {
      setIsSubmittingProposal(false);
    }
  };

  const handleAcceptProposal = async (proposalId: string) => {
    setIsProcessingProposal(proposalId);
    try {
      const res = await proposalService.acceptProposal(orderId!, proposalId);
      if (res.status === "success") {
        toast.success("Proposal accepted! Order has been assigned.");
        fetchOrderDetails();
        fetchProposals();
      }
    } catch (error) {
      toast.error("Failed to accept proposal");
    } finally {
      setIsProcessingProposal(null);
      setAcceptingProposalId(null);
    }
  };

  const handleRejectProposal = async (proposalId: string) => {
    const reason = prompt("Enter rejection reason (optional):");
    if (reason === null) return;

    setIsProcessingProposal(proposalId);
    try {
      const res = await proposalService.rejectProposal(orderId!, proposalId, reason);
      if (res.status === "success") {
        toast.success("Proposal rejected");
        fetchProposals();
      }
    } catch (error) {
      toast.error("Failed to reject proposal");
    } finally {
      setIsProcessingProposal(null);
    }
  };

  const handleAdminRejectOrder = async () => {
    if (!rejectionReason.trim()) {
      toast.error("Please provide a rejection reason");
      return;
    }

    try {
      setIsAdminRejecting(true);
      await (orderService as any).adminRejectOrder(orderId!, rejectionReason);
      toast.success("Order post rejected by admin");
      setShowRejectDialog(false);
      setRejectionReason("");
      fetchOrderDetails();
      fetchProposals();
    } catch (error: any) {
      toast.error(error.message || "Failed to reject order");
    } finally {
      setIsAdminRejecting(false);
    }
  };

  if (isLoading || !order) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="mt-4 text-muted-foreground">Loading details...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <button 
        onClick={() => navigate("/marketplace")}
        className="flex items-center gap-2 text-muted-foreground hover:text-primary mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Marketplace
      </button>

      {order.status === "REJECTED" && order.adminRejectionReason && (
        <div className="mb-6 rounded-2xl bg-destructive/10 border border-destructive/20 p-6 flex items-start gap-4">
          <XCircle className="h-6 w-6 text-destructive shrink-0" />
          <div>
            <h3 className="font-bold text-destructive">Order Post Rejected by Administrator</h3>
            <p className="text-sm text-destructive/80 mt-1">Reason: {order.adminRejectionReason}</p>
          </div>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-3xl border border-border bg-card p-8 shadow-sm">
            <div className="flex items-start justify-between mb-6">
              <div>
                <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
                  {order.assignmentMode.replace(/_/g, ' ')}
                </Badge>
                <h1 className="text-3xl font-bold text-card-foreground">{order.title}</h1>
                <div className="flex items-center gap-4 mt-3 text-muted-foreground">
                  <span className="flex items-center gap-1 text-sm"><Clock className="h-4 w-4" /> Posted {new Date(order.createdAt).toLocaleDateString()}</span>
                  <span className="flex items-center gap-1 text-sm"><Building2 className="h-4 w-4" /> {order.createdBy?.fullName || "Verified Vendor"}</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Budget</p>
                <p className="text-3xl font-bold text-primary">
                  {order.pricing?.proposedBudget || order.proposedBudget} {order.pricing?.currency || order.currency}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8 py-8 border-y border-border">
              <div className="space-y-4">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Route Information</h3>
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div className="mt-1 h-6 w-6 rounded-full bg-success/10 flex items-center justify-center">
                      <div className="h-2 w-2 rounded-full bg-success" />
                    </div>
                    <div>
                      <p className="text-sm font-bold">{order.pickupLocation?.city}</p>
                      <p className="text-xs text-muted-foreground">{order.pickupLocation?.address}</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="mt-1 h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
                      <MapPin className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-bold">{order.deliveryLocation?.city}</p>
                      <p className="text-xs text-muted-foreground">{order.deliveryLocation?.address}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Shipment Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Cargo Type</p>
                    <p className="text-sm font-medium flex items-center gap-2"><Truck className="h-3 w-3" /> {order.cargo?.type || order.cargoType}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Weight</p>
                    <p className="text-sm font-medium">{order.cargo?.weightKg || order.weightKg} Kg</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Pickup Date</p>
                    <p className="text-sm font-medium">{new Date(order.pickupDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Deadline</p>
                    <p className="text-sm font-medium">{order.deliveryDeadline ? new Date(order.deliveryDeadline).toLocaleDateString() : "Flexible"}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">Description</h3>
              <p className="text-card-foreground leading-relaxed whitespace-pre-wrap">
                {order.description || "No additional description provided."}
              </p>
            </div>
          </div>

          <Tabs defaultValue="proposals" className="w-full">
            <TabsList className="grid w-full grid-cols-2 max-w-[400px]">
              <TabsTrigger value="proposals" className="gap-2">
                Proposals <Badge variant="secondary" className="h-5 px-1.5">{proposals.length}</Badge>
              </TabsTrigger>
              <TabsTrigger value="questions">Questions</TabsTrigger>
            </TabsList>
            
            <TabsContent value="proposals" className="mt-6 space-y-4">
              {proposals.length === 0 ? (
                <div className="text-center py-12 rounded-3xl border border-dashed border-border">
                  <MessageSquare className="h-10 w-10 text-muted-foreground/20 mx-auto mb-3" />
                  <p className="text-muted-foreground">No proposals yet. Be the first to bid!</p>
                </div>
              ) : (
                proposals.map((proposal) => (
                  <div 
                    key={proposal._id}
                    className={cn(
                      "rounded-2xl border border-border p-6 transition-all",
                      proposal.status === "ACCEPTED" ? "bg-primary/5 border-primary/30 ring-1 ring-primary/30" : "bg-card"
                    )}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex gap-4">
                        <div className="h-12 w-12 rounded-full bg-secondary flex items-center justify-center">
                          <UserIcon className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-lg">
                              {proposal.proposalType === "COMPANY" 
                                ? proposal.companyId?.companyName 
                                : proposal.submittedByUserId?.fullName}
                            </h4>
                            {proposal.status === "ACCEPTED" && (
                              <Badge className="bg-success/10 text-success border-success/20 gap-1">
                                <CheckCircle2 className="h-3 w-3" /> Accepted
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {proposal.proposalType.replace(/_/g, ' ')} • Submitted {new Date(proposal.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-primary">{proposal.proposedPrice} {proposal.currency}</p>
                        <p className="text-xs text-muted-foreground">Bid Amount</p>
                      </div>
                    </div>

                    <div className="mt-4 pl-16">
                      <p className="text-sm text-card-foreground/80 italic">"{proposal.message || "No message provided."}"</p>
                      
                      {proposal.vehicleDetails && (
                        <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground bg-secondary/50 p-2 rounded-lg inline-flex">
                          <Truck className="h-3.5 w-3.5" /> {proposal.vehicleDetails}
                        </div>
                      )}

                      {isCreator && (order.status === "OPEN" || order.status === "PENDING") && (
                        <div className="mt-6 flex gap-2">
                          <Button 
                            size="sm" 
                            className="bg-success hover:bg-success/90 h-8 gap-1"
                            onClick={() => setAcceptingProposalId(proposal._id)}
                            disabled={isProcessingProposal === proposal._id}
                          >
                            {isProcessingProposal === proposal._id ? <Loader2 className="h-3 w-3 animate-spin" /> : <CheckCircle2 className="h-3.5 w-3.5" />}
                            Accept Bid
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="h-8 gap-1 border-destructive/20 text-destructive hover:bg-destructive/5"
                            onClick={() => handleRejectProposal(proposal._id)}
                            disabled={isProcessingProposal === proposal._id}
                          >
                            <XCircle className="h-3.5 w-3.5" /> Reject
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </TabsContent>

            <TabsContent value="questions" className="mt-6">
               <div className="text-center py-12">
                  <p className="text-muted-foreground">Question and answer section coming soon.</p>
               </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Action Sidebar */}
        <div className="space-y-6">
          {order.status === "OPEN" && canPropose && !isCreator && (
            <Card className="rounded-3xl shadow-xl border-primary/20 overflow-hidden">
              <CardHeader className="bg-primary/5 pb-6">
                <CardTitle className="text-xl flex items-center gap-2">
                  <Gavel className="h-5 w-5 text-primary" />
                  Submit Proposal
                </CardTitle>
                <CardDescription>Enter your bid for this shipment</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <form onSubmit={handleSubmitProposal} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Proposed Price ({order.pricing?.currency || order.currency})</label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input 
                        type="number" 
                        className="pl-10"
                        placeholder="0.00"
                        value={proposalForm.proposedPrice}
                        onChange={(e) => setProposalForm({...proposalForm, proposedPrice: e.target.value})}
                        required
                      />
                    </div>
                    {order.pricing?.negotiable === false && (
                      <p className="text-[10px] text-warning flex items-center gap-1">
                        <Info className="h-3 w-3" /> This is a fixed-price order.
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Message to Vendor</label>
                    <Textarea 
                      placeholder="Explain why you're a good fit..."
                      value={proposalForm.message}
                      onChange={(e) => setProposalForm({...proposalForm, message: e.target.value})}
                      className="h-24 resize-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Vehicle Details (Optional)</label>
                    <Input 
                      placeholder="e.g. 5-ton Refrigerator Truck"
                      value={proposalForm.vehicleDetails}
                      onChange={(e) => setProposalForm({...proposalForm, vehicleDetails: e.target.value})}
                    />
                  </div>

                  <Button className="w-full h-12 gap-2 mt-4 shadow-lg shadow-primary/20" disabled={isSubmittingProposal}>
                    {isSubmittingProposal ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                    Submit Bid
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}

          {(isCreator || currentUser?.role === "SUPER_ADMIN") && (
            <Card className="rounded-3xl bg-secondary/20 border-none">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <History className="h-4 w-4" /> Management
                </h3>
                <div className="space-y-3">
                  {isCreator && (
                    <>
                      <Button variant="outline" className="w-full justify-start gap-2 bg-background border-border h-11">
                        <MessageSquare className="h-4 w-4" /> Message Bidders
                      </Button>
                      <Button variant="outline" className="w-full justify-start gap-2 bg-background border-border h-11">
                        <Info className="h-4 w-4" /> Edit Post
                      </Button>
                    </>
                  )}
                  {currentUser?.role === "SUPER_ADMIN" && order.status !== "REJECTED" && (
                    <Button 
                      variant="destructive" 
                      className="w-full justify-start gap-2 h-11"
                      onClick={() => setShowRejectDialog(true)}
                    >
                      <XCircle className="h-4 w-4" /> Reject Order Post
                    </Button>
                  )}
                  {isCreator && (
                    <Button variant="outline" className="w-full justify-start gap-2 bg-background border-border h-11 text-destructive hover:bg-destructive/5">
                      <XCircle className="h-4 w-4" /> Close Listing
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          <div className="rounded-3xl border border-border bg-card p-6">
            <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-success" /> Load Reliability
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Payment Protection</span>
                <span className="font-medium text-success">Enabled</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Insurance Cover</span>
                <span className="font-medium">Up to $50k</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Dispute Resolution</span>
                <span className="font-medium">Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Acceptance Confirmation Modal */}
      <AlertDialog open={!!acceptingProposalId} onOpenChange={(open) => !open && setAcceptingProposalId(null)}>
        <AlertDialogContent className="rounded-3xl border-none">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl font-bold">Accept Proposal?</AlertDialogTitle>
            <AlertDialogDescription className="text-base">
              Are you sure you want to accept this bid? This will assign the order to this transporter and close the bidding process for all other participants.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-6">
            <AlertDialogCancel className="rounded-2xl h-12 border-none bg-secondary hover:bg-secondary/80">Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => acceptingProposalId && handleAcceptProposal(acceptingProposalId)}
              className="rounded-2xl h-12 bg-success hover:bg-success/90 text-success-foreground"
            >
              {isProcessingProposal ? <Loader2 className="h-4 w-4 animate-spin" /> : "Confirm Acceptance"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Admin Rejection Modal */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent className="rounded-3xl border-none max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Reject Order Post</DialogTitle>
            <DialogDescription>
              Please provide a detailed reason for rejecting this order post. This reason will be visible to the vendor.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Textarea 
              placeholder="e.g. Incomplete documentation, suspicious pricing, etc."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="min-h-[120px] rounded-2xl resize-none border-border focus:ring-primary"
            />
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowRejectDialog(false)}
              className="rounded-2xl h-12 border-none bg-secondary hover:bg-secondary/80"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleAdminRejectOrder}
              disabled={isAdminRejecting || !rejectionReason.trim()}
              className="rounded-2xl h-12 bg-destructive hover:bg-destructive/90 text-destructive-foreground min-w-[120px]"
            >
              {isAdminRejecting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Reject Post"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
