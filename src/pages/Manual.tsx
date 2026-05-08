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
  Gavel
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
        <article className="bg-white shadow-xl shadow-slate-200/60 rounded-[2rem] overflow-hidden border border-slate-100 print:shadow-none print:border-none print:rounded-none">
          {/* Cover Section */}
          <div className="bg-slate-900 text-white p-12 lg:p-20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full -mr-32 -mt-32 blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full -ml-32 -mb-32 blur-3xl" />
            
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-8">
                <div className="bg-white p-2 rounded-xl">
                  <img src="/favicon.png" alt="CargoMax Logo" className="h-8 w-8 object-contain" />
                </div>
                <span className="text-2xl font-black tracking-tight">CargoMax</span>
              </div>
              
              <h1 className="text-4xl lg:text-6xl font-black mb-6 leading-tight">
                Operational <br />
                <span className="text-primary text-gradient">Manual & Guidelines</span>
              </h1>
              <p className="text-slate-400 text-lg max-w-2xl leading-relaxed">
                A comprehensive guide for Companies, Private Transporters, and Vendors on how to integrate, 
                collaborate, and thrive within the CargoMax ecosystem.
              </p>
              
              <div className="mt-12 flex flex-wrap gap-6 text-sm font-medium text-slate-300">
                <span className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-primary" />
                  Version 2026.1
                </span>
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  Official Document
                </span>
              </div>
            </div>
          </div>

          {/* Table of Contents / Main Sections */}
          <div className="p-8 lg:p-16 space-y-16">
            
            {/* Section 1: Introduction */}
            <section id="introduction">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                  <Info className="h-6 w-6" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900">1. Introduction to CargoMax</h2>
              </div>
              <p className="text-slate-600 leading-relaxed mb-4">
                CargoMax is a state-of-the-art logistics orchestration platform designed to streamline the movement 
                of goods across global supply chains. Our ecosystem connects shippers, carriers, and vendors 
                in a unified digital marketplace, powered by real-time tracking and automated fleet management.
              </p>
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 italic text-slate-500">
                "Our mission is to empower logistics stakeholders with data-driven tools that reduce waste, 
                increase efficiency, and ensure every shipment arrives on time, every time."
              </div>
            </section>

            {/* Section 2: Registration & Onboarding */}
            <section id="registration">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-orange-50 rounded-lg text-orange-600">
                  <Users className="h-6 w-6" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900">2. Registration & Onboarding</h2>
              </div>
              
              <div className="grid gap-8 md:grid-cols-2">
                <div className="space-y-4">
                  <h3 className="text-lg font-bold flex items-center gap-2 text-slate-800">
                    <Building2 className="h-5 w-5 text-primary" />
                    For Companies (Fleet Owners)
                  </h3>
                  <ul className="space-y-2 text-slate-600 list-disc ml-6">
                    <li>Submit legal business registration and transport licenses.</li>
                    <li>Provide fleet size and vehicle specification details.</li>
                    <li>Verification process typically takes 3-5 business days.</li>
                    <li>Assign an account manager for CargoMax marketplace interactions.</li>
                  </ul>
                </div>
                <div className="space-y-4">
                  <h3 className="text-lg font-bold flex items-center gap-2 text-slate-800">
                    <Truck className="h-5 w-5 text-primary" />
                    For Private Transporters
                  </h3>
                  <ul className="space-y-2 text-slate-600 list-disc ml-6">
                    <li>Register with personal identification and driver's license.</li>
                    <li>Vehicle must pass the CargoMax 20-point safety inspection.</li>
                    <li>Proof of valid cargo insurance is mandatory.</li>
                    <li>Complete the 'Driver Excellence' digital training module.</li>
                  </ul>
                </div>
                <div className="space-y-4 md:col-span-2">
                  <h3 className="text-lg font-bold flex items-center gap-2 text-slate-800">
                    <HelpCircle className="h-5 w-5 text-primary" />
                    For Vendors & Shippers
                  </h3>
                  <p className="text-slate-600">
                    Vendors must provide valid commercial tax IDs and warehouse location data. Once verified, 
                    vendors can post shipment requests directly to the marketplace or establish long-term 
                    contracts with specific carriers.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 3: Rules & Regulations */}
            <section id="rules">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-red-50 rounded-lg text-red-600">
                  <Gavel className="h-6 w-6" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900">3. Policies, Rules & Regulations</h2>
              </div>
              
              <div className="space-y-6">
                <div className="bg-red-50/50 border border-red-100 rounded-2xl p-6">
                  <h4 className="font-bold text-red-900 mb-2 flex items-center gap-2">
                    <AlertCircle className="h-5 w-5" />
                    Safety & Conduct
                  </h4>
                  <p className="text-red-800 text-sm">
                    CargoMax maintains a zero-tolerance policy for reckless driving, falsified delivery reports, 
                    or the transportation of unauthorized materials. Violations result in immediate account suspension.
                  </p>
                </div>

                <div className="grid gap-6 md:grid-cols-2 text-sm text-slate-600">
                  <div>
                    <h4 className="font-bold text-slate-900 mb-2">Payment Terms</h4>
                    <p>Payments are processed within 48 hours of successful delivery confirmation and e-signature. CargoMax takes a 5% platform fee on marketplace transactions.</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 mb-2">Insurance Requirements</h4>
                    <p>All carriers must maintain a minimum of $50,000 cargo insurance and $1,000,000 general liability insurance to operate on the platform.</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 mb-2">Data Privacy</h4>
                    <p>User data is encrypted using AES-256 standards. Location tracking is only active during active trip sessions for privacy protection.</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 mb-2">Maintenance Standards</h4>
                    <p>Vehicles must undergo bi-annual inspections. Maintenance logs must be uploaded to the CargoMax Fleet portal every quarter.</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 4: Operational Workflow */}
            <section id="workflow">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-green-50 rounded-lg text-green-600">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900">4. Operational Workflow</h2>
              </div>
              <div className="relative border-l-2 border-slate-100 ml-3 pl-8 space-y-8">
                <div className="relative">
                  <div className="absolute -left-[2.35rem] top-1 h-4 w-4 rounded-full bg-primary" />
                  <h4 className="font-bold text-slate-900">Order Matching</h4>
                  <p className="text-slate-600 text-sm">AI-driven matching based on vehicle capacity, route optimization, and carrier rating.</p>
                </div>
                <div className="relative">
                  <div className="absolute -left-[2.35rem] top-1 h-4 w-4 rounded-full bg-slate-300" />
                  <h4 className="font-bold text-slate-900">Real-time Tracking</h4>
                  <p className="text-slate-600 text-sm">Once a trip starts, GPS data is shared with the vendor for precise ETA updates.</p>
                </div>
                <div className="relative">
                  <div className="absolute -left-[2.35rem] top-1 h-4 w-4 rounded-full bg-slate-300" />
                  <h4 className="font-bold text-slate-900">Delivery Confirmation</h4>
                  <p className="text-slate-600 text-sm">Digital Bill of Lading (eBOL) signed on-site triggers the automated invoicing system.</p>
                </div>
              </div>
            </section>

            {/* Footer Sign-off */}
            <div className="pt-12 border-t border-slate-100 flex flex-col items-center text-center">
              <ShieldCheck className="h-12 w-12 text-primary mb-4" />
              <p className="text-slate-900 font-bold">Secure. Reliable. Efficient.</p>
              <p className="text-slate-400 text-sm mt-1">© 2026 CargoMax Logistics Platform. All Rights Reserved.</p>
            </div>
          </div>
        </article>
        
        <div className="mt-12 text-center text-slate-400 text-xs print:hidden">
          This document is subject to change. Please visit the help center for the latest updates.
        </div>
      </div>
    </div>
  );
};

export default Manual;
