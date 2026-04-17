import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Warehouse, Plus, Search, MapPin, Package, Users, Boxes, TrendingUp, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

const warehouses = [
  { id: "WH-001", name: "East Coast Hub", location: "Newark, NJ", capacity: 85, staff: 42, inventory: 12500, status: "operational", manager: "Robert Chen", phone: "+1 (555) 111-2222" },
  { id: "WH-002", name: "West Coast Distribution", location: "Los Angeles, CA", capacity: 72, staff: 38, inventory: 9800, status: "operational", manager: "Maria Garcia", phone: "+1 (555) 222-3333" },
  { id: "WH-003", name: "Central Logistics", location: "Chicago, IL", capacity: 91, staff: 55, inventory: 15200, status: "operational", manager: "James Wilson", phone: "+1 (555) 333-4444" },
  { id: "WH-004", name: "Southern Hub", location: "Dallas, TX", capacity: 68, staff: 35, inventory: 8700, status: "operational", manager: "Patricia Brown", phone: "+1 (555) 444-5555" },
  { id: "WH-005", name: "Pacific Northwest", location: "Seattle, WA", capacity: 45, staff: 22, inventory: 5400, status: "maintenance", manager: "Michael Lee", phone: "+1 (555) 555-6666" },
  { id: "WH-006", name: "Southeast Center", location: "Atlanta, GA", capacity: 78, staff: 40, inventory: 10200, status: "operational", manager: "Jennifer Adams", phone: "+1 (555) 666-7777" },
];

export default function WarehouseLocations() {
  return (
    <DashboardLayout>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Warehouse Locations</h1>
          <p className="text-muted-foreground">Manage your distribution centers</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Warehouse
        </Button>
      </div>

      {/* Search */}
      <div className="mb-6 flex gap-4 rounded-xl border border-border bg-card p-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search warehouses..." className="pl-10" />
        </div>
      </div>

      {/* Warehouse cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {warehouses.map((warehouse) => (
          <div key={warehouse.id} className="rounded-xl border border-border bg-card overflow-hidden stat-card-hover">
            <div className="p-5">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <Warehouse className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-card-foreground">{warehouse.name}</h3>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {warehouse.location}
                    </p>
                  </div>
                </div>
                <Badge className={warehouse.status === "operational" ? "bg-success/10 text-success" : "bg-warning/10 text-warning"}>
                  {warehouse.status}
                </Badge>
              </div>

              <div className="mb-4">
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Capacity Usage</span>
                  <span className={cn("font-medium", warehouse.capacity > 85 ? "text-warning" : "text-card-foreground")}>
                    {warehouse.capacity}%
                  </span>
                </div>
                <Progress value={warehouse.capacity} className="h-2" />
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-lg font-semibold text-card-foreground">{warehouse.staff}</p>
                    <p className="text-xs text-muted-foreground">Staff</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Boxes className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-lg font-semibold text-card-foreground">{warehouse.inventory.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">Items</p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-border">
                <p className="text-sm text-muted-foreground mb-1">Manager</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-card-foreground">{warehouse.manager}</span>
                  <Button variant="ghost" size="sm">
                    <Phone className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}
