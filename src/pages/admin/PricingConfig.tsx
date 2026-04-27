import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { pricingService, PricingConfigData } from "@/services/pricingService";
import { toast } from "sonner";
import { 
  DollarSign, 
  MapPin, 
  Scale, 
  ShieldCheck, 
  Percent, 
  Save, 
  Loader2,
  AlertCircle
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function PricingConfig() {
  const [config, setConfig] = useState<PricingConfigData>({
    baseFare: 0,
    distanceRate: 0,
    weightRate: 0,
    serviceFee: 0,
    taxRate: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      const data = await pricingService.getConfig();
      setConfig(data);
    } catch (error) {
      toast.error("Failed to load pricing configuration");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await pricingService.updateConfig(config);
      toast.success("Pricing configuration updated successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to update configuration");
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setConfig(prev => ({
      ...prev,
      [name]: parseFloat(value) || 0
    }));
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8 pb-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Pricing Configuration</h1>
            <p className="text-muted-foreground mt-1">Manage the global pricing rules for the marketplace.</p>
          </div>
          <Button size="lg" onClick={handleSave} disabled={isSaving} className="gap-2 shadow-lg shadow-primary/20">
            {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Save Changes
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Base Fare */}
          <Card className="border-primary/5 hover:border-primary/20 transition-all shadow-sm">
            <CardHeader className="space-y-1">
              <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500 mb-2">
                <DollarSign className="h-5 w-5" />
              </div>
              <CardTitle className="text-xl">Base Fare</CardTitle>
              <CardDescription>The starting price for every shipment.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">ETB</span>
                <Input 
                  name="baseFare"
                  type="number" 
                  value={config.baseFare} 
                  onChange={handleChange}
                  className="pl-12 h-12 text-lg font-bold"
                />
              </div>
            </CardContent>
          </Card>

          {/* Distance Rate */}
          <Card className="border-primary/5 hover:border-primary/20 transition-all shadow-sm">
            <CardHeader className="space-y-1">
              <div className="h-10 w-10 rounded-lg bg-green-500/10 flex items-center justify-center text-green-500 mb-2">
                <MapPin className="h-5 w-5" />
              </div>
              <CardTitle className="text-xl">Distance Rate</CardTitle>
              <CardDescription>Cost per kilometer (KM).</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">ETB</span>
                <Input 
                  name="distanceRate"
                  type="number" 
                  value={config.distanceRate} 
                  onChange={handleChange}
                  className="pl-12 h-12 text-lg font-bold"
                />
              </div>
            </CardContent>
          </Card>

          {/* Weight Rate */}
          <Card className="border-primary/5 hover:border-primary/20 transition-all shadow-sm">
            <CardHeader className="space-y-1">
              <div className="h-10 w-10 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-500 mb-2">
                <Scale className="h-5 w-5" />
              </div>
              <CardTitle className="text-xl">Weight Rate</CardTitle>
              <CardDescription>Cost per Kilogram (Kg).</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">ETB</span>
                <Input 
                  name="weightRate"
                  type="number" 
                  value={config.weightRate} 
                  onChange={handleChange}
                  className="pl-12 h-12 text-lg font-bold"
                />
              </div>
            </CardContent>
          </Card>

          {/* Service Fee */}
          <Card className="border-primary/5 hover:border-primary/20 transition-all shadow-sm">
            <CardHeader className="space-y-1">
              <div className="h-10 w-10 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-500 mb-2">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <CardTitle className="text-xl">Service Fee</CardTitle>
              <CardDescription>Fixed handling and platform fee.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">ETB</span>
                <Input 
                  name="serviceFee"
                  type="number" 
                  value={config.serviceFee} 
                  onChange={handleChange}
                  className="pl-12 h-12 text-lg font-bold"
                />
              </div>
            </CardContent>
          </Card>

          {/* Tax Rate */}
          <Card className="border-primary/5 hover:border-primary/20 transition-all shadow-sm">
            <CardHeader className="space-y-1">
              <div className="h-10 w-10 rounded-lg bg-red-500/10 flex items-center justify-center text-red-500 mb-2">
                <Percent className="h-5 w-5" />
              </div>
              <CardTitle className="text-xl">Tax Rate</CardTitle>
              <CardDescription>Government tax percentage (0.15 = 15%).</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">%</span>
                <Input 
                  name="taxRate"
                  type="number" 
                  step="0.01"
                  value={config.taxRate} 
                  onChange={handleChange}
                  className="pl-12 h-12 text-lg font-bold"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-amber-500/10 bg-amber-500/5">
          <CardContent className="pt-6 flex gap-4 items-start">
            <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5 shrink-0" />
            <div className="space-y-1">
              <p className="text-sm font-bold text-amber-900">Important Note</p>
              <p className="text-sm text-amber-800 leading-relaxed">
                Changes to pricing configuration will apply immediately to all **newly created orders**. 
                Existing orders and active shipments will maintain their originally agreed-upon pricing.
              </p>
              <div className="pt-2">
                <Badge variant="outline" className="bg-white border-amber-200 text-amber-700">
                  Formula: Base + (Dist × Rate) + (Weight × Rate) + Fee + Tax
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
