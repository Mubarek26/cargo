import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { 
  ArrowLeft, ShoppingCart, Calendar, MapPin, Package, User, 
  Truck, Scale, Clock, CheckCircle, XCircle, Loader2, Check, X,
  ExternalLink, Phone, Mail, DollarSign
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { orderService } from "@/services/orderService";
import { getCompanyDrivers } from "@/services/driverService";
import { getCompanyVehicles } from "@/services/vehicleService";
import { useCheckAuth } from "@/hooks/use-check-auth";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

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

export default function OrderDetails() {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const { checkAuth } = useCheckAuth();
  
  const [order, setOrder] = useState<any>(null);
  const [drivers, setDrivers] = useState<any[]>([]);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  const [selectedDriver, setSelectedDriver] = useState<string>("");
  const [selectedVehicle, setSelectedVehicle] = useState<string>("");

  useEffect(() => {
    const init = async () => {
      const auth = await checkAuth();
      if (auth.isAuthenticated) {
        const userData = (auth.data as any)?.data?.user || (auth.data as any)?.user;
        setCurrentUser(userData);
        fetchOrderDetails();
      } else {
        navigate("/login");
      }
    };
    init();
  }, [orderId]);

  const fetchOrderDetails = async () => {
    if (!orderId) return;
    setIsLoading(true);
    try {
      const res = await orderService.getOrder(orderId);
      if (res.status === "success") {
        setOrder(res.data.order);
        
        // If the order is ACCEPTED, we might need to fetch drivers and vehicles for assignment
        if (res.data.order.status === 'ACCEPTED' || res.data.order.status === 'ASSIGNED') {
          const token = localStorage.getItem("authToken") || "";
          const userData = (await checkAuth()).data as any;
          const companyId = userData?.data?.user?.companyId || userData?.user?.companyId;
          
          if (companyId) {
            const driversRes = await getCompanyDrivers(token, companyId);
            const vehiclesRes = await getCompanyVehicles(token);
            
            if (driversRes.ok) setDrivers((driversRes.data as any).data.drivers || []);
            if (vehiclesRes.ok) setVehicles((vehiclesRes.data as any).data.vehicles || []);
          }
        }
      }
    } catch (error) {
      toast.error("Failed to fetch order details");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAccept = async () => {
    if (!orderId) return;
    setIsActionLoading(true);
    try {
      await orderService.acceptOrder(orderId);
      toast.success("Order accepted successfully");
      fetchOrderDetails();
    } catch (error: any) {
      toast.error(error.message || "Failed to accept order");
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!orderId) return;
    setIsActionLoading(true);
    try {
      await orderService.rejectOrder(orderId);
      toast.error("Order rejected");
      fetchOrderDetails();
    } catch (error: any) {
      toast.error(error.message || "Failed to reject order");
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleAssign = async () => {
    if (!orderId || !selectedDriver || !selectedVehicle) {
      toast.error("Please select both a driver and a vehicle");
      return;
    }
    setIsActionLoading(true);
    try {
      await orderService.assignOrder(orderId, selectedDriver, selectedVehicle);
      toast.success("Driver and vehicle assigned successfully");
      fetchOrderDetails();
    } catch (error: any) {
      toast.error(error.message || "Failed to assign order");
    } finally {
      setIsActionLoading(false);
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex h-[60vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  if (!order) {
    return (
      <DashboardLayout>
        <div className="flex h-[60vh] flex-col items-center justify-center gap-4">
          <XCircle className="h-12 w-12 text-destructive opacity-20" />
          <p className="text-xl font-medium text-muted-foreground">Order not found</p>
          <Button onClick={() => navigate("/orders")}>Back to Orders</Button>
        </div>
      </DashboardLayout>
    );
  }

  const status = statusConfig[order.status] || { label: order.status, icon: Clock, className: "" };
  const StatusIcon = status.icon;

  const isAssignedToMyCompany = 
    currentUser?.role === 'COMPANY_ADMIN' && 
    order.assignmentMode === 'DIRECT_COMPANY' && 
    (order.targetCompanyId?._id === currentUser.companyId || order.targetCompanyId === currentUser.companyId);

  return (
    <DashboardLayout>
      <div className="mb-6 flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/orders")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Order {order.orderNumber}</h1>
          <p className="text-muted-foreground">Detailed view and management of shipment</p>
        </div>
        <div className="ml-auto">
          <Badge className={cn("gap-1 py-1.5 px-3 text-sm", status.className)}>
            <StatusIcon className="h-4 w-4" />
            {status.label}
          </Badge>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Action Card */}
          {isAssignedToMyCompany && (
            <div className="rounded-xl border-2 border-primary/20 bg-primary/5 p-6">
              <h3 className="mb-4 text-lg font-semibold text-foreground flex items-center gap-2">
                <ExternalLink className="h-5 w-5 text-primary" />
                Actions Required
              </h3>
              
              {order.status === 'PENDING' && (
                <div className="flex gap-4">
                  <Button className="flex-1 gap-2 bg-success hover:bg-success/90" size="lg" onClick={handleAccept} disabled={isActionLoading}>
                    {isActionLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                    Accept Order
                  </Button>
                  <Button variant="destructive" className="flex-1 gap-2" size="lg" onClick={handleReject} disabled={isActionLoading}>
                    {isActionLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <X className="h-4 w-4" />}
                    Reject Order
                  </Button>
                </div>
              )}

              {order.status === 'ACCEPTED' && (
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">The order is accepted. Now assign a driver and a vehicle to start the trip.</p>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Select Driver</Label>
                      <Select value={selectedDriver} onValueChange={setSelectedDriver}>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose a driver" />
                        </SelectTrigger>
                        <SelectContent>
                          {drivers.map(driver => {
                            const driverUserId = driver.userId?._id || driver.userId;
                            return (
                              <SelectItem key={driver._id} value={driverUserId}>
                                {driver.fullName}
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Select Vehicle</Label>
                      <Select value={selectedVehicle} onValueChange={setSelectedVehicle}>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose a vehicle" />
                        </SelectTrigger>
                        <SelectContent>
                          {vehicles.map(vehicle => (
                            <SelectItem key={vehicle._id} value={vehicle._id}>
                              {vehicle.plateNumber} ({vehicle.vehicleType})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <Button className="w-full gap-2" size="lg" onClick={handleAssign} disabled={isActionLoading}>
                    {isActionLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Truck className="h-4 w-4" />}
                    Assign & Start Trip
                  </Button>
                </div>
              )}

              {order.status === 'ASSIGNED' && (
                <div className="flex items-center gap-3 text-success">
                  <div className="rounded-full bg-success/20 p-1.5">
                    <CheckCircle className="h-5 w-5" />
                  </div>
                  <span className="font-medium">Order has been assigned. Trip is in progress.</span>
                </div>
              )}
            </div>
          )}

          {/* Details sections */}
          <div className="grid gap-6 sm:grid-cols-2">
            {/* Route Details */}
            <div className="rounded-xl border border-border bg-card p-6">
              <h3 className="mb-4 flex items-center gap-2 font-semibold text-card-foreground">
                <MapPin className="h-5 w-5 text-primary" />
                Route Information
              </h3>
              <div className="space-y-6">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Pickup</p>
                  <p className="mt-1 font-medium">{order.pickupLocation?.address}</p>
                  <p className="text-sm text-muted-foreground">{order.pickupLocation?.city}, {order.pickupLocation?.state}</p>
                  {(order.pickupLocation?.contactName || order.pickupLocation?.contactPhone) && (
                    <div className="mt-2 flex flex-col gap-1">
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <User className="h-3 w-3" /> {order.pickupLocation.contactName || "Unknown"}
                      </p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Phone className="h-3 w-3" /> {order.pickupLocation.contactPhone || "No phone"}
                      </p>
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Delivery</p>
                  <p className="mt-1 font-medium">{order.deliveryLocation?.address}</p>
                  <p className="text-sm text-muted-foreground">{order.deliveryLocation?.city}, {order.deliveryLocation?.state}</p>
                  {(order.deliveryLocation?.contactName || order.deliveryLocation?.contactPhone) && (
                    <div className="mt-2 flex flex-col gap-1">
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <User className="h-3 w-3" /> {order.deliveryLocation.contactName || "Unknown"}
                      </p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Phone className="h-3 w-3" /> {order.deliveryLocation.contactPhone || "No phone"}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Cargo Details */}
            <div className="rounded-xl border border-border bg-card p-6">
              <h3 className="mb-4 flex items-center gap-2 font-semibold text-card-foreground">
                <Package className="h-5 w-5 text-primary" />
                Cargo & Requirements
              </h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Type</p>
                    <p className="font-medium">{order.cargo?.type || "General"}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Weight</p>
                    <p className="font-medium">{order.cargo?.weightKg} Kg</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Quantity</p>
                    <p className="font-medium">{order.cargo?.quantity} {order.cargo?.unit}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Vehicle Req.</p>
                    <p className="font-medium">{order.vehicleRequirements?.vehicleType || "Any"}</p>
                  </div>
                </div>
                {order.description && (
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Description</p>
                    <p className="text-sm">{order.description}</p>
                  </div>
                )}
                {order.specialInstructions && (
                  <div className="rounded-lg bg-secondary/50 p-3">
                    <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1">Special Instructions</p>
                    <p className="text-sm italic">"{order.specialInstructions}"</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="mb-4 font-semibold text-card-foreground">Fulfillment Details</h3>
            <div className="space-y-4">
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-muted-foreground flex items-center gap-2 text-sm"><Calendar className="h-4 w-4" /> Pickup Date</span>
                <span className="font-medium text-sm">{new Date(order.pickupDate).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-muted-foreground flex items-center gap-2 text-sm"><Clock className="h-4 w-4" /> Deadline</span>
                <span className="font-medium text-sm">{order.deliveryDeadline ? new Date(order.deliveryDeadline).toLocaleDateString() : "N/A"}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-muted-foreground flex items-center gap-2 text-sm"><DollarSign className="h-4 w-4" /> Budget</span>
                <span className="font-bold text-primary">{order.pricing?.proposedBudget} {order.pricing?.currency}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-muted-foreground text-sm">Created By</span>
                <span className="text-sm font-medium">{order.createdBy?.fullName}</span>
              </div>
              {order.createdBy?.email && (
                <div className="text-xs text-muted-foreground text-right mt-[-10px]">
                  {order.createdBy.email}
                </div>
              )}
            </div>
          </div>

          {order.status === 'ASSIGNED' && (
            <div className="rounded-xl border border-border bg-card p-6">
              <h3 className="mb-4 font-semibold text-card-foreground flex items-center gap-2">
                <Truck className="h-5 w-5 text-primary" />
                Assigned Resources
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="rounded-full bg-primary/10 p-2">
                    <User className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase">Driver</p>
                    <p className="font-medium text-sm">{order.targetTransporterId?.fullName || "Assigned Driver"}</p>
                    <p className="text-xs text-muted-foreground">{order.targetTransporterId?.phoneNumber}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="rounded-full bg-primary/10 p-2">
                    <Truck className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase">Vehicle</p>
                    <p className="font-medium text-sm">{order.assignedVehicleId?.plateNumber || "Assigned Vehicle"}</p>
                    <p className="text-xs text-muted-foreground">{order.assignedVehicleId?.vehicleType}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
