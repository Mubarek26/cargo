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
import { useTranslation } from "react-i18next";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function AllOrders() {
  const { t } = useTranslation("orders");
  const navigate = useNavigate();
  const { checkAuth, data: authData } = useCheckAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [assignmentFilter, setAssignmentFilter] = useState<string>("ALL");

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

  const statusConfig: any = {
    PENDING: { label: t("status.pending"), icon: Clock, className: "text-warning bg-warning/10" },
    OPEN: { label: t("status.open"), icon: Package, className: "text-blue-500 bg-blue-500/10" },
    ACCEPTED: { label: t("status.accepted"), icon: CheckCircle, className: "text-success bg-success/10" },
    ASSIGNED: { label: t("status.assigned"), icon: Truck, className: "text-primary bg-primary/10" },
    IN_TRANSIT: { label: t("status.inTransit"), icon: Truck, className: "text-primary bg-primary/10" },
    DELIVERED: { label: t("status.delivered"), icon: CheckCircle, className: "text-success bg-success/10" },
    CANCELLED: { label: t("status.cancelled"), icon: XCircle, className: "text-destructive bg-destructive/10" },
    REJECTED: { label: t("status.rejected"), icon: XCircle, className: "text-destructive bg-destructive/10" },
  };

  const paymentConfig: any = {
    paid: { label: t("payment.paid"), className: "text-success bg-success/10" },
    pending: { label: t("payment.pending"), className: "text-warning bg-warning/10" },
    failed: { label: t("payment.failed"), className: "text-destructive bg-destructive/10" },
  };

  const assignmentModeLabelMap: Record<string, string> = {
    OPEN_MARKETPLACE: t("assignmentModes.openMarketplace"),
    DIRECT_COMPANY: t("assignmentModes.directCompany"),
    DIRECT_PRIVATE_TRANSPORTER: t("assignmentModes.directPrivateTransporter"),
  };

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const res = await orderService.getMyOrders();
      if (res.status === "success") {
        setOrders(res.data.orders);
      }
    } catch (error) {
      toast.error(t("messages.fetchFailed"));
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
    const matchesAssignment = assignmentFilter === "ALL" || order.assignmentMode === assignmentFilter;
    
    return matchesSearch && matchesStatus && matchesAssignment;
  });

  const handleAcceptOrder = async (e: React.MouseEvent, orderId: string) => {
    e.stopPropagation();
    try {
      await orderService.acceptOrder(orderId);
      toast.success(t("messages.accepted"));
      fetchOrders();
    } catch (error: any) {
      toast.error(error.message || t("messages.acceptFailed"));
    }
  };

  const handleRejectOrder = async (e: React.MouseEvent, orderId: string) => {
    e.stopPropagation();
    try {
      await orderService.rejectOrder(orderId);
      toast.error(t("messages.rejected"));
      fetchOrders();
    } catch (error: any) {
      toast.error(error.message || t("messages.rejectFailed"));
    }
  };

  return (
    <DashboardLayout>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{t("allOrders.title")}</h1>
          <p className="text-muted-foreground">{t("allOrders.subtitle")}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            {t("allOrders.export")}
          </Button>
          <Button onClick={() => navigate("/shipments/create")}>
            <Plus className="mr-2 h-4 w-4" />
            {t("allOrders.newOrder")}
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
              <p className="text-sm text-muted-foreground">{t("allOrders.stats.total")}</p>
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
              <p className="text-sm text-muted-foreground">{t("allOrders.stats.pending")}</p>
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
              <p className="text-sm text-muted-foreground">{t("allOrders.stats.inTransit")}</p>
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
              <p className="text-sm text-muted-foreground">{t("allOrders.stats.totalBudget")}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="relative lg:col-span-2">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input 
            placeholder={t("allOrders.searchPlaceholder")} 
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger>
            <SelectValue placeholder={t("allOrders.filterStatus")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">{t("allOrders.allStatuses")}</SelectItem>
            <SelectItem value="PENDING">{t("status.pending")}</SelectItem>
            <SelectItem value="ACCEPTED">{t("status.accepted")}</SelectItem>
            <SelectItem value="ASSIGNED">{t("status.assigned")}</SelectItem>
            <SelectItem value="IN_TRANSIT">{t("status.inTransit")}</SelectItem>
            <SelectItem value="DELIVERED">{t("status.delivered")}</SelectItem>
            <SelectItem value="CANCELLED">{t("status.cancelled")}</SelectItem>
          </SelectContent>
        </Select>
        <Select value={assignmentFilter} onValueChange={setAssignmentFilter}>
          <SelectTrigger>
            <SelectValue placeholder={t("allOrders.filterOrderType")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">{t("allOrders.allTypes")}</SelectItem>
            <SelectItem value="OPEN_MARKETPLACE">{t("assignmentModes.openMarketplace")}</SelectItem>
            <SelectItem value="DIRECT_COMPANY">{t("assignmentModes.directCompany")}</SelectItem>
            <SelectItem value="DIRECT_PRIVATE_TRANSPORTER">{t("assignmentModes.directPrivateTransporter")}</SelectItem>
          </SelectContent>
        </Select>
        { (searchQuery || statusFilter !== "ALL" || assignmentFilter !== "ALL") && (
          <Button 
            variant="ghost" 
            className="gap-2 text-muted-foreground"
            onClick={() => {
              setSearchQuery("");
              setStatusFilter("ALL");
              setAssignmentFilter("ALL");
            }}
          >
            <X className="h-4 w-4" /> {t("allOrders.clearFilters")}
          </Button>
        )}
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
            <p className="text-muted-foreground">{t("allOrders.loading")}</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <ShoppingCart className="h-12 w-12 text-muted-foreground mb-4 opacity-20" />
            <p className="text-lg font-medium text-muted-foreground">
              {orders.length === 0 ? t("allOrders.noOrders") : t("allOrders.noOrdersFiltered")}
            </p>
            {orders.length === 0 && (
              <Button variant="link" onClick={() => navigate("/shipments/create")}>{t("allOrders.createFirst")}</Button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-secondary/50">
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t("allOrders.table.orderInfo")}</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t("allOrders.table.route")}</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t("allOrders.table.type")}</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t("allOrders.table.status")}</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t("allOrders.table.budgetPayment")}</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t("allOrders.table.actions")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredOrders.map((order) => {
                  const status = statusConfig[order.status] || { label: order.status, icon: Clock, className: "" };
                  const StatusIcon = status.icon;
                  const payment = paymentConfig[order.paymentStatus] || { label: order.paymentStatus, className: "" };

                  // Check if the current user can accept/reject this order
                  const isAssignedToMyCompany = 
                    (user?.role === 'COMPANY_ADMIN' && (order.targetCompanyId?._id === user.companyId || order.targetCompanyId === user.companyId)) ||
                    user?.role === 'SUPER_ADMIN';
                  
                  const canAction = order.assignmentMode === 'DIRECT_COMPANY' && isAssignedToMyCompany && order.status === 'PENDING';

                  return (
                    <tr 
                        key={order._id} 
                        className="hover:bg-secondary/30 transition-colors cursor-pointer" 
                        onClick={() => {
                          if (order.assignmentMode === 'OPEN_MARKETPLACE') {
                            navigate(`/marketplace/orders/${order._id}`);
                          } else {
                            navigate(`/orders/${order._id}`);
                          }
                        }}
                      >
                      <td className="whitespace-nowrap px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="rounded-full bg-primary/10 p-1.5 shrink-0">
                            <ShoppingCart className="h-3.5 w-3.5 text-primary" />
                          </div>
                          <div className="text-sm">
                            <p className="font-bold text-card-foreground leading-tight">{order.orderNumber}</p>
                            <p className="text-xs text-muted-foreground truncate max-w-[140px]">{order.title}</p>
                            <p className="text-[10px] text-muted-foreground/60">{new Date(order.createdAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3">
                        <div className="flex items-center gap-1.5 text-xs">
                           <span className="text-card-foreground font-medium">{order.pickupLocation?.city || t("common.na")}</span>
                           <ArrowRight className="h-3 w-3 text-muted-foreground" />
                           <span className="text-card-foreground font-medium">{order.deliveryLocation?.city || t("common.na")}</span>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3">
                        <Badge variant="outline" className={cn(
                          "text-[10px] px-2 py-0 h-5 font-normal",
                          order.assignmentMode === 'OPEN_MARKETPLACE' ? "border-primary text-primary" : "border-muted-foreground/30 text-muted-foreground"
                        )}>
                          {assignmentModeLabelMap[order.assignmentMode] || t("assignmentModes.na")}
                        </Badge>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3">
                        <Badge className={cn("gap-1 text-[10px] px-2 py-0 h-5", status.className)}>
                          <StatusIcon className="h-3 w-3" />
                          {status.label}
                        </Badge>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3">
                        <div className="text-sm">
                          <p className="font-bold text-card-foreground">{order.pricing?.proposedBudget} <span className="text-[10px] text-muted-foreground font-normal">{order.pricing?.currency}</span></p>
                          <Badge variant="outline" className={cn("text-[9px] px-1.5 py-0 h-4 mt-1 font-normal", payment.className)}>{payment.label}</Badge>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-right">
                        {canAction ? (
                          <div className="flex justify-end gap-2">
                            <Button 
                              size="sm" 
                              className="h-8 gap-1 bg-success hover:bg-success/90" 
                              onClick={(e) => handleAcceptOrder(e, order._id)}
                            >
                              <Check className="h-3.5 w-3.5" />
                              {t("allOrders.accept")}
                            </Button>
                            <Button 
                              size="sm" 
                              variant="destructive" 
                              className="h-8 gap-1"
                              onClick={(e) => handleRejectOrder(e, order._id)}
                            >
                              <X className="h-3.5 w-3.5" />
                              {t("allOrders.reject")}
                            </Button>
                          </div>
                        ) : (
                            <Button variant="ghost" size="sm" className="h-8">{t("allOrders.details")}</Button>
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
