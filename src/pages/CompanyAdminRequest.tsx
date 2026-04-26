import * as React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Building2, 
  Phone, 
  Mail, 
  Globe, 
  FileText, 
  Car, 
  MapPin, 
  ArrowRight, 
  ChevronRight, 
  ShieldCheck, 
  Layers,
  CheckCircle2,
  Camera,
  Info
} from "lucide-react";
import { toast } from "sonner";
import { useCompanyAdminRequest } from "@/hooks/use-company-admin-request";
import { cn } from "@/lib/utils";

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
  const { submitRequest, isLoading } = useCompanyAdminRequest();

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
      !companyName.trim() ||
      !phoneNumber.trim() ||
      !email.trim() ||
      !businessLicense.trim() ||
      !photoFile ||
      !numberOfCars.trim() ||
      !address.trim() ||
      !description.trim()
    ) {
      toast.error("Please fill all required fields and upload your license photo.");
      return;
    }

    if (!validateEmail(email.trim())) {
      toast.error("Please provide a valid email address.");
      return;
    }

    try {
      await submitRequest(token, {
        companyName: companyName.trim(),
        phoneNumber: phoneNumber.trim(),
        email: email.trim(),
        website: website.trim() || undefined,
        description: description.trim(),
        businessLicense: businessLicense.trim(),
        photoFile: photoFile!,
        address: address.trim(),
        numberOfCars: numberOfCars.trim(),
      });

      toast.success("Company administration request submitted!");
      navigate("/company-admin-review");
    } catch (error: any) {
      toast.error(error.message || "Unable to submit the request.");
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
              src="/images/company-hero.png" 
              alt="Company Access" 
              className="w-full h-full object-cover mix-blend-overlay opacity-40 scale-110" 
            />
            <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/80 to-transparent" />
          </div>

          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-8">
              <div className="h-10 w-10 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/20">
                <Building2 className="h-6 w-6" />
              </div>
              <span className="text-xl font-black tracking-tighter uppercase italic">CargoMax</span>
            </div>
            
            <h1 className="text-5xl font-black leading-[1.1] mb-6">Scale Your<br/><span className="text-white/70">Fleet Ops.</span></h1>
            <p className="text-lg text-primary-foreground/80 font-medium max-w-sm mb-12">
              Get full dashboard access to manage vehicles, drivers, and global shipping routes.
            </p>

            <div className="space-y-6">
              {[
                { icon: ShieldCheck, title: "Verified Control", desc: "Granular permissions and enterprise security for your fleet." },
                { icon: Globe, title: "Route Intelligence", desc: "Advanced geospatial tools to optimize every shipment." },
                { icon: Layers, title: "Fleet Hydration", desc: "Centralized management of vehicles, drivers, and maintenance." }
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
              Fleet Administration
              <div className="h-px flex-1 bg-white/20" />
            </div>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="lg:col-span-3 p-8 lg:p-16 h-full overflow-y-auto max-h-[850px] scrollbar-thin scrollbar-thumb-primary/10">
          <div className="flex justify-between items-start mb-10">
            <div>
              <h2 className="text-3xl font-black tracking-tight text-slate-900">Dashboard Request</h2>
              <p className="text-slate-500 mt-2 font-medium">Empower your logistics company with enterprise tools.</p>
            </div>
            <Link to="/login">
              <Button variant="outline" className="rounded-full gap-2 border-primary/10 hover:bg-primary/5 text-primary font-bold px-6">
                Sign In <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          <form onSubmit={handleSubmit} className="space-y-12">
            {/* Enterprise Info Section */}
            <div className="space-y-6">
              <SectionHeading 
                icon={Building2} 
                title="Entity Information" 
                description="Core details of your transport or logistics company."
              />
              <div className="grid grid-cols-1 gap-6">
                <div className="space-y-2 group">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground group-focus-within:text-primary transition-colors">Company Name *</Label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="e.g. BlueSky Logistics"
                      className="pl-10 h-12 bg-slate-50 !text-slate-900 border-none focus:bg-white transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2 group">
                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground group-focus-within:text-primary transition-colors">Business Phone *</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="+251 900 000 000"
                        className="pl-10 h-12 bg-slate-50 !text-slate-900 border-none focus:bg-white transition-all"
                      />
                    </div>
                  </div>
                  <div className="space-y-2 group">
                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground group-focus-within:text-primary transition-colors">Business Email *</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="admin@bluesky.com"
                        className="pl-10 h-12 bg-slate-50 !text-slate-900 border-none focus:bg-white transition-all"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2 group">
                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground group-focus-within:text-primary transition-colors">Official Website</Label>
                    <div className="relative">
                      <Input
                        value={website}
                        onChange={(e) => setWebsite(e.target.value)}
                        placeholder="https://bluesky.com"
                        className="pl-10 h-12 bg-slate-50 !text-slate-900 border-none focus:bg-white transition-all"
                      />
                    </div>
                  </div>
                  <div className="space-y-2 group">
                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground group-focus-within:text-primary transition-colors">Business License Number *</Label>
                    <Input
                      value={businessLicense}
                      onChange={(e) => setBusinessLicense(e.target.value)}
                      placeholder="e.g. BL-998877"
                      className="h-12 bg-slate-50 !text-slate-900 border-none focus:bg-white transition-all uppercase"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Operational Metrics */}
            <div className="space-y-6 pt-6 border-t border-slate-100">
              <SectionHeading 
                icon={Car} 
                title="Fleet Capacity" 
                description="Help us understand the size of your current operations."
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2 group">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground group-focus-within:text-primary transition-colors">Number of Vehicles *</Label>
                  <div className="relative">
                    <Car className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="number"
                      min={1}
                      value={numberOfCars}
                      onChange={(e) => setNumberOfCars(e.target.value)}
                      placeholder="e.g. 50"
                      className="pl-10 h-12 bg-slate-50 !text-slate-900 border-none focus:bg-white transition-all"
                    />
                  </div>
                </div>
                <div className="space-y-2 group">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground group-focus-within:text-primary transition-colors">Headquarters Address *</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Street, City, Country"
                      className="pl-10 h-12 bg-slate-50 !text-slate-900 border-none focus:bg-white transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Documentation Section */}
            <div className="space-y-6 pt-6 border-t border-slate-100">
              <SectionHeading 
                icon={FileText} 
                title="Legal Documentation" 
                description="Upload an image of your valid business license."
              />
              
              <div className="bg-primary/5 border border-primary/10 rounded-2xl p-4 mb-6 flex items-start gap-3">
                <Info className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <p className="text-xs text-primary/80 leading-relaxed font-medium">
                  We require a high-resolution photo or scan of your business license to verify your entity's legal standing.
                </p>
              </div>

              <div className="space-y-3">
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Business License Photo *</Label>
                <div className="relative group/upload h-48 rounded-3xl border-2 border-dashed border-slate-200 bg-slate-50/50 flex flex-col items-center justify-center gap-2 hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer overflow-hidden">
                  {photoFile ? (
                    <div className="flex flex-col items-center p-4">
                      <CheckCircle2 className="h-10 w-10 text-green-500" />
                      <span className="text-sm font-bold mt-2 text-center truncate w-full px-10">{photoFile.name}</span>
                      <Button variant="ghost" size="sm" className="mt-2 text-xs font-bold uppercase" onClick={(e) => { e.preventDefault(); setPhotoFile(null); }}>Replace File</Button>
                    </div>
                  ) : (
                    <>
                      <Camera className="h-10 w-10 text-muted-foreground group-hover/upload:text-primary group-hover/upload:scale-110 transition-all" />
                      <span className="text-sm font-bold text-muted-foreground group-hover/upload:text-primary">Click to Upload License Image</span>
                      <span className="text-[10px] text-muted-foreground/60 italic font-medium">JPG, PNG up to 10MB</span>
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={(e) => setPhotoFile(e.target.files?.[0] || null)}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2 pt-6">
              <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Company Description *</Label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Tell us about your company's specialty and operational regions..."
                rows={4}
                className="bg-slate-50 !text-slate-900 border-none focus:bg-white transition-all"
              />
            </div>

            <div className="pt-6">
              <Button type="submit" className="w-full h-14 rounded-2xl text-lg font-black tracking-tight shadow-xl shadow-primary/20 gap-3" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Submitting Request...
                  </>
                ) : (
                  <>
                    Submit Administrative Request <ChevronRight className="h-5 w-5" />
                  </>
                )}
              </Button>
              <p className="text-center text-[10px] text-muted-foreground mt-4 font-medium px-10">
                Application review usually takes 24-48 business hours. You will be notified via the email provided.
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CompanyAdminRequest;
