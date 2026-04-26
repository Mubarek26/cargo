import * as React from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { resetPassword } from "@/services/authService";
import { Lock, Eye, EyeOff, ShieldCheck, Truck, ArrowRight, ShieldAlert, CheckCircle2 } from "lucide-react";

const ResetPassword: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [password, setPassword] = React.useState("");
  const [passwordConfirm, setPasswordConfirm] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!password || !passwordConfirm) {
      toast.error("Please fill in all fields.");
      return;
    }

    if (password !== passwordConfirm) {
      toast.error("Passwords do not match.");
      return;
    }

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters long.");
      return;
    }

    if (!token) {
      toast.error("Invalid or expired reset token.");
      return;
    }

    setIsLoading(true);
    try {
      const data = await resetPassword(token, password, passwordConfirm);
      toast.success("Security credentials updated. Welcome back!");
      
      const authToken = (data as any)?.token || (data as any)?.data?.token;
      if (authToken) {
        localStorage.setItem("authToken", authToken);
      }
      
      const user = (data as any)?.data?.user || (data as any)?.user;
      if (user?.role) {
        localStorage.setItem("userRole", user.role);
      }

      navigate("/home");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Security verification failed. Link may be expired.";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col md:flex-row overflow-hidden">
      {/* Left Side: Branding & Security Focus */}
      <div className="relative hidden lg:flex lg:w-1/2 bg-slate-900 overflow-hidden group">
        <img 
          src="/images/auth_login_bg.png" 
          alt="Secure Network" 
          className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:scale-105 transition-transform duration-1000 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-900/80 to-blue-900/40" />
        
        <div className="relative z-10 p-16 flex flex-col justify-end h-full w-full text-white">
          <div className="flex items-center gap-3 mb-8 bg-primary/20 backdrop-blur-md w-fit px-4 py-2 rounded-full border border-primary/20">
            <ShieldAlert className="h-5 w-5 text-primary" />
            <span className="text-sm font-bold uppercase tracking-widest text-orange-100">Security Vault</span>
          </div>
          <h2 className="text-5xl font-extrabold leading-tight mb-6">
            Redefine Your <br />
            <span className="text-primary text-6xl">Credentials</span>
          </h2>
          <p className="text-slate-300 text-lg max-w-md leading-relaxed mb-12">
            Update your password to maintain the highest level of security for your logistics operations and data.
          </p>
          
          <div className="grid grid-cols-2 gap-8 border-t border-white/10 pt-8">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-green-400" />
              <span className="text-sm font-medium text-slate-300">ISO 27001 Certified</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-green-400" />
              <span className="text-sm font-medium text-slate-300">2FA Ready</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side: Form */}
      <div className="w-full lg:w-1/2 p-8 md:p-12 lg:p-24 flex flex-col justify-center bg-white relative">
        {/* Ambient background glow */}
        <div className="absolute top-1/4 right-0 w-80 h-80 bg-blue-100 rounded-full blur-[100px] opacity-40 -z-10" />
        
        <div className="w-full max-w-md mx-auto relative z-10">
          <div className="mb-12 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="bg-primary p-2.5 rounded-2xl shadow-xl shadow-primary/20">
                <Truck className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-black tracking-tighter text-slate-900">Cargo<span className="text-primary">Dash</span></span>
            </div>
          </div>

          <div className="mb-12">
            <h1 className="text-4xl font-black text-slate-900 mb-3 tracking-tight">Set New Password</h1>
            <p className="text-slate-500 text-lg">Create a robust password to regain full access.</p>
          </div>

          <form className="space-y-8" onSubmit={handleSubmit}>
            <div className="space-y-3">
              <label className="text-sm font-bold text-slate-700 uppercase tracking-wider ml-1">New Password</label>
              <div className="relative group">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">
                  <Lock className="h-6 w-6" />
                </div>
                <Input
                  className="pl-14 pr-14 h-16 bg-slate-50 border-slate-200 focus:bg-white focus:ring-4 focus:ring-primary/10 rounded-2xl transition-all text-lg font-medium border-2"
                  placeholder="••••••••"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-900 transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-6 w-6" /> : <Eye className="h-6 w-6" />}
                </button>
              </div>
              <p className="text-xs text-slate-400 ml-1">Minimum 8 characters with letters and numbers.</p>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-bold text-slate-700 uppercase tracking-wider ml-1">Confirm Identity</label>
              <div className="relative group">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <Input
                  className="pl-14 h-16 bg-slate-50 border-slate-200 focus:bg-white focus:ring-4 focus:ring-primary/10 rounded-2xl transition-all text-lg font-medium border-2"
                  placeholder="Re-enter password"
                  type={showPassword ? "text" : "password"}
                  value={passwordConfirm}
                  onChange={(e) => setPasswordConfirm(e.target.value)}
                  required
                />
              </div>
            </div>

            <Button 
              className="w-full h-16 bg-slate-900 hover:bg-primary text-white rounded-2xl text-lg font-black shadow-2xl shadow-slate-900/20 group transition-all duration-300" 
              type="submit" 
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center gap-3">
                  <span className="h-6 w-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                  Updating Vault...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-3">
                  Update Password
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </span>
              )}
            </Button>
          </form>

          <div className="mt-12 pt-8 border-t border-slate-100 text-center">
            <Link to="/login" className="text-sm font-bold text-primary hover:text-orange-700 transition-colors uppercase tracking-widest">
              Return to Login Portal
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
