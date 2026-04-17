import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ShoppingCart, Search, Filter, Download, Plus, Package, Clock, CheckCircle, Truck, XCircle, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const orders = [
  { id: "ORD-2024-00456", customer: "Acme Corporation", items: 5, total: "$2,450.00", status: "delivered", paymentStatus: "paid", date: "Dec 12, 2024", deliveryDate: "Dec 14, 2024" },
  { id: "ORD-2024-00457", customer: "Tech Solutions Inc", items: 3, total: "$1,890.00", status: "in_transit", paymentStatus: "paid", date: "Dec 12, 2024", deliveryDate: "Dec 16, 2024" },
  { id: "ORD-2024-00458", customer: "Global Retail Co", items: 8, total: "$4,200.00", status: "processing", paymentStatus: "pending", date: "Dec 13, 2024", deliveryDate: "Dec 18, 2024" },
  { id: "ORD-2024-00459", customer: "Fast Logistics Ltd", items: 2, total: "$780.00", status: "delivered", paymentStatus: "paid", date: "Dec 11, 2024", deliveryDate: "Dec 13, 2024" },
  { id: "ORD-2024-00460", customer: "Prime Shipping Co", items: 6, total: "$3,150.00", status: "in_transit", paymentStatus: "paid", date: "Dec 12, 2024", deliveryDate: "Dec 15, 2024" },
  { id: "ORD-2024-00461", customer: "West Coast Imports", items: 4, total: "$2,100.00", status: "cancelled", paymentStatus: "refunded", date: "Dec 10, 2024", deliveryDate: "-" },
  { id: "ORD-2024-00462", customer: "Motor City Co", items: 10, total: "$5,600.00", status: "processing", paymentStatus: "paid", date: "Dec 13, 2024", deliveryDate: "Dec 19, 2024" },
  { id: "ORD-2024-00463", customer: "Gulf Trading", items: 7, total: "$3,890.00", status: "delivered", paymentStatus: "paid", date: "Dec 09, 2024", deliveryDate: "Dec 12, 2024" },
];

const statusConfig = {
  processing: { label: "Processing", icon: Clock, className: "text-warning bg-warning/10" },
  in_transit: { label: "In Transit", icon: Truck, className: "text-primary bg-primary/10" },
  delivered: { label: "Delivered", icon: CheckCircle, className: "text-success bg-success/10" },
  cancelled: { label: "Cancelled", icon: XCircle, className: "text-destructive bg-destructive/10" },
};

const paymentConfig = {
  paid: { label: "Paid", className: "text-success bg-success/10" },
  pending: { label: "Pending", className: "text-warning bg-warning/10" },
  refunded: { label: "Refunded", className: "text-muted-foreground bg-secondary" },
};

export default function AllOrders() {
  return (
    <DashboardLayout>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">All Orders</h1>
          <p className="text-muted-foreground">Manage customer orders and fulfillment</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Order
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="mb-6 grid gap-4 sm:grid-cols-4">
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-primary/10 p-2">
              <ShoppingCart className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-card-foreground">{orders.length}</p>
              <p className="text-sm text-muted-foreground">Total Orders</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-warning/10 p-2">
              <Clock className="h-5 w-5 text-warning" />
            </div>
            <div>
              <p className="text-2xl font-bold text-card-foreground">
                {orders.filter(o => o.status === "processing").length}
              </p>
              <p className="text-sm text-muted-foreground">Processing</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-chart-2/10 p-2">
              <Truck className="h-5 w-5 text-chart-2" />
            </div>
            <div>
              <p className="text-2xl font-bold text-card-foreground">
                {orders.filter(o => o.status === "in_transit").length}
              </p>
              <p className="text-sm text-muted-foreground">In Transit</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-success/10 p-2">
              <DollarSign className="h-5 w-5 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold text-card-foreground">$24,060</p>
              <p className="text-sm text-muted-foreground">Revenue</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col gap-4 rounded-xl border border-border bg-card p-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search orders..." className="pl-10" />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Filters
          </Button>
          <Button variant="outline" size="sm">All Status</Button>
          <Button variant="outline" size="sm">Date Range</Button>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-secondary/50">
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Order ID</th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Customer</th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Items</th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Total</th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Status</th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Payment</th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Delivery</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {orders.map((order) => {
                const status = statusConfig[order.status as keyof typeof statusConfig];
                const StatusIcon = status.icon;
                const payment = paymentConfig[order.paymentStatus as keyof typeof paymentConfig];

                return (
                  <tr key={order.id} className="hover:bg-secondary/30 transition-colors cursor-pointer">
                    <td className="whitespace-nowrap px-5 py-4">
                      <div className="flex items-center gap-2">
                        <ShoppingCart className="h-4 w-4 text-primary" />
                        <span className="font-medium text-card-foreground">{order.id}</span>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-5 py-4">
                      <div className="text-sm">
                        <p className="text-card-foreground">{order.customer}</p>
                        <p className="text-muted-foreground">{order.date}</p>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-5 py-4">
                      <div className="flex items-center gap-1 text-sm">
                        <Package className="h-4 w-4 text-muted-foreground" />
                        <span className="text-card-foreground">{order.items}</span>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 font-medium text-card-foreground">{order.total}</td>
                    <td className="whitespace-nowrap px-5 py-4">
                      <Badge className={cn("gap-1", status.className)}>
                        <StatusIcon className="h-3 w-3" />
                        {status.label}
                      </Badge>
                    </td>
                    <td className="whitespace-nowrap px-5 py-4">
                      <Badge className={payment.className}>{payment.label}</Badge>
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 text-sm text-muted-foreground">{order.deliveryDate}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
