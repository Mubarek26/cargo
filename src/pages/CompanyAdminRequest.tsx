import * as React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { API_BASE_URL } from "@/lib/api";

const CompanyAdminRequest: React.FC = () => {
  const navigate = useNavigate();
  const [companyName, setCompanyName] = React.useState("");
  const [phoneNumber, setPhoneNumber] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [website, setWebsite] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [businessLicense, setBusinessLicense] = React.useState("");
  const [photoFile, setPhotoFile] = React.useState<File | null>(null);
  const [numberOfCars, setNumberOfCars] = React.useState("");
  const [address, setAddress] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const validateEmail = (value: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const token = localStorage.getItem("authToken");
    if (!token) {
      toast({
        title: "Login required",
        description: "Please sign in before submitting your application.",
      });
      navigate("/login");
      return;
    }

    if (
      !companyName.trim() ||
      !phoneNumber.trim() ||
      !email.trim() ||
      !businessLicense.trim() ||
      !photoFile ||
      !numberOfCars.trim() ||
      !address.trim() ||
      !description.trim()
    ) {
      toast({
        title: "Missing fields",
        description: "Please fill all required fields.",
      });
      return;
    }

    if (!validateEmail(email.trim())) {
      toast({
        title: "Invalid email",
        description: "Please provide a valid email address.",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("companyName", companyName.trim());
      formData.append("phoneNumber", phoneNumber.trim());
      formData.append("email", email.trim());
      if (website.trim()) {
        formData.append("website", website.trim());
      }
      formData.append("description", description.trim());
      formData.append("businessLicense", businessLicense.trim());
      formData.append("photo", photoFile);
      formData.append("address", address.trim());
      formData.append("numberOfCars", numberOfCars.trim());

      const response = await fetch(`${API_BASE_URL}/api/v1/company`, {
        method: "POST",
        credentials: "include",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        const message =
          (data && typeof data === "object" && "message" in data && data.message) ||
          "Unable to submit the request. Please try again.";
        throw new Error(String(message));
      }

      toast({
        title: "Application submitted",
        description: "We will review your request and notify you by email.",
      });

      setCompanyName("");
      setPhoneNumber("");
      setEmail("");
      setWebsite("");
      setDescription("");
      setBusinessLicense("");
      setPhotoFile(null);
      setNumberOfCars("");
      setAddress("");
      navigate("/company-admin-review");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Unable to submit the request. Please try again.";
      toast({
        title: "Submission failed",
        description: message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-6xl bg-white rounded-lg shadow-md overflow-hidden grid grid-cols-1 md:grid-cols-2 min-h-[640px]">
        <div className="hidden md:block">
          <div className="h-full w-full">
            <img src="/images/logo-DGT-qY52.svg" alt="Company access" className="w-full h-full object-cover" />
          </div>
        </div>

        <div className="p-8 md:p-12 flex flex-col justify-center">
          <div className="flex justify-end mb-4">
            <img src="/images/logo-DGT-qY52.svg" alt="Logo" className="h-10 w-auto" />
          </div>
          <h1 className="text-2xl font-semibold text-slate-900">Request dashboard access</h1>
          <p className="text-sm text-slate-500 mt-2">
            Tell us about your company. We will review your application and notify you once it is approved.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 grid grid-cols-1 gap-5">
            <div>
              <Label>Company name *</Label>
              <Input
                value={companyName}
                onChange={(event) => setCompanyName(event.target.value)}
                placeholder="FastMove Logistics"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <Label>Phone number *</Label>
                <Input
                  value={phoneNumber}
                  onChange={(event) => setPhoneNumber(event.target.value)}
                  placeholder="+60123456789"
                />
              </div>
              <div>
                <Label>Email *</Label>
                <Input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="contact@fastmove.com"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <Label>Website</Label>
                <Input
                  value={website}
                  onChange={(event) => setWebsite(event.target.value)}
                  placeholder="https://fastmove.com"
                />
              </div>
              <div>
                <Label>Business license number *</Label>
                <Input
                  value={businessLicense}
                  onChange={(event) => setBusinessLicense(event.target.value)}
                  placeholder="BL-2026-0001"
                />
              </div>
            </div>

            <div>
              <Label>Business license photo *</Label>
              <Input
                type="file"
                accept="image/*"
                onChange={(event) => {
                  const file = event.target.files?.[0] || null;
                  setPhotoFile(file);
                }}
              />
            </div>

            <div>
              <Label>Number of cars *</Label>
              <Input
                type="number"
                min={1}
                value={numberOfCars}
                onChange={(event) => setNumberOfCars(event.target.value)}
                placeholder="25"
              />
            </div>

            <div>
              <Label>Address *</Label>
              <Input
                value={address}
                onChange={(event) => setAddress(event.target.value)}
                placeholder="Kuala Lumpur, Malaysia"
              />
            </div>

            <div>
              <Label>Company description *</Label>
              <Textarea
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Regional transport and logistics company"
                rows={4}
              />
            </div>

            <div className="pt-2">
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit request"}
              </Button>
            </div>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-slate-600">Already approved? </span>
            <Link to="/login" className="text-primary font-medium hover:underline">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyAdminRequest;
