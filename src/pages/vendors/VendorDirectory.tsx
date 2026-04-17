import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Building2, Plus, Search, Filter, Star, MapPin, Phone, Mail, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const vendors = [
  { id: "VND-001", name: "Pacific Freight Services", category: "Ocean Freight", location: "Los Angeles, CA", rating: 4.8, contracts: 12, email: "contact@pacificfreight.com", phone: "+1 (555) 111-2222", website: "pacificfreight.com", status: "active" },
  { id: "VND-002", name: "Air Express Logistics", category: "Air Freight", location: "Chicago, IL", rating: 4.6, contracts: 8, email: "info@airexpress.com", phone: "+1 (555) 222-3333", website: "airexpress.com", status: "active" },
  { id: "VND-003", name: "Continental Carriers", category: "Ground Transport", location: "Dallas, TX", rating: 4.9, contracts: 15, email: "sales@continental.com", phone: "+1 (555) 333-4444", website: "continentalcarriers.com", status: "active" },
  { id: "VND-004", name: "Global Packaging Co", category: "Packaging", location: "Newark, NJ", rating: 4.5, contracts: 6, email: "orders@globalpack.com", phone: "+1 (555) 444-5555", website: "globalpack.com", status: "active" },
  { id: "VND-005", name: "Secure Storage Inc", category: "Warehousing", location: "Atlanta, GA", rating: 4.7, contracts: 4, email: "info@securestorage.com", phone: "+1 (555) 555-6666", website: "securestorage.com", status: "inactive" },
  { id: "VND-006", name: "Quick Customs Clear", category: "Customs", location: "Miami, FL", rating: 4.4, contracts: 9, email: "support@quickcustoms.com", phone: "+1 (555) 666-7777", website: "quickcustoms.com", status: "active" },
];

export default function VendorDirectory() {
  return (
    <DashboardLayout>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Vendor Directory</h1>
          <p className="text-muted-foreground">Manage your supplier and partner network</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Vendor
        </Button>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col gap-4 rounded-xl border border-border bg-card p-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search vendors..." className="pl-10" />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Filters
          </Button>
          <Button variant="outline" size="sm">All Categories</Button>
        </div>
      </div>

      {/* Vendor cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {vendors.map((vendor) => (
          <div key={vendor.id} className="rounded-xl border border-border bg-card p-5 stat-card-hover">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Building2 className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-card-foreground">{vendor.name}</h3>
                  <p className="text-sm text-muted-foreground">{vendor.id}</p>
                </div>
              </div>
              <Badge className={vendor.status === "active" ? "bg-success/10 text-success" : "bg-secondary text-muted-foreground"}>
                {vendor.status}
              </Badge>
            </div>

            <Badge variant="outline" className="mb-4">{vendor.category}</Badge>

            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">{vendor.location}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Star className="h-4 w-4 text-warning" />
                <span className="text-card-foreground">{vendor.rating}</span>
                <span className="text-muted-foreground">• {vendor.contracts} contracts</span>
              </div>
            </div>

            <div className="pt-4 border-t border-border space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground truncate">{vendor.email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">{vendor.phone}</span>
              </div>
            </div>

            <div className="mt-4 flex gap-2">
              <Button variant="outline" size="sm" className="flex-1">
                <Phone className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" className="flex-1">
                <Mail className="h-4 w-4" />
              </Button>
              <Button size="sm" className="flex-1">View</Button>
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}
