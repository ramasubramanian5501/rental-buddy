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
  Loader2,
  Trash2,
} from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { RentalFormModal } from "@/components/modals/RentalFormModal";
import { useRentals, useDeleteRental, useUpdateRental } from "@/hooks/useRentals";
import { RentalWithDetails } from "@/types/database";

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
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: rentals = [], isLoading } = useRentals();
  const deleteRental = useDeleteRental();
  const updateRental = useUpdateRental();

  const filteredRentals = rentals.filter((rental) => {
    const matchesSearch =
      rental.rental_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rental.customer?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rental.customer?.company.toLowerCase().includes(searchQuery.toLowerCase());
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

  const handleMarkReturn = async (rental: RentalWithDetails) => {
    await updateRental.mutateAsync({
      id: rental.id,
      status: "completed",
      actual_return_date: new Date().toISOString(),
    });
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this rental?")) {
      await deleteRental.mutateAsync(id);
    }
  };

  const stats = {
    active: rentals.filter((r) => r.status === "active").length,
    overdue: rentals.filter((r) => r.status === "overdue").length,
    pending: rentals.filter((r) => r.status === "pending").length,
    completed: rentals.filter((r) => r.status === "completed").length,
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
        <button className="btn-accent" onClick={() => setIsModalOpen(true)}>
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
          { label: "Active", count: stats.active, color: "text-success" },
          { label: "Overdue", count: stats.overdue, color: "text-destructive" },
          { label: "Pending", count: stats.pending, color: "text-warning" },
          { label: "Completed", count: stats.completed, color: "text-muted-foreground" },
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
          {["all", "active", "overdue", "pending", "completed"].map((status) => (
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
          ))}
        </div>
      </motion.div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-8 h-8 animate-spin text-accent" />
        </div>
      )}

      {/* Rentals List */}
      {!isLoading && (
        <div className="space-y-4">
          {filteredRentals.map((rental, index) => {
            const statusInfo = statusConfig[rental.status as keyof typeof statusConfig] || statusConfig.pending;
            const StatusIcon = statusInfo.icon;
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
                            {rental.rental_code}
                          </span>
                          <span className={`badge ${statusInfo.class}`}>
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {statusInfo.label}
                          </span>
                        </div>
                        <h3 className="font-semibold text-lg">
                          {rental.customer?.company || "Unknown Company"}
                        </h3>
                      </div>
                    </div>

                    {/* Customer & Location */}
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
                      <div className="flex items-center gap-1.5">
                        <User className="w-4 h-4" />
                        <span>{rental.customer?.name || "Unknown"}</span>
                      </div>
                      {rental.location && (
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-4 h-4" />
                          <span>{rental.location}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {formatDate(rental.start_date)} - {formatDate(rental.return_date)}
                        </span>
                      </div>
                    </div>

                    {/* Products */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <Package className="w-4 h-4 text-muted-foreground" />
                      {rental.products && rental.products.length > 0 ? (
                        rental.products.map((product, i) => (
                          <span
                            key={i}
                            className="badge bg-muted text-muted-foreground"
                          >
                            {product.name}
                          </span>
                        ))
                      ) : (
                        <span className="text-muted-foreground text-sm">
                          No products
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Payment Info */}
                  <div className="lg:w-64 p-4 bg-muted/30 rounded-xl">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Total Amount</p>
                        <p className="font-bold text-lg">
                          ₹{Number(rental.total_amount).toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">
                          Advance ({rental.advance_percent}%)
                        </p>
                        <p className="font-semibold text-success">
                          ₹{Number(rental.advance_amount).toLocaleString()}
                        </p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-muted-foreground">Remaining</p>
                        <p className="font-bold text-xl text-accent">
                          ₹{Number(rental.remaining_amount).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="hidden lg:flex flex-col gap-2">
                    {rental.status === "active" && (
                      <button
                        onClick={() => handleMarkReturn(rental)}
                        className="btn-accent py-2 text-sm"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Mark Return
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(rental.id)}
                      className="btn-secondary py-2 text-sm text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                </div>

                {/* Vehicle & Driver */}
                {(rental.vehicle || rental.driver) && (
                  <div className="mt-4 pt-4 border-t border-border flex items-center gap-6 text-sm text-muted-foreground">
                    {rental.vehicle && (
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-foreground">Vehicle:</span>
                        <span>{rental.vehicle.vehicle_number}</span>
                      </div>
                    )}
                    {rental.driver && (
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-foreground">Driver:</span>
                        <span>{rental.driver.name}</span>
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && filteredRentals.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <Package className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No rentals found</h3>
          <p className="text-muted-foreground mb-6">
            {rentals.length === 0
              ? "Create your first rental order"
              : "Try adjusting your search or filter criteria"}
          </p>
          <button className="btn-accent" onClick={() => setIsModalOpen(true)}>
            <Plus className="w-4 h-4" />
            Create Rental
          </button>
        </motion.div>
      )}

      {/* Modal */}
      <RentalFormModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </MainLayout>
  );
};

export default Rentals;
