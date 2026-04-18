import * as React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { API_BASE_URL } from "@/lib/api";

const DriverApplication: React.FC = () => {
  const navigate = useNavigate();
  const [fullName, setFullName] = React.useState("");
  const [contactNumber, setContactNumber] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [address, setAddress] = React.useState("");
  const [vehicleType, setVehicleType] = React.useState("");
  const [vehicleRegistrationNumber, setVehicleRegistrationNumber] = React.useState("");
  const [driversLicenseNumber, setDriversLicenseNumber] = React.useState("");
  const [licenseExpiryDate, setLicenseExpiryDate] = React.useState("");
  const [yearsOfExperience, setYearsOfExperience] = React.useState("");
  const [availability, setAvailability] = React.useState("");
  const [vehicleModel, setVehicleModel] = React.useState("");
  const [vehicleCapacityKg, setVehicleCapacityKg] = React.useState("");
  const [notes, setNotes] = React.useState("");
  const [nationalIdOrPassportFile, setNationalIdOrPassportFile] = React.useState<File | null>(null);
  const [driversLicenseImageFile, setDriversLicenseImageFile] = React.useState<File | null>(null);
  const [profilePhotoFile, setProfilePhotoFile] = React.useState<File | null>(null);
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
      !fullName.trim() ||
      !contactNumber.trim() ||
      !email.trim() ||
      !address.trim() ||
      !vehicleType.trim() ||
      !vehicleRegistrationNumber.trim() ||
      !driversLicenseNumber.trim() ||
      !licenseExpiryDate.trim() ||
      !yearsOfExperience.trim() ||
      !availability.trim() ||
      !nationalIdOrPassportFile ||
      !driversLicenseImageFile ||
      !profilePhotoFile
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
      formData.append("fullName", fullName.trim());
      formData.append("contactNumber", contactNumber.trim());
      formData.append("email", email.trim());
      formData.append("address", address.trim());
      formData.append("vehicleType", vehicleType.trim());
      formData.append("vehicleRegistrationNumber", vehicleRegistrationNumber.trim());
      formData.append("driversLicenseNumber", driversLicenseNumber.trim());
      formData.append("licenseExpiryDate", licenseExpiryDate.trim());
      formData.append("nationalIdOrPassportImage", nationalIdOrPassportFile);
      formData.append("nationalIdOrPassport", nationalIdOrPassportFile.name);
      formData.append("yearsOfExperience", yearsOfExperience.trim());
      formData.append("availability", availability.trim());
      formData.append("driversLicenseImage", driversLicenseImageFile);
      formData.append("profilePhoto", profilePhotoFile);

      if (notes.trim()) {
        formData.append("notes", notes.trim());
      }
      if (vehicleModel.trim()) {
        formData.append("vehicleModel", vehicleModel.trim());
      }
      if (vehicleCapacityKg.trim()) {
        formData.append("vehicleCapacityKg", vehicleCapacityKg.trim());
      }

      const response = await fetch(`${API_BASE_URL}/api/v1/private-transporter/apply`, {
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

      setFullName("");
      setContactNumber("");
      setEmail("");
      setAddress("");
      setVehicleType("");
      setVehicleRegistrationNumber("");
      setDriversLicenseNumber("");
      setLicenseExpiryDate("");
      setYearsOfExperience("");
      setAvailability("");
      setVehicleModel("");
      setVehicleCapacityKg("");
      setNotes("");
      setNationalIdOrPassportFile(null);
      setDriversLicenseImageFile(null);
      setProfilePhotoFile(null);
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
            <img src="/images/logo-DGT-qY52.svg" alt="Driver application" className="w-full h-full object-cover" />
          </div>
        </div>

        <div className="p-8 md:p-12 flex flex-col justify-center">
          <div className="flex justify-end mb-4">
            <img src="/images/logo-DGT-qY52.svg" alt="Logo" className="h-10 w-auto" />
          </div>
          <h1 className="text-2xl font-semibold text-slate-900">Driver application</h1>
          <p className="text-sm text-slate-500 mt-2">
            Provide your details and documents. We will review and contact you with next steps.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 grid grid-cols-1 gap-5">
            <div>
              <Label>Full name *</Label>
              <Input
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                placeholder="John Doe"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <Label>Contact number *</Label>
                <Input
                  value={contactNumber}
                  onChange={(event) => setContactNumber(event.target.value)}
                  placeholder="+1 555 555 5555"
                />
              </div>
              <div>
                <Label>Email *</Label>
                <Input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="driver@example.com"
                />
              </div>
            </div>

            <div>
              <Label>Address *</Label>
              <Input
                value={address}
                onChange={(event) => setAddress(event.target.value)}
                placeholder="City, State"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <Label>Vehicle type *</Label>
                <Input
                  value={vehicleType}
                  onChange={(event) => setVehicleType(event.target.value)}
                  placeholder="Truck, Van, Motorcycle"
                />
              </div>
              <div>
                <Label>Vehicle registration number *</Label>
                <Input
                  value={vehicleRegistrationNumber}
                  onChange={(event) => setVehicleRegistrationNumber(event.target.value)}
                  placeholder="ABC-1234"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <Label>Driver's license number *</Label>
                <Input
                  value={driversLicenseNumber}
                  onChange={(event) => setDriversLicenseNumber(event.target.value)}
                  placeholder="DL-2026-0001"
                />
              </div>
              <div>
                <Label>License expiry date *</Label>
                <Input
                  type="date"
                  value={licenseExpiryDate}
                  onChange={(event) => setLicenseExpiryDate(event.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <Label>Years of experience *</Label>
                <Input
                  type="number"
                  min={0}
                  value={yearsOfExperience}
                  onChange={(event) => setYearsOfExperience(event.target.value)}
                  placeholder="3"
                />
              </div>
              <div>
                <Label>Availability *</Label>
                <Select value={availability} onValueChange={setAvailability}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select availability" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full-time">Full-time</SelectItem>
                    <SelectItem value="part-time">Part-time</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <Label>Vehicle model</Label>
                <Input
                  value={vehicleModel}
                  onChange={(event) => setVehicleModel(event.target.value)}
                  placeholder="Isuzu N-Series"
                />
              </div>
              <div>
                <Label>Vehicle capacity (kg)</Label>
                <Input
                  type="number"
                  min={0}
                  value={vehicleCapacityKg}
                  onChange={(event) => setVehicleCapacityKg(event.target.value)}
                  placeholder="2000"
                />
              </div>
            </div>

            <div>
              <Label>National ID or passport (image) *</Label>
              <Input
                type="file"
                accept="image/*"
                onChange={(event) => {
                  const file = event.target.files?.[0] || null;
                  setNationalIdOrPassportFile(file);
                }}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <Label>Driver's license image *</Label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(event) => {
                    const file = event.target.files?.[0] || null;
                    setDriversLicenseImageFile(file);
                  }}
                />
              </div>
              <div>
                <Label>Profile photo *</Label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(event) => {
                    const file = event.target.files?.[0] || null;
                    setProfilePhotoFile(file);
                  }}
                />
              </div>
            </div>

            <div>
              <Label>Notes</Label>
              <Textarea
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                placeholder="Share any additional details"
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

export default DriverApplication;
