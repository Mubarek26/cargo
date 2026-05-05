import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { 
  DollarSign, 
  Search, 
  Filter, 
  Download, 
  ArrowUpRight, 
  ArrowDownLeft,
  Building2,
  User as UserIcon,
  Calendar,
  Loader2,
  ClipboardCheck
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { transactionService, Transaction } from "@/services/transactionService";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function Transactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const userRole = localStorage.getItem("userRole");
  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async (companyId?: string) => {
    setIsLoading(true);
    try {
      const res = await transactionService.getAllTransactions(companyId);
      if (res.status === "success") {
        setTransactions(res.data);
      }
    } catch (error) {
      toast.error("Failed to load transactions");
    } finally {
      setIsLoading(false);
    }
  };

  const filteredTransactions = transactions.filter(tx => 
    tx.trx_ref.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tx.shipperId?.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tx.companyId?.companyName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleExportCSV = () => {
    if (!filteredTransactions || filteredTransactions.length === 0) {
      toast.error("No transactions to export");
      return;
    }

    const escape = (val: any) => {
      if (val === null || val === undefined) return '""';
      return '"' + String(val).replace(/"/g, '""') + '"';
    };

    const headers = [
      'DateTime',
      'Reference',
      'Company',
      'Shipper',
      'Amount',
      'Commission',
      'CompanyShare',
      'DriverCommission',
      'Status'
    ];

    const rows = filteredTransactions.map((tx) => {
      const dateStr = tx.createdAt ? format(new Date(tx.createdAt), "yyyy-MM-dd HH:mm:ss") : '';
      return [
        escape(dateStr),
        escape(tx.trx_ref),
        escape(tx.companyId?.companyName || ''),
        escape(tx.shipperId?.fullName || ''),
        escape(tx.amount ?? ''),
        escape(tx.commission ?? ''),
        escape(tx.companyShare ?? ''),
        escape(tx.driverCommission ?? ''),
        escape(tx.status || ''),
      ].join(',');
    });

    const csv = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const now = format(new Date(), 'yyyyMMdd_HHmm');
    link.setAttribute('download', `transactions_${now}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const stats = {
    totalRevenue: transactions.reduce((acc, tx) => acc + tx.amount, 0),
    totalCommission: transactions.reduce((acc, tx) => acc + (tx.commission || 0), 0),
    totalTransactions: transactions.length,
    lastTransaction: transactions[0]?.createdAt
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-[60vh]">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="text-muted-foreground animate-pulse">Fetching financial records...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8 pb-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Transaction History</h1>
            <p className="text-muted-foreground mt-1">Review and manage all financial movements across the platform.</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="gap-2" onClick={() => handleExportCSV()}>
              <Download className="h-4 w-4" /> Export CSV
            </Button>
            {userRole === "SUPER_ADMIN" && (
              <Button className="gap-2 shadow-lg shadow-primary/20">
                <Filter className="h-4 w-4" /> Advanced Filters
              </Button>
            )}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-primary/5 bg-primary/5">
            <CardHeader className="pb-2">
              <CardDescription className="text-xs font-bold uppercase tracking-wider text-primary/60">Total Volume</CardDescription>
              <CardTitle className="text-2xl font-black">{stats.totalRevenue.toLocaleString()} <span className="text-sm font-normal text-muted-foreground">ETB</span></CardTitle>
            </CardHeader>
          </Card>
          
          <Card className="border-primary/5">
            <CardHeader className="pb-2">
              <CardDescription className="text-xs font-bold uppercase tracking-wider">Platform Revenue</CardDescription>
              <CardTitle className="text-2xl font-black text-green-500">+{stats.totalCommission.toLocaleString()} <span className="text-sm font-normal text-muted-foreground">ETB</span></CardTitle>
            </CardHeader>
          </Card>

          <Card className="border-primary/5">
            <CardHeader className="pb-2">
              <CardDescription className="text-xs font-bold uppercase tracking-wider">Transactions</CardDescription>
              <CardTitle className="text-2xl font-black">{stats.totalTransactions}</CardTitle>
            </CardHeader>
          </Card>

          <Card className="border-primary/5">
            <CardHeader className="pb-2">
              <CardDescription className="text-xs font-bold uppercase tracking-wider">Last Activity</CardDescription>
              <CardTitle className="text-lg font-bold">{stats.lastTransaction ? format(new Date(stats.lastTransaction), "MMM d, HH:mm") : "N/A"}</CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Table Section */}
        <Card className="border-primary/5 shadow-xl shadow-primary/5 overflow-hidden">
          <CardHeader className="border-b border-border/50 bg-muted/20">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <ClipboardCheck className="h-5 w-5 text-primary" /> Recent Transactions
              </CardTitle>
              <div className="relative w-full md:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search ref, company or shipper..." 
                  className="pl-10 bg-background"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30">
                  <TableHead className="font-bold">Date & Time</TableHead>
                  <TableHead className="font-bold">Reference</TableHead>
                  <TableHead className="font-bold">Parties</TableHead>
                  <TableHead className="font-bold text-right">Amount</TableHead>
                  {(userRole === "SUPER_ADMIN" || userRole === "COMPANY_ADMIN") && (
                    <TableHead className="font-bold text-right text-primary">Revenue</TableHead>
                  )}
                  <TableHead className="font-bold text-center">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-32 text-center text-muted-foreground italic">
                      No financial records found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredTransactions.map((tx) => (
                    <TableRow key={tx._id} className="hover:bg-muted/10 transition-colors group">
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium">{format(new Date(tx.createdAt), "MMM d, yyyy")}</span>
                          <span className="text-[10px] text-muted-foreground uppercase flex items-center gap-1">
                            <Calendar className="h-2 w-2" /> {format(new Date(tx.createdAt), "HH:mm")}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <code className="bg-muted px-2 py-0.5 rounded text-[10px] font-mono border border-border group-hover:bg-primary/10 group-hover:border-primary/20 transition-colors">
                          {tx.trx_ref}
                        </code>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {tx.shipperId && (
                            <div className="flex items-center gap-1.5 text-xs">
                              <UserIcon className="h-3 w-3 text-muted-foreground" />
                              <span className="font-medium">{tx.shipperId.fullName}</span>
                            </div>
                          )}
                          {tx.companyId && (
                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                              <Building2 className="h-3 w-3" />
                              <span>{tx.companyId.companyName}</span>
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex flex-col items-end">
                          <span className="font-black text-foreground">{tx.amount.toLocaleString()}</span>
                          <span className="text-[9px] text-muted-foreground uppercase">ETB</span>
                        </div>
                      </TableCell>
                      {(userRole === "SUPER_ADMIN" || userRole === "COMPANY_ADMIN") && (
                        <TableCell className="text-right">
                          <span className="font-bold text-green-500">
                            +{tx.commission?.toLocaleString() || 0}
                          </span>
                        </TableCell>
                      )}
                      <TableCell className="text-center">
                        <Badge className={cn("text-[10px] uppercase font-bold", 
                          tx.status === "success" ? "bg-green-500/10 text-green-500 border-green-500/20" :
                          "bg-amber-500/10 text-amber-500 border-amber-500/20"
                        )}>
                          {tx.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
