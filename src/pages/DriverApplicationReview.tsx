import * as React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useDriverApplicationStatus } from "@/hooks/use-driver-application-status";
import { 
  Clock, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowLeft, 
  RefreshCw, 
  Mail, 
  Package,
  ExternalLink,
  ChevronRight
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const DriverApplicationReview: React.FC = () => {
  const navigate = useNavigate();
  const { fetchStatus, isLoading, status } = useDriverApplicationStatus();

  React.useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      navigate("/login");
      return;
    }

    fetchStatus(token).then((result) => {
      if (result.notFound) {
        navigate("/driver-application");
      }
    });
  }, [fetchStatus, navigate]);

  React.useEffect(() => {
    if (status === "APPROVED") {
      navigate("/home");
    }
  }, [navigate, status]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-muted-foreground font-medium animate-pulse tracking-tight">Syncing application status...</p>
        </div>
      </div>
    );
  }

  if (status === "APPROVED") {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50/50 flex items-center justify-center px-6 py-12 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/5 rounded-full blur-[120px]" />
      </div>

      <div className="w-full max-w-2xl relative z-10">
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
              <Package className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-2xl font-black tracking-tighter uppercase italic text-slate-900">CargoMax</span>
          </div>
        </div>

        <Card className="border-primary/5 shadow-2xl shadow-primary/5 rounded-[2.5rem] overflow-hidden bg-white/80 backdrop-blur-xl">
          <CardContent className="p-10 lg:p-16 text-center">
            <div className="relative mb-10 inline-block">
              <div className="h-24 w-24 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500 relative z-10 mx-auto">
                <Clock className="h-12 w-12 animate-[spin_10s_linear_infinite]" />
              </div>
              <div className="absolute inset-0 bg-amber-500/20 rounded-full blur-2xl animate-pulse -z-0" />
              <div className="absolute -right-2 -bottom-2 h-8 w-8 rounded-full bg-background border-4 border-slate-50 flex items-center justify-center z-20">
                <ShieldCheck className="h-4 w-4 text-primary" />
              </div>
            </div>

            <h1 className="text-3xl font-black tracking-tight text-slate-900 mb-4">Application Under Review</h1>
            <p className="text-slate-600 font-medium max-w-md mx-auto leading-relaxed">
              We've received your <span className="text-primary font-bold">Driver Application</span> and our compliance team is currently verifying your documents.
            </p>

            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
              {[
                { icon: CheckCircle2, title: "Submitted", status: "Completed", color: "text-green-500" },
                { icon: Clock, title: "Vetting", status: "In Progress", color: "text-amber-500" },
                { icon: ShieldCheck, title: "Final Approval", status: "Pending", color: "text-slate-300" }
              ].map((item, i) => (
                <div key={i} className="bg-slate-50/80 rounded-2xl p-4 border border-slate-100 flex flex-col gap-2">
                  <item.icon className={cn("h-5 w-5", item.color)} />
                  <div className="space-y-0.5">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{item.status}</p>
                    <p className="text-sm font-bold text-slate-700">{item.title}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 p-6 bg-primary/5 rounded-3xl border border-primary/10 flex items-start gap-4 text-left">
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                <Mail className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-900">What's Next?</h4>
                <p className="text-xs text-slate-600 leading-relaxed mt-1">
                  Once approved, you'll receive a confirmation email with your dashboard credentials. Review usually takes <span className="font-bold">2-4 business days</span>.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mt-12">
              <Button 
                onClick={() => window.location.reload()} 
                className="flex-1 h-14 rounded-2xl font-black text-lg gap-2 shadow-xl shadow-primary/10"
              >
                <RefreshCw className="h-5 w-5" /> Refresh Status
              </Button>
              <Button 
                onClick={() => navigate("/login")} 
                variant="outline"
                className="flex-1 h-14 rounded-2xl font-black text-lg gap-2 border-slate-200"
              >
                <ArrowLeft className="h-5 w-5" /> Back to Login
              </Button>
            </div>

            <div className="mt-10 flex items-center justify-center gap-6 text-xs font-bold text-slate-400 uppercase tracking-widest">
              <a href="#" className="hover:text-primary transition-colors flex items-center gap-1">
                Help Center <ExternalLink className="h-3 w-3" />
              </a>
              <div className="h-1 w-1 bg-slate-300 rounded-full" />
              <a href="#" className="hover:text-primary transition-colors flex items-center gap-1">
                Terms of Service <ChevronRight className="h-3 w-3" />
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DriverApplicationReview;
