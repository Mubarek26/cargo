import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { MessageSquare, Search, Filter, Star, ThumbsUp, ThumbsDown, Clock, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

const feedbacks = [
  { id: "FDB-001", client: "Acme Corporation", contact: "John Doe", rating: 5, type: "positive", shipment: "SHP-2024-00142", message: "Excellent service! The delivery was on time and the package was in perfect condition. Will definitely use again.", date: "Dec 12, 2024", status: "reviewed" },
  { id: "FDB-002", client: "Tech Solutions Inc", contact: "Jane Smith", rating: 4, type: "positive", shipment: "SHP-2024-00138", message: "Good overall experience. The tracking updates were very helpful. Minor delay but customer service was responsive.", date: "Dec 11, 2024", status: "reviewed" },
  { id: "FDB-003", client: "Global Retail Co", contact: "Mike Johnson", rating: 2, type: "negative", shipment: "SHP-2024-00145", message: "Disappointed with the delay. Package arrived 3 days late without any proactive communication.", date: "Dec 10, 2024", status: "pending" },
  { id: "FDB-004", client: "Fast Logistics Ltd", contact: "Sarah Brown", rating: 5, type: "positive", shipment: "SHP-2024-00140", message: "Outstanding! The team went above and beyond to ensure our fragile items were handled with care.", date: "Dec 10, 2024", status: "reviewed" },
  { id: "FDB-005", client: "Prime Shipping Co", contact: "Chris Wilson", rating: 3, type: "neutral", shipment: "SHP-2024-00135", message: "Average experience. Nothing special but nothing bad either. Would appreciate more competitive pricing.", date: "Dec 09, 2024", status: "pending" },
  { id: "FDB-006", client: "West Coast Imports", contact: "Emily Davis", rating: 5, type: "positive", shipment: "SHP-2024-00133", message: "Perfect execution as always. Your team is reliable and professional. Highly recommend!", date: "Dec 08, 2024", status: "reviewed" },
];

const getRatingColor = (rating: number) => {
  if (rating >= 4) return "text-success";
  if (rating >= 3) return "text-warning";
  return "text-destructive";
};

export default function ClientFeedback() {
  const positiveCount = feedbacks.filter(f => f.type === "positive").length;
  const negativeCount = feedbacks.filter(f => f.type === "negative").length;
  const avgRating = (feedbacks.reduce((acc, f) => acc + f.rating, 0) / feedbacks.length).toFixed(1);

  return (
    <DashboardLayout>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Client Feedback</h1>
          <p className="text-muted-foreground">Review and respond to customer feedback</p>
        </div>
        <Button variant="outline">Export Report</Button>
      </div>

      {/* Stats */}
      <div className="mb-6 grid gap-4 sm:grid-cols-4">
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-warning/10 p-2">
              <Star className="h-5 w-5 text-warning" />
            </div>
            <div>
              <p className="text-2xl font-bold text-card-foreground">{avgRating}</p>
              <p className="text-sm text-muted-foreground">Avg Rating</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-success/10 p-2">
              <ThumbsUp className="h-5 w-5 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold text-card-foreground">{positiveCount}</p>
              <p className="text-sm text-muted-foreground">Positive</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-destructive/10 p-2">
              <ThumbsDown className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <p className="text-2xl font-bold text-card-foreground">{negativeCount}</p>
              <p className="text-sm text-muted-foreground">Negative</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-primary/10 p-2">
              <MessageSquare className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-card-foreground">{feedbacks.length}</p>
              <p className="text-sm text-muted-foreground">Total Reviews</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col gap-4 rounded-xl border border-border bg-card p-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search feedback..." className="pl-10" />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Filters
          </Button>
          <Button variant="outline" size="sm">All Ratings</Button>
          <Button variant="outline" size="sm">All Status</Button>
        </div>
      </div>

      {/* Feedback list */}
      <div className="space-y-4">
        {feedbacks.map((feedback) => (
          <div key={feedback.id} className="rounded-xl border border-border bg-card p-5 hover:shadow-lg transition-shadow">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${feedback.client}`} />
                    <AvatarFallback>{feedback.client.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-card-foreground">{feedback.client}</h3>
                    <p className="text-sm text-muted-foreground">{feedback.contact} • {feedback.shipment}</p>
                  </div>
                  <div className="flex items-center gap-1 ml-auto">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={cn(
                          "h-4 w-4",
                          i < feedback.rating ? "text-warning fill-warning" : "text-border"
                        )}
                      />
                    ))}
                  </div>
                </div>

                <p className="text-card-foreground mb-3">"{feedback.message}"</p>

                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {feedback.date}
                  </span>
                  <Badge className={feedback.status === "reviewed" ? "bg-success/10 text-success" : "bg-warning/10 text-warning"}>
                    {feedback.status === "reviewed" ? (
                      <><CheckCircle className="mr-1 h-3 w-3" />Reviewed</>
                    ) : (
                      <><Clock className="mr-1 h-3 w-3" />Pending</>
                    )}
                  </Badge>
                </div>
              </div>

              {feedback.status === "pending" && (
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">Dismiss</Button>
                  <Button size="sm">Respond</Button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}
