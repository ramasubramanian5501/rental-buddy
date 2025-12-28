import { useState } from "react";
import { motion } from "framer-motion";
import {
  Plus,
  Search,
  Clock,
  MapPin,
  User,
  Package,
  Calendar,
  MoreVertical,
  Eye,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";

interface Rental {
  id: string;
  customer: string;
  company: string;
  products: string[];
  location: string;
  startDate: string;
  returnDate: string;
  actualReturn?: string;
  status: "active" | "overdue" | "pending" | "completed";
  advancePercent: number;
  advanceAmount: number;
  totalAmount: number;
  remainingAmount: number;
  vehicle?: string;
  driver?: string;
}

const sampleRentals: Rental[] = [
  {
    id: "RNT-001",
    customer: "Rajesh Kumar",
    company: "Rajesh Construction Co.",
    products: ["JCB Excavator 3DX", "Boom Lift 60ft"],
    location: "Andheri East, Mumbai",
    startDate: "2025-12-26",
    returnDate: "2025-12-30",
    status: "active",
    advancePercent: 20,
    advanceAmount: 8000,
    totalAmount: 40000,
    remainingAmount: 32000,
    vehicle: "MH-01-AB-1234",
    driver: "Suresh Patil",
  },
  {
    id: "RNT-002",
    customer: "Vikram Sharma",
    company: "Metro Builders Pvt Ltd",
    products: ["Tower Crane TC-500"],
    location: "BKC, Mumbai",
    startDate: "2025-12-25",
    returnDate: "2026-01-05",
    status: "active",
    advancePercent: 10,
    advanceAmount: 18500,
    totalAmount: 185000,
    remainingAmount: 166500,
    vehicle: "MH-01-CD-5678",
    driver: "Amit Deshmukh",
  },
  {
    id: "RNT-003",
    customer: "Priya Sharma",
    company: "Sharma Developers",
    products: ["Concrete Mixer CM-100", "Scaffolding Set 20m"],
    location: "Thane West",
    startDate: "2025-12-24",
    returnDate: "2025-12-28",
    status: "overdue",
    advancePercent: 20,
    advanceAmount: 2000,
    totalAmount: 10000,
    remainingAmount: 8000,
    vehicle: "MH-04-EF-9012",
    driver: "Rahul Jadhav",
  },
  {
    id: "RNT-004",
    customer: "Arun Mehta",
    company: "BuildRight Infrastructure",
    products: ["Boom Lift 60ft"],
    location: "Powai, Mumbai",
    startDate: "2025-12-27",
    returnDate: "2025-12-29",
    status: "pending",
    advancePercent: 10,
    advanceAmount: 1500,
    totalAmount: 15000,
    remainingAmount: 13500,
  },
  {
    id: "RNT-005",
    customer: "Sunita Patel",
    company: "Patel Construction",
    products: ["Compactor Roller CR-200"],
    location: "Navi Mumbai",
    startDate: "2025-12-20",
    returnDate: "2025-12-25",
    actualReturn: "2025-12-25",
    status: "completed",
    advancePercent: 20,
    advanceAmount: 8000,
    totalAmount: 40000,
    remainingAmount: 0,
    vehicle: "MH-01-GH-3456",
    driver: "Vijay Shinde",
  },
];

const statusConfig = {
  active: {
    label: "Active",
    class: "badge-success",
    icon: CheckCircle,
  },
  overdue: {
    label: "Overdue",
    class: "badge-destructive",
    icon: AlertTriangle,
  },
  pending: {
    label: "Pending Delivery",
    class: "badge-warning",
    icon: Clock,
  },
  completed: {
    label: "Completed",
    class: "badge-primary",
    icon: CheckCircle,
  },
};

const Rentals = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [rentals] = useState<Rental[]>(sampleRentals);

  const filteredRentals = rentals.filter((rental) => {
    const matchesSearch =
      rental.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rental.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rental.company.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || rental.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <MainLayout>
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold text-foreground">Rentals</h1>
          <p className="text-muted-foreground mt-1">
            Manage all rental orders and returns
          </p>
        </div>
        <button className="btn-accent">
          <Plus className="w-4 h-4" />
          New Rental
        </button>
      </motion.div>

      {/* Stats Summary */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6"
      >
        {[
          { label: "Active", count: 2, color: "text-success" },
          { label: "Overdue", count: 1, color: "text-destructive" },
          { label: "Pending", count: 1, color: "text-warning" },
          { label: "Completed", count: 1, color: "text-muted-foreground" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-card rounded-xl border border-border p-4 text-center"
          >
            <p className={`text-2xl font-bold ${stat.color}`}>{stat.count}</p>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="mb-6 flex flex-col lg:flex-row gap-4"
      >
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by rental ID, customer, or company..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-field pl-12"
          />
        </div>

        {/* Status Filter */}
        <div className="flex gap-2 flex-wrap">
          {["all", "active", "overdue", "pending", "completed"].map(
            (status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all capitalize ${
                  statusFilter === status
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {status === "all" ? "All" : status}
              </button>
            )
          )}
        </div>
      </motion.div>

      {/* Rentals List */}
      <div className="space-y-4">
        {filteredRentals.map((rental, index) => {
          const StatusIcon = statusConfig[rental.status].icon;
          return (
            <motion.div
              key={rental.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.05 }}
              className="bg-card rounded-xl border border-border p-6 hover:border-accent/30 hover:shadow-md transition-all"
            >
              <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                {/* Main Info */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <span className="font-bold text-accent text-lg">
                          {rental.id}
                        </span>
                        <span
                          className={`badge ${statusConfig[rental.status].class}`}
                        >
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {statusConfig[rental.status].label}
                        </span>
                      </div>
                      <h3 className="font-semibold text-lg">{rental.company}</h3>
                    </div>
                    <button className="p-2 rounded-lg hover:bg-muted transition-colors lg:hidden">
                      <MoreVertical className="w-5 h-5 text-muted-foreground" />
                    </button>
                  </div>

                  {/* Customer & Location */}
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-1.5">
                      <User className="w-4 h-4" />
                      <span>{rental.customer}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4" />
                      <span>{rental.location}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {formatDate(rental.startDate)} -{" "}
                        {formatDate(rental.returnDate)}
                      </span>
                    </div>
                  </div>

                  {/* Products */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <Package className="w-4 h-4 text-muted-foreground" />
                    {rental.products.map((product, i) => (
                      <span
                        key={i}
                        className="badge bg-muted text-muted-foreground"
                      >
                        {product}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Payment Info */}
                <div className="lg:w-64 p-4 bg-muted/30 rounded-xl">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Total Amount</p>
                      <p className="font-bold text-lg">
                        ₹{rental.totalAmount.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">
                        Advance ({rental.advancePercent}%)
                      </p>
                      <p className="font-semibold text-success">
                        ₹{rental.advanceAmount.toLocaleString()}
                      </p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-muted-foreground">Remaining</p>
                      <p className="font-bold text-xl text-accent">
                        ₹{rental.remainingAmount.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="hidden lg:flex flex-col gap-2">
                  <button className="btn-secondary py-2 text-sm">
                    <Eye className="w-4 h-4" />
                    View Details
                  </button>
                  {rental.status === "active" && (
                    <button className="btn-accent py-2 text-sm">
                      <CheckCircle className="w-4 h-4" />
                      Mark Return
                    </button>
                  )}
                </div>
              </div>

              {/* Vehicle & Driver (if assigned) */}
              {rental.vehicle && (
                <div className="mt-4 pt-4 border-t border-border flex items-center gap-6 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-foreground">
                      Vehicle:
                    </span>
                    <span>{rental.vehicle}</span>
                  </div>
                  {rental.driver && (
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-foreground">
                        Driver:
                      </span>
                      <span>{rental.driver}</span>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredRentals.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <Package className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No rentals found</h3>
          <p className="text-muted-foreground mb-6">
            Try adjusting your search or filter criteria
          </p>
          <button className="btn-accent">
            <Plus className="w-4 h-4" />
            Create Rental
          </button>
        </motion.div>
      )}
    </MainLayout>
  );
};

export default Rentals;
