import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { commissionService, CommissionConfigData } from "@/services/commissionService";
import { toast } from "sonner";
import { 
  Percent, 
  Save, 
  Loader2,
  AlertTriangle,
  TrendingUp,
  Briefcase,
  Info
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function CommissionConfig() {
  const [config, setConfig] = useState<CommissionConfigData>({
    commissionRate: 0,
    driverCommissionRate: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      const data = await commissionService.getConfig();
      setConfig(data);
    } catch (error) {
      toast.error("Failed to load commission configuration");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await commissionService.updateConfig(config);
      toast.success("Commission rates updated successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to update configuration");
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    // Handle decimal conversion (e.g., 10 becomes 0.1)
    const rawValue = parseFloat(value) || 0;
    const normalizedValue = name === "commissionRate" || name === "driverCommissionRate" ? rawValue / 100 : rawValue;

    setConfig(prev => ({
      ...prev,
      [name]: normalizedValue
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
            <h1 className="text-3xl font-bold tracking-tight text-foreground text-glow">Commission Management</h1>
            <p className="text-muted-foreground mt-1">Configure platform revenue and driver payouts.</p>
          </div>
          <Button size="lg" onClick={handleSave} disabled={isSaving} className="gap-2 shadow-lg shadow-primary/20">
            {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Update Rates
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Platform Commission Rate */}
          <Card className="border-primary/5 hover:border-primary/20 transition-all shadow-xl bg-card/50 backdrop-blur-sm">
            <CardHeader className="space-y-1">
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-2 shadow-inner">
                <TrendingUp className="h-6 w-6" />
              </div>
              <CardTitle className="text-2xl font-black">Platform Revenue</CardTitle>
              <CardDescription>The percentage the platform takes from the total shipment cost.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="relative">
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-2xl font-black text-primary/20">%</span>
                <Input 
                  name="commissionRate"
                  type="number" 
                  step="0.1"
                  value={Math.round(config.commissionRate * 100)} 
                  onChange={handleChange}
                  className="h-16 text-3xl font-black pl-6 rounded-2xl border-2 focus:border-primary transition-all"
                />
              </div>
              <div className="bg-muted/30 p-4 rounded-xl flex items-center gap-3">
                <Info className="h-4 w-4 text-primary" />
                <p className="text-xs leading-relaxed text-muted-foreground">
                  If set to <span className="font-bold text-foreground">10%</span>, an order of 1,000 ETB will generate <span className="font-bold text-foreground">100 ETB</span> for the platform.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Driver Payout Rate */}
          <Card className="border-primary/5 hover:border-primary/20 transition-all shadow-xl bg-card/50 backdrop-blur-sm">
            <CardHeader className="space-y-1">
              <div className="h-12 w-12 rounded-xl bg-green-500/10 flex items-center justify-center text-green-500 mb-2 shadow-inner">
                <Briefcase className="h-6 w-6" />
              </div>
              <CardTitle className="text-2xl font-black">Driver Payout</CardTitle>
              <CardDescription>The percentage the driver receives from the remaining company share.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="relative">
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-2xl font-black text-green-500/20">%</span>
                <Input 
                  name="driverCommissionRate"
                  type="number" 
                  step="0.1"
                  value={Math.round(config.driverCommissionRate * 100)} 
                  onChange={handleChange}
                  className="h-16 text-3xl font-black pl-6 rounded-2xl border-2 focus:border-green-500 transition-all"
                />
              </div>
              <div className="bg-muted/30 p-4 rounded-xl flex items-center gap-3">
                <Info className="h-4 w-4 text-green-500" />
                <p className="text-xs leading-relaxed text-muted-foreground">
                  This is calculated <span className="italic">after</span> the platform cut. If set to <span className="font-bold text-foreground">5%</span>, and 900 ETB remains, the driver gets <span className="font-bold text-foreground">45 ETB</span>.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Warning Section */}
        <Card className="border-red-500/10 bg-red-500/5">
          <CardContent className="pt-6 flex gap-4 items-start">
            <AlertTriangle className="h-6 w-6 text-red-500 mt-0.5 shrink-0" />
            <div className="space-y-1">
              <p className="text-sm font-bold text-red-900 uppercase tracking-tighter">Financial Impact Warning</p>
              <p className="text-sm text-red-800 leading-relaxed">
                Modifying these rates will directly affect the profitability of the platform and the earnings of logisitcal partners. 
                Changes are applied instantly to all **payment callbacks** processed from this moment forward.
              </p>
              <div className="pt-2 flex flex-wrap gap-2">
                <Badge variant="destructive" className="bg-red-500/10 text-red-600 border-red-500/20">Immediate Effect</Badge>
                <Badge variant="outline" className="bg-white border-red-200 text-red-700 font-mono">
                  Commission = Total × Rate
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
