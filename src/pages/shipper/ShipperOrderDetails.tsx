import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { 
  Package, 
  MapPin, 
  Clock, 
  Truck, 
  User, 
  Phone, 
  Mail, 
  ArrowLeft, 
  CheckCircle2, 
  AlertCircle,
  FileText,
  Calendar,
  Scale,
  DollarSign,
  ShieldCheck,
  ChevronRight,
  Users
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { RouteMap } from "@/components/RouteMap";
import { orderService } from "@/services/orderService";
import { toast } from "sonner";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { paymentService } from "@/services/paymentService";
import { Loader2, CreditCard } from "lucide-react";

export default function ShipperOrderDetails() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPaying, setIsPaying] = useState(false);

  useEffect(() => {
    if (orderId) fetchOrderDetails();
  }, [orderId]);

  const fetchOrderDetails = async () => {
    setIsLoading(true);
    try {
      const res = await orderService.getOrder(orderId!);
      if (res.status === "success") {
        setOrder(res.data.order);
      }
    } catch (error) {
      toast.error("Failed to load order details");
      navigate("/shipper/orders");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePayment = async () => {
    if (!order) return;

    setIsPaying(true);
    try {
      // Get user from localStorage to get their phone number
      const userStr = localStorage.getItem("user");
      const user = userStr ? JSON.parse(userStr) : null;
      
      if (!user?.phoneNumber) {
        toast.error("Please update your phone number in profile before payment");
        navigate("/profile");
        return;
      }

      const res = await paymentService.initializePayment(
        order._id,
        user.phoneNumber,
        order.pricing?.currency || "ETB"
      );

      if (res.status === "success" && res.data.data.checkout_url) {
        toast.success("Redirecting to secure payment...");
        window.location.href = res.data.data.checkout_url;
      } else {
        throw new Error("Failed to get checkout URL");
      }
    } catch (error: any) {
      console.error("Payment error:", error);
      toast.error(error.message || "Payment initialization failed");
    } finally {
      setIsPaying(false);
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-[60vh]">
          <div className="flex flex-col items-center gap-4">
            <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-muted-foreground animate-pulse">Loading shipment details...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!order) return null;

  const getStatusStep = (status: string) => {
    const steps = ["OPEN", "PENDING", "ACCEPTED", "ASSIGNED", "IN_TRANSIT", "DELIVERED"];
    return steps.indexOf(status) + 1;
  };

  const currentStep = getStatusStep(order.status);
  const progressValue = (currentStep / 6) * 100;

  return (
    <DashboardLayout>
      <div className="space-y-8 pb-10">
        {/* Top Navigation & Status */}
        <div className="flex flex-col gap-6">
          <Button 
            variant="ghost" 
            className="w-fit -ml-2 text-muted-foreground hover:text-primary gap-2"
            onClick={() => navigate("/shipper/orders")}
          >
            <ArrowLeft className="h-4 w-4" /> Back to Shipments
          </Button>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold tracking-tight text-foreground">{order.title}</h1>
                <Badge className={cn("text-xs uppercase font-bold", 
                  order.status === "DELIVERED" ? "bg-green-500/10 text-green-500 border-green-500/20" :
                  order.status === "IN_TRANSIT" ? "bg-primary/10 text-primary border-primary/20 animate-pulse" :
                  "bg-amber-500/10 text-amber-500 border-amber-500/20"
                )}>
                  {order.status.replace('_', ' ')}
                </Badge>
              </div>
              <p className="text-muted-foreground flex items-center gap-2">
                Order ID: <span className="font-mono text-foreground font-medium">#{order.orderNumber || order._id.slice(-8)}</span>
                <span className="text-border">|</span>
                Created on {format(new Date(order.createdAt), "PPP")}
              </p>
            </div>
            {order.status === "IN_TRANSIT" && (
              <Button size="lg" className="gap-2 shadow-lg shadow-primary/20" onClick={() => navigate(`/tracking/${order._id}`)}>
                <MapPin className="h-4 w-4" /> Track Real-time
              </Button>
            )}
          </div>
        </div>

        {/* Progress Tracker */}
        <Card className="border-primary/5 bg-card/50 backdrop-blur-sm">
          <CardContent className="pt-6">
            <div className="relative mb-8">
              <Progress value={progressValue} className="h-2" />
              <div className="absolute top-1/2 -translate-y-1/2 w-full flex justify-between px-1">
                {[1, 2, 3, 4, 5, 6].map((step) => (
                  <div 
                    key={step}
                    className={cn(
                      "h-5 w-5 rounded-full border-4 transition-all duration-500",
                      currentStep >= step 
                        ? "bg-primary border-primary shadow-[0_0_10px_rgba(59,130,246,0.5)]" 
                        : "bg-background border-muted"
                    )}
                  />
                ))}
              </div>
            </div>
            <div className="grid grid-cols-6 text-center">
              <div className={cn("text-[10px] font-bold uppercase", currentStep >= 1 ? "text-primary" : "text-muted-foreground")}>Order<br/>Placed</div>
              <div className={cn("text-[10px] font-bold uppercase", currentStep >= 2 ? "text-primary" : "text-muted-foreground")}>Reviewing<br/>Bids</div>
              <div className={cn("text-[10px] font-bold uppercase", currentStep >= 3 ? "text-primary" : "text-muted-foreground")}>Bid<br/>Accepted</div>
              <div className={cn("text-[10px] font-bold uppercase", currentStep >= 4 ? "text-primary" : "text-muted-foreground")}>Transporter<br/>Assigned</div>
              <div className={cn("text-[10px] font-bold uppercase", currentStep >= 5 ? "text-primary" : "text-muted-foreground")}>In<br/>Transit</div>
              <div className={cn("text-[10px] font-bold uppercase", currentStep >= 6 ? "text-primary" : "text-muted-foreground")}>Order<br/>Delivered</div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Info Columns */}
          <div className="lg:col-span-2 space-y-8">
            {/* Map Preview */}
            <div className="rounded-2xl overflow-hidden border border-border shadow-xl h-[400px]">
              <RouteMap 
                pickup={order.pickupLocation}
                delivery={order.deliveryLocation}
                className="h-full w-full"
              />
            </div>

            {/* Shipment Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-primary/5">
                <CardHeader>
                  <CardTitle className="text-sm font-semibold flex items-center gap-2">
                    <Package className="h-4 w-4 text-primary" /> Cargo Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center py-2 border-b border-border/50">
                    <span className="text-muted-foreground text-sm">Cargo Type</span>
                    <span className="font-medium">{order.cargo?.type || "Not specified"}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-border/50">
                    <span className="text-muted-foreground text-sm">Weight</span>
                    <span className="font-medium">{order.cargo?.weightKg} Kg</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-border/50">
                    <span className="text-muted-foreground text-sm">Quantity</span>
                    <span className="font-medium">{order.cargo?.quantity} {order.cargo?.unit || "Units"}</span>
                  </div>
                  <div className="pt-2">
                    <p className="text-muted-foreground text-xs mb-1">Description</p>
                    <p className="text-sm italic">{order.cargo?.description || "No description provided."}</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-primary/5">
                <CardHeader>
                  <CardTitle className="text-sm font-semibold flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-primary" /> Pricing & Payment
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center py-2 border-b border-border/50">
                    <span className="text-muted-foreground text-sm">Agreed Rate</span>
                    <span className="text-lg font-bold text-primary">{order.pricing?.proposedBudget?.toLocaleString()} {order.pricing?.currency || "ETB"}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-border/50">
                    <span className="text-muted-foreground text-sm">Payment Method</span>
                    <Badge variant="secondary">{order.pricing?.paymentMethod?.replace('_', ' ') || "BANK TRANSFER"}</Badge>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-border/50">
                    <span className="text-muted-foreground text-sm">Payment Status</span>
                    <Badge className={cn("text-[10px] uppercase font-bold", 
                      order.paymentStatus === "paid" ? "bg-green-500/10 text-green-500 border-green-500/20" :
                      order.paymentStatus === "failed" ? "bg-red-500/10 text-red-500 border-red-500/20" :
                      "bg-amber-500/10 text-amber-500 border-amber-500/20"
                    )}>
                      {order.paymentStatus || "PENDING"}
                    </Badge>
                  </div>
                  <div className="pt-4 space-y-4">
                    <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                      <ShieldCheck className="h-3 w-3 text-green-500" />
                      Secure payment handled by Chapa
                    </div>
                    {order.paymentStatus !== "paid" && (
                      <Button 
                        className="w-full gap-2 shadow-lg shadow-primary/20" 
                        onClick={handlePayment}
                        disabled={isPaying}
                      >
                        {isPaying ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          <>
                            <CreditCard className="h-4 w-4" />
                            Pay Now ({order.pricing?.proposedBudget?.toLocaleString()} {order.pricing?.currency || "ETB"})
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Route & Locations */}
            <Card className="border-primary/5">
              <CardHeader>
                <CardTitle className="text-sm font-semibold">Route Overview</CardTitle>
              </CardHeader>
              <CardContent className="p-0 overflow-hidden rounded-b-xl">
                <div className="flex flex-col md:flex-row">
                  <div className="flex-1 p-6 border-b md:border-b-0 md:border-r border-border">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="h-8 w-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500">
                        <MapPin className="h-4 w-4" />
                      </div>
                      <h4 className="font-bold text-sm uppercase tracking-wider text-muted-foreground">Pickup Location</h4>
                    </div>
                    <div className="space-y-3">
                      <p className="font-semibold text-lg">{order.pickupLocation?.city}</p>
                      <p className="text-sm text-muted-foreground">{order.pickupLocation?.address}</p>
                      <div className="pt-4 space-y-1">
                        <p className="text-xs font-bold text-muted-foreground uppercase">Contact Person</p>
                        <p className="text-sm flex items-center gap-2"><User className="h-3 w-3" /> {order.pickupLocation?.contactName || "Contact not set"}</p>
                        <p className="text-sm flex items-center gap-2"><Phone className="h-3 w-3" /> {order.pickupLocation?.contactPhone || "Phone not set"}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex-1 p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="h-8 w-8 rounded-lg bg-green-500/10 flex items-center justify-center text-green-500">
                        <MapPin className="h-4 w-4" />
                      </div>
                      <h4 className="font-bold text-sm uppercase tracking-wider text-muted-foreground">Delivery Destination</h4>
                    </div>
                    <div className="space-y-3">
                      <p className="font-semibold text-lg">{order.deliveryLocation?.city}</p>
                      <p className="text-sm text-muted-foreground">{order.deliveryLocation?.address}</p>
                      <div className="pt-4 space-y-1">
                        <p className="text-xs font-bold text-muted-foreground uppercase">Contact Person</p>
                        <p className="text-sm flex items-center gap-2"><User className="h-3 w-3" /> {order.deliveryLocation?.contactName || "Contact not set"}</p>
                        <p className="text-sm flex items-center gap-2"><Phone className="h-3 w-3" /> {order.deliveryLocation?.contactPhone || "Phone not set"}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar Info */}
          <div className="space-y-8">
            {/* Delivery Timeline */}
            <Card className="border-primary/5">
              <CardHeader>
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <Clock className="h-4 w-4 text-primary" /> Delivery Window
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="h-4 w-4 rounded-full bg-primary" />
                    <div className="w-0.5 h-full bg-border" />
                  </div>
                  <div className="pb-4">
                    <p className="text-[10px] uppercase font-bold text-muted-foreground">Requested Pickup</p>
                    <p className="text-sm font-medium">{format(new Date(order.pickupDate), "PPP")}</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="h-4 w-4 rounded-full border-2 border-primary" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-muted-foreground">Delivery Deadline</p>
                    <p className="text-sm font-medium">{order.deliveryDeadline ? format(new Date(order.deliveryDeadline), "PPP") : "No fixed deadline"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Assigned Partner Info */}
            <Card className="border-primary/5 overflow-hidden">
              <div className="bg-primary/5 p-6 border-b border-primary/10">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <Truck className="h-4 w-4 text-primary" /> Logistical Partner
                </CardTitle>
              </div>
              <CardContent className="pt-6">
                {order.targetCompanyId ? (
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold text-xl">
                        {order.targetCompanyId.companyName?.[0]}
                      </div>
                      <div>
                        <h4 className="font-bold">{order.targetCompanyId.companyName}</h4>
                        <Badge variant="outline" className="text-[10px] uppercase font-medium">Verified Partner</Badge>
                      </div>
                    </div>
                    
                    <div className="space-y-3 pt-4 border-t border-border">
                      <div className="flex items-center gap-3 text-sm">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span>{order.targetCompanyId.phoneNumber}</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span className="truncate">{order.targetCompanyId.email}</span>
                      </div>
                    </div>

                    <Button className="w-full gap-2" variant="outline">
                      Contact Support
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-4 text-muted-foreground">
                      <Users className="h-6 w-6" />
                    </div>
                    <p className="text-sm font-medium">Not yet assigned</p>
                    <p className="text-xs text-muted-foreground mt-1 px-4">Reviewing bids from available transporters.</p>
                    <Button 
                      variant="link" 
                      className="mt-2 text-primary"
                      onClick={() => navigate(`/marketplace/orders/${order._id}`)}
                    >
                      View Current Bids <ChevronRight className="h-3 w-3" />
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Special Instructions */}
            <Card className="border-amber-500/10 bg-amber-500/5">
              <CardHeader>
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-amber-500" /> Instructions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed">
                  {order.specialInstructions || "No special instructions provided for this shipment."}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
