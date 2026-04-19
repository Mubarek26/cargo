import * as React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { API_BASE_URL } from "@/lib/api";

const VendorApplication: React.FC = () => {
  const navigate = useNavigate();
  const [companyName, setCompanyName] = React.useState("");
  const [contactName, setContactName] = React.useState("");
  const [contactNumber, setContactNumber] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [address, setAddress] = React.useState("");
  const [businessType, setBusinessType] = React.useState("");
  const [businessRegistrationNumber, setBusinessRegistrationNumber] = React.useState("");
  const [taxIdNumber, setTaxIdNumber] = React.useState("");
  const [yearsInBusiness, setYearsInBusiness] = React.useState("");
  const [website, setWebsite] = React.useState("");
  const [expectedMonthlyOrders, setExpectedMonthlyOrders] = React.useState("");
  const [notes, setNotes] = React.useState("");
  const [businessLicenseImageFile, setBusinessLicenseImageFile] = React.useState<File | null>(null);
  const [taxIdImageFile, setTaxIdImageFile] = React.useState<File | null>(null);
  const [companyProfileImageFile, setCompanyProfileImageFile] = React.useState<File | null>(null);
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
      !contactName.trim() ||
      !contactNumber.trim() ||
      !email.trim() ||
      !address.trim() ||
      !businessType.trim() ||
      !businessRegistrationNumber.trim() ||
      !taxIdNumber.trim() ||
      !yearsInBusiness.trim() ||
      !expectedMonthlyOrders.trim() ||
      !businessLicenseImageFile ||
      !taxIdImageFile ||
      !companyProfileImageFile
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
      formData.append("contactName", contactName.trim());
      formData.append("contactNumber", contactNumber.trim());
      formData.append("email", email.trim());
      formData.append("address", address.trim());
      formData.append("businessType", businessType.trim());
      formData.append("businessRegistrationNumber", businessRegistrationNumber.trim());
      formData.append("taxIdNumber", taxIdNumber.trim());
      formData.append("yearsInBusiness", yearsInBusiness.trim());
      if (website.trim()) {
        formData.append("website", website.trim());
      }
      formData.append("expectedMonthlyOrders", expectedMonthlyOrders.trim());
      if (notes.trim()) {
        formData.append("notes", notes.trim());
      }
      formData.append("businessLicenseImage", businessLicenseImageFile);
      formData.append("taxIdImage", taxIdImageFile);
      formData.append("companyProfileImage", companyProfileImageFile);

      const response = await fetch(`${API_BASE_URL}/api/v1/vendor/apply`, {
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
          "Unable to submit the application. Please try again.";
        throw new Error(String(message));
      }

      toast({
        title: "Application submitted",
        description: "We will review your application and notify you soon.",
      });

      setCompanyName("");
      setContactName("");
      setContactNumber("");
      setEmail("");
      setAddress("");
      setBusinessType("");
      setBusinessRegistrationNumber("");
      setTaxIdNumber("");
      setYearsInBusiness("");
      setWebsite("");
      setExpectedMonthlyOrders("");
      setNotes("");
      setBusinessLicenseImageFile(null);
      setTaxIdImageFile(null);
      setCompanyProfileImageFile(null);
      navigate("/vendor-application-review");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Unable to submit the application. Please try again.";
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
      <div className="w-full max-w-6xl bg-white rounded-lg shadow-md overflow-hidden grid grid-cols-1 md:grid-cols-2 min-h-[760px]">
        <div className="hidden md:block">
          <div className="h-full w-full">
            <img src="/images/logo-DGT-qY52.svg" alt="Vendor application" className="w-full h-full object-cover" />
          </div>
        </div>

        <div className="p-8 md:p-12 flex flex-col justify-center">
          <div className="flex justify-end mb-4">
            <img src="/images/logo-DGT-qY52.svg" alt="Logo" className="h-10 w-auto" />
          </div>
          <h1 className="text-2xl font-semibold text-slate-900">Vendor application</h1>
          <p className="text-sm text-slate-500 mt-2">
            Share your company details so we can review your vendor application.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 grid grid-cols-1 gap-5">
            <div>
              <Label>Company name *</Label>
              <Input
                value={companyName}
                onChange={(event) => setCompanyName(event.target.value)}
                placeholder="Acme Supplies"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <Label>Contact name *</Label>
                <Input
                  value={contactName}
                  onChange={(event) => setContactName(event.target.value)}
                  placeholder="Sara Ahmed"
                />
              </div>
              <div>
                <Label>Contact number *</Label>
                <Input
                  value={contactNumber}
                  onChange={(event) => setContactNumber(event.target.value)}
                  placeholder="+60123456789"
                />
              </div>
            </div>

            <div>
              <Label>Email *</Label>
              <Input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="vendor@acme.com"
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <Label>Business type *</Label>
                <Input
                  value={businessType}
                  onChange={(event) => setBusinessType(event.target.value)}
                  placeholder="Wholesale"
                />
              </div>
              <div>
                <Label>Business registration number *</Label>
                <Input
                  value={businessRegistrationNumber}
                  onChange={(event) => setBusinessRegistrationNumber(event.target.value)}
                  placeholder="BRN-2026-0001"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <Label>Tax ID number *</Label>
                <Input
                  value={taxIdNumber}
                  onChange={(event) => setTaxIdNumber(event.target.value)}
                  placeholder="TAX-123456"
                />
              </div>
              <div>
                <Label>Years in business *</Label>
                <Input
                  type="number"
                  min={0}
                  value={yearsInBusiness}
                  onChange={(event) => setYearsInBusiness(event.target.value)}
                  placeholder="5"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <Label>Website</Label>
                <Input
                  value={website}
                  onChange={(event) => setWebsite(event.target.value)}
                  placeholder="https://acme.com"
                />
              </div>
              <div>
                <Label>Expected monthly orders *</Label>
                <Input
                  type="number"
                  min={0}
                  value={expectedMonthlyOrders}
                  onChange={(event) => setExpectedMonthlyOrders(event.target.value)}
                  placeholder="120"
                />
              </div>
            </div>

            <div>
              <Label>Business license image *</Label>
              <Input
                type="file"
                accept="image/*"
                onChange={(event) => {
                  const file = event.target.files?.[0] || null;
                  setBusinessLicenseImageFile(file);
                }}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <Label>Tax ID image *</Label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(event) => {
                    const file = event.target.files?.[0] || null;
                    setTaxIdImageFile(file);
                  }}
                />
              </div>
              <div>
                <Label>Company profile image *</Label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(event) => {
                    const file = event.target.files?.[0] || null;
                    setCompanyProfileImageFile(file);
                  }}
                />
              </div>
            </div>

            <div>
              <Label>Notes</Label>
              <Textarea
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                placeholder="We ship daily in KL area"
                rows={4}
              />
            </div>

            <div className="pt-2">
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit application"}
              </Button>
            </div>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-slate-600">Already applied? </span>
            <Link to="/login" className="text-primary font-medium hover:underline">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorApplication;
