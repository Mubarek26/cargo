import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Users, Plus, Search, Filter, Truck, MapPin, Phone, Mail, Star, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

const drivers = [
  { id: "DRV-001", name: "John Smith", email: "john.smith@cargo.com", phone: "+1 (555) 123-4567", vehicle: "TRK-001", status: "on_route", location: "Denver, CO", rating: 4.8, trips: 156, hoursThisWeek: 38 },
  { id: "DRV-002", name: "Sarah Johnson", email: "sarah.j@cargo.com", phone: "+1 (555) 234-5678", vehicle: "TRK-002", status: "on_route", location: "Phoenix, AZ", rating: 4.9, trips: 203, hoursThisWeek: 42 },
  { id: "DRV-003", name: "Mike Brown", email: "mike.b@cargo.com", phone: "+1 (555) 345-6789", vehicle: "TRK-003", status: "off_duty", location: "Depot A", rating: 4.6, trips: 178, hoursThisWeek: 28 },
  { id: "DRV-004", name: "Emily Davis", email: "emily.d@cargo.com", phone: "+1 (555) 456-7890", vehicle: "TRK-004", status: "on_route", location: "Salt Lake City, UT", rating: 4.7, trips: 134, hoursThisWeek: 35 },
  { id: "DRV-005", name: "Chris Wilson", email: "chris.w@cargo.com", phone: "+1 (555) 567-8901", vehicle: "TRK-005", status: "available", location: "Depot B", rating: 4.5, trips: 98, hoursThisWeek: 15 },
  { id: "DRV-006", name: "Lisa Anderson", email: "lisa.a@cargo.com", phone: "+1 (555) 678-9012", vehicle: "TRK-006", status: "on_route", location: "Albuquerque, NM", rating: 4.8, trips: 189, hoursThisWeek: 40 },
];

const statusConfig = {
  on_route: { label: "On Route", className: "text-success bg-success/10" },
  available: { label: "Available", className: "text-primary bg-primary/10" },
  off_duty: { label: "Off Duty", className: "text-muted-foreground bg-secondary" },
};

export default function DriverAssignments() {
  return (
    <DashboardLayout>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Driver Assignments</h1>
          <p className="text-muted-foreground">Manage driver schedules and assignments</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Driver
        </Button>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col gap-4 rounded-xl border border-border bg-card p-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search drivers..." className="pl-10" />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Filters
          </Button>
          <Button variant="outline" size="sm">All Status</Button>
        </div>
      </div>

      {/* Driver cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {drivers.map((driver) => {
          const status = statusConfig[driver.status as keyof typeof statusConfig];

          return (
            <div key={driver.id} className="rounded-xl border border-border bg-card p-5 stat-card-hover">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${driver.name}`} />
                    <AvatarFallback>{driver.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-card-foreground">{driver.name}</h3>
                    <p className="text-sm text-muted-foreground">{driver.id}</p>
                  </div>
                </div>
                <Badge className={status.className}>{status.label}</Badge>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <Truck className="h-4 w-4 text-muted-foreground" />
                  <span className="text-card-foreground">{driver.vehicle}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">{driver.location}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Star className="h-4 w-4 text-warning" />
                  <span className="text-card-foreground">{driver.rating}</span>
                  <span className="text-muted-foreground">• {driver.trips} trips</span>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    Hours this week
                  </span>
                  <span className={cn("font-medium", driver.hoursThisWeek > 40 ? "text-warning" : "text-card-foreground")}>
                    {driver.hoursThisWeek}/60 hrs
                  </span>
                </div>
                <Progress value={(driver.hoursThisWeek / 60) * 100} className="h-2" />
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <Phone className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  <Mail className="h-4 w-4" />
                </Button>
                <Button size="sm" className="flex-1">Assign</Button>
              </div>
            </div>
          );
        })}
      </div>
    </DashboardLayout>
  );
}
