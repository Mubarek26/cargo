import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { toast } from "sonner";
import { companyWalletService, CompanyDriverWallet, CompanyTransaction } from "@/services/companyWalletService";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";

export default function CompanyDriverWallets() {
  const [drivers, setDrivers] = useState<CompanyDriverWallet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState("");

  const [selectedDriver, setSelectedDriver] = useState<CompanyDriverWallet | null>(null);
  const [transactions, setTransactions] = useState<CompanyTransaction[]>([]);
  const [isTxLoading, setIsTxLoading] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchDrivers();
  }, []);

  const fetchDrivers = async () => {
    setIsLoading(true);
    try {
      const res = await companyWalletService.getDriversWallets();
      setDrivers(res);
    } catch (error) {
      toast.error("Failed to load drivers wallets");
    } finally {
      setIsLoading(false);
    }
  };

  const openDriver = async (driver: CompanyDriverWallet) => {
    // Support driver objects that may have either `driverId` or `_id`
    const id = (driver as any).driverId || (driver as any)._id;
    if (!id) return toast.error('Invalid driver id');
    setSelectedDriver(driver);
    setIsTxLoading(true);
    try {
      const txs = await companyWalletService.getDriverTransactions(id);
      setTransactions(txs);
    } catch (error) {
      toast.error("Failed to load transactions");
    } finally {
      setIsTxLoading(false);
    }
  };

  const submitWithdraw = async () => {
    if (!selectedDriver || !withdrawAmount || withdrawAmount <= 0) return toast.error("Enter a valid amount");
    setIsSubmitting(true);
    try {
      await companyWalletService.requestWithdraw(selectedDriver.driverId, { amount: withdrawAmount });
      toast.success("Withdraw request submitted");
      setWithdrawAmount(null);
      setSelectedDriver(null);
      fetchDrivers();
    } catch (error) {
      toast.error("Failed to submit withdraw request");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filtered = drivers.filter((d) => d.fullName.toLowerCase().includes(filter.toLowerCase()));

  return (
    <DashboardLayout>
      <div className="space-y-6 pb-10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Drivers Wallets</h1>
            <p className="text-sm text-muted-foreground">View driver balances, transactions and manage withdraw requests.</p>
          </div>
          <div className="w-64">
            <Input placeholder="Search driver..." value={filter} onChange={(e) => setFilter(e.target.value)} />
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Wallets</CardTitle>
            <CardDescription>Balances and lifetime earnings for company drivers.</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-8 flex items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30">
                    <TableHead className="font-bold">Driver</TableHead>
                    <TableHead className="font-bold">Balance</TableHead>
                    <TableHead className="font-bold">Total Earnings</TableHead>
                    <TableHead className="font-bold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">No drivers found.</TableCell>
                    </TableRow>
                  ) : (
                    filtered.map((d) => (
                      <TableRow key={d.driverId} className="hover:bg-muted/5">
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-medium">{d.fullName}</span>
                            <span className="text-xs text-muted-foreground">{d.phone || ''} {d.email ? `• ${d.email}` : ''}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-black">{d.balance.toLocaleString()}</span>
                            <span className="text-xs text-muted-foreground">ETB</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-medium">{d.totalEarnings.toLocaleString()}</span>
                            <span className="text-xs text-muted-foreground">lifetime</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" onClick={() => openDriver(d)}>View</Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        <Dialog open={!!selectedDriver} onOpenChange={(open) => !open && setSelectedDriver(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Driver Details</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {selectedDriver && (
                <div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-bold">{selectedDriver.fullName}</h3>
                      <p className="text-sm text-muted-foreground">Balance: {selectedDriver.balance.toLocaleString()} ETB</p>
                    </div>
                    {(selectedDriver.phone || selectedDriver.email) ? (
                      <div className="text-right">
                        {selectedDriver.phone && <div className="text-sm">{selectedDriver.phone}</div>}
                        {selectedDriver.email && <div className="text-xs text-muted-foreground">{selectedDriver.email}</div>}
                      </div>
                    ) : null}
                  </div>

                  <div className="mt-4">
                    <h4 className="font-semibold">Transaction History</h4>
                    {isTxLoading ? (
                      <div className="py-6 flex items-center justify-center"><Loader2 className="h-5 w-5 animate-spin" /></div>
                    ) : (
                      <div className="mt-3 space-y-2 max-h-60 overflow-auto">
                        {transactions.length === 0 ? (
                                      <p className="text-sm text-muted-foreground">No transactions available.</p>
                                    ) : (
                                      transactions.map((t) => (
                                        <div key={t._id} className="p-2 border rounded">
                                          <div className="flex items-center justify-between">
                                            <div>
                                              <div className="text-sm font-medium">{t.trx_ref}</div>
                                              <div className="text-xs text-muted-foreground">{format(new Date(t.createdAt), "MMM d, yyyy • HH:mm")}</div>
                                            </div>
                                            <div className="text-right">
                                              <div className="font-black">{t.driverCommission.toLocaleString()} ETB</div>
                                              <div className="text-xs text-muted-foreground">Status: {t.status}</div>
                                            </div>
                                          </div>
                                        </div>
                                      ))
                                    )}
                      </div>
                    )}
                  </div>

                  <div className="mt-4">
                    <label className="text-sm font-medium">Withdraw Amount (ETB)</label>
                    <div className="flex gap-2 mt-2">
                      <Input type="number" value={withdrawAmount ?? ""} onChange={(e) => setWithdrawAmount(Number(e.target.value))} />
                      <Button onClick={submitWithdraw} disabled={isSubmitting}>{isSubmitting ? "Sending..." : "Request Withdraw"}</Button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">Submitting a withdraw request will notify finance to process the payout.</p>
                  </div>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="ghost" onClick={() => setSelectedDriver(null)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Withdrawal Requests */}
        <Card>
          <CardHeader>
            <CardTitle>Withdrawal Requests</CardTitle>
            <CardDescription>Pending requests from drivers; approve to process payouts.</CardDescription>
          </CardHeader>
          <CardContent>
            <WithdrawalList />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

function WithdrawalList() {
  const [withdrawals, setWithdrawals] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const res = await companyWalletService.getWithdrawals();
      setWithdrawals(res);
    } catch (error) {
      toast.error('Failed to load withdrawals');
    } finally {
      setIsLoading(false);
    }
  };

  const approve = async (id: string) => {
    try {
      await companyWalletService.approveWithdraw(id);
      toast.success('Withdrawal approved');
      fetchData();
    } catch (error) {
      toast.error('Failed to approve');
    }
  };

  if (isLoading) return <div className="p-4">Loading...</div>;

  return (
    <div className="space-y-2">
      {withdrawals.length === 0 ? (
        <div className="text-muted-foreground">No withdrawal requests.</div>
      ) : (
        withdrawals.map(w => (
          <div key={w._id} className="p-3 border rounded flex items-center justify-between">
            <div>
              <div className="font-medium">{w.requestedBy}</div>
              <div className="text-xs text-muted-foreground">{w.amount} ETB • {w.note}</div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={w.status === 'PENDING' ? 'secondary' : 'outline'}>{w.status}</Badge>
              {w.status === 'PENDING' && <Button size="sm" onClick={() => approve(w._id)}>Approve</Button>}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
