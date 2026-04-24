import * as React from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { forgotPassword } from "@/services/authService";
import { Mail, ArrowLeft, Send, Truck, ShieldCheck, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [isSubmitted, setIsSubmitted] = React.useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!email.trim()) {
      toast.error("Please enter your email address.");
      return;
    }

    setIsLoading(true);
    try {
      await forgotPassword(email.trim());
      toast.success("Reset link sent to your email!");
      setIsSubmitted(true);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Something went wrong. Please try again.";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col md:flex-row overflow-hidden">
      {/* Left Side: Branding & Visuals (Matching Login) */}
      <div className="relative hidden lg:flex lg:w-1/2 bg-slate-900 overflow-hidden group">
        <img 
          src="/images/auth_login_bg.png" 
          alt="Logistics Security" 
          className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:scale-105 transition-transform duration-1000 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-slate-900 via-slate-900/60 to-blue-900/20" />
        
        <div className="relative z-10 p-16 flex flex-col justify-end h-full w-full text-white">
          <div className="flex items-center gap-3 mb-8 bg-white/10 backdrop-blur-md w-fit px-4 py-2 rounded-full border border-white/10 animate-pulse">
            <ShieldCheck className="h-5 w-5 text-blue-400" />
            <span className="text-sm font-medium uppercase tracking-wider">Account Recovery</span>
          </div>
          <h2 className="text-5xl font-bold leading-tight mb-6">
            Secure Your <br />
            <span className="text-blue-400 text-6xl">Access</span>
          </h2>
          <p className="text-slate-300 text-lg max-w-md leading-relaxed mb-12">
            Restoring your connection to the world's most advanced logistics network is just a step away.
          </p>
          
          <div className="flex items-center gap-4 border-t border-white/10 pt-8">
            <div className="h-12 w-12 rounded-2xl bg-blue-600/20 flex items-center justify-center border border-blue-500/30">
              <Lock className="h-6 w-6 text-blue-400" />
            </div>
            <div>
              <p className="font-semibold">End-to-End Encryption</p>
              <p className="text-sm text-slate-400">Your security is our top priority.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side: Form Area */}
      <div className="w-full lg:w-1/2 p-8 md:p-12 lg:p-24 flex flex-col justify-center bg-white relative">
        {/* Abstract Background Elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-60" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-slate-50 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 opacity-60" />

        <div className="relative z-10 w-full max-w-md mx-auto">
          {/* Logo Section */}
          <div className="mb-16 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="bg-blue-600 p-2.5 rounded-2xl shadow-lg shadow-blue-600/20">
                <Truck className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-black tracking-tight text-slate-900 italic">Cargo<span className="text-blue-600">Dash</span></span>
            </div>
          </div>

          {!isSubmitted ? (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="mb-10">
                <h1 className="text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">Forgot Password?</h1>
                <p className="text-slate-500 text-lg leading-relaxed">
                  No worries. Enter your registered email address and we'll send you instructions to reset your password.
                </p>
              </div>

              <form className="space-y-8" onSubmit={handleSubmit}>
                <div className="space-y-3">
                  <label className="text-sm font-bold text-slate-700 uppercase tracking-wide ml-1">Work Email</label>
                  <div className="relative group">
                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-all duration-300">
                      <Mail className="h-6 w-6" />
                    </div>
                    <Input
                      className="pl-14 h-16 bg-slate-50 border-slate-100 focus:bg-white focus:ring-4 focus:ring-blue-600/10 rounded-2xl transition-all text-lg shadow-sm border-2"
                      placeholder="alex@company.com"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <Button 
                  className="w-full h-16 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-lg font-black shadow-xl shadow-blue-600/30 group transition-all duration-300 relative overflow-hidden" 
                  type="submit" 
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center gap-3">
                      <span className="h-6 w-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                      Authenticating...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-3">
                      Send Reset Instructions
                      <Send className="h-5 w-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </span>
                  )}
                </Button>
              </form>
            </div>
          ) : (
            <div className="text-center py-8 animate-in zoom-in-95 fade-in duration-500">
              <div className="relative mb-10 inline-block">
                <div className="absolute inset-0 bg-green-500/20 blur-2xl rounded-full scale-150" />
                <div className="relative w-24 h-24 bg-green-100 text-green-600 rounded-3xl flex items-center justify-center mx-auto border-2 border-green-200">
                  <CheckCircle2 className="h-12 w-12" />
                </div>
              </div>
              
              <h2 className="text-3xl font-black text-slate-900 mb-4">Email Dispatched</h2>
              <p className="text-slate-500 text-lg mb-10 leading-relaxed px-4">
                We've sent a secure reset link to <span className="font-bold text-blue-600 underline decoration-blue-600/30 underline-offset-4">{email}</span>. 
                The link will expire in 10 minutes.
              </p>
              
              <Button 
                variant="outline"
                className="w-full h-16 rounded-2xl text-lg font-bold border-2 hover:bg-slate-50 transition-all"
                onClick={() => setIsSubmitted(false)}
              >
                Resend Email
              </Button>
            </div>
          )}

          <div className="mt-12 pt-10 border-t border-slate-100">
            <Link to="/login" className="flex items-center justify-center gap-3 text-slate-500 hover:text-blue-600 font-bold transition-all group">
              <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center group-hover:bg-blue-50 transition-colors">
                <ArrowLeft className="h-5 w-5" />
              </div>
              Return to Login
            </Link>
          </div>
        </div>
        
        {/* Footer info */}
        <div className="absolute bottom-8 left-0 right-0 text-center px-8 text-slate-400 text-xs font-medium uppercase tracking-[0.2em]">
          Powered by CargoDash Unified Security System
        </div>
      </div>
    </div>
  );
};

const Lock = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2.5" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

export default ForgotPassword;
