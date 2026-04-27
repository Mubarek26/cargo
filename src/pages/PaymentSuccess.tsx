import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { CheckCircle2, Package, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { paymentService } from "@/services/paymentService";
import { toast } from "sonner";

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isVerifying, setIsVerifying] = useState(true);
  const [status, setStatus] = useState<"success" | "error" | "verifying">("verifying");
  const txRef = searchParams.get("trx_ref");

  useEffect(() => {
    if (txRef) {
      verifyPayment();
    } else {
      setStatus("error");
      setIsVerifying(false);
    }
  }, [txRef]);

  const verifyPayment = async () => {
    try {
      const res = await paymentService.verifyPayment(txRef!);
      if (res.status === "success") {
        setStatus("success");
        toast.success("Payment verified successfully!");
      } else {
        setStatus("error");
        toast.error("Payment verification failed");
      }
    } catch (error) {
      console.error("Verification error:", error);
      setStatus("error");
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="flex items-center justify-center min-h-[70vh]">
        <Card className="w-full max-w-md border-primary/10 shadow-2xl overflow-hidden">
          <CardContent className="pt-12 pb-10 text-center space-y-6">
            {isVerifying ? (
              <div className="space-y-4">
                <div className="flex justify-center">
                  <div className="relative">
                    <div className="h-24 w-24 border-4 border-primary/20 rounded-full" />
                    <Loader2 className="h-24 w-24 text-primary animate-spin absolute top-0 left-0" />
                  </div>
                </div>
                <h2 className="text-2xl font-bold">Verifying Payment</h2>
                <p className="text-muted-foreground">Please wait while we confirm your transaction with Chapa...</p>
              </div>
            ) : status === "success" ? (
              <div className="space-y-6 animate-in zoom-in duration-500">
                <div className="flex justify-center">
                  <div className="h-24 w-24 bg-green-500/10 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="h-12 w-12 text-green-500" />
                  </div>
                </div>
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold">Payment Successful!</h2>
                  <p className="text-muted-foreground">Your transaction has been processed. The shipment is now marked as paid and is ready for transit.</p>
                </div>
                
                <div className="bg-muted/50 p-4 rounded-xl text-sm font-mono flex justify-between items-center">
                  <span className="text-muted-foreground">Reference:</span>
                  <span className="font-bold">{txRef}</span>
                </div>

                <div className="pt-4 flex flex-col gap-3">
                  <Button size="lg" className="gap-2" onClick={() => navigate("/shipper/orders")}>
                    <Package className="h-4 w-4" /> View My Shipments
                  </Button>
                  <Button variant="ghost" className="gap-2" onClick={() => navigate("/home")}>
                    Go to Dashboard <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex justify-center">
                  <div className="h-24 w-24 bg-red-500/10 rounded-full flex items-center justify-center text-red-500">
                    <CheckCircle2 className="h-12 w-12" />
                  </div>
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold">Payment Unconfirmed</h2>
                  <p className="text-muted-foreground">We couldn't verify your payment. If you've been charged, please contact support with your reference ID.</p>
                </div>
                <Button size="lg" variant="destructive" className="w-full" onClick={() => navigate("/shipper/orders")}>
                  Return to Orders
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
