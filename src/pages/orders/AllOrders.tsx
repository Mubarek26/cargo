import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ShoppingCart, Search, Filter, Download, Plus, Package, Clock, CheckCircle, Truck, XCircle, DollarSign, Loader2, ArrowRight, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { orderService } from "@/services/orderService";
import { toast } from "sonner";
import { useCheckAuth } from "@/hooks/use-check-auth";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const statusConfig: any = {
  PENDING: { label: "Pending", icon: Clock, className: "text-warning bg-warning/10" },
  OPEN: { label: "Open", icon: Package, className: "text-blue-500 bg-blue-500/10" },
  ACCEPTED: { label: "Accepted", icon: CheckCircle, className: "text-success bg-success/10" },
  ASSIGNED: { label: "Assigned", icon: Truck, className: "text-primary bg-primary/10" },
  IN_TRANSIT: { label: "In Transit", icon: Truck, className: "text-primary bg-primary/10" },
  DELIVERED: { label: "Delivered", icon: CheckCircle, className: "text-success bg-success/10" },
  CANCELLED: { label: "Cancelled", icon: XCircle, className: "text-destructive bg-destructive/10" },
  REJECTED: { label: "Rejected", icon: XCircle, className: "text-destructive bg-destructive/10" },
};

const paymentConfig: any = {
  paid: { label: "Paid", className: "text-success bg-success/10" },
  pending: { label: "Pending", className: "text-warning bg-warning/10" },
  failed: { label: "Failed", className: "text-destructive bg-destructive/10" },
};

export default function AllOrders() {
  const navigate = useNavigate();
  const { checkAuth, data: authData } = useCheckAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  useEffect(() => {
    const init = async () => {
      const auth = await checkAuth();
      if (auth.isAuthenticated) {
        const userData = (auth.data as any)?.data?.user || (auth.data as any)?.user;
        setUser(userData);
      }
      fetchOrders();
    };
    init();
  }, [checkAuth]);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const res = await orderService.getMyOrders();
      if (res.status === "success") {
        setOrders(res.data.orders);
      }
    } catch (error) {
      toast.error("Failed to fetch orders");
    } finally {
      setIsLoading(false);
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.orderNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.pickupLocation?.city?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.deliveryLocation?.city?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === "ALL" || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleAcceptOrder = async (e: React.MouseEvent, orderId: string) => {
    e.stopPropagation();
    try {
      await orderService.acceptOrder(orderId);
      toast.success("Order accepted");
      fetchOrders();
    } catch (error: any) {
      toast.error(error.message || "Failed to accept order");
    }
  };

  const handleRejectOrder = async (e: React.MouseEvent, orderId: string) => {
    e.stopPropagation();
    try {
      await orderService.rejectOrder(orderId);
      toast.error("Order rejected");
      fetchOrders();
    } catch (error: any) {
      toast.error(error.message || "Failed to reject order");
    }
  };

  return (
    <DashboardLayout>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">All Orders</h1>
          <p className="text-muted-foreground">Manage customer orders and fulfillment</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button onClick={() => navigate("/shipments/create")}>
            <Plus className="mr-2 h-4 w-4" />
            New Order
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="mb-6 grid gap-4 sm:grid-cols-4">
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-primary/10 p-2">
              <ShoppingCart className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-card-foreground">{orders.length}</p>
              <p className="text-sm text-muted-foreground">Total Orders</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-warning/10 p-2">
              <Clock className="h-5 w-5 text-warning" />
            </div>
            <div>
              <p className="text-2xl font-bold text-card-foreground">
                {orders.filter(o => o.status === "PENDING").length}
              </p>
              <p className="text-sm text-muted-foreground">Pending</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-chart-2/10 p-2">
              <Truck className="h-5 w-5 text-chart-2" />
            </div>
            <div>
              <p className="text-2xl font-bold text-card-foreground">
                {orders.filter(o => ["IN_TRANSIT", "ASSIGNED"].includes(o.status)).length}
              </p>
              <p className="text-sm text-muted-foreground">In Transit</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-success/10 p-2">
              <DollarSign className="h-5 w-5 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold text-card-foreground">
                {orders.reduce((acc, curr) => acc + (curr.pricing?.proposedBudget || 0), 0).toLocaleString()}
              </p>
              <p className="text-sm text-muted-foreground">Total Budget</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="relative lg:col-span-2">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input 
            placeholder="Search by order #, city or title..." 
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Statuses</SelectItem>
            <SelectItem value="PENDING">Pending</SelectItem>
            <SelectItem value="ACCEPTED">Accepted</SelectItem>
            <SelectItem value="ASSIGNED">Assigned</SelectItem>
            <SelectItem value="IN_TRANSIT">In Transit</SelectItem>
            <SelectItem value="DELIVERED">Delivered</SelectItem>
            <SelectItem value="CANCELLED">Cancelled</SelectItem>
          </SelectContent>
        </Select>
        { (searchQuery || statusFilter !== "ALL") && (
          <Button 
            variant="ghost" 
            className="gap-2 text-muted-foreground"
            onClick={() => {
              setSearchQuery("");
              setStatusFilter("ALL");
            }}
          >
            <X className="h-4 w-4" /> Clear Filters
          </Button>
        )}
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
            <p className="text-muted-foreground">Loading orders...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <ShoppingCart className="h-12 w-12 text-muted-foreground mb-4 opacity-20" />
            <p className="text-lg font-medium text-muted-foreground">
              {orders.length === 0 ? "No orders found" : "No orders match your filters"}
            </p>
            {orders.length === 0 && (
              <Button variant="link" onClick={() => navigate("/shipments/create")}>Create your first order</Button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-secondary/50">
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Order Number</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Title / Date</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Route</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Budget</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Status</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Payment</th>
                  <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredOrders.map((order) => {
                  const status = statusConfig[order.status] || { label: order.status, icon: Clock, className: "" };
                  const StatusIcon = status.icon;
                  const payment = paymentConfig[order.paymentStatus] || { label: order.paymentStatus, className: "" };

                  // Check if the current user can accept/reject this order
                  const isAssignedToMyCompany = 
                    user?.role === 'COMPANY_ADMIN' && 
                    order.assignmentMode === 'DIRECT_COMPANY' && 
                    (order.targetCompanyId?._id === user.companyId || order.targetCompanyId === user.companyId);
                  
                  const canAction = isAssignedToMyCompany && order.status === 'PENDING';

                  return (
                    <tr key={order._id} className="hover:bg-secondary/30 transition-colors cursor-pointer" onClick={() => navigate(`/orders/${order._id}`)}>
                      <td className="whitespace-nowrap px-5 py-4">
                        <div className="flex items-center gap-2">
                          <ShoppingCart className="h-4 w-4 text-primary" />
                          <span className="font-medium text-card-foreground">{order.orderNumber}</span>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-5 py-4">
                        <div className="text-sm">
                          <p className="text-card-foreground font-medium">{order.title}</p>
                          <p className="text-muted-foreground">{new Date(order.createdAt).toLocaleDateString()}</p>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-5 py-4">
                        <div className="flex items-center gap-1 text-sm">
                           <span className="text-card-foreground">{order.pickupLocation?.city || "N/A"}</span>
                           <ArrowRight className="h-3 w-3 text-muted-foreground" />
                           <span className="text-card-foreground">{order.deliveryLocation?.city || "N/A"}</span>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-5 py-4 font-medium text-card-foreground">
                        {order.pricing?.proposedBudget} {order.pricing?.currency}
                      </td>
                      <td className="whitespace-nowrap px-5 py-4">
                        <Badge className={cn("gap-1", status.className)}>
                          <StatusIcon className="h-3 w-3" />
                          {status.label}
                        </Badge>
                      </td>
                      <td className="whitespace-nowrap px-5 py-4">
                        <Badge variant="outline" className={payment.className}>{payment.label}</Badge>
                      </td>
                      <td className="whitespace-nowrap px-5 py-4 text-right">
                        {canAction ? (
                          <div className="flex justify-end gap-2">
                            <Button 
                              size="sm" 
                              className="h-8 gap-1 bg-success hover:bg-success/90" 
                              onClick={(e) => handleAcceptOrder(e, order._id)}
                            >
                              <Check className="h-3.5 w-3.5" />
                              Accept
                            </Button>
                            <Button 
                              size="sm" 
                              variant="destructive" 
                              className="h-8 gap-1"
                              onClick={(e) => handleRejectOrder(e, order._id)}
                            >
                              <X className="h-3.5 w-3.5" />
                              Reject
                            </Button>
                          </div>
                        ) : (
                          <Button variant="ghost" size="sm" className="h-8">Details</Button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
