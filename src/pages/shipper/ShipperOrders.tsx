import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { 
  Package, 
  Search, 
  Filter, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  TrendingUp,
  ArrowRight,
  Eye,
  Truck,
  ChevronRight,
  MoreVertical
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import { orderService } from "@/services/orderService";
import { toast } from "sonner";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export default function ShipperOrders() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [orders, setOrders] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const res = await orderService.getMyOrders();
      if (res.status === "success") {
        setOrders(res.data.orders || []);
      }
    } catch (error) {
      toast.error("Failed to load your shipments");
    } finally {
      setIsLoading(false);
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.orderNumber?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: orders.length,
    active: orders.filter(o => ["PENDING", "ACCEPTED", "ASSIGNED", "IN_TRANSIT"].includes(o.status)).length,
    delivered: orders.filter(o => o.status === "DELIVERED").length,
    delayed: orders.filter(o => o.status === "DELAYED").length,
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "OPEN": return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "PENDING": return "bg-amber-500/10 text-amber-500 border-amber-500/20";
      case "ASSIGNED": return "bg-indigo-500/10 text-indigo-500 border-indigo-500/20";
      case "IN_TRANSIT": return "bg-primary/10 text-primary border-primary/20";
      case "DELIVERED": return "bg-green-500/10 text-green-500 border-green-500/20";
      case "CANCELLED": return "bg-red-500/10 text-red-500 border-red-500/20";
      default: return "bg-slate-500/10 text-slate-500 border-slate-500/20";
    }
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-8 pb-10">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">My Shipments</h1>
            <p className="text-muted-foreground mt-1">Track and manage your freight deliveries in real-time</p>
          </div>
          <Button onClick={() => navigate("/shipments/create")} className="gap-2 shadow-lg shadow-primary/20">
            <Package className="h-4 w-4" /> Post New Load
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-card/50 backdrop-blur-sm border-primary/10 hover:border-primary/30 transition-all">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Package className="h-5 w-5 text-primary" />
                </div>
                <Badge variant="outline" className="font-medium">Total</Badge>
              </div>
              <div className="mt-4">
                <div className="text-2xl font-bold">{stats.total}</div>
                <p className="text-xs text-muted-foreground">Orders placed to date</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-sm border-blue-500/10 hover:border-blue-500/30 transition-all">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <Truck className="h-5 w-5 text-blue-500" />
                </div>
                <Badge variant="outline" className="text-blue-500 border-blue-500/20">Active</Badge>
              </div>
              <div className="mt-4">
                <div className="text-2xl font-bold">{stats.active}</div>
                <p className="text-xs text-muted-foreground">In transit or pending</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-sm border-green-500/10 hover:border-green-500/30 transition-all">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="p-2 bg-green-500/10 rounded-lg">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                </div>
                <Badge variant="outline" className="text-green-500 border-green-500/20">Completed</Badge>
              </div>
              <div className="mt-4">
                <div className="text-2xl font-bold">{stats.delivered}</div>
                <p className="text-xs text-muted-foreground">Successfully delivered</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-sm border-red-500/10 hover:border-red-500/30 transition-all">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="p-2 bg-red-500/10 rounded-lg">
                  <AlertCircle className="h-5 w-5 text-red-500" />
                </div>
                <Badge variant="outline" className="text-red-500 border-red-500/20">Delayed</Badge>
              </div>
              <div className="mt-4">
                <div className="text-2xl font-bold">{stats.delayed}</div>
                <p className="text-xs text-muted-foreground">Attention required</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and List */}
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4 justify-between">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search by order # or title..." 
                className="pl-10 bg-card/50"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {["ALL", "OPEN", "PENDING", "IN_TRANSIT", "DELIVERED"].map((status) => (
                <Button
                  key={status}
                  variant={statusFilter === status ? "default" : "outline"}
                  size="sm"
                  onClick={() => setStatusFilter(status)}
                  className="rounded-full whitespace-nowrap"
                >
                  {status.replace('_', ' ')}
                </Button>
              ))}
            </div>
          </div>

          <div className="grid gap-4">
            {isLoading ? (
              Array(3).fill(0).map((_, i) => (
                <div key={i} className="h-32 w-full animate-pulse bg-muted rounded-xl" />
              ))
            ) : filteredOrders.length === 0 ? (
              <div className="text-center py-20 bg-card rounded-xl border border-dashed">
                <Package className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                <h3 className="text-lg font-medium">No shipments found</h3>
                <p className="text-muted-foreground">Try adjusting your filters or post a new load.</p>
              </div>
            ) : (
              filteredOrders.map((order) => (
                <Card 
                  key={order._id} 
                  className="group hover:shadow-md transition-all border-primary/5 hover:border-primary/20 overflow-hidden"
                >
                  <CardContent className="p-0">
                    <div className="flex flex-col lg:flex-row lg:items-center">
                      {/* Left: Info */}
                      <div className="p-5 flex-1 space-y-4">
                        <div className="flex items-start justify-between">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-mono text-muted-foreground">#{order.orderNumber || order._id.slice(-6)}</span>
                              <Badge className={cn("text-[10px] uppercase font-bold", getStatusColor(order.status))}>
                                {order.status.replace('_', ' ')}
                              </Badge>
                            </div>
                            <h3 className="font-bold text-lg leading-tight group-hover:text-primary transition-colors">{order.title}</h3>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-primary">{order.pricing?.proposedBudget?.toLocaleString()} {order.pricing?.currency || 'ETB'}</div>
                            <div className="text-[10px] text-muted-foreground">Estimated Budget</div>
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 text-sm">
                          <div className="flex items-start gap-2 flex-1 min-w-0">
                            <div className="mt-1 h-4 w-4 rounded-full bg-blue-500/20 flex items-center justify-center">
                              <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-[10px] uppercase text-muted-foreground font-semibold">Origin</p>
                              <p className="truncate font-medium">{order.pickupLocation?.address}</p>
                              <p className="text-xs text-muted-foreground">{order.pickupLocation?.city}</p>
                            </div>
                          </div>
                          <div className="hidden sm:flex items-center text-muted-foreground/30">
                            <ArrowRight className="h-4 w-4" />
                          </div>
                          <div className="flex items-start gap-2 flex-1 min-w-0">
                            <div className="mt-1 h-4 w-4 rounded-full bg-green-500/20 flex items-center justify-center">
                              <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-[10px] uppercase text-muted-foreground font-semibold">Destination</p>
                              <p className="truncate font-medium">{order.deliveryLocation?.address}</p>
                              <p className="text-xs text-muted-foreground">{order.deliveryLocation?.city}</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Right: Actions */}
                      <div className="border-t lg:border-t-0 lg:border-l border-border p-4 bg-muted/30 flex lg:flex-col items-center justify-between lg:justify-center gap-3 w-full lg:w-48">
                        <Button 
                          variant="default" 
                          className="w-full gap-2 shadow-sm"
                          onClick={() => navigate(`/shipper/orders/${order._id}`)}
                        >
                          <Eye className="h-4 w-4" /> Details
                        </Button>
                        {["IN_TRANSIT", "ASSIGNED"].includes(order.status) && (
                          <Button 
                            variant="outline" 
                            className="w-full gap-2 border-primary/20 hover:bg-primary/5 text-primary"
                            onClick={() => navigate(`/tracking/${order._id}`)}
                          >
                            <MapPin className="h-4 w-4" /> Track Live
                          </Button>
                        )}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="hidden lg:flex">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => navigate(`/shipper/orders/${order._id}`)}>
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-500">
                              Cancel Order
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
