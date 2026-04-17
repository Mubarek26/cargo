import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Calendar, Search, Filter, Package, MapPin, Clock, User, Truck, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const deliveries = [
  { id: "DEL-001", order: "ORD-2024-00457", customer: "Tech Solutions Inc", destination: "San Francisco, CA", driver: "John Smith", vehicle: "TRK-001", time: "09:00 AM", status: "on_time" },
  { id: "DEL-002", order: "ORD-2024-00460", customer: "Prime Shipping Co", destination: "Portland, OR", driver: "Sarah Johnson", vehicle: "TRK-002", time: "10:30 AM", status: "on_time" },
  { id: "DEL-003", order: "ORD-2024-00462", customer: "Motor City Co", destination: "Detroit, MI", driver: "Mike Brown", vehicle: "TRK-004", time: "11:00 AM", status: "delayed" },
  { id: "DEL-004", order: "ORD-2024-00458", customer: "Global Retail Co", destination: "Chicago, IL", driver: "Emily Davis", vehicle: "TRK-006", time: "02:00 PM", status: "on_time" },
  { id: "DEL-005", order: "ORD-2024-00465", customer: "Acme Corporation", destination: "New York, NY", driver: "Chris Wilson", vehicle: "TRK-005", time: "03:30 PM", status: "on_time" },
  { id: "DEL-006", order: "ORD-2024-00467", customer: "West Coast Imports", destination: "Los Angeles, CA", driver: "Lisa Anderson", vehicle: "TRK-008", time: "04:00 PM", status: "at_risk" },
];

const weekDays = [
  { day: "Mon", date: "16", active: false },
  { day: "Tue", date: "17", active: true },
  { day: "Wed", date: "18", active: false },
  { day: "Thu", date: "19", active: false },
  { day: "Fri", date: "20", active: false },
  { day: "Sat", date: "21", active: false },
  { day: "Sun", date: "22", active: false },
];

const statusConfig = {
  on_time: { label: "On Time", className: "text-success bg-success/10" },
  delayed: { label: "Delayed", className: "text-destructive bg-destructive/10" },
  at_risk: { label: "At Risk", className: "text-warning bg-warning/10" },
};

export default function ScheduledDeliveries() {
  return (
    <DashboardLayout>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Scheduled Deliveries</h1>
          <p className="text-muted-foreground">View and manage upcoming deliveries</p>
        </div>
        <Button>
          <Calendar className="mr-2 h-4 w-4" />
          Schedule Delivery
        </Button>
      </div>

      {/* Calendar header */}
      <div className="mb-6 rounded-xl border border-border bg-card p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <h3 className="text-lg font-semibold text-card-foreground">December 2024</h3>
            <Button variant="ghost" size="icon">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <Button variant="outline" size="sm">Today</Button>
        </div>

        <div className="grid grid-cols-7 gap-2">
          {weekDays.map((day) => (
            <button
              key={day.date}
              className={`flex flex-col items-center rounded-lg p-3 transition-colors ${
                day.active
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-secondary"
              }`}
            >
              <span className="text-xs font-medium">{day.day}</span>
              <span className="text-lg font-bold">{day.date}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col gap-4 rounded-xl border border-border bg-card p-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search deliveries..." className="pl-10" />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Filters
          </Button>
          <Button variant="outline" size="sm">All Status</Button>
        </div>
      </div>

      {/* Deliveries timeline */}
      <div className="rounded-xl border border-border bg-card p-5">
        <h3 className="mb-4 font-semibold text-card-foreground flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          Tuesday, December 17, 2024
        </h3>

        <div className="space-y-4">
          {deliveries.map((delivery) => {
            const status = statusConfig[delivery.status as keyof typeof statusConfig];

            return (
              <div
                key={delivery.id}
                className="flex flex-col gap-4 rounded-lg border border-border p-4 hover:shadow-md transition-shadow sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-start gap-4">
                  <div className="flex flex-col items-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                      <Clock className="h-6 w-6 text-primary" />
                    </div>
                    <span className="mt-1 text-sm font-medium text-card-foreground">{delivery.time}</span>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-card-foreground">{delivery.customer}</span>
                      <Badge className={status.className}>{status.label}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      <Package className="inline h-3 w-3 mr-1" />
                      {delivery.order}
                    </p>
                    <div className="flex flex-wrap gap-3 text-sm">
                      <span className="flex items-center gap-1 text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        {delivery.destination}
                      </span>
                      <span className="flex items-center gap-1 text-muted-foreground">
                        <User className="h-4 w-4" />
                        {delivery.driver}
                      </span>
                      <span className="flex items-center gap-1 text-muted-foreground">
                        <Truck className="h-4 w-4" />
                        {delivery.vehicle}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm">Reschedule</Button>
                  <Button size="sm">Track</Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
}
