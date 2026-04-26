import * as React from "react";
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { useSignup } from "@/hooks/use-signup";
import { User, Phone, Mail, Lock, Camera, ArrowRight, Truck, ShieldCheck, Briefcase } from "lucide-react";
import { cn } from "@/lib/utils";

const roles = ["SHIPPER", "VENDOR", "DRIVER", "COMPANY_ADMIN"] as const;
type Role = (typeof roles)[number];

const Signup: React.FC = () => {
  const navigate = useNavigate();
  const { signup, isLoading } = useSignup();

  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [role, setRole] = useState<Role>(roles[0]);

  const validateEmail = (e: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);


  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();

    if (
      !fullName.trim() ||
      !phoneNumber.trim() ||
      !email.trim() ||
      !password ||
      !passwordConfirm
    ) {
      toast({
        title: "Missing fields",
        description: "Please fill all required fields.",
        variant: "destructive",
      });
      return;
    }

    if (!validateEmail(email)) {
      toast({
        title: "Invalid email",
        description: "Please provide a valid email address.",
        variant: "destructive",
      });
      return;
    }

    if (password !== passwordConfirm) {
      toast({
        title: "Password mismatch",
        description: "Passwords do not match.",
        variant: "destructive",
      });
      return;
    }

    try {
      const data = await signup({
        fullName: fullName.trim(),
        phoneNumber: phoneNumber.trim(),
        email: email.trim(),
        password,
        passwordConfirm,
        role,
      });

      const token =
        (data as any)?.token ||
        (data as any)?.accessToken ||
        (data as any)?.data?.token ||
        (data as any)?.data?.accessToken;
      const user = (data as any)?.data?.user || (data as any)?.user;
      const resolvedRole = user?.role || role;

      if (token) {
        localStorage.setItem("authToken", token);
      }

      if (resolvedRole) {
        localStorage.setItem("userRole", resolvedRole);
      }

      toast({
        title: "Account Created",
        description: "Please check your email to verify your account.",
      });
      
      navigate("/verify-email-notice", { state: { email: email.trim() } });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Unable to reach the server. Please try again.";
      toast({
        title: "Signup failed",
        description: message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col md:flex-row">
      <div className="w-full flex flex-col md:flex-row min-h-screen overflow-hidden">
        
        {/* Left Side: Illustration & Branding (Hidden on small screens) */}
        <div className="relative hidden lg:flex lg:w-1/2 bg-slate-900 overflow-hidden group">
          <img 
            src="/images/auth_signup_bg.png" 
            alt="Logistics Terminal" 
            className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
          
          <div className="relative z-10 p-16 flex flex-col justify-end h-full w-full text-white">
            <div className="flex items-center gap-3 mb-8 bg-white/10 backdrop-blur-md w-fit px-4 py-2 rounded-full border border-white/10">
              <ShieldCheck className="h-5 w-5 text-green-400" />
              <span className="text-sm font-medium">Join the Global Network</span>
            </div>
            <h2 className="text-5xl font-bold leading-tight mb-6">
              Connect to <br />
              <span className="text-blue-400">Unlimited Growth</span>
            </h2>
            <p className="text-slate-300 text-lg max-w-md leading-relaxed mb-12">
              The world's most intuitive platform for transporters, vendors, and shippers to collaborate seamlessly.
            </p>
            
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-2xl bg-blue-600/20 border border-blue-600/30 flex items-center justify-center">
                  <Truck className="h-6 w-6 text-blue-400" />
                </div>
                <div>
                  <p className="font-bold text-white">Optimized Routing</p>
                  <p className="text-slate-400 text-sm">Save up to 30% on fuel costs.</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-2xl bg-green-600/20 border border-green-600/30 flex items-center justify-center">
                  <Briefcase className="h-6 w-6 text-green-400" />
                </div>
                <div>
                  <p className="font-bold text-white">Marketplace Access</p>
                  <p className="text-slate-400 text-sm">Find new loads and partners daily.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Signup Form */}
        <div className="w-full lg:w-1/2 p-8 md:p-12 lg:p-16 flex flex-col justify-center bg-white overflow-y-auto">
          <div className="mb-10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="bg-blue-600 p-2 rounded-xl">
                <Truck className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold tracking-tight text-slate-900">Cargo<span className="text-blue-600">Dash</span></span>
            </div>
            <Link to="/login" className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors">
              Already have an account?
            </Link>
          </div>

          <div className="mb-8">
            <h1 className="text-4xl font-bold text-slate-900 mb-3">Get Started</h1>
            <p className="text-slate-500 text-lg">Create your professional account today.</p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 ml-1">Full Name</label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors">
                    <User className="h-5 w-5" />
                  </div>
                  <Input
                    className="pl-12 h-13 bg-slate-50 border-slate-100 focus:bg-white focus:ring-blue-600/20 rounded-2xl transition-all"
                    placeholder="John Doe"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 ml-1">Phone Number</label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors">
                    <Phone className="h-5 w-5" />
                  </div>
                  <Input
                    className="pl-12 h-13 bg-slate-50 border-slate-100 focus:bg-white focus:ring-blue-600/20 rounded-2xl transition-all"
                    placeholder="+251 9xx xxx xxx"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 ml-1">Email Address</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors">
                  <Mail className="h-5 w-5" />
                </div>
                <Input
                  className="pl-12 h-13 bg-slate-50 border-slate-100 focus:bg-white focus:ring-blue-600/20 rounded-2xl transition-all"
                  placeholder="name@company.com"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 ml-1">Password</label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors">
                    <Lock className="h-5 w-5" />
                  </div>
                  <Input
                    className="pl-12 h-13 bg-slate-50 border-slate-100 focus:bg-white focus:ring-blue-600/20 rounded-2xl transition-all"
                    placeholder="••••••••"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 ml-1">Confirm Password</label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors">
                    <Lock className="h-5 w-5" />
                  </div>
                  <Input
                    className="pl-12 h-13 bg-slate-50 border-slate-100 focus:bg-white focus:ring-blue-600/20 rounded-2xl transition-all"
                    placeholder="••••••••"
                    type="password"
                    value={passwordConfirm}
                    onChange={(e) => setPasswordConfirm(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 ml-1">Your Primary Role</label>
              <Select value={role} onValueChange={(val: Role) => setRole(val)}>
                <SelectTrigger className="h-13 bg-slate-50 border-slate-100 focus:bg-white focus:ring-blue-600/20 rounded-2xl transition-all">
                  <SelectValue placeholder="Select your role" />
                </SelectTrigger>
                <SelectContent className="rounded-2xl border-slate-100 shadow-xl">
                  {roles.map((r) => (
                    <SelectItem key={r} value={r} className="rounded-xl my-1 focus:bg-blue-50 focus:text-blue-600 font-medium cursor-pointer">
                      {r.replace(/_/g, ' ')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
                    Creating account...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    Create Account
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;