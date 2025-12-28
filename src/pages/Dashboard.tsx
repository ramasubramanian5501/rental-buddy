import { motion } from "framer-motion";
import {
  Package,
  TrendingUp,
  AlertCircle,
  IndianRupee,
  Clock,
  Truck,
} from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { RecentRentals } from "@/components/dashboard/RecentRentals";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { RevenueChart } from "@/components/dashboard/RevenueChart";

const Dashboard = () => {
  return (
    <MainLayout>
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Welcome back! Here's your business overview.
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          title="Active Rentals"
          value={24}
          subtitle="8 due today"
          icon={Package}
          trend={{ value: 12, isPositive: true }}
          accentColor="accent"
          delay={0}
        />
        <StatCard
          title="Monthly Revenue"
          value="₹4.78L"
          subtitle="Dec 2025"
          icon={IndianRupee}
          trend={{ value: 8.5, isPositive: true }}
          accentColor="success"
          delay={0.05}
        />
        <StatCard
          title="Overdue Returns"
          value={3}
          subtitle="Action required"
          icon={AlertCircle}
          trend={{ value: 2, isPositive: false }}
          accentColor="destructive"
          delay={0.1}
        />
        <StatCard
          title="Fleet Utilization"
          value="87%"
          subtitle="15/17 vehicles active"
          icon={Truck}
          trend={{ value: 5, isPositive: true }}
          accentColor="warning"
          delay={0.15}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
        {/* Revenue Chart */}
        <div className="xl:col-span-2">
          <RevenueChart />
        </div>

        {/* Quick Actions */}
        <div>
          <QuickActions />
        </div>
      </div>

      {/* Recent Rentals Table */}
      <RecentRentals />

      {/* Today's Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4 }}
        className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        <div className="bg-card rounded-xl border border-border p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
              <Clock className="w-5 h-5 text-success" />
            </div>
            <h3 className="font-semibold">Today's Pickups</h3>
          </div>
          <p className="text-3xl font-bold mb-1">5</p>
          <p className="text-sm text-muted-foreground">
            Scheduled for delivery
          </p>
        </div>

        <div className="bg-card rounded-xl border border-border p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-warning" />
            </div>
            <h3 className="font-semibold">Today's Returns</h3>
          </div>
          <p className="text-3xl font-bold mb-1">8</p>
          <p className="text-sm text-muted-foreground">Expected back today</p>
        </div>

        <div className="bg-card rounded-xl border border-border p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
              <IndianRupee className="w-5 h-5 text-accent" />
            </div>
            <h3 className="font-semibold">Pending Payments</h3>
          </div>
          <p className="text-3xl font-bold mb-1">₹1.2L</p>
          <p className="text-sm text-muted-foreground">
            From 12 rentals
          </p>
        </div>
      </motion.div>
    </MainLayout>
  );
};

export default Dashboard;
