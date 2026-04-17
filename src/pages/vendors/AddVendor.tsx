import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Building2, MapPin, User, FileText, Globe, Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function AddVendor() {
  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Add Vendor</h1>
        <p className="text-muted-foreground">Register a new vendor or supplier</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {/* Company Info */}
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="mb-4 flex items-center gap-2 font-semibold text-card-foreground">
              <Building2 className="h-5 w-5 text-primary" />
              Company Information
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Company Name</Label>
                <Input placeholder="Enter company name" />
              </div>
              <div className="space-y-2">
                <Label>Business Type</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ocean">Ocean Freight</SelectItem>
                    <SelectItem value="air">Air Freight</SelectItem>
                    <SelectItem value="ground">Ground Transport</SelectItem>
                    <SelectItem value="packaging">Packaging</SelectItem>
                    <SelectItem value="warehousing">Warehousing</SelectItem>
                    <SelectItem value="customs">Customs</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Tax ID / EIN</Label>
                <Input placeholder="XX-XXXXXXX" />
              </div>
              <div className="space-y-2">
                <Label>Website</Label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input placeholder="www.example.com" className="pl-10" />
                </div>
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="mb-4 flex items-center gap-2 font-semibold text-card-foreground">
              <User className="h-5 w-5 text-primary" />
              Primary Contact
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Contact Name</Label>
                <Input placeholder="Full name" />
              </div>
              <div className="space-y-2">
                <Label>Position</Label>
                <Input placeholder="Job title" />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input type="email" placeholder="email@company.com" className="pl-10" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Phone</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input placeholder="+1 (555) 000-0000" className="pl-10" />
                </div>
              </div>
            </div>
          </div>

          {/* Address */}
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="mb-4 flex items-center gap-2 font-semibold text-card-foreground">
              <MapPin className="h-5 w-5 text-primary" />
              Business Address
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
                <Label>Street Address</Label>
                <Input placeholder="Street address" />
              </div>
              <div className="space-y-2">
                <Label>City</Label>
                <Input placeholder="City" />
              </div>
              <div className="space-y-2">
                <Label>State / Province</Label>
                <Input placeholder="State" />
              </div>
              <div className="space-y-2">
                <Label>ZIP / Postal Code</Label>
                <Input placeholder="ZIP code" />
              </div>
              <div className="space-y-2">
                <Label>Country</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="us">United States</SelectItem>
                    <SelectItem value="ca">Canada</SelectItem>
                    <SelectItem value="mx">Mexico</SelectItem>
                    <SelectItem value="uk">United Kingdom</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Additional Info */}
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="mb-4 flex items-center gap-2 font-semibold text-card-foreground">
              <FileText className="h-5 w-5 text-primary" />
              Additional Information
            </h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Services Offered</Label>
                <Textarea placeholder="Describe the services this vendor provides..." rows={3} />
              </div>
              <div className="space-y-2">
                <Label>Notes</Label>
                <Textarea placeholder="Any additional notes..." rows={3} />
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-6">
          <div className="sticky top-24 rounded-xl border border-border bg-card p-6">
            <h3 className="mb-4 font-semibold text-card-foreground">Actions</h3>
            <div className="space-y-3">
              <Button className="w-full" size="lg">
                <Building2 className="mr-2 h-4 w-4" />
                Add Vendor
              </Button>
              <Button variant="outline" className="w-full">
                Save as Draft
              </Button>
              <Button variant="ghost" className="w-full">
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
