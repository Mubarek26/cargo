import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { RefreshCw, Plus, Search, Filter, CheckCircle, Clock, AlertTriangle, Package, Warehouse } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const restockRequests = [
  { id: "RST-001", item: "Bubble Wrap Roll", sku: "SKU-004", warehouse: "Central Logistics", quantity: 1500, status: "pending", priority: "high", requestedBy: "James Wilson", date: "Dec 13, 2024" },
  { id: "RST-002", item: "Pallet Wrap", sku: "SKU-007", warehouse: "Central Logistics", quantity: 800, status: "approved", priority: "high", requestedBy: "James Wilson", date: "Dec 12, 2024" },
  { id: "RST-003", item: "Standard Shipping Box (Large)", sku: "SKU-003", warehouse: "West Coast Distribution", quantity: 5000, status: "in_transit", priority: "medium", requestedBy: "Maria Garcia", date: "Dec 10, 2024" },
  { id: "RST-004", item: "Shipping Labels", sku: "SKU-006", warehouse: "East Coast Hub", quantity: 20000, status: "delivered", priority: "low", requestedBy: "Robert Chen", date: "Dec 08, 2024" },
  { id: "RST-005", item: "Packing Tape", sku: "SKU-005", warehouse: "Southern Hub", quantity: 2000, status: "pending", priority: "medium", requestedBy: "Patricia Brown", date: "Dec 13, 2024" },
  { id: "RST-006", item: "Wooden Pallets", sku: "SKU-008", warehouse: "Southeast Center", quantity: 300, status: "approved", priority: "low", requestedBy: "Jennifer Adams", date: "Dec 11, 2024" },
];

const statusConfig = {
  pending: { label: "Pending", icon: Clock, className: "text-warning bg-warning/10" },
  approved: { label: "Approved", icon: CheckCircle, className: "text-primary bg-primary/10" },
  in_transit: { label: "In Transit", icon: RefreshCw, className: "text-chart-2 bg-chart-2/10" },
  delivered: { label: "Delivered", icon: CheckCircle, className: "text-success bg-success/10" },
};

const priorityConfig = {
  high: "text-destructive bg-destructive/10",
  medium: "text-warning bg-warning/10",
  low: "text-muted-foreground bg-secondary",
};

export default function RestockRequests() {
  return (
    <DashboardLayout>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Restock Requests</h1>
          <p className="text-muted-foreground">Manage inventory replenishment orders</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Request
        </Button>
      </div>

      {/* Stats */}
      <div className="mb-6 grid gap-4 sm:grid-cols-4">
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-warning/10 p-2">
              <Clock className="h-5 w-5 text-warning" />
            </div>
            <div>
              <p className="text-2xl font-bold text-card-foreground">
                {restockRequests.filter(r => r.status === "pending").length}
              </p>
              <p className="text-sm text-muted-foreground">Pending</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-primary/10 p-2">
              <CheckCircle className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-card-foreground">
                {restockRequests.filter(r => r.status === "approved").length}
              </p>
              <p className="text-sm text-muted-foreground">Approved</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-chart-2/10 p-2">
              <RefreshCw className="h-5 w-5 text-chart-2" />
            </div>
            <div>
              <p className="text-2xl font-bold text-card-foreground">
                {restockRequests.filter(r => r.status === "in_transit").length}
              </p>
              <p className="text-sm text-muted-foreground">In Transit</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-success/10 p-2">
              <CheckCircle className="h-5 w-5 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold text-card-foreground">
                {restockRequests.filter(r => r.status === "delivered").length}
              </p>
              <p className="text-sm text-muted-foreground">Delivered</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col gap-4 rounded-xl border border-border bg-card p-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search requests..." className="pl-10" />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Filters
          </Button>
          <Button variant="outline" size="sm">All Status</Button>
          <Button variant="outline" size="sm">All Priority</Button>
        </div>
      </div>

      {/* Requests list */}
      <div className="space-y-4">
        {restockRequests.map((request) => {
          const status = statusConfig[request.status as keyof typeof statusConfig];
          const StatusIcon = status.icon;

          return (
            <div key={request.id} className="rounded-xl border border-border bg-card p-5 hover:shadow-lg transition-shadow">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <Package className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-card-foreground">{request.item}</span>
                        <Badge className={priorityConfig[request.priority as keyof typeof priorityConfig]}>
                          {request.priority}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{request.id} • {request.sku}</p>
                    </div>
                  </div>

                  <div className="grid gap-2 sm:grid-cols-4 text-sm">
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider">Warehouse</p>
                      <p className="text-card-foreground flex items-center gap-1">
                        <Warehouse className="h-3 w-3" />
                        {request.warehouse}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider">Quantity</p>
                      <p className="text-card-foreground font-medium">{request.quantity.toLocaleString()} units</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider">Requested By</p>
                      <p className="text-card-foreground">{request.requestedBy}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider">Date</p>
                      <p className="text-muted-foreground">{request.date}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Badge className={cn("gap-1", status.className)}>
                    <StatusIcon className="h-3 w-3" />
                    {status.label}
                  </Badge>
                  {request.status === "pending" && (
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">Reject</Button>
                      <Button size="sm">Approve</Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </DashboardLayout>
  );
}
