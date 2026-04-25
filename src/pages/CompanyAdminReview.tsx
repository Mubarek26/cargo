import * as React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { API_BASE_URL } from "@/lib/api";
import { 
  Building2, 
  Clock, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowLeft, 
  RefreshCw, 
  Mail, 
  Package,
  ExternalLink,
  ChevronRight,
  ShieldAlert
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const CompanyAdminReview: React.FC = () => {
  const [status, setStatus] = React.useState<"PENDING"|"APPROVED"|"REJECTED"|null>(null);
  const [loading, setLoading] = React.useState(true);
  const navigate = useNavigate();

  React.useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      navigate("/login");
      return;
    }
    fetch(`${API_BASE_URL}/api/v1/company/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
    })
      .then(async (res) => {
        if (!res.ok) throw new Error("Not found");
        const data = await res.json();
        const s = data?.status || data?.company?.status || "PENDING";
        setStatus(s);
        setLoading(false);
        if (s === "APPROVED") {
          navigate("/home");
        }
      })
      .catch(() => {
        setStatus("PENDING");
        setLoading(false);
      });
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-muted-foreground font-medium animate-pulse tracking-tight">Verifying entity status...</p>
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
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/5 rounded-full blur-[120px]" />
      </div>

      <div className="w-full max-w-2xl relative z-10">
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
              <Building2 className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-2xl font-black tracking-tighter uppercase italic text-slate-900">CargoMax</span>
          </div>
        </div>

        <Card className="border-primary/5 shadow-2xl shadow-primary/5 rounded-[2.5rem] overflow-hidden bg-background/80 backdrop-blur-xl">
          <CardContent className="p-10 lg:p-16 text-center">
            <div className="relative mb-10 inline-block">
              <div className={cn(
                "h-24 w-24 rounded-full flex items-center justify-center relative z-10 mx-auto",
                status === "REJECTED" ? "bg-red-500/10 text-red-500" : "bg-primary/10 text-primary"
              )}>
                {status === "REJECTED" ? (
                  <ShieldAlert className="h-12 w-12" />
                ) : (
                  <Clock className="h-12 w-12 animate-[spin_10s_linear_infinite]" />
                )}
              </div>
              <div className={cn(
                "absolute inset-0 rounded-full blur-2xl -z-0",
                status === "REJECTED" ? "bg-red-500/20" : "bg-primary/20 animate-pulse"
              )} />
              <div className="absolute -right-2 -bottom-2 h-8 w-8 rounded-full bg-background border-4 border-slate-50 flex items-center justify-center z-20">
                <ShieldCheck className="h-4 w-4 text-primary" />
              </div>
            </div>

            <h1 className="text-3xl font-black tracking-tight text-slate-900 mb-4">
              {status === "REJECTED" ? "Application Rejected" : "Entity Under Review"}
            </h1>
            <p className="text-slate-600 font-medium max-w-md mx-auto leading-relaxed">
              {status === "REJECTED" 
                ? "Unfortunately, your company application does not meet our current requirements. Please contact support for details."
                : "We're currently vetting your company's operational capacity and license documentation. This ensures network integrity."
              }
            </p>

            {status !== "REJECTED" && (
              <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                {[
                  { icon: CheckCircle2, title: "Request Sent", status: "Verified", color: "text-green-500" },
                  { icon: Building2, title: "Fleet Vetting", status: "Active", color: "text-primary" },
                  { icon: ShieldCheck, title: "Dashboard Access", status: "Queued", color: "text-slate-300" }
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
            )}

            <div className="mt-12 p-6 bg-slate-50 rounded-3xl border border-slate-100 flex items-start gap-4 text-left">
              <div className="h-10 w-10 rounded-xl bg-background border border-slate-200 flex items-center justify-center text-slate-400 shrink-0 shadow-sm">
                <Mail className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-900">Communication</h4>
                <p className="text-xs text-slate-600 leading-relaxed mt-1">
                  We'll notify you at the registered email address. Please allow <span className="font-bold">48-72 hours</span> for the full background check.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mt-12">
              <Button 
                onClick={() => window.location.reload()} 
                className="flex-1 h-14 rounded-2xl font-black text-lg gap-2 shadow-xl shadow-primary/10"
              >
                <RefreshCw className="h-5 w-5" /> Refresh Review
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
                Admin Support <ExternalLink className="h-3 w-3" />
              </a>
              <div className="h-1 w-1 bg-slate-300 rounded-full" />
              <a href="#" className="hover:text-primary transition-colors flex items-center gap-1">
                Terms of Use <ChevronRight className="h-3 w-3" />
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CompanyAdminReview;
