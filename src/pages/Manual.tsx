import * as React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  FileText, 
  Download, 
  ArrowLeft, 
  Building2, 
  Truck, 
  Users, 
  ShieldCheck, 
  Info,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Gavel,
  Mail,
  Phone,
  ArrowRight,
  Clock,
  UserCheck,
  Globe
} from "lucide-react";

const Manual: React.FC = () => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 print:bg-white print:py-0 print:px-0">
      <div className="max-w-4xl mx-auto">
        {/* Header / Navigation */}
        <div className="mb-8 flex items-center justify-between print:hidden">
          <Link to="/login" className="flex items-center gap-2 text-slate-500 hover:text-primary transition-colors font-medium">
            <ArrowLeft className="h-4 w-4" />
            Back to Login
          </Link>
          <Button onClick={handlePrint} className="gap-2 rounded-xl shadow-lg shadow-primary/20">
            <Download className="h-4 w-4" />
            Download PDF
          </Button>
        </div>

        {/* Manual Content */}
        <article className="bg-white shadow-2xl shadow-slate-200/80 rounded-[2.5rem] overflow-hidden border border-slate-100 print:shadow-none print:border-none print:rounded-none">
          {/* Cover Section */}
          <div className="bg-slate-950 text-white p-12 lg:p-24 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full -mr-48 -mt-48 blur-3xl" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/5 rounded-full -ml-48 -mb-48 blur-3xl" />
            
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-10">
                <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/10">
                  <Building2 className="h-8 w-8 text-primary" />
                </div>
                <span className="text-3xl font-black tracking-tighter">CargoMax<span className="text-primary text-gradient">.</span></span>
              </div>
              
              <h1 className="text-5xl lg:text-7xl font-black mb-8 leading-[1.1] tracking-tight">
                Operational <br />
                <span className="text-primary text-gradient">Manual 2026</span>
              </h1>
              <p className="text-slate-400 text-xl max-w-2xl leading-relaxed font-light">
                The official operational framework and compliance guidelines for Shippers, 
                Carriers, and Logistics Partners within the CargoMax Company System.
              </p>
              
              <div className="mt-14 flex flex-wrap gap-8 text-sm font-semibold text-slate-400">
                <span className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-primary" />
                  Version 4.2.0-STABLE
                </span>
                <span className="flex items-center gap-3">
                  <ShieldCheck className="h-5 w-5 text-green-400" />
                  Enterprise Certified
                </span>
              </div>
            </div>
          </div>

          <div className="p-8 lg:p-20 space-y-24">
            
            {/* Section 1: Strategic Overview */}
            <section id="introduction">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-blue-500/10 rounded-2xl text-blue-600">
                  <Info className="h-7 w-7" />
                </div>
                <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">1. Strategic Overview</h2>
              </div>
              <div className="grid lg:grid-cols-5 gap-10">
                <div className="lg:col-span-3">
                  <p className="text-slate-600 text-lg leading-relaxed mb-6">
                    CargoMax is a dedicated logistics orchestration platform designed to streamline internal company 
                    operations. We provide real-time telemetry and robust data management to ensure a seamless, 
                    transparent, and highly efficient logistics experience for all participants.
                  </p>
                  <div className="bg-slate-50 border-l-4 border-primary rounded-r-2xl p-8 italic text-slate-600 text-lg shadow-sm">
                    "Driving the future of logistics through unparalleled connectivity and operational excellence."
                  </div>
                </div>
                <div className="lg:col-span-2 space-y-4">
                  <div className="bg-slate-900 rounded-2xl p-6 text-white">
                    <h4 className="font-bold mb-2">Core Pillars</h4>
                    <ul className="space-y-2 text-sm text-slate-400">
                      <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary" /> Real-time Tracking</li>
                      <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary" /> Operational Compliance</li>
                      <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary" /> Direct Settlement</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 2: Onboarding Protocols */}
            <section id="registration">
              <div className="flex items-center gap-4 mb-10">
                <div className="p-3 bg-orange-500/10 rounded-2xl text-orange-600">
                  <Users className="h-7 w-7" />
                </div>
                <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">2. Onboarding Protocols</h2>
              </div>
              
              <div className="grid gap-8 md:grid-cols-2">
                {/* Strict Approval Roles */}
                <div className="bg-slate-50 rounded-[2rem] p-8 border border-slate-100 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-10">
                    <ShieldCheck className="h-20 w-20 text-slate-900" />
                  </div>
                  <h3 className="text-xl font-bold mb-6 flex items-center gap-3 text-slate-900">
                    <UserCheck className="h-6 w-6 text-primary" />
                    Verified Partnership Roles
                  </h3>
                  <p className="text-sm text-slate-500 mb-6 font-medium uppercase tracking-wider">Required for Drivers, Companies & Vendors</p>
                  <ul className="space-y-4 text-slate-600">
                    <li className="flex items-start gap-3">
                      <div className="mt-1 p-1 bg-white rounded-md shadow-sm">
                        <ArrowRight className="h-3 w-3 text-primary" />
                      </div>
                      <span><strong>Email Verification:</strong> Mandatory multi-factor validation via registered electronic mail.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="mt-1 p-1 bg-white rounded-md shadow-sm">
                        <ArrowRight className="h-3 w-3 text-primary" />
                      </div>
                      <span><strong>Detailed Application:</strong> Submission of business licenses, IDs, and operational permits.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="mt-1 p-1 bg-white rounded-md shadow-sm">
                        <ArrowRight className="h-3 w-3 text-primary" />
                      </div>
                      <span><strong>Administrative Review:</strong> The CargoMax Operations team will conduct a thorough audit (typically 24-48 hours).</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="mt-1 p-1 bg-white rounded-md shadow-sm">
                        <ArrowRight className="h-3 w-3 text-primary" />
                      </div>
                      <span><strong>Activation:</strong> Dashboard access is granted only upon successful "Approved" status.</span>
                    </li>
                  </ul>
                </div>

                {/* Instant Access Roles */}
                <div className="bg-primary/5 rounded-[2rem] p-8 border border-primary/10 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-10 text-primary">
                    <Clock className="h-20 w-20" />
                  </div>
                  <h3 className="text-xl font-bold mb-6 flex items-center gap-3 text-slate-900">
                    <Building2 className="h-6 w-6 text-primary" />
                    Instant Access Roles
                  </h3>
                  <p className="text-sm text-primary/60 mb-6 font-medium uppercase tracking-wider">Applicable to Shippers</p>
                  <ul className="space-y-4 text-slate-600">
                    <li className="flex items-start gap-3">
                      <div className="mt-1 p-1 bg-white rounded-md shadow-sm">
                        <ArrowRight className="h-3 w-3 text-primary" />
                      </div>
                      <span><strong>Email Verification:</strong> Secure your account via immediate email confirmation.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="mt-1 p-1 bg-white rounded-md shadow-sm">
                        <ArrowRight className="h-3 w-3 text-primary" />
                      </div>
                      <span><strong>Immediate Onboarding:</strong> Skip the queue. Shippers are granted dashboard access immediately after verification.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="mt-1 p-1 bg-white rounded-md shadow-sm">
                        <ArrowRight className="h-3 w-3 text-primary" />
                      </div>
                      <span><strong>Instant Deployment:</strong> Create orders and initiate shipment requests without manual intervention.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Section 3: Operational Workflow */}
            <section id="workflow">
              <div className="flex items-center gap-4 mb-10">
                <div className="p-3 bg-green-500/10 rounded-2xl text-green-600">
                  <CheckCircle2 className="h-7 w-7" />
                </div>
                <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">3. Operational Workflow Architecture</h2>
              </div>
              
              <div className="relative">
                <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-slate-200 to-slate-200" />
                
                <div className="space-y-12">
                  {[
                    { title: "Registration & Verification", desc: "User creates an account and validates their identity through secure email protocols.", icon: Users },
                    { title: "Submission & Compliance", desc: "Drivers and Entities submit necessary legal documentation for CargoMax audit.", icon: FileText },
                    { title: "CargoMax Approval", desc: "Internal vetting process to ensure all safety and operational standards are met.", icon: ShieldCheck },
                    { title: "Enterprise System Access", desc: "Full access to the Internal Marketplace, Fleet Management, and Logistics tools.", icon: Building2 }
                  ].map((step, idx) => (
                    <div key={idx} className="relative pl-16">
                      <div className={`absolute left-0 p-3 rounded-full z-10 ${idx === 0 ? 'bg-primary text-white' : 'bg-white border-2 border-slate-200 text-slate-400'}`}>
                        <step.icon className="h-6 w-6" />
                      </div>
                      <h4 className="text-xl font-bold text-slate-900 mb-1">{step.title}</h4>
                      <p className="text-slate-500 leading-relaxed max-w-xl">{step.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Section 4: Support & Assistance */}
            <section id="support" className="bg-slate-950 rounded-[3rem] p-10 lg:p-16 text-white relative overflow-hidden">
              <div className="absolute bottom-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[100px]" />
              <div className="relative z-10 flex flex-col lg:flex-row gap-12 items-center">
                <div className="flex-1 text-center lg:text-left">
                  <h2 className="text-4xl font-black mb-6">Need Assistance?</h2>
                  <p className="text-slate-400 text-lg mb-8">
                    Our dedicated CargoMax Support Team is available 24/7 to ensure your logistics operations run without friction.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start">
                    <a href="mailto:support@cargomax.com" className="flex items-center gap-4 bg-white/10 hover:bg-white/20 transition-colors px-6 py-4 rounded-2xl border border-white/10 group">
                      <Mail className="h-6 w-6 text-primary" />
                      <div className="text-left">
                        <div className="text-xs text-slate-500 font-bold uppercase tracking-widest">Email Support</div>
                        <div className="text-sm font-semibold">support@cargomax.com</div>
                      </div>
                    </a>
                    <a href="tel:+18885550199" className="flex items-center gap-4 bg-white/10 hover:bg-white/20 transition-colors px-6 py-4 rounded-2xl border border-white/10 group">
                      <Phone className="h-6 w-6 text-primary" />
                      <div className="text-left">
                        <div className="text-xs text-slate-500 font-bold uppercase tracking-widest">Direct Line</div>
                        <div className="text-sm font-semibold">+1 (888) 555-0199</div>
                      </div>
                    </a>
                  </div>
                </div>
                <div className="w-48 h-48 bg-primary/30 rounded-3xl flex items-center justify-center backdrop-blur-3xl border border-white/20">
                  <HelpCircle className="h-24 w-24 text-white opacity-50" />
                </div>
              </div>
            </section>

            {/* Final Footer */}
            <div className="pt-12 border-t border-slate-100 flex flex-col items-center text-center">
              <div className="flex items-center gap-2 mb-4">
                <Building2 className="h-6 w-6 grayscale opacity-50 text-slate-400" />
                <span className="font-bold text-slate-400 tracking-tighter uppercase">CargoMax Enterprise</span>
              </div>
              <p className="text-slate-400 text-sm italic">
                All operational procedures are governed by the CargoMax Internal Service Agreement. 
              </p>
              <p className="text-slate-400 text-[10px] mt-6 font-mono">
                REF_ID: CMS-ENT-2026-V4.2
              </p>
            </div>
          </div>
        </article>
        
        <div className="mt-12 flex flex-col items-center gap-4 print:hidden">
          <p className="text-slate-400 text-sm font-medium">© 2026 CargoMax Enterprise. Precision Logistics.</p>
          <div className="flex gap-4">
            <div className="h-1 w-12 rounded-full bg-slate-200" />
            <div className="h-1 w-4 rounded-full bg-primary" />
            <div className="h-1 w-12 rounded-full bg-slate-200" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Manual;
