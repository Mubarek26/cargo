import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Wallet, 
  ArrowUpRight, 
  History, 
  DollarSign, 
  TrendingUp, 
  ArrowDownCircle,
  CreditCard,
  Loader2,
  AlertCircle
} from "lucide-react";
import { walletService, WalletData, TransactionRecord } from "@/services/walletService";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export default function DriverWallet() {
  const [wallet, setWallet] = useState<WalletData | null>(null);
  const [transactions, setTransactions] = useState<TransactionRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [walletData, historyData] = await Promise.all([
        walletService.getDriverWallet(),
        walletService.getTransactionHistory()
      ]);
      setWallet(walletData);
      setTransactions(historyData);
    } catch (error) {
      toast.error("Failed to load wallet data");
    } finally {
      setIsLoading(false);
    }
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
            <h1 className="text-3xl font-bold tracking-tight text-foreground">My Wallet</h1>
            <p className="text-muted-foreground mt-1">Manage your earnings and track your payouts.</p>
          </div>
          <Button className="gap-2 shadow-lg shadow-primary/20">
            <CreditCard className="h-4 w-4" /> Withdraw Funds
          </Button>
        </div>

        {/* Wallet Balance Card - Premium Look */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="lg:col-span-2 relative overflow-hidden border-none bg-gradient-to-br from-primary to-primary/80 text-white shadow-2xl">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <Wallet className="h-48 w-48" />
            </div>
            <CardHeader>
              <CardDescription className="text-primary-foreground/70 font-medium uppercase tracking-widest text-xs">Available Balance</CardDescription>
              <CardTitle className="text-5xl font-black mt-2">
                {wallet?.balance.toLocaleString()} <span className="text-2xl font-normal opacity-70 ml-1">ETB</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="mt-4">
              <div className="flex items-center gap-6">
                <div className="flex flex-col">
                  <span className="text-primary-foreground/60 text-xs font-bold uppercase">Total Lifetime Earnings</span>
                  <span className="text-xl font-bold">{wallet?.totalEarnings.toLocaleString()} ETB</span>
                </div>
                <div className="h-10 w-[1px] bg-white/20" />
                <div className="flex flex-col">
                  <span className="text-primary-foreground/60 text-xs font-bold uppercase">Account Status</span>
                  <Badge variant="outline" className="bg-white/10 text-white border-white/20 w-fit mt-1">Verified Partner</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <div className="space-y-6">
            <Card className="border-primary/5 shadow-sm">
              <CardHeader className="pb-2">
                <CardDescription className="text-xs font-bold uppercase">Last Payout</CardDescription>
                <CardTitle className="text-xl font-bold flex items-center justify-between">
                  0.00 <span className="text-muted-foreground text-xs font-normal">ETB</span>
                </CardTitle>
              </CardHeader>
            </Card>
            
            <Card className="border-primary/5 shadow-sm bg-muted/30">
              <CardHeader className="pb-4">
                <div className="h-8 w-8 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-600 mb-2">
                  <AlertCircle className="h-4 w-4" />
                </div>
                <CardTitle className="text-sm font-bold">Payout Schedule</CardTitle>
                <CardDescription className="text-xs">Your next automated payout will be processed on Friday.</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>

        {/* Transaction History */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <History className="h-5 w-5 text-primary" /> Earning History
            </h2>
            <Badge variant="secondary" className="font-mono">
              {transactions.length} Records
            </Badge>
          </div>

          <div className="grid gap-4">
            {transactions.length === 0 ? (
              <Card className="border-dashed border-2 flex items-center justify-center p-12 text-muted-foreground">
                <div className="text-center">
                  <ArrowDownCircle className="h-10 w-10 mx-auto mb-4 opacity-20" />
                  <p>No earnings history found yet.</p>
                  <p className="text-xs">Complete shipments to start earning!</p>
                </div>
              </Card>
            ) : (
              transactions.map((tx) => (
                <Card key={tx._id} className="group hover:border-primary/20 transition-all">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-green-500/10 flex items-center justify-center text-green-600">
                        <TrendingUp className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-bold text-sm">Shipment Payment Received</p>
                        <p className="text-xs text-muted-foreground">{format(new Date(tx.createdAt), "MMM d, yyyy • HH:mm")}</p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-lg font-black text-green-600">
                        +{tx.driverCommission.toLocaleString()} <span className="text-[10px] font-normal">ETB</span>
                      </p>
                      <Badge variant="outline" className="text-[10px] uppercase font-mono">
                        {tx.trx_ref}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
