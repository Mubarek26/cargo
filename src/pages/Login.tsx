import * as React from "react";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const Login: React.FC = () => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-6xl bg-white rounded-lg shadow-md overflow-hidden grid grid-cols-1 md:grid-cols-2 min-h-[520px]">
        <div className="hidden md:block">
          <div className="h-full w-full">
            <img src="/images/logo-DGT-qY52.svg" alt="Login illustration" className="w-full h-full object-cover" />
          </div>
        </div>

        <div className="p-10 md:p-16 flex flex-col justify-center">
          <div className="flex justify-end mb-4">
            <img src="/images/logo-DGT-qY52.svg" alt="Logo" className="h-10 w-auto" />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900">Welcome Back!</h1>
          <p className="mt-3 text-sm text-slate-500">Sign in to manage menus, track and deliver live orders, and keep your account details up to date.</p>

          <form className="mt-8 space-y-4 w-full max-w-lg">
            <div>
              <label className="sr-only">Email</label>
              <Input placeholder="mezid58@gmail.com" type="email" />
            </div>

            <div className="relative">
              <label className="sr-only">Password</label>
              <Input placeholder="Password" type="password" />
              <button type="button" aria-label="toggle password" className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div />
              <Link to="#" className="text-sm text-primary hover:underline">Forgot password?</Link>
            </div>

            <div className="pt-2">
              <Button className="w-full rounded-full h-12" type="submit">Sign In</Button>
            </div>
            <div className="mt-3 text-center text-sm">
              <span className="text-slate-600">Don't have an account? </span>
              <a href="/signup" className="text-primary font-medium hover:underline">Sign up</a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
