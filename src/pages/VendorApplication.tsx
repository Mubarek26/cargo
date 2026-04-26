import * as React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Building2, 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Briefcase, 
  FileText, 
  Globe, 
  BarChart3, 
  ShieldCheck, 
  ArrowRight, 
  ChevronRight,
  CreditCard,
  Camera,
  CheckCircle2,
  Info,
  Layers
} from "lucide-react";
import { toast } from "sonner";
import { API_BASE_URL } from "@/lib/api";
import { cn } from "@/lib/utils";

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
      toast.error("Please sign in before submitting your application.");
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
      toast.error("Please fill all required fields and upload all documents.");
      return;
    }

    if (!validateEmail(email.trim())) {
      toast.error("Please provide a valid email address.");
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
        throw new Error(data?.message || "Unable to submit the application.");
      }

      toast.success("Vendor application submitted successfully!");
      navigate("/vendor-application-review");
    } catch (error: any) {
      toast.error(error.message || "Unable to submit the application.");
    } finally {
      setIsSubmitting(false);
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
              src="/images/vendor-hero.png" 
              alt="Vendor Application" 
              className="w-full h-full object-cover mix-blend-overlay opacity-40 scale-110" 
            />
            <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/80 to-transparent" />
          </div>

          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-8">
              <div className="h-10 w-10 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/20">
                <Layers className="h-6 w-6" />
              </div>
              <span className="text-xl font-black tracking-tighter uppercase italic">CargoMax</span>
            </div>
            
            <h1 className="text-5xl font-black leading-[1.1] mb-6">Partner with<br/><span className="text-white/70">Efficiency.</span></h1>
            <p className="text-lg text-primary-foreground/80 font-medium max-w-sm mb-12">
              Expand your reach and streamline your logistics as a verified CargoMax vendor.
            </p>

            <div className="space-y-6">
              {[
                { icon: BarChart3, title: "Market Growth", desc: "Access a massive pool of consistent shipping demands." },
                { icon: ShieldCheck, title: "Secure Contracts", desc: "Digital, transparent, and legally-binding agreements." },
                { icon: Globe, title: "Global Standards", desc: "Adopt international best practices in cargo management." }
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
              Vendor Network
              <div className="h-px flex-1 bg-white/20" />
            </div>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="lg:col-span-3 p-8 lg:p-16 h-full overflow-y-auto max-h-[850px] scrollbar-thin scrollbar-thumb-primary/10">
          <div className="flex justify-between items-start mb-10">
            <div>
              <h2 className="text-3xl font-black tracking-tight text-slate-900">Vendor Application</h2>
              <p className="text-slate-500 mt-2 font-medium">Join our ecosystem of logistical excellence.</p>
            </div>
            <Link to="/login">
              <Button variant="outline" className="rounded-full gap-2 border-primary/10 hover:bg-primary/5 text-primary font-bold px-6">
                Sign In <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          <form onSubmit={handleSubmit} className="space-y-12">
            {/* Company Info Section */}
            <div className="space-y-6">
              <SectionHeading 
                icon={Building2} 
                title="Company Information" 
                description="General details about your business entity."
              />
              <div className="grid grid-cols-1 gap-6">
                <div className="space-y-2 group">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground group-focus-within:text-primary transition-colors">Company Name *</Label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="e.g. Acme Supplies Ltd."
                      className="pl-10 h-12 bg-slate-50 !text-slate-900 border-none focus:bg-white transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2 group">
                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground group-focus-within:text-primary transition-colors">Contact Name *</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        placeholder="Authorized representative"
                        className="pl-10 h-12 bg-slate-50 !text-slate-900 border-none focus:bg-white transition-all"
                      />
                    </div>
                  </div>
                  <div className="space-y-2 group">
                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground group-focus-within:text-primary transition-colors">Contact Number *</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        value={contactNumber}
                        onChange={(e) => setContactNumber(e.target.value)}
                        placeholder="+251 912 345 678"
                        className="pl-10 h-12 bg-slate-50 !text-slate-900 border-none focus:bg-white transition-all"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2 group">
                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground group-focus-within:text-primary transition-colors">Business Email *</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="vendor@company.com"
                        className="pl-10 h-12 bg-slate-50 !text-slate-900 border-none focus:bg-white transition-all"
                      />
                    </div>
                  </div>
                  <div className="space-y-2 group">
                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground group-focus-within:text-primary transition-colors">Website</Label>
                    <div className="relative">
                      <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        value={website}
                        onChange={(e) => setWebsite(e.target.value)}
                        placeholder="https://company.com"
                        className="pl-10 h-12 bg-slate-50 !text-slate-900 border-none focus:bg-white transition-all"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2 group">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground group-focus-within:text-primary transition-colors">Business Address *</Label>
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

            {/* Professional Details Section */}
            <div className="space-y-6 pt-6 border-t border-slate-100">
              <SectionHeading 
                icon={Briefcase} 
                title="Business Metrics" 
                description="Information about your operations and legitimacy."
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2 group">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground group-focus-within:text-primary transition-colors">Business Type *</Label>
                  <Input
                    value={businessType}
                    onChange={(e) => setBusinessType(e.target.value)}
                    placeholder="e.g. Wholesale, Manufacturer"
                    className="h-12 bg-slate-50 !text-slate-900 border-none focus:bg-white transition-all"
                  />
                </div>
                <div className="space-y-2 group">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground group-focus-within:text-primary transition-colors">Registration Number *</Label>
                  <Input
                    value={businessRegistrationNumber}
                    onChange={(e) => setBusinessRegistrationNumber(e.target.value)}
                    placeholder="e.g. REG-123456"
                    className="h-12 bg-slate-50 !text-slate-900 border-none focus:bg-white transition-all uppercase"
                  />
                </div>
                <div className="space-y-2 group">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground group-focus-within:text-primary transition-colors">Tax ID / TIN *</Label>
                  <Input
                    value={taxIdNumber}
                    onChange={(e) => setTaxIdNumber(e.target.value)}
                    placeholder="e.g. TIN-998877"
                    className="h-12 bg-slate-50 !text-slate-900 border-none focus:bg-white transition-all uppercase"
                  />
                </div>
                <div className="space-y-2 group">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground group-focus-within:text-primary transition-colors">Years in Business *</Label>
                  <Input
                    type="number"
                    min={0}
                    value={yearsInBusiness}
                    onChange={(e) => setYearsInBusiness(e.target.value)}
                    placeholder="3"
                    className="h-12 bg-slate-50 !text-slate-900 border-none focus:bg-white transition-all"
                  />
                </div>
                <div className="space-y-2 group md:col-span-2">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground group-focus-within:text-primary transition-colors">Expected Monthly Orders *</Label>
                  <div className="relative">
                    <BarChart3 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="number"
                      min={0}
                      value={expectedMonthlyOrders}
                      onChange={(e) => setExpectedMonthlyOrders(e.target.value)}
                      placeholder="Estimated monthly shipping volume"
                      className="pl-10 h-12 bg-slate-50 !text-slate-900 border-none focus:bg-white transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Document Upload Section */}
            <div className="space-y-6 pt-6 border-t border-slate-100">
              <SectionHeading 
                icon={FileText} 
                title="Business Documents" 
                description="Upload verification files for company vetting."
              />
              
              <div className="bg-blue-500/5 border border-blue-500/10 rounded-2xl p-4 mb-6 flex items-start gap-3">
                <Info className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
                <p className="text-xs text-blue-700/80 leading-relaxed font-medium">
                  Upload high-quality scans of your business license and tax certificates. All files must be in JPG or PNG format.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Business License *</Label>
                  <div className="relative group/upload h-40 rounded-3xl border-2 border-dashed border-slate-200 bg-slate-50/50 flex flex-col items-center justify-center gap-2 hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer overflow-hidden">
                    {businessLicenseImageFile ? (
                      <div className="flex flex-col items-center p-4">
                        <CheckCircle2 className="h-8 w-8 text-green-500" />
                        <span className="text-xs font-bold mt-2 text-center truncate w-full px-4">{businessLicenseImageFile.name}</span>
                        <Button variant="ghost" size="sm" className="mt-2 text-[10px] uppercase font-bold" onClick={(e) => { e.preventDefault(); setBusinessLicenseImageFile(null); }}>Change</Button>
                      </div>
                    ) : (
                      <>
                        <FileText className="h-8 w-8 text-muted-foreground group-hover/upload:text-primary group-hover/upload:scale-110 transition-all" />
                        <span className="text-xs font-bold text-muted-foreground group-hover/upload:text-primary">Official License Image</span>
                        <span className="text-[10px] text-muted-foreground/60 italic font-medium">JPG, PNG up to 5MB</span>
                      </>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      onChange={(e) => setBusinessLicenseImageFile(e.target.files?.[0] || null)}
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Tax ID Certificate *</Label>
                  <div className="relative group/upload h-40 rounded-3xl border-2 border-dashed border-slate-200 bg-slate-50/50 flex flex-col items-center justify-center gap-2 hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer overflow-hidden">
                    {taxIdImageFile ? (
                      <div className="flex flex-col items-center p-4">
                        <CheckCircle2 className="h-8 w-8 text-green-500" />
                        <span className="text-xs font-bold mt-2 text-center truncate w-full px-4">{taxIdImageFile.name}</span>
                        <Button variant="ghost" size="sm" className="mt-2 text-[10px] uppercase font-bold" onClick={(e) => { e.preventDefault(); setTaxIdImageFile(null); }}>Change</Button>
                      </div>
                    ) : (
                      <>
                        <CreditCard className="h-8 w-8 text-muted-foreground group-hover/upload:text-primary group-hover/upload:scale-110 transition-all" />
                        <span className="text-xs font-bold text-muted-foreground group-hover/upload:text-primary">TIN / VAT Certificate</span>
                        <span className="text-[10px] text-muted-foreground/60 italic font-medium">JPG, PNG up to 5MB</span>
                      </>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      onChange={(e) => setTaxIdImageFile(e.target.files?.[0] || null)}
                    />
                  </div>
                </div>

                <div className="space-y-3 md:col-span-2">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Company Profile Image *</Label>
                  <div className="relative group/upload h-40 rounded-3xl border-2 border-dashed border-slate-200 bg-slate-50/50 flex flex-col items-center justify-center gap-2 hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer overflow-hidden">
                    {companyProfileImageFile ? (
                      <div className="flex flex-col items-center p-4">
                        <CheckCircle2 className="h-8 w-8 text-green-500" />
                        <span className="text-xs font-bold mt-2 text-center truncate w-full px-4">{companyProfileImageFile.name}</span>
                        <Button variant="ghost" size="sm" className="mt-2 text-[10px] uppercase font-bold" onClick={(e) => { e.preventDefault(); setCompanyProfileImageFile(null); }}>Change</Button>
                      </div>
                    ) : (
                      <>
                        <Camera className="h-8 w-8 text-muted-foreground group-hover/upload:text-primary group-hover/upload:scale-110 transition-all" />
                        <span className="text-xs font-bold text-muted-foreground group-hover/upload:text-primary">Main Business Photo or Logo</span>
                        <span className="text-[10px] text-muted-foreground/60 italic font-medium">High resolution preferred</span>
                      </>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      onChange={(e) => setCompanyProfileImageFile(e.target.files?.[0] || null)}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2 pt-6">
              <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Additional Notes</Label>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Share any specific logistics needs or company background..."
                rows={4}
                className="bg-slate-50 !text-slate-900 border-none focus:bg-white transition-all"
              />
            </div>

            <div className="pt-6">
              <Button type="submit" className="w-full h-14 rounded-2xl text-lg font-black tracking-tight shadow-xl shadow-primary/20 gap-3" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Submitting Application...
                  </>
                ) : (
                  <>
                    Apply to Join Network <ChevronRight className="h-5 w-5" />
                  </>
                )}
              </Button>
              <p className="text-center text-[10px] text-muted-foreground mt-4 font-medium px-10">
                A CargoMax representative will contact you via email after reviewing your documentation.
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default VendorApplication;
