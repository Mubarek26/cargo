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
import { 
  Truck, 
  User, 
  MapPin, 
  Phone, 
  Mail, 
  Briefcase, 
  Calendar, 
  CreditCard, 
  FileText, 
  Camera,
  ShieldCheck,
  CheckCircle2,
  ChevronRight,
  ArrowRight,
  Info,
  DollarSign
} from "lucide-react";
import { toast } from "sonner";
import { useDriverApplication } from "@/hooks/use-driver-application";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

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
  const { submitApplication, isLoading } = useDriverApplication();

  const validateEmail = (value: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const token = localStorage.getItem("authToken");
    if (!token) {
      toast.error("Please sign in before submitting your application.");
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
      toast.error("Please fill all required fields and upload all documents.");
      return;
    }

    if (!validateEmail(email.trim())) {
      toast.error("Please provide a valid email address.");
      return;
    }

    try {
      await submitApplication(token, {
        fullName: fullName.trim(),
        contactNumber: contactNumber.trim(),
        email: email.trim(),
        address: address.trim(),
        vehicleType: vehicleType.trim(),
        vehicleRegistrationNumber: vehicleRegistrationNumber.trim(),
        driversLicenseNumber: driversLicenseNumber.trim(),
        licenseExpiryDate: licenseExpiryDate.trim(),
        nationalIdOrPassportFile: nationalIdOrPassportFile!,
        yearsOfExperience: yearsOfExperience.trim(),
        availability: availability.trim(),
        driversLicenseImageFile: driversLicenseImageFile!,
        profilePhotoFile: profilePhotoFile!,
        notes: notes.trim() || undefined,
        vehicleModel: vehicleModel.trim() || undefined,
        vehicleCapacityKg: vehicleCapacityKg.trim() || undefined,
      });

      toast.success("Application submitted successfully!");
      navigate("/driver-application-review");
    } catch (error: any) {
      toast.error(error.message || "Unable to submit the application.");
    }
  };

  const SectionHeading = ({ icon: Icon, title, description }: any) => (
    <div className="flex flex-col gap-1 mb-6 mt-2">
      <div className="flex items-center gap-2 text-primary">
        <Icon className="h-5 w-5" />
        <h3 className="font-bold text-lg tracking-tight">{title}</h3>
      </div>
      <p className="text-xs text-muted-foreground ml-7">{description}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50/50 flex items-center justify-center px-4 py-12 lg:py-20">
      <div className="w-full max-w-[1200px] bg-white rounded-[2rem] shadow-2xl shadow-primary/10 overflow-hidden grid grid-cols-1 lg:grid-cols-5 min-h-[850px] border border-primary/5">
        
        {/* Left Side: Hero & Info */}
        <div className="hidden lg:flex lg:col-span-2 relative overflow-hidden bg-primary p-12 text-primary-foreground flex-col justify-between">
          <div className="absolute inset-0 z-0">
            <img 
              src="/images/driver-hero.png" 
              alt="Driver Application" 
              className="w-full h-full object-cover mix-blend-overlay opacity-40 scale-110" 
            />
            <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/80 to-transparent" />
          </div>

          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-8">
              <div className="h-10 w-10 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/20">
                <Truck className="h-6 w-6" />
              </div>
              <span className="text-xl font-black tracking-tighter uppercase italic">CargoMax</span>
            </div>
            
            <h1 className="text-5xl font-black leading-[1.1] mb-6">Drive with<br/><span className="text-white/70">the Best.</span></h1>
            <p className="text-lg text-primary-foreground/80 font-medium max-w-sm mb-12">
              Join our network of elite drivers and transform the way goods move across the region.
            </p>

            <div className="space-y-6">
              {[
                { icon: ShieldCheck, title: "Verified Security", desc: "Enterprise-grade protection for all your trips." },
                { icon: DollarSign, title: "Quick Payments", desc: "Get paid faster with our automated billing system." },
                { icon: MapPin, title: "Smart Routing", desc: "Proprietary road intelligence for efficient delivery." }
              ].map((feature, i) => (
                <div key={i} className="flex gap-4 items-start bg-white/5 backdrop-blur-md p-4 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors cursor-default group">
                  <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center text-white shrink-0 group-hover:scale-110 transition-transform">
                    <feature.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm">{feature.title}</h4>
                    <p className="text-xs text-white/60">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative z-10 pt-12">
            <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-white/40">
              <div className="h-px flex-1 bg-white/20" />
              Empowering Logistics
              <div className="h-px flex-1 bg-white/20" />
            </div>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="lg:col-span-3 p-8 lg:p-16 h-full overflow-y-auto max-h-[850px] scrollbar-thin scrollbar-thumb-primary/10">
          <div className="flex justify-between items-start mb-10">
            <div>
              <h2 className="text-3xl font-black tracking-tight text-slate-900">Driver Application</h2>
              <p className="text-slate-500 mt-2 font-medium">Complete your profile to start your journey.</p>
            </div>
            <Link to="/login">
              <Button variant="outline" className="rounded-full gap-2 border-primary/10 hover:bg-primary/5 text-primary font-bold px-6">
                Sign In <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          <form onSubmit={handleSubmit} className="space-y-12">
            {/* Personal Info Section */}
            <div className="space-y-6">
              <SectionHeading 
                icon={User} 
                title="Personal Information" 
                description="Help us identify you in our logistics network."
              />
              <div className="grid grid-cols-1 gap-6">
                <div className="space-y-2 group">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground group-focus-within:text-primary transition-colors">Full Name *</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. John Doe"
                      className="pl-10 h-12 bg-slate-50 !text-slate-900 border-none focus:bg-white transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2 group">
                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground group-focus-within:text-primary transition-colors">Contact Number *</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        value={contactNumber}
                        onChange={(e) => setContactNumber(e.target.value)}
                        placeholder="+251 900 000 000"
                        className="pl-10 h-12 bg-slate-50 !text-slate-900 border-none focus:bg-white transition-all"
                      />
                    </div>
                  </div>
                  <div className="space-y-2 group">
                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground group-focus-within:text-primary transition-colors">Email Address *</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="john@example.com"
                        className="pl-10 h-12 bg-slate-50 !text-slate-900 border-none focus:bg-white transition-all"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2 group">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground group-focus-within:text-primary transition-colors">Residential Address *</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Addis Ababa, Ethiopia"
                      className="pl-10 h-12 bg-slate-50 !text-slate-900 border-none focus:bg-white transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Vehicle & Experience Section */}
            <div className="space-y-6 pt-6 border-t border-slate-100">
              <SectionHeading 
                icon={Briefcase} 
                title="Professional Details" 
                description="We need to know what you drive and your expertise."
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2 group">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground group-focus-within:text-primary transition-colors">Vehicle Type *</Label>
                  <Input
                    value={vehicleType}
                    onChange={(e) => setVehicleType(e.target.value)}
                    placeholder="e.g. Heavy Truck, Delivery Van"
                    className="h-12 bg-slate-50 !text-slate-900 border-none focus:bg-white transition-all"
                  />
                </div>
                <div className="space-y-2 group">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground group-focus-within:text-primary transition-colors">Vehicle Reg. Number *</Label>
                  <Input
                    value={vehicleRegistrationNumber}
                    onChange={(e) => setVehicleRegistrationNumber(e.target.value)}
                    placeholder="e.g. AA-12345"
                    className="h-12 bg-slate-50 !text-slate-900 border-none focus:bg-white transition-all uppercase"
                  />
                </div>
                <div className="space-y-2 group">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground group-focus-within:text-primary transition-colors">License Number *</Label>
                  <Input
                    value={driversLicenseNumber}
                    onChange={(e) => setDriversLicenseNumber(e.target.value)}
                    placeholder="e.g. DL-2026-99"
                    className="h-12 bg-slate-50 !text-slate-900 border-none focus:bg-white transition-all uppercase"
                  />
                </div>
                <div className="space-y-2 group">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground group-focus-within:text-primary transition-colors">License Expiry *</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="date"
                      value={licenseExpiryDate}
                      onChange={(e) => setLicenseExpiryDate(e.target.value)}
                      className="pl-10 h-12 bg-slate-50 !text-slate-900 border-none focus:bg-white transition-all"
                    />
                  </div>
                </div>
                <div className="space-y-2 group">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground group-focus-within:text-primary transition-colors">Years of Experience *</Label>
                  <Input
                    type="number"
                    min={0}
                    value={yearsOfExperience}
                    onChange={(e) => setYearsOfExperience(e.target.value)}
                    placeholder="5"
                    className="h-12 bg-slate-50 !text-slate-900 border-none focus:bg-white transition-all"
                  />
                </div>
                <div className="space-y-2 group">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground group-focus-within:text-primary transition-colors">Availability *</Label>
                  <Select value={availability} onValueChange={setAvailability}>
                    <SelectTrigger className="h-12 bg-slate-50 !text-slate-900 border-none focus:bg-white transition-all">
                      <SelectValue placeholder="Select availability" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="full-time">Full-time Professional</SelectItem>
                      <SelectItem value="part-time">Part-time Partner</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Document Upload Section */}
            <div className="space-y-6 pt-6 border-t border-slate-100">
              <SectionHeading 
                icon={FileText} 
                title="Verification Documents" 
                description="Upload clear images of your official documents."
              />
              
              <div className="bg-amber-500/5 border border-amber-500/10 rounded-2xl p-4 mb-6 flex items-start gap-3">
                <Info className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                <p className="text-xs text-amber-700/80 leading-relaxed font-medium">
                  Please ensure all documents are clearly legible and not expired. The maximum file size is 5MB per image.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">National ID or Passport *</Label>
                  <div className="relative group/upload h-40 rounded-3xl border-2 border-dashed border-slate-200 bg-slate-50/50 flex flex-col items-center justify-center gap-2 hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer overflow-hidden">
                    {nationalIdOrPassportFile ? (
                      <div className="flex flex-col items-center p-4">
                        <CheckCircle2 className="h-8 w-8 text-green-500" />
                        <span className="text-xs font-bold mt-2 text-center truncate w-full px-4">{nationalIdOrPassportFile.name}</span>
                        <Button variant="ghost" size="sm" className="mt-2 text-[10px] uppercase font-bold" onClick={(e) => { e.preventDefault(); setNationalIdOrPassportFile(null); }}>Change File</Button>
                      </div>
                    ) : (
                      <>
                        <CreditCard className="h-8 w-8 text-muted-foreground group-hover/upload:text-primary group-hover/upload:scale-110 transition-all" />
                        <span className="text-xs font-bold text-muted-foreground group-hover/upload:text-primary">Click to Upload</span>
                        <span className="text-[10px] text-muted-foreground/60 italic font-medium">JPG, PNG up to 5MB</span>
                      </>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      onChange={(e) => setNationalIdOrPassportFile(e.target.files?.[0] || null)}
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Driver's License *</Label>
                  <div className="relative group/upload h-40 rounded-3xl border-2 border-dashed border-slate-200 bg-slate-50/50 flex flex-col items-center justify-center gap-2 hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer overflow-hidden">
                    {driversLicenseImageFile ? (
                      <div className="flex flex-col items-center p-4">
                        <CheckCircle2 className="h-8 w-8 text-green-500" />
                        <span className="text-xs font-bold mt-2 text-center truncate w-full px-4">{driversLicenseImageFile.name}</span>
                        <Button variant="ghost" size="sm" className="mt-2 text-[10px] uppercase font-bold" onClick={(e) => { e.preventDefault(); setDriversLicenseImageFile(null); }}>Change File</Button>
                      </div>
                    ) : (
                      <>
                        <CreditCard className="h-8 w-8 text-muted-foreground group-hover/upload:text-primary group-hover/upload:scale-110 transition-all" />
                        <span className="text-xs font-bold text-muted-foreground group-hover/upload:text-primary">Click to Upload</span>
                        <span className="text-[10px] text-muted-foreground/60 italic font-medium">JPG, PNG up to 5MB</span>
                      </>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      onChange={(e) => setDriversLicenseImageFile(e.target.files?.[0] || null)}
                    />
                  </div>
                </div>

                <div className="space-y-3 md:col-span-2">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Profile Photo (Selfie) *</Label>
                  <div className="relative group/upload h-40 rounded-3xl border-2 border-dashed border-slate-200 bg-slate-50/50 flex flex-col items-center justify-center gap-2 hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer overflow-hidden">
                    {profilePhotoFile ? (
                      <div className="flex flex-col items-center p-4">
                        <CheckCircle2 className="h-8 w-8 text-green-500" />
                        <span className="text-xs font-bold mt-2 text-center truncate w-full px-4">{profilePhotoFile.name}</span>
                        <Button variant="ghost" size="sm" className="mt-2 text-[10px] uppercase font-bold" onClick={(e) => { e.preventDefault(); setProfilePhotoFile(null); }}>Change File</Button>
                      </div>
                    ) : (
                      <>
                        <Camera className="h-8 w-8 text-muted-foreground group-hover/upload:text-primary group-hover/upload:scale-110 transition-all" />
                        <span className="text-xs font-bold text-muted-foreground group-hover/upload:text-primary">Take a clear photo of your face</span>
                        <span className="text-[10px] text-muted-foreground/60 italic font-medium">Professional photo preferred</span>
                      </>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      onChange={(e) => setProfilePhotoFile(e.target.files?.[0] || null)}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-10">
              <Button type="submit" className="w-full h-14 rounded-2xl text-lg font-black tracking-tight shadow-xl shadow-primary/20 gap-3" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Processing Application...
                  </>
                ) : (
                  <>
                    Submit Application <ChevronRight className="h-5 w-5" />
                  </>
                )}
              </Button>
              <p className="text-center text-[10px] text-muted-foreground mt-4 font-medium px-10">
                By submitting, you agree to our <span className="text-primary cursor-pointer hover:underline">Terms of Service</span> and <span className="text-primary cursor-pointer hover:underline">Privacy Policy</span>.
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DriverApplication;
