import * as React from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useLogin } from "@/hooks/use-login";
import { useLoginApplicationGate } from "@/hooks/use-login-application-gate";
import { Mail, Lock, Eye, EyeOff, ArrowRight, ShieldCheck, Truck } from "lucide-react";
import { cn } from "@/lib/utils";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login, isLoading } = useLogin();
  const { checkApplicationGate } = useLoginApplicationGate();
  const [emailOrPhone, setEmailOrPhone] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!emailOrPhone.trim() || !password) {
      toast.error("Please enter your credentials.");
      return;
    }

    const trimmed = emailOrPhone.trim();
    const isEmail = /@/.test(trimmed);
    const payload = {
      password,
      email: isEmail ? trimmed : undefined,
      phoneNumber: isEmail ? undefined : trimmed,
    };

    try {
      const data = await login(payload);
      const token =
        (data as any)?.token ||
        (data as any)?.accessToken ||
        (data as any)?.data?.token ||
        (data as any)?.data?.accessToken;
      const user = (data as any)?.data?.user || (data as any)?.user;

      if (token) {
        localStorage.setItem("authToken", token);
      }

      if (user?.role) {
        localStorage.setItem("userRole", user.role);
      }

      const wasHandled = await checkApplicationGate(user?.role, token, {
        onApproved: () => {
          toast.success("Welcome back!");
          navigate("/home");
        },
        onCompanyMissing: () => {
          toast.info("Please submit your company application.");
          navigate("/company-admin-request");
        },
        onCompanyReview: () => {
          toast.info("Your application is under review.");
          navigate("/company-admin-review");
        },
        onDriverMissing: () => {
          toast.info("Please submit your driver application.");
          navigate("/driver-application");
        },
        onDriverReview: () => {
          toast.info("Your application is under review.");
          navigate("/driver-application-review");
        },
        onVendorMissing: () => {
          toast.info("Please submit your vendor application.");
          navigate("/vendor-application");
        },
        onVendorReview: () => {
          toast.info("Your application is under review.");
          navigate("/vendor-application-review");
        },
      });

      if (wasHandled) {
        return;
      }

      toast.success("Login successful.");
      navigate("/home");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to reach the server. Please try again.";
      toast.error(message);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col md:flex-row">
      <div className="w-full flex flex-col md:flex-row min-h-screen overflow-hidden">
        
        {/* Left Side: Illustration & Branding */}
        <div className="relative hidden lg:flex lg:w-1/2 bg-slate-900 overflow-hidden group">
          <img 
            src="/images/auth_login_bg.png" 
            alt="Logistics Dashboard" 
            className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
          
          <div className="relative z-10 p-16 flex flex-col justify-end h-full w-full text-white">
            <div className="flex items-center gap-3 mb-8 bg-white/10 backdrop-blur-md w-fit px-4 py-2 rounded-full border border-white/10">
              <ShieldCheck className="h-5 w-5 text-blue-400" />
              <span className="text-sm font-medium">Enterprise Grade Security</span>
            </div>
            <h2 className="text-5xl font-bold leading-tight mb-6">
              Empowering Global <br />
              <span className="text-blue-400">Logistics Networks</span>
            </h2>
            <p className="text-slate-300 text-lg max-w-md leading-relaxed mb-12">
              The all-in-one platform for fleet management, real-time tracking, and marketplace collaboration.
            </p>
            
            <div className="grid grid-cols-2 gap-8 border-t border-white/10 pt-8">
              <div>
                <p className="text-2xl font-bold text-white">2.5k+</p>
                <p className="text-slate-400 text-sm">Active Carriers</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-white">99.9%</p>
                <p className="text-slate-400 text-sm">Uptime SLA</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="w-full lg:w-1/2 p-8 md:p-12 lg:p-20 flex flex-col justify-center bg-white">
          <div className="mb-12 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="bg-blue-600 p-2 rounded-xl">
                <Truck className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold tracking-tight text-slate-900">Cargo<span className="text-blue-600">Dash</span></span>
            </div>
            <Link to="/signup" className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors">
              Create an account
            </Link>
          </div>

          <div className="mb-10">
            <h1 className="text-4xl font-bold text-slate-900 mb-3">Welcome Back</h1>
            <p className="text-slate-500 text-lg">Enter your credentials to access your dashboard.</p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 ml-1">Email or Phone</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors">
                  <Mail className="h-5 w-5" />
                </div>
                <Input
                  className="pl-12 h-14 bg-slate-50 border-slate-100 focus:bg-white focus:ring-blue-600/20 rounded-2xl transition-all text-lg"
                  placeholder="name@company.com"
                  type="text"
                  value={emailOrPhone}
                  onChange={(e) => setEmailOrPhone(e.target.value)}
                  autoComplete="username"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between ml-1">
                <label className="text-sm font-semibold text-slate-700">Password</label>
                <Link to="/forgot-password" name="forgot-password-link" className="text-xs font-semibold text-blue-600 hover:underline">Forgot Password?</Link>
              </div>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors">
                  <Lock className="h-5 w-5" />
                </div>
                <Input
                  className="pl-12 pr-12 h-14 bg-slate-50 border-slate-100 focus:bg-white focus:ring-blue-600/20 rounded-2xl transition-all text-lg"
                  placeholder="••••••••"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div className="pt-4">
              <Button 
                className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-lg font-bold shadow-lg shadow-blue-600/20 group transition-all" 
                type="submit" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Signing In...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    Sign In
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                )}
              </Button>
            </div>
          </form>

          <div className="mt-12 pt-8 border-t border-slate-100 flex items-center justify-center gap-6">
            <div className="flex -space-x-3 overflow-hidden">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="inline-block h-8 w-8 rounded-full ring-2 ring-white bg-slate-200" />
              ))}
            </div>
            <p className="text-sm text-slate-500">Joined by <span className="font-bold text-slate-900">10,000+</span> professionals worldwide.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
