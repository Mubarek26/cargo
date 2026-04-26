import * as React from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { CheckCircle, XCircle, Loader2, ArrowRight, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { API_BASE_URL } from "@/lib/api";

export default function VerifyEmail() {
  const { token } = useParams();
  const [status, setStatus] = React.useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = React.useState("");

  React.useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("Invalid verification link.");
      return;
    }

    const verify = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/v1/users/verify-email/${token}`);
        const data = await response.json();

        if (response.ok) {
          setStatus("success");
          setMessage("Your email has been verified successfully! You can now log in to your account.");
        } else {
          setStatus("error");
          setMessage(data.message || "Email verification failed. The link may have expired.");
        }
      } catch (err) {
        setStatus("error");
        setMessage("Unable to reach the server. Please try again later.");
      }
    };

    // Small delay for better UX feel
    const timer = setTimeout(verify, 1500);
    return () => clearTimeout(timer);
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="max-w-md w-full bg-white rounded-[2rem] shadow-2xl p-10 text-center border border-slate-100 relative overflow-hidden">
        {/* Subtle Background Pattern */}
        <div className="absolute top-0 left-0 w-full h-2 bg-blue-600" />
        
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-2 rounded-xl">
              <Truck className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-slate-900">Cargo<span className="text-blue-600">Dash</span></span>
          </div>
        </div>
        
        {status === "loading" && (
          <div className="space-y-6 animate-in fade-in zoom-in duration-500">
            <div className="relative">
              <div className="h-20 w-20 border-4 border-slate-100 border-t-blue-600 rounded-full animate-spin mx-auto" />
              <Loader2 className="h-10 w-10 text-blue-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900">Verifying Email</h1>
            <p className="text-slate-500 text-lg">We're confirming your credentials. This won't take long.</p>
          </div>
        )}

        {status === "success" && (
          <div className="space-y-6 animate-in fade-in zoom-in duration-500">
            <div className="h-24 w-24 bg-green-50 text-green-500 rounded-3xl flex items-center justify-center mx-auto border border-green-100 shadow-inner">
              <CheckCircle className="h-12 w-12" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900">Success!</h1>
            <p className="text-slate-500 text-lg leading-relaxed">{message}</p>
            <div className="pt-6">
              <Button asChild className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-lg font-bold shadow-xl shadow-blue-600/20 group transition-all">
                <Link to="/login">
                  Go to Login
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>
          </div>
        )}

        {status === "error" && (
          <div className="space-y-6 animate-in fade-in zoom-in duration-500">
            <div className="h-24 w-24 bg-red-50 text-red-500 rounded-3xl flex items-center justify-center mx-auto border border-red-100 shadow-inner">
              <XCircle className="h-12 w-12" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900">Oops!</h1>
            <p className="text-slate-500 text-lg leading-relaxed">{message}</p>
            <div className="pt-6 space-y-4">
              <Button asChild variant="outline" className="w-full h-14 border-slate-200 hover:bg-slate-50 rounded-2xl text-lg font-bold text-slate-700 transition-all">
                <Link to="/signup">Register Again</Link>
              </Button>
              <div className="flex items-center justify-center gap-2">
                <span className="text-sm text-slate-400">Need help?</span>
                <Link to="/login" className="text-sm text-blue-600 font-bold hover:underline transition-all">
                  Contact Support
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Decorative Elements */}
      <div className="fixed top-0 left-0 w-full h-full -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[10%] left-[5%] h-64 w-64 bg-blue-100/50 rounded-full blur-3xl" />
        <div className="absolute bottom-[10%] right-[5%] h-96 w-96 bg-blue-50/50 rounded-full blur-3xl" />
      </div>
    </div>
  );
}
