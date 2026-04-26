import * as React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Building2, 
  Clock, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowLeft, 
  RefreshCw, 
  Mail, 
  Layers,
  ExternalLink,
  ChevronRight
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const VendorApplicationReview: React.FC = () => {
  const navigate = useNavigate();

  React.useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-slate-50/50 flex items-center justify-center px-6 py-12 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]" />
      </div>

      <div className="w-full max-w-2xl relative z-10">
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
              <Layers className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-2xl font-black tracking-tighter uppercase italic text-slate-900">CargoMax</span>
          </div>
        </div>

        <Card className="border-primary/5 shadow-2xl shadow-primary/5 rounded-[2.5rem] overflow-hidden bg-white/80 backdrop-blur-xl">
          <CardContent className="p-10 lg:p-16 text-center">
            <div className="relative mb-10 inline-block">
              <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center text-primary relative z-10 mx-auto">
                <Building2 className="h-12 w-12 animate-[pulse_3s_ease-in-out_infinite]" />
              </div>
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl animate-pulse -z-0" />
              <div className="absolute -right-2 -bottom-2 h-8 w-8 rounded-full bg-background border-4 border-slate-50 flex items-center justify-center z-20">
                <ShieldCheck className="h-4 w-4 text-primary" />
              </div>
            </div>

            <h1 className="text-3xl font-black tracking-tight text-slate-900 mb-4">Vendor Profile Under Review</h1>
            <p className="text-slate-600 font-medium max-w-md mx-auto leading-relaxed">
              We're processing your <span className="text-primary font-bold">Business Application</span>. Our partnerships team will verify your company profile shortly.
            </p>

            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
              {[
                { icon: CheckCircle2, title: "Submitted", status: "Verified", color: "text-green-500" },
                { icon: Building2, title: "Company Vetting", status: "Processing", color: "text-primary" },
                { icon: ShieldCheck, title: "Network Access", status: "Pending", color: "text-slate-300" }
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
                <h4 className="font-bold text-sm text-slate-900">Next Steps for Vendors</h4>
                <p className="text-xs text-slate-600 leading-relaxed mt-1">
                  Check your inbox for a verification email. We may reach out for additional tax or license documentation. Review time: <span className="font-bold">3-5 days</span>.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mt-12">
              <Button 
                onClick={() => window.location.reload()} 
                className="flex-1 h-14 rounded-2xl font-black text-lg gap-2 shadow-xl shadow-primary/10 bg-primary hover:opacity-90"
              >
                <RefreshCw className="h-5 w-5" /> Sync Status
              </Button>
              <Button 
                onClick={() => navigate("/login")} 
                variant="outline"
                className="flex-1 h-14 rounded-2xl font-black text-lg gap-2 border-slate-200"
              >
                <ArrowLeft className="h-5 w-5" /> Exit to Login
              </Button>
            </div>

            <div className="mt-10 flex items-center justify-center gap-6 text-xs font-bold text-slate-400 uppercase tracking-widest">
              <a href="#" className="hover:text-primary transition-colors flex items-center gap-1">
                Vendor Portal <ExternalLink className="h-3 w-3" />
              </a>
              <div className="h-1 w-1 bg-slate-300 rounded-full" />
              <a href="#" className="hover:text-primary transition-colors flex items-center gap-1">
                Contact Support <ChevronRight className="h-3 w-3" />
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VendorApplicationReview;
