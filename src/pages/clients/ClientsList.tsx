import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Contact, Plus, Search, Filter, Star, Package, DollarSign, Calendar, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const clients = [
  { id: "CLT-001", name: "Acme Corporation", contact: "John Doe", email: "john@acme.com", phone: "+1 (555) 111-2222", shipments: 156, revenue: "$245,000", rating: 4.9, status: "active", since: "Jan 2022" },
  { id: "CLT-002", name: "Tech Solutions Inc", contact: "Jane Smith", email: "jane@techsolutions.com", phone: "+1 (555) 222-3333", shipments: 89, revenue: "$178,500", rating: 4.7, status: "active", since: "Mar 2022" },
  { id: "CLT-003", name: "Global Retail Co", contact: "Mike Johnson", email: "mike@globalretail.com", phone: "+1 (555) 333-4444", shipments: 234, revenue: "$412,000", rating: 4.8, status: "active", since: "Nov 2021" },
  { id: "CLT-004", name: "Fast Logistics Ltd", contact: "Sarah Brown", email: "sarah@fastlogistics.com", phone: "+1 (555) 444-5555", shipments: 67, revenue: "$89,200", rating: 4.5, status: "active", since: "Jun 2023" },
  { id: "CLT-005", name: "Prime Shipping Co", contact: "Chris Wilson", email: "chris@primeshipping.com", phone: "+1 (555) 555-6666", shipments: 145, revenue: "$267,800", rating: 4.6, status: "inactive", since: "Feb 2022" },
  { id: "CLT-006", name: "West Coast Imports", contact: "Emily Davis", email: "emily@wcimports.com", phone: "+1 (555) 666-7777", shipments: 98, revenue: "$156,400", rating: 4.8, status: "active", since: "Aug 2022" },
];

export default function ClientsList() {
  return (
    <DashboardLayout>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Clients List</h1>
          <p className="text-muted-foreground">Manage your customer relationships</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Client
        </Button>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col gap-4 rounded-xl border border-border bg-card p-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search clients..." className="pl-10" />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Filters
          </Button>
          <Button variant="outline" size="sm">All Status</Button>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-secondary/50">
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Client</th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Contact</th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Shipments</th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Revenue</th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Rating</th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Status</th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {clients.map((client) => (
                <tr key={client.id} className="hover:bg-secondary/30 transition-colors">
                  <td className="whitespace-nowrap px-5 py-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${client.name}`} />
                        <AvatarFallback>{client.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-card-foreground">{client.name}</p>
                        <p className="text-xs text-muted-foreground">Since {client.since}</p>
                      </div>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-5 py-4">
                    <div className="text-sm">
                      <p className="text-card-foreground">{client.contact}</p>
                      <p className="text-muted-foreground">{client.email}</p>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-5 py-4">
                    <div className="flex items-center gap-1 text-sm">
                      <Package className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium text-card-foreground">{client.shipments}</span>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-5 py-4">
                    <div className="flex items-center gap-1 text-sm">
                      <DollarSign className="h-4 w-4 text-success" />
                      <span className="font-medium text-card-foreground">{client.revenue}</span>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-5 py-4">
                    <div className="flex items-center gap-1 text-sm">
                      <Star className="h-4 w-4 text-warning" />
                      <span className="font-medium text-card-foreground">{client.rating}</span>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-5 py-4">
                    <Badge className={client.status === "active" ? "bg-success/10 text-success" : "bg-secondary text-muted-foreground"}>
                      {client.status}
                    </Badge>
                  </td>
                  <td className="whitespace-nowrap px-5 py-4">
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
