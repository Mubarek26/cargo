import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Package, MapPin, User, Scale, Calendar, FileText, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function CreateShipment() {
  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Create Shipment</h1>
        <p className="text-muted-foreground">Enter shipment details to create a new order</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Origin & Destination */}
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="mb-4 flex items-center gap-2 font-semibold text-card-foreground">
              <MapPin className="h-5 w-5 text-primary" />
              Route Details
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Origin Address</Label>
                <Input placeholder="Street address" />
              </div>
              <div className="space-y-2">
                <Label>Destination Address</Label>
                <Input placeholder="Street address" />
              </div>
              <div className="space-y-2">
                <Label>Origin City</Label>
                <Input placeholder="City, State ZIP" />
              </div>
              <div className="space-y-2">
                <Label>Destination City</Label>
                <Input placeholder="City, State ZIP" />
              </div>
            </div>
          </div>

          {/* Customer Info */}
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="mb-4 flex items-center gap-2 font-semibold text-card-foreground">
              <User className="h-5 w-5 text-primary" />
              Customer Information
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Customer Name</Label>
                <Input placeholder="Company or individual name" />
              </div>
              <div className="space-y-2">
                <Label>Contact Email</Label>
                <Input type="email" placeholder="email@example.com" />
              </div>
              <div className="space-y-2">
                <Label>Phone Number</Label>
                <Input placeholder="+1 (555) 000-0000" />
              </div>
              <div className="space-y-2">
                <Label>Account Number</Label>
                <Input placeholder="ACC-XXXX" />
              </div>
            </div>
          </div>

          {/* Package Details */}
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="mb-4 flex items-center gap-2 font-semibold text-card-foreground">
              <Package className="h-5 w-5 text-primary" />
              Package Details
            </h3>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label>Weight (lbs)</Label>
                <Input type="number" placeholder="0" />
              </div>
              <div className="space-y-2">
                <Label>Dimensions (L×W×H)</Label>
                <Input placeholder='24" × 18" × 12"' />
              </div>
              <div className="space-y-2">
                <Label>Package Type</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pallet">Pallet</SelectItem>
                    <SelectItem value="crate">Crate</SelectItem>
                    <SelectItem value="box">Box</SelectItem>
                    <SelectItem value="container">Container</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label>Contents Description</Label>
                <Input placeholder="Brief description of contents" />
              </div>
              <div className="space-y-2">
                <Label>Declared Value ($)</Label>
                <Input type="number" placeholder="0.00" />
              </div>
            </div>
          </div>

          {/* Shipping Options */}
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="mb-4 flex items-center gap-2 font-semibold text-card-foreground">
              <Calendar className="h-5 w-5 text-primary" />
              Shipping Options
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Service Type</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select service" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standard">Standard (5-7 days)</SelectItem>
                    <SelectItem value="express">Express (2-3 days)</SelectItem>
                    <SelectItem value="overnight">Overnight</SelectItem>
                    <SelectItem value="freight">Freight</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Pickup Date</Label>
                <Input type="date" />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label>Special Instructions</Label>
                <Textarea placeholder="Any special handling requirements..." rows={3} />
              </div>
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="space-y-6">
          <div className="sticky top-24 rounded-xl border border-border bg-card p-6">
            <h3 className="mb-4 flex items-center gap-2 font-semibold text-card-foreground">
              <FileText className="h-5 w-5 text-primary" />
              Order Summary
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-2 border-b border-border">
                <span className="text-muted-foreground">Route</span>
                <span className="text-card-foreground font-medium">-- <ArrowRight className="inline h-3 w-3" /> --</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-muted-foreground">Weight</span>
                <span className="text-card-foreground">-- lbs</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-muted-foreground">Service</span>
                <span className="text-card-foreground">--</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-muted-foreground">Base Rate</span>
                <span className="text-card-foreground">$0.00</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-muted-foreground">Fuel Surcharge</span>
                <span className="text-card-foreground">$0.00</span>
              </div>
              <div className="flex justify-between py-3 text-lg font-semibold">
                <span className="text-card-foreground">Total</span>
                <span className="text-primary">$0.00</span>
              </div>
            </div>
            <Button className="w-full mt-4" size="lg">
              <Package className="mr-2 h-4 w-4" />
              Create Shipment
            </Button>
            <Button variant="outline" className="w-full mt-2">
              Save as Draft
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
