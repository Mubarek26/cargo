import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const data = [
  { month: "Jan", shipments: 320, deliveries: 280 },
  { month: "Feb", shipments: 450, deliveries: 400 },
  { month: "Mar", shipments: 380, deliveries: 350 },
  { month: "Apr", shipments: 520, deliveries: 480 },
  { month: "May", shipments: 610, deliveries: 550 },
  { month: "Jun", shipments: 490, deliveries: 460 },
  { month: "Jul", shipments: 580, deliveries: 520 },
  { month: "Aug", shipments: 650, deliveries: 600 },
  { month: "Sep", shipments: 720, deliveries: 680 },
  { month: "Oct", shipments: 800, deliveries: 750 },
  { month: "Nov", shipments: 880, deliveries: 820 },
  { month: "Dec", shipments: 950, deliveries: 900 },
];

export function ShipmentTrendsChart({ data }: { data?: any[] }) {
  const chartData = data || [
    { date: "Jan", shipments: 0, revenue: 0 },
  ];

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-card-foreground">
          Shipment Trends
        </h3>
        <p className="text-sm text-muted-foreground">
          Shipment volume and revenue performance over the selected period
        </p>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis
              dataKey="date"
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
              axisLine={{ stroke: "hsl(var(--border))" }}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
              axisLine={{ stroke: "hsl(var(--border))" }}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
              }}
              labelStyle={{ color: "hsl(var(--card-foreground))" }}
            />
            <Legend
              wrapperStyle={{ paddingTop: 20 }}
              iconType="rect"
              iconSize={10}
            />
            <Bar
              dataKey="shipments"
              name="Shipments"
              fill="hsl(var(--primary))"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="revenue"
              name="Revenue"
              fill="hsl(var(--chart-2))"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
