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
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const validateEmail = (e: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

  const handlePhoto = (file?: File) => {
    if (!file) return;

    if (photoPreview) {
      URL.revokeObjectURL(photoPreview);
    }

    const url = URL.createObjectURL(file);
    setPhoto(file);
    setPhotoPreview(url);
  };

  // cleanup on unmount
  useEffect(() => {
    return () => {
      if (photoPreview) URL.revokeObjectURL(photoPreview);
    };
  }, [photoPreview]);

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
      });
      return;
    }

    if (!validateEmail(email)) {
      toast({
        title: "Invalid email",
        description: "Please provide a valid email address.",
      });
      return;
    }

    if (password !== passwordConfirm) {
      toast({
        title: "Password mismatch",
        description: "Passwords do not match.",
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
        photo,
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
        title: "Success",
        description: "Account created — redirecting...",
      });
      if (resolvedRole === "COMPANY_ADMIN") {
        navigate("/company-admin-request");
      } else if (resolvedRole === "DRIVER") {
        navigate("/driver-application");
      } else if (resolvedRole === "VENDOR") {
        navigate("/vendor-application");
      } else {
        navigate("/home");
      }
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Unable to reach the server. Please try again.";
      toast({
        title: "Signup failed",
        description: message,
      });
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-6xl bg-white rounded-lg shadow-md overflow-hidden grid grid-cols-1 md:grid-cols-2 min-h-[520px]">
        {/* Left side image for desktop */}
        <div className="hidden md:block">
          <div className="h-full w-full">
            <img src="/images/logo-DGT-qY52.svg" alt="Signup illustration" className="w-full h-full object-cover" />
          </div>
        </div>

        {/* Signup form */}
        <div className="p-8 md:p-16 flex flex-col justify-center">
          <div className="flex justify-end mb-4">
            <img src="/images/logo-DGT-qY52.svg" alt="Logo" className="h-10 w-auto" />
          </div>
          <h2 className="text-2xl font-semibold text-slate-900">Create account</h2>
          <p className="text-sm text-slate-500 mt-1">Fill the required fields to sign up.</p>

          <form
            onSubmit={handleSubmit}
            className="mt-6 grid grid-cols-1 gap-4"
          >
            <div>
              <label className="block text-sm font-medium text-slate-700">
                Full name *
              </label>
              <Input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="John Doe"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">
                Phone number *
              </label>
              <Input
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="+1 555 555 5555"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">
                Email *
              </label>
              <Input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                type="email"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Password *
                </label>
                <Input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  placeholder="Password"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Confirm password *
                </label>
                <Input
                  value={passwordConfirm}
                  onChange={(e) => setPasswordConfirm(e.target.value)}
                  type="password"
                  placeholder="Confirm password"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">
                Role (optional)
              </label>
              <Select value={role} onValueChange={(val: Role) => setRole(val)}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((r) => (
                    <SelectItem key={r} value={r}>
                      {r}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">
                Photo (optional)
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  handlePhoto(e.target.files?.[0])
                }
                className="mt-1"
              />
              {photoPreview && (
                <img
                  src={photoPreview}
                  alt="preview"
                  className="mt-2 h-24 w-24 object-cover rounded-md"
                />
              )}
            </div>

            <div className="pt-2">
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Creating account..." : "Sign up"}
              </Button>
            </div>
          </form>
          <div className="mt-6 text-center text-sm">
            <span className="text-slate-600">Already have an account? </span>
            <Link to="/login" className="text-primary font-medium hover:underline">Sign in</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;