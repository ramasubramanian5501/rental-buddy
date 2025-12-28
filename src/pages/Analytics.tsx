import { motion } from "framer-motion";
import {
  BarChart3,
  TrendingUp,
  Package,
  IndianRupee,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { MainLayout } from "@/components/layout/MainLayout";

const monthlyRevenue = [
  { month: "Jan", revenue: 320000, rentals: 24 },
  { month: "Feb", revenue: 285000, rentals: 21 },
  { month: "Mar", revenue: 380000, rentals: 28 },
  { month: "Apr", revenue: 410000, rentals: 31 },
  { month: "May", revenue: 356000, rentals: 27 },
  { month: "Jun", revenue: 425000, rentals: 32 },
  { month: "Jul", revenue: 389000, rentals: 29 },
  { month: "Aug", revenue: 445000, rentals: 34 },
  { month: "Sep", revenue: 398000, rentals: 30 },
  { month: "Oct", revenue: 512000, rentals: 38 },
  { month: "Nov", revenue: 478000, rentals: 36 },
  { month: "Dec", revenue: 545000, rentals: 41 },
];

const productDemand = [
  { name: "Scaffolding Set", rentals: 412, revenue: 618000 },
  { name: "Concrete Mixer", rentals: 289, revenue: 722500 },
  { name: "Compactor Roller", rentals: 156, revenue: 499200 },
  { name: "JCB Excavator", rentals: 124, revenue: 744000 },
  { name: "Boom Lift", rentals: 78, revenue: 374400 },
  { name: "Tower Crane", rentals: 45, revenue: 1530000 },
];

const paymentBreakdown = [
  { name: "Advance Collected", value: 35, color: "hsl(142, 71%, 45%)" },
  { name: "Final Payments", value: 55, color: "hsl(38, 92%, 50%)" },
  { name: "Pending", value: 10, color: "hsl(0, 84%, 60%)" },
];

const Analytics = () => {
  const totalRevenue = monthlyRevenue.reduce((sum, m) => sum + m.revenue, 0);
  const totalRentals = monthlyRevenue.reduce((sum, m) => sum + m.rentals, 0);
  const avgMonthlyRevenue = Math.round(totalRevenue / 12);

  return (
    <MainLayout>
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-2xl font-bold text-foreground">Analytics</h1>
        <p className="text-muted-foreground mt-1">
          Business insights and performance metrics
        </p>
      </motion.div>

      {/* Summary Stats */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
      >
        <div className="stat-card">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
              <IndianRupee className="w-6 h-6 text-accent" />
            </div>
            <div className="flex items-center gap-1 text-success text-sm font-medium">
              <ArrowUpRight className="w-4 h-4" />
              12.5%
            </div>
          </div>
          <p className="text-sm text-muted-foreground">Total Revenue (2025)</p>
          <p className="text-2xl font-bold">
            ₹{(totalRevenue / 100000).toFixed(1)}L
          </p>
        </div>

        <div className="stat-card">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
              <Package className="w-6 h-6 text-success" />
            </div>
            <div className="flex items-center gap-1 text-success text-sm font-medium">
              <ArrowUpRight className="w-4 h-4" />
              8.3%
            </div>
          </div>
          <p className="text-sm text-muted-foreground">Total Rentals</p>
          <p className="text-2xl font-bold">{totalRentals}</p>
        </div>

        <div className="stat-card">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-primary" />
            </div>
            <div className="flex items-center gap-1 text-destructive text-sm font-medium">
              <ArrowDownRight className="w-4 h-4" />
              2.1%
            </div>
          </div>
          <p className="text-sm text-muted-foreground">Avg Monthly Revenue</p>
          <p className="text-2xl font-bold">
            ₹{(avgMonthlyRevenue / 1000).toFixed(0)}k
          </p>
        </div>

        <div className="stat-card">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-warning/10 flex items-center justify-center">
              <Calendar className="w-6 h-6 text-warning" />
            </div>
            <div className="flex items-center gap-1 text-success text-sm font-medium">
              <ArrowUpRight className="w-4 h-4" />
              15%
            </div>
          </div>
          <p className="text-sm text-muted-foreground">This Month</p>
          <p className="text-2xl font-bold">₹5.45L</p>
        </div>
      </motion.div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
        {/* Revenue Trend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card rounded-xl border border-border p-6"
        >
          <h2 className="font-semibold text-lg mb-6">Monthly Revenue Trend</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyRevenue}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="hsl(38, 92%, 50%)"
                      stopOpacity={0.3}
                    />
                    <stop
                      offset="95%"
                      stopColor="hsl(38, 92%, 50%)"
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="hsl(215, 25%, 88%)"
                  vertical={false}
                />
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "hsl(215, 16%, 47%)", fontSize: 12 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "hsl(215, 16%, 47%)", fontSize: 12 }}
                  tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(0, 0%, 100%)",
                    border: "1px solid hsl(215, 25%, 88%)",
                    borderRadius: "8px",
                  }}
                  formatter={(value: number) => [
                    `₹${value.toLocaleString()}`,
                    "Revenue",
                  ]}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="hsl(38, 92%, 50%)"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorRev)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Product Demand */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="bg-card rounded-xl border border-border p-6"
        >
          <h2 className="font-semibold text-lg mb-6">Product-wise Demand</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={productDemand} layout="vertical">
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="hsl(215, 25%, 88%)"
                  horizontal={true}
                  vertical={false}
                />
                <XAxis
                  type="number"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "hsl(215, 16%, 47%)", fontSize: 12 }}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "hsl(215, 16%, 47%)", fontSize: 11 }}
                  width={100}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(0, 0%, 100%)",
                    border: "1px solid hsl(215, 25%, 88%)",
                    borderRadius: "8px",
                  }}
                />
                <Bar
                  dataKey="rentals"
                  fill="hsl(222, 47%, 18%)"
                  radius={[0, 4, 4, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Payment Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-card rounded-xl border border-border p-6"
        >
          <h2 className="font-semibold text-lg mb-6">Payment Breakdown</h2>
          <div className="h-48 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={paymentBreakdown}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {paymentBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2 mt-4">
            {paymentBreakdown.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm text-muted-foreground">
                    {item.name}
                  </span>
                </div>
                <span className="font-medium">{item.value}%</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Top Products Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="lg:col-span-2 bg-card rounded-xl border border-border p-6"
        >
          <h2 className="font-semibold text-lg mb-6">
            High-Demand Products (Consider Adding Stock)
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left text-sm font-semibold text-muted-foreground pb-3">
                    Product
                  </th>
                  <th className="text-left text-sm font-semibold text-muted-foreground pb-3">
                    Total Rentals
                  </th>
                  <th className="text-left text-sm font-semibold text-muted-foreground pb-3">
                    Revenue
                  </th>
                  <th className="text-left text-sm font-semibold text-muted-foreground pb-3">
                    Demand Score
                  </th>
                </tr>
              </thead>
              <tbody>
                {productDemand.slice(0, 5).map((product, index) => (
                  <tr key={product.name} className="border-b border-border/50">
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-accent/10 text-accent text-xs font-bold flex items-center justify-center">
                          {index + 1}
                        </span>
                        <span className="font-medium">{product.name}</span>
                      </div>
                    </td>
                    <td className="py-3">{product.rentals}</td>
                    <td className="py-3 font-semibold">
                      ₹{product.revenue.toLocaleString()}
                    </td>
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-muted rounded-full max-w-24">
                          <div
                            className="h-full bg-accent rounded-full"
                            style={{
                              width: `${(product.rentals / 412) * 100}%`,
                            }}
                          />
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {Math.round((product.rentals / 412) * 100)}%
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </MainLayout>
  );
};

export default Analytics;
