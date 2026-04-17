import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Boxes, Search, Filter, AlertTriangle, TrendingUp, TrendingDown, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

const inventoryItems = [
  { sku: "SKU-001", name: "Standard Shipping Box (Small)", category: "Packaging", warehouse: "East Coast Hub", quantity: 15000, minStock: 5000, maxStock: 20000, status: "normal" },
  { sku: "SKU-002", name: "Standard Shipping Box (Medium)", category: "Packaging", warehouse: "East Coast Hub", quantity: 8500, minStock: 3000, maxStock: 15000, status: "normal" },
  { sku: "SKU-003", name: "Standard Shipping Box (Large)", category: "Packaging", warehouse: "West Coast Distribution", quantity: 2100, minStock: 2000, maxStock: 10000, status: "low" },
  { sku: "SKU-004", name: "Bubble Wrap Roll", category: "Packaging", warehouse: "Central Logistics", quantity: 450, minStock: 500, maxStock: 2000, status: "critical" },
  { sku: "SKU-005", name: "Packing Tape", category: "Supplies", warehouse: "Southern Hub", quantity: 3200, minStock: 1000, maxStock: 5000, status: "normal" },
  { sku: "SKU-006", name: "Shipping Labels", category: "Supplies", warehouse: "East Coast Hub", quantity: 25000, minStock: 10000, maxStock: 50000, status: "normal" },
  { sku: "SKU-007", name: "Pallet Wrap", category: "Supplies", warehouse: "Central Logistics", quantity: 180, minStock: 200, maxStock: 1000, status: "critical" },
  { sku: "SKU-008", name: "Wooden Pallets", category: "Equipment", warehouse: "West Coast Distribution", quantity: 890, minStock: 500, maxStock: 2000, status: "normal" },
];

const statusConfig = {
  normal: { label: "Normal", className: "text-success bg-success/10" },
  low: { label: "Low Stock", className: "text-warning bg-warning/10" },
  critical: { label: "Critical", className: "text-destructive bg-destructive/10" },
};

export default function InventoryLevels() {
  const criticalItems = inventoryItems.filter(i => i.status === "critical").length;
  const lowItems = inventoryItems.filter(i => i.status === "low").length;

  return (
    <DashboardLayout>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Inventory Levels</h1>
          <p className="text-muted-foreground">Monitor stock across all warehouses</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">Export Report</Button>
          <Button>Restock Order</Button>
        </div>
      </div>

      {/* Alert banner */}
      {criticalItems > 0 && (
        <div className="mb-6 rounded-xl border border-destructive/30 bg-destructive/5 p-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            <div>
              <h3 className="font-medium text-card-foreground">Low Stock Alert</h3>
              <p className="text-sm text-muted-foreground">
                {criticalItems} items are critically low and {lowItems} items are running low on stock.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="mb-6 flex flex-col gap-4 rounded-xl border border-border bg-card p-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search inventory..." className="pl-10" />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Filters
          </Button>
          <Button variant="outline" size="sm">All Warehouses</Button>
          <Button variant="outline" size="sm">All Categories</Button>
        </div>
      </div>

      {/* Inventory table */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-secondary/50">
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Item</th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Category</th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Warehouse</th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Stock Level</th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Status</th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {inventoryItems.map((item) => {
                const status = statusConfig[item.status as keyof typeof statusConfig];
                const stockPercentage = (item.quantity / item.maxStock) * 100;

                return (
                  <tr key={item.sku} className="hover:bg-secondary/30 transition-colors">
                    <td className="whitespace-nowrap px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                          <Package className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-card-foreground">{item.name}</p>
                          <p className="text-xs text-muted-foreground">{item.sku}</p>
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 text-sm text-muted-foreground">{item.category}</td>
                    <td className="whitespace-nowrap px-5 py-4 text-sm text-card-foreground">{item.warehouse}</td>
                    <td className="px-5 py-4 min-w-[200px]">
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium text-card-foreground">{item.quantity.toLocaleString()}</span>
                          <span className="text-muted-foreground">/ {item.maxStock.toLocaleString()}</span>
                        </div>
                        <Progress value={stockPercentage} className="h-2" />
                        <p className="text-xs text-muted-foreground">Min: {item.minStock.toLocaleString()}</p>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-5 py-4">
                      <Badge className={status.className}>{status.label}</Badge>
                    </td>
                    <td className="whitespace-nowrap px-5 py-4">
                      <Button variant="outline" size="sm">Restock</Button>
                    </td>
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
