import * as React from "react";
import { Link, useLocation } from "react-router-dom";
import { Mail, ArrowRight, Truck, CheckCircle, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function VerifyEmailNotice() {
  const location = useLocation();
  const email = location.state?.email || "your email address";

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="max-w-lg w-full bg-white rounded-[2.5rem] shadow-2xl p-12 text-center border border-slate-100 relative overflow-hidden">
        {/* Top Accent Bar */}
        <div className="absolute top-0 left-0 w-full h-3 bg-gradient-to-r from-primary to-orange-400" />
        
        <div className="flex justify-center mb-10">
          <div className="flex items-center gap-2">
            <div className="bg-primary p-2.5 rounded-2xl shadow-lg shadow-primary/20">
              <Truck className="h-7 w-7 text-white" />
            </div>
            <span className="text-3xl font-black tracking-tight text-slate-900">Cargo<span className="text-primary">Dash</span></span>
          </div>
        </div>

        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="relative mx-auto w-24 h-24">
            <div className="absolute inset-0 bg-orange-100 rounded-full animate-ping opacity-20" />
            <div className="relative bg-orange-50 text-primary rounded-[2rem] h-full w-full flex items-center justify-center border border-orange-100 shadow-inner">
              <Mail className="h-12 w-12" />
            </div>
          </div>

          <div className="space-y-3">
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Check Your Inbox!</h1>
            <p className="text-slate-500 text-lg leading-relaxed">
              We've sent a verification link to <span className="font-bold text-slate-900">{email}</span>.
              Please verify your email to activate your CargoDash account.
            </p>
          </div>

          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 text-left space-y-4">
            <div className="flex gap-3">
              <div className="mt-1 bg-primary/10 p-1 rounded-full">
                <CheckCircle className="h-4 w-4 text-primary" />
              </div>
              <p className="text-sm text-slate-600">Click the link in the email to verify your identity.</p>
            </div>
            <div className="flex gap-3">
              <div className="mt-1 bg-primary/10 p-1 rounded-full">
                <CheckCircle className="h-4 w-4 text-primary" />
              </div>
              <p className="text-sm text-slate-600">Once verified, you'll be able to log in and set up your profile.</p>
            </div>
          </div>

          <div className="pt-4 space-y-4">
            <Button asChild className="w-full h-14 bg-primary hover:opacity-90 text-white rounded-2xl text-lg font-bold shadow-xl shadow-primary/20 group transition-all">
              <Link to="/login">
                Return to Login
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            
            <button className="flex items-center justify-center gap-2 mx-auto text-slate-400 hover:text-primary font-semibold transition-colors text-sm">
              <RefreshCcw className="h-4 w-4" />
              Didn't receive the email? Resend link
            </button>
          </div>
        </div>
      </div>
      
      {/* Decorative Circles */}
      <div className="fixed top-0 left-0 w-full h-full -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] h-[40rem] w-[40rem] bg-orange-50/50 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-20%] left-[-10%] h-[50rem] w-[50rem] bg-orange-50/30 rounded-full blur-[120px]" />
      </div>
    </div>
  );
}
