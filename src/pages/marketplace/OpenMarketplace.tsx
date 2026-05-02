import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import {
  Package, Search, Filter, MapPin,
  Calendar, DollarSign, ArrowRight,
  Clock, CheckCircle2, ChevronRight,
  Truck, Building2, User as UserIcon,
  Briefcase, Loader2, Star, ShieldCheck, Gavel
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

import { orderService } from "@/services/orderService";
import { proposalService } from "@/services/proposalService";
import { useCheckAuth } from "@/hooks/use-check-auth";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function OpenMarketplace() {
  const navigate = useNavigate();
  const { checkAuth } = useCheckAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [myProposals, setMyProposals] = useState<any[]>([]);
  const [myPostings, setMyPostings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("marketplace");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterMode, setFilterMode] = useState("ALL");
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [withdrawingProposal, setWithdrawingProposal] = useState<any>(null);
  const [isWithdrawing, setIsWithdrawing] = useState(false);


  useEffect(() => {
    const init = async () => {
      const auth = await checkAuth();
      if (auth.isAuthenticated) {
        const userData = (auth.data as any)?.data?.user || (auth.data as any)?.user;
        setCurrentUser(userData);
      }
      fetchMarketplaceData();
    };
    init();
  }, [checkAuth]);

  const fetchMarketplaceData = async () => {
    setIsLoading(true);
    try {
      const [marketRes, myOrdersRes] = await Promise.all([
        orderService.getMarketplaceOrders(),
        orderService.getMyOrders()
      ]);

      if (marketRes.status === "success") setOrders(marketRes.data.orders || []);
      if (myOrdersRes.status === "success") {
        setMyPostings(myOrdersRes.data.orders.filter((o: any) => o.assignmentMode === 'OPEN_MARKETPLACE'));
      }

      // Fetch proposals if user is a transporter or super admin
      const role = localStorage.getItem("userRole");
      if (role === "DRIVER" || role === "COMPANY_ADMIN" || role === "PRIVATE_TRANSPORTER" || role === "SUPER_ADMIN") {
        const proposalsRes = await proposalService.listMyProposals();
        if (proposalsRes.status === "success") setMyProposals(proposalsRes.data.proposals || []);
      }
    } catch (error) {
      toast.error("Failed to load marketplace data");
    } finally {
      setIsLoading(false);
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch =
      order.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.pickupLocation?.city?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.deliveryLocation?.city?.toLowerCase().includes(searchQuery.toLowerCase());

    if (filterMode === "ALL") return matchesSearch;
    return matchesSearch && order.assignmentMode === filterMode;
  });

  const getRelativeTime = (date: string) => {
    const now = new Date();
    const then = new Date(date);
    const diffInHours = Math.abs(now.getTime() - then.getTime()) / 36e5;

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${Math.floor(diffInHours)}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  const getOrderStatusBadge = (order: any) => {
    const s = String(order.status || '').toUpperCase();
    const common = "uppercase text-[10px] font-bold border-none";
    switch (s) {
      case 'OPEN':
        return <Badge className={cn(common, 'bg-blue-500/10 text-blue-600')}>OPEN</Badge>;
      case 'PENDING':
        return <Badge className={cn(common, 'bg-amber-500/10 text-amber-600')}>PENDING</Badge>;
      case 'ACCEPTED':
        return <Badge className={cn(common, 'bg-emerald-500/10 text-emerald-600')}>ACCEPTED</Badge>;
      case 'ASSIGNED':
        return <Badge className={cn(common, 'bg-primary/10 text-primary')}>ASSIGNED</Badge>;
      case 'IN_TRANSIT':
        return <Badge className={cn(common, 'bg-primary/10 text-primary')}>IN TRANSIT</Badge>;
      case 'DELIVERED':
        return <Badge className={cn(common, 'bg-emerald-500/10 text-emerald-600')}>DELIVERED</Badge>;
      case 'REJECTED':
        return <Badge className={cn(common, 'bg-destructive/10 text-destructive')}>REJECTED</Badge>;
      case 'CANCELLED':
        return <Badge className={cn(common, 'bg-destructive/10 text-destructive')}>CANCELLED</Badge>;
      default:
        return <Badge className={cn(common, 'bg-muted text-muted-foreground')}>{s || order.assignmentMode?.replace(/_/g, ' ') || 'UNKNOWN'}</Badge>;
    }
  };

  return (
    <DashboardLayout>
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Briefcase className="h-8 w-8 text-primary" />
            Open Marketplace
          </h1>
          <p className="text-muted-foreground mt-1">Discover and bid on available freight orders in real-time</p>
        </div>
        <div className="flex gap-2">
          {(currentUser?.role === "VENDOR" || currentUser?.role === "SHIPPER") && (
            <Button onClick={() => navigate("/shipments/create")} className="gap-2 shadow-lg shadow-primary/20">
              <Package className="h-4 w-4" /> Post a Load
            </Button>
          )}
        </div>
      </div>

      <Tabs defaultValue="marketplace" className="w-full" onValueChange={setActiveTab}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <TabsList className="bg-primary/5 border border-primary/10 p-1 rounded-2xl h-14 w-full sm:w-auto overflow-x-auto justify-start sm:justify-center">
            <TabsTrigger 
              value="marketplace" 
              className="rounded-xl px-8 h-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg transition-all duration-300"
            >
              Explore Orders
            </TabsTrigger>
            {(currentUser?.role === "DRIVER" || currentUser?.role === "COMPANY_ADMIN" || currentUser?.role === "PRIVATE_TRANSPORTER" || currentUser?.role === "SUPER_ADMIN") && (
              <TabsTrigger 
                value="proposals" 
                className="rounded-xl px-8 h-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg transition-all duration-300"
              >
                {currentUser?.role === "SUPER_ADMIN" ? "All Proposals" : "My Proposals"} 
                <Badge variant="secondary" className="ml-2 h-5 px-1.5 opacity-80">{myProposals.length}</Badge>
              </TabsTrigger>
            )}
            {(currentUser?.role === "VENDOR" || currentUser?.role === "SHIPPER" || currentUser?.role === "SUPER_ADMIN") && (
              <TabsTrigger 
                value="postings" 
                className="rounded-xl px-8 h-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg transition-all duration-300"
              >
                {currentUser?.role === "SUPER_ADMIN" ? "All Postings" : "My Postings"} 
                <Badge variant="secondary" className="ml-2 h-5 px-1.5 opacity-80">{myPostings.length}</Badge>
              </TabsTrigger>
            )}
          </TabsList>
        </div>

        <TabsContent value="marketplace">
          <div className="grid gap-6 lg:grid-cols-4">
            {/* Sidebar Filters */}
            <div className="lg:col-span-1 space-y-6">
              <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                <h3 className="font-semibold mb-4 flex items-center gap-2 text-sm uppercase tracking-wider text-muted-foreground">
                  <Filter className="h-4 w-4" /> Filters
                </h3>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Assignment Type</label>
                    <div className="flex flex-col gap-1">
                      {["ALL", "OPEN_MARKETPLACE", "DIRECT_COMPANY", "DIRECT_PRIVATE_TRANSPORTER"].map((mode) => (
                        <button
                          key={mode}
                          onClick={() => setFilterMode(mode)}
                          className={cn(
                            "text-left px-3 py-2 rounded-lg text-sm transition-all",
                            filterMode === mode
                              ? "bg-primary text-primary-foreground font-medium"
                              : "text-muted-foreground hover:bg-secondary/50"
                          )}
                        >
                          {mode.replace(/_/g, ' ')}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-border">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <ShieldCheck className="h-4 w-4 text-success" />
                      Verified Loads Only
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl bg-primary/5 border border-primary/10 p-5">
                <h4 className="font-semibold text-primary flex items-center gap-2 mb-2">
                  <Star className="h-4 w-4 fill-primary" />
                  Pro Tip
                </h4>
                <p className="text-xs text-primary/80 leading-relaxed">
                  Submitting a detailed proposal with your estimated pickup time increases your chances of being accepted by 40%.
                </p>
              </div>
            </div>

            {/* Order Feed */}
            <div className="lg:col-span-3 space-y-4">
              <div className="relative mb-6">
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search by city, title, or cargo type..."
                  className="pl-12 h-14 bg-card border-border rounded-2xl shadow-sm text-lg"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20">
                  <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
                  <p className="text-muted-foreground font-medium">Scanning the marketplace...</p>
                </div>
              ) : filteredOrders.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 rounded-3xl border-2 border-dashed border-border bg-card/50">
                  <Briefcase className="h-16 w-16 text-muted-foreground/20 mb-4" />
                  <p className="text-xl font-semibold text-muted-foreground">No orders available right now</p>
                  <p className="text-muted-foreground mt-2">Try adjusting your filters or check back later</p>
                </div>
              ) : (
                filteredOrders.map((order) => (
                  <div 
                    key={order._id}
                    className="group relative rounded-2xl border border-border bg-card p-6 shadow-sm hover:shadow-xl hover:border-primary/30 transition-all duration-300 cursor-pointer overflow-hidden"
                    onClick={() => navigate(`/marketplace/orders/${order._id}`)}
                  >
                    {/* Decorative background element */}
                    <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-primary/5 group-hover:bg-primary/10 transition-colors" />

                    <div className="flex flex-col md:flex-row gap-6 relative z-10">
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              {getOrderStatusBadge(order)}
                              <span className="text-xs text-muted-foreground flex items-center gap-1">
                                <Clock className="h-3 w-3" /> {getRelativeTime(order.createdAt)}
                              </span>
                            </div>
                            <h3 className="text-xl font-bold text-card-foreground group-hover:text-primary transition-colors">
                              {order.title}
                            </h3>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-primary">
                              {order.pricing?.proposedBudget || order.proposedBudget} {order.pricing?.currency || order.currency}
                            </div>
                            <p className="text-xs text-muted-foreground">Budget</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                          <div className="space-y-3">
                            <div className="flex items-center gap-3 text-sm text-card-foreground/80">
                              <div className="h-8 w-8 rounded-full bg-primary/5 flex items-center justify-center border border-primary/10">
                                <MapPin className="h-4 w-4 text-primary" />
                              </div>
                              <div>
                                <p className="font-semibold flex items-center gap-2">
                                  {order.pickupLocation?.city} <ArrowRight className="h-3 w-3" /> {order.deliveryLocation?.city}
                                </p>
                                <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                                  {order.pickupLocation?.address}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-muted-foreground">
                              <div className="h-8 w-8 rounded-full bg-primary/5 flex items-center justify-center border border-primary/10">
                                <Calendar className="h-4 w-4 text-primary" />
                              </div>
                              <span>Pickup: {new Date(order.pickupDate).toLocaleDateString()}</span>
                            </div>
                          </div>

                          <div className="space-y-3">
                            <div className="flex items-center gap-3 text-sm text-muted-foreground">
                              <div className="h-8 w-8 rounded-full bg-primary/5 flex items-center justify-center border border-primary/10">
                                <Truck className="h-4 w-4 text-primary" />
                              </div>
                              <span>{order.cargo?.type || order.cargoType} • {order.cargo?.weightKg || order.weightKg} Kg</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-muted-foreground">
                              <div className="h-8 w-8 rounded-full bg-primary/5 flex items-center justify-center border border-primary/10">
                                <Building2 className="h-4 w-4 text-primary" />
                              </div>
                              <span className="flex items-center gap-1 text-card-foreground">
                                Posted by {order.createdBy?.fullName || "Verified Vendor"}
                                <CheckCircle2 className="h-3 w-3 text-success fill-success/20" />
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-row md:flex-col justify-end gap-2 min-w-[120px]">
                        <Button
                          className={cn(
                            "w-full gap-2 transition-transform",
                            order.status === 'REJECTED' ? "bg-muted text-muted-foreground hover:bg-muted" : "group-hover:scale-105"
                          )}
                          disabled={order.status === 'REJECTED'}
                        >
                          {order.status === 'REJECTED' 
                            ? "Closed" 
                            : (currentUser?.role === 'VENDOR' || currentUser?.role === 'SHIPPER') 
                              ? "View Details" 
                              : "Bid Now"} 
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="proposals">
          <div className="grid gap-4">
            {myProposals.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 rounded-3xl border-2 border-dashed border-border bg-card/50">
                <Gavel className="h-16 w-16 text-muted-foreground/20 mb-4" />
                <p className="text-xl font-semibold text-muted-foreground">You haven't submitted any proposals yet</p>
                <Button variant="link" onClick={() => setActiveTab("marketplace")}>Browse available orders</Button>
              </div>
            ) : (
              myProposals.map((proposal) => (
                <div
                  key={proposal._id}
                  className="rounded-2xl border border-border bg-secondary/10 dark:bg-secondary/20 p-6 shadow-sm hover:shadow-lg hover:border-primary/30 transition-all cursor-pointer group"
                  onClick={() => {
                    const orderId = proposal.orderId?._id || proposal.orderId;
                    if (proposal.status === 'ACCEPTED') {
                      navigate(`/orders/${orderId}`);
                    } else {
                      navigate(`/marketplace/orders/${orderId}`);
                    }
                  }}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className={cn(
                          "uppercase text-[10px] font-bold border-none",
                          proposal.status === 'ACCEPTED' ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 dark:bg-emerald-500/20" :
                            proposal.status === 'REJECTED' ? "bg-destructive/10 text-destructive dark:bg-destructive/20" :
                              "bg-amber-500/10 text-amber-600 dark:text-amber-400 dark:bg-amber-500/20"
                        )}>
                          {proposal.status}
                        </Badge>
                        <span className="text-xs text-muted-foreground">Submitted {new Date(proposal.createdAt).toLocaleDateString()}</span>
                      </div>
                      <h3 className="font-bold text-lg">{proposal.orderId?.title || "Marketplace Order"}</h3>
                      <div className="mt-2 flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {proposal.orderId?.pickupLocation?.city} to {proposal.orderId?.deliveryLocation?.city}</span>
                        <span className="flex items-center gap-1"><DollarSign className="h-3.5 w-3.5" /> Your Bid: {proposal.proposedPrice} {proposal.currency}</span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Button variant="ghost" size="sm">View Details <ChevronRight className="ml-2 h-4 w-4" /></Button>
                      {proposal.status === 'PENDING' && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-destructive border-destructive/20 hover:bg-destructive/5"
                          onClick={async (e) => {
                            e.stopPropagation();
                            setWithdrawingProposal(proposal);
                          }}
                        >
                          Withdraw Bid
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </TabsContent>

        <AlertDialog open={!!withdrawingProposal} onOpenChange={(open) => !open && setWithdrawingProposal(null)}>
          <AlertDialogContent className="rounded-3xl border-none">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-2xl font-bold">Withdraw Proposal?</AlertDialogTitle>
              <AlertDialogDescription className="text-base">
                Are you sure you want to withdraw your bid for <span className="font-semibold text-foreground">"{withdrawingProposal?.orderId?.title}"</span>? 
                This action cannot be undone and you may lose your spot in the bidding process.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="mt-6">
              <AlertDialogCancel className="rounded-2xl h-12 border-none bg-secondary hover:bg-secondary/80">Cancel</AlertDialogCancel>
              <AlertDialogAction 
                onClick={async () => {
                  if (!withdrawingProposal) return;
                  try {
                    setIsWithdrawing(true);
                    await (proposalService as any).withdrawProposal(
                      withdrawingProposal.orderId?._id || withdrawingProposal.orderId, 
                      withdrawingProposal._id
                    );
                    toast.success("Proposal withdrawn successfully");
                    fetchMarketplaceData();
                  } catch (error) {
                    toast.error("Failed to withdraw proposal");
                  } finally {
                    setIsWithdrawing(false);
                    setWithdrawingProposal(null);
                  }
                }}
                className="rounded-2xl h-12 bg-destructive hover:bg-destructive/90 text-destructive-foreground"
              >
                {isWithdrawing ? <Loader2 className="h-4 w-4 animate-spin" /> : "Yes, Withdraw Bid"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>


        <TabsContent value="postings">
          <div className="grid gap-4">
            {myPostings.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 rounded-3xl border-2 border-dashed border-border bg-card/50">
                <Package className="h-16 w-16 text-muted-foreground/20 mb-4" />
                <p className="text-xl font-semibold text-muted-foreground">You haven't posted any marketplace orders yet</p>
                <Button variant="link" onClick={() => navigate("/shipments/create")}>Post your first load</Button>
              </div>
            ) : (
              myPostings.map((order) => (
                <div
                  key={order._id}
                  className="rounded-2xl border border-border bg-card p-6 shadow-sm hover:shadow-md transition-all cursor-pointer"
                  onClick={() => {
                    if (order.status === 'ACCEPTED' || order.status === 'ASSIGNED') {
                      navigate(`/orders/${order._id}`);
                    } else {
                      navigate(`/marketplace/orders/${order._id}`);
                    }
                  }}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className="uppercase text-[10px] bg-blue-500/10 text-blue-500">
                          {order.status}
                        </Badge>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Gavel className="h-3 w-3" /> Managed in Marketplace
                        </span>
                      </div>
                      <h3 className="font-bold text-lg">{order.title}</h3>
                      <div className="mt-2 flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {order.pickupLocation?.city} to {order.deliveryLocation?.city}</span>
                        <span className="flex items-center gap-1"><DollarSign className="h-3.5 w-3.5" /> Budget: {order.pricing?.proposedBudget} {order.pricing?.currency}</span>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">Manage Bids <ChevronRight className="ml-2 h-4 w-4" /></Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
}
